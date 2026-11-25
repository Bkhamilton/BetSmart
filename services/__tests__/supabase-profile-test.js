import { getOrCreateSupabaseProfile, getOrCreateLocalAccount } from '../supabaseProfile';

const authUser = {
    id: 'auth-user-id',
    email: 'user@example.com',
    user_metadata: { display_name: 'Test User', username: 'test_user' },
};

it('returns an existing profile without overwriting cloud metadata', async () => {
    const profile = { user_id: authUser.id, display_name: 'Saved Name', username: 'saved_name' };
    const query = {
        select: jest.fn(() => query),
        eq: jest.fn(() => query),
        maybeSingle: jest.fn().mockResolvedValue({ data: profile, error: null }),
        insert: jest.fn(),
    };
    const client = { from: jest.fn(() => query) };

    await expect(getOrCreateSupabaseProfile(client, authUser)).resolves.toEqual(profile);
    expect(query.insert).not.toHaveBeenCalled();
});

it('re-reads a concurrently created profile instead of replacing it', async () => {
    const profile = { user_id: authUser.id, display_name: 'Existing Name', username: 'existing_name' };
    const initialQuery = {
        select: jest.fn(() => initialQuery),
        eq: jest.fn(() => initialQuery),
        maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
    };
    const insertQuery = {
        insert: jest.fn(() => insertQuery),
        select: jest.fn(() => insertQuery),
        single: jest.fn().mockResolvedValue({ data: null, error: { code: '23505' } }),
    };
    const retryQuery = {
        select: jest.fn(() => retryQuery),
        eq: jest.fn(() => retryQuery),
        maybeSingle: jest.fn().mockResolvedValue({ data: profile, error: null }),
    };
    const client = {
        from: jest.fn()
            .mockReturnValueOnce(initialQuery)
            .mockReturnValueOnce(insertQuery)
            .mockReturnValueOnce(retryQuery),
    };

    await expect(getOrCreateSupabaseProfile(client, authUser)).resolves.toEqual(profile);
    expect(insertQuery.insert).toHaveBeenCalledWith({
        user_id: authUser.id,
        display_name: 'Test User',
        username: 'test_user',
    });
});

it('maps the local account by Auth UUID and never uses local credentials', async () => {
    const localUser = { id: 8, cloudUserId: authUser.id, username: 'test_user' };
    const db = {
        runAsync: jest.fn().mockResolvedValue(undefined),
        getFirstAsync: jest.fn().mockResolvedValue(localUser),
    };
    const profile = { user_id: authUser.id, display_name: 'Test User', username: 'test_user' };

    await expect(getOrCreateLocalAccount(db, authUser, profile)).resolves.toEqual(localUser);
    expect(db.runAsync.mock.calls[0][0]).not.toMatch(/password/i);
    expect(db.runAsync.mock.calls[0][1][0]).toBe(authUser.id);
    expect(db.getFirstAsync).toHaveBeenCalledWith(
        expect.stringContaining('WHERE cloudUserId = ?'),
        [authUser.id]
    );
});
