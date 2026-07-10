import type { PaymentStatus } from "@/types/shared";

export interface Parent {
  id: string;
  userId: string;
  name: string;
  phone: string;
  profession: string;
  address: string;
  emergencyContact: string;
  paymentStatus: PaymentStatus;
}

export interface RegisterParentInput {
  name: string;
  email: string;
  password: string;
  phone: string;
  profession: string;
  address: string;
  emergencyContact: string;
}
