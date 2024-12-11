export const validateUsername = (username: string): { isValid: boolean; error?: string } => {
  if (!username) {
    return { isValid: false, error: "Username is required" };
  }

  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    return { isValid: false, error: "Username can only contain letters and numbers, without spaces" };
  }

  if (username.length > 30) {
    return { isValid: false, error: "Username must be 30 characters or less" };
  }

  return { isValid: true };
};