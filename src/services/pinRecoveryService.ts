const RECOVERY_PASSWORD = "o flamengo é seleção";

export function verifyRecoveryPassword(password: string): boolean {
  return password.trim() === RECOVERY_PASSWORD;
}