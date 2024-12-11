export const validatePassword = (password: string) => {
  const minLength = password.length >= 6;
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?/`~]/.test(password);

  const isValid = minLength && hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar;
  
  const errors = [];
  if (!minLength) errors.push("Password must be at least 6 characters long");
  if (!hasLowerCase) errors.push("Include at least one lowercase letter");
  if (!hasUpperCase) errors.push("Include at least one uppercase letter");
  if (!hasNumber) errors.push("Include at least one number");
  if (!hasSpecialChar) errors.push("Include at least one special character");

  return {
    isValid,
    errors
  };
};