export const getAuthErrorMessage = (error: string): { 
  fieldErrors: { email?: string; password?: string },
  toastMessage: string 
} => {
  console.log("Processing auth error:", error);
  
  if (error.includes("Invalid login credentials")) {
    return {
      fieldErrors: {
        email: "Invalid email or password",
        password: "Invalid email or password"
      },
      toastMessage: "The email or password you entered is incorrect. Please try again."
    };
  }
  
  if (error.includes("Email not confirmed")) {
    return {
      fieldErrors: {
        email: "Email not verified"
      },
      toastMessage: "Please verify your email address before logging in."
    };
  }

  if (error.includes("User not found")) {
    return {
      fieldErrors: {
        email: "Email address not found"
      },
      toastMessage: "This email address is not registered. Please check your email or sign up for a new account."
    };
  }

  // Default error case
  return {
    fieldErrors: {},
    toastMessage: "An error occurred during authentication. Please try again."
  };
};