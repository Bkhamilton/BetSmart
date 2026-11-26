import { validateSignupFields } from '../authValidation';

const validFields = {
    name: 'Test User',
    username: 'test_user',
    email: 'test@example.com',
    password: 'secure-password',
    confirmPassword: 'secure-password',
};

it('accepts complete valid signup fields', () => {
    expect(validateSignupFields(validFields)).toBeNull();
});

it.each([
    [{ ...validFields, email: 'not-an-email' }, 'Enter a valid email address.'],
    [{ ...validFields, username: 'x' }, 'Use a username with at least 3 letters, numbers, or underscores.'],
    [{ ...validFields, password: 'short', confirmPassword: 'short' }, 'Use a password with at least 8 characters.'],
    [{ ...validFields, confirmPassword: 'different-password' }, 'Passwords do not match.'],
])('rejects invalid signup fields', (fields, message) => {
    expect(validateSignupFields(fields)).toBe(message);
});
