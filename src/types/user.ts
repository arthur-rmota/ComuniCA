export interface User {
  id: string;
  name: string;
  email: string;
  pinHash?: string;
  failedPinAttempts?: number;
  pinLockedUntil?: number | null;
  createdAt: string;
  updatedAt: string;
}
