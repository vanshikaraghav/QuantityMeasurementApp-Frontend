// src/app/models/quantity.model.ts

export interface QuantityDTO {
  value: number;
  unit: string;
  type: string;
}

export interface QuantityMeasurementEntity {
  id: number;
  operation: string;
  result: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
  message: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  password: string;
  role?: string;
}

export interface CompareResult {
  equal: boolean;
}
