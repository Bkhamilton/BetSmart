jest.mock('@react-native-async-storage/async-storage', () => ({}));
jest.mock('@supabase/supabase-js', () => ({ createClient: jest.fn(() => ({})) }));

const originalUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const originalKey = process.env.EXPO_PUBLIC_SUPABASE_API_KEY;

afterEach(() => {
  if (originalUrl === undefined) delete process.env.EXPO_PUBLIC_SUPABASE_URL;
  else process.env.EXPO_PUBLIC_SUPABASE_URL = originalUrl;
  if (originalKey === undefined) delete process.env.EXPO_PUBLIC_SUPABASE_API_KEY;
  else process.env.EXPO_PUBLIC_SUPABASE_API_KEY = originalKey;
  jest.resetModules();
});

it.each([undefined, 'https://example.supabase.co'])('does not construct a client without both credentials (url=%s)', (url) => {
  if (url) process.env.EXPO_PUBLIC_SUPABASE_URL = url;
  else delete process.env.EXPO_PUBLIC_SUPABASE_URL;
  delete process.env.EXPO_PUBLIC_SUPABASE_API_KEY;
  jest.isolateModules(() => {
    const { createClient } = require('@supabase/supabase-js');
    expect(require('../supabase').supabase).toBeUndefined();
    expect(createClient).not.toHaveBeenCalled();
  });
});

it('shares a single configured client', () => {
  process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
  process.env.EXPO_PUBLIC_SUPABASE_API_KEY = 'test-public-key';
  jest.isolateModules(() => {
    const { createClient } = require('@supabase/supabase-js');
    const first = require('../supabase').supabase;
    expect(require('../supabase').supabase).toBe(first);
    expect(createClient).toHaveBeenCalledTimes(1);
  });
});
