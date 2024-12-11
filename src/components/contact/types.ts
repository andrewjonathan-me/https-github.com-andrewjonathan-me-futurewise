export interface FormData {
  name: string;
  email: string;
  phone: string;
  category: string;
  message: string;
  consent: boolean;
}

export interface FormErrors {
  name: string;
  phone: string;
}