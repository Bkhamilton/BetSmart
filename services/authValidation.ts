interface SignupFields {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface ProfileFields {
    name: string;
    username: string;
    email: string;
}

export const validateProfileFields = ({ name, username, email }: ProfileFields): string | null => {
    if (!name.trim() || !username.trim() || !email.trim()) {
        return 'Name, username, and email are required.';
    }
    if (username.trim().length < 3 || !/^[a-zA-Z0-9_]+$/.test(username.trim())) {
        return 'Use a username with at least 3 letters, numbers, or underscores.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return 'Enter a valid email address.';
    }
    return null;
};

export const validateSignupFields = ({
    name,
    username,
    email,
    password,
    confirmPassword,
}: SignupFields): string | null => {
    if (!password || !confirmPassword) {
        return 'Please complete every field.';
    }
    const profileError = validateProfileFields({ name, username, email });
    if (profileError) return profileError;
    if (password.length < 8) {
        return 'Use a password with at least 8 characters.';
    }
    if (password !== confirmPassword) {
        return 'Passwords do not match.';
    }
    return null;
};
