jest.mock('@/services/supabase', () => ({
    supabase: {
        auth: {
            exchangeCodeForSession: jest.fn(),
            setSession: jest.fn(),
            verifyOtp: jest.fn(),
        },
    },
}));

const { processSupabaseAuthLink } = require('../authLinks');
const { supabase } = require('@/services/supabase');

beforeEach(() => {
    jest.clearAllMocks();
    supabase.auth.exchangeCodeForSession.mockResolvedValue({ error: null });
    supabase.auth.setSession.mockResolvedValue({ error: null });
    supabase.auth.verifyOtp.mockResolvedValue({ error: null });
});

it('establishes a session from recovery tokens in a deep link fragment', async () => {
    const type = await processSupabaseAuthLink(
        'myapp://reset-password#access_token=access%2Ftoken&refresh_token=refresh-token&type=recovery'
    );

    expect(type).toBe('recovery');
    expect(supabase.auth.setSession).toHaveBeenCalledWith({
        access_token: 'access/token',
        refresh_token: 'refresh-token',
    });
});

it('exchanges PKCE authorization codes from confirmation links', async () => {
    const type = await processSupabaseAuthLink('myapp://auth/callback?code=one-time-code&type=signup');

    expect(type).toBe('signup');
    expect(supabase.auth.exchangeCodeForSession).toHaveBeenCalledWith('one-time-code');
});

it('rejects incomplete or expired links', async () => {
    await expect(processSupabaseAuthLink('myapp://auth/callback')).rejects.toThrow(/incomplete or expired/);
});
