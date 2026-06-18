export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const isValidUsername = (username: string): boolean => {
  const trimmed = username.trim();

  return (
    trimmed.length >= 3 &&
    trimmed.length <= 20 &&
    /^[a-zA-Z0-9_]+$/.test(trimmed)
  );
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};
