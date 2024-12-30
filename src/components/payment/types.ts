export interface FormData {
  name: string;
  email: string;
  phone: string;
  country: string;
  province: string;
  district: string;
  city: string;
  address: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

export interface FormErrors {
  name?: string;
  phone?: string;
  country?: string;
  province?: string;
  district?: string;
  city?: string;
  address?: string;
  cardNumber?: string;
  expiry?: string;
  cvc?: string;
}