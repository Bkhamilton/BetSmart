import type { SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';
import type { SQLiteDatabase } from 'expo-sqlite';
import type { User } from '@/constants/types';

export interface SupabaseProfile {
    user_id: string;
    display_name: string | null;
    username: string | null;
}

export class UsernameUnavailableError extends Error {
    readonly code = 'username_unavailable';

    constructor() {
        super('That username is unavailable.');
        this.name = 'UsernameUnavailableError';
    }
}

export const getOrCreateSupabaseProfile = async (
    client: SupabaseClient,
    authUser: SupabaseUser
): Promise<SupabaseProfile> => {
    const { data: existingProfile, error: selectError } = await client
        .from('bs_profiles')
        .select('user_id, display_name, username')
        .eq('user_id', authUser.id)
        .maybeSingle();

    if (selectError) throw selectError;
    if (existingProfile) return existingProfile;

    const { data: createdProfile, error: insertError } = await client
        .from('bs_profiles')
        .insert({
            user_id: authUser.id,
            display_name: authUser.user_metadata?.display_name ?? null,
            username: authUser.user_metadata?.username ?? null,
        })
        .select('user_id, display_name, username')
        .single();

    if (!insertError && createdProfile) return createdProfile;

    if (insertError?.code === '23505') {
        const { data: concurrentProfile, error: retryError } = await client
            .from('bs_profiles')
            .select('user_id, display_name, username')
            .eq('user_id', authUser.id)
            .maybeSingle();

        if (retryError) throw retryError;
        if (concurrentProfile) return concurrentProfile;
        throw new UsernameUnavailableError();
    }

    if (insertError) throw insertError;
    throw new Error('Supabase did not return the account profile.');
};

export const getOrCreateLocalAccount = async (
    db: SQLiteDatabase,
    authUser: SupabaseUser,
    profile: SupabaseProfile
): Promise<User> => {
    await db.runAsync(
        `INSERT INTO Users (cloudUserId, name, email, username)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(cloudUserId) DO UPDATE SET
           name = excluded.name,
           email = excluded.email,
           username = excluded.username`,
        [
            authUser.id,
            profile.display_name ?? '',
            authUser.email ?? '',
            profile.username ?? '',
        ]
    );

    const localUser = await db.getFirstAsync<User>(
        'SELECT id, cloudUserId, name, email, username, lastSyncedAt FROM Users WHERE cloudUserId = ?',
        [authUser.id]
    );

    if (!localUser) throw new Error('The local account could not be initialized.');
    return localUser;
};

export const initializeAuthenticatedAccount = async (
    db: SQLiteDatabase,
    client: SupabaseClient,
    authUser: SupabaseUser
): Promise<User> => {
    const profile = await getOrCreateSupabaseProfile(client, authUser);
    return getOrCreateLocalAccount(db, authUser, profile);
};
