import { supabase } from '@/services/supabase';

const readUrlParameters = (url: string): Map<string, string> => {
    const parameters = new Map<string, string>();
    for (const section of url.split(/[?#]/).slice(1)) {
        for (const pair of section.split('&')) {
            if (!pair) continue;
            const separator = pair.indexOf('=');
            const rawKey = separator < 0 ? pair : pair.slice(0, separator);
            const rawValue = separator < 0 ? '' : pair.slice(separator + 1);
            parameters.set(
                decodeURIComponent(rawKey.replace(/\+/g, ' ')),
                decodeURIComponent(rawValue.replace(/\+/g, ' '))
            );
        }
    }
    return parameters;
};

export const processSupabaseAuthLink = async (url: string): Promise<string> => {
    if (!supabase) throw new Error('Supabase authentication is not configured.');

    const parameters = readUrlParameters(url);
    const providerError = parameters.get('error_description') ?? parameters.get('error');
    if (providerError) throw new Error(providerError.replace(/\+/g, ' '));

    const code = parameters.get('code');
    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) throw error;
        return parameters.get('type') ?? 'signup';
    }

    const accessToken = parameters.get('access_token');
    const refreshToken = parameters.get('refresh_token');
    if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
        });
        if (error) throw error;
        return parameters.get('type') ?? 'signup';
    }

    const tokenHash = parameters.get('token_hash');
    const type = parameters.get('type');
    if (tokenHash && (type === 'signup' || type === 'recovery')) {
        const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
        if (error) throw error;
        return type;
    }

    throw new Error('This authentication link is incomplete or expired. Request a new link and try again.');
};
