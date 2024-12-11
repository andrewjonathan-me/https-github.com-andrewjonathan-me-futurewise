export const validateName = (name: string) => {
  if (name.length > 50) {
    return "Name must be 50 characters or less";
  }
  if (!/^[a-zA-Z\s]*$/.test(name)) {
    return "Name should contain only letters and spaces";
  }
  return "";
};

export const validatePhone = (phone: string) => {
  if (phone && !/^[0-9-]*$/.test(phone)) {
    return "Phone number can only contain numbers and hyphens";
  }
  return "";
};