export interface PasswordStrength {
  score: number; // 0 to 4 (exact count of rules satisfied)
  labelKey: string;
  colorClass: string;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  isStrong: boolean;
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  // Exact 1-to-1 score matching each of the 4 visible rules
  let score = 0;
  if (hasMinLength) score++;
  if (hasUppercase) score++;
  if (hasNumber) score++;
  if (hasSpecialChar) score++;

  let labelKey = 'auth.strengthTooShort';
  let colorClass = 'bg-gray-300';

  if (!password || password.length === 0) {
    labelKey = 'auth.strengthTooShort';
    colorClass = 'bg-gray-300';
  } else if (score <= 1) {
    // 0 or 1 rule satisfied -> Weak
    labelKey = 'auth.strengthWeak';
    colorClass = 'bg-red-500';
  } else if (score === 2 || score === 3) {
    // 2 or 3 rules satisfied -> Medium / Fair
    labelKey = 'auth.strengthMedium';
    colorClass = 'bg-amber-500';
  } else if (score === 4) {
    // ALL 4 rules satisfied -> Strong
    labelKey = 'auth.strengthStrong';
    colorClass = 'bg-emerald-600';
  }

  // A password is strictly strong ONLY if ALL 4 criteria are satisfied
  const isStrong = hasMinLength && hasUppercase && hasNumber && hasSpecialChar;

  return {
    score,
    labelKey,
    colorClass,
    hasMinLength,
    hasUppercase,
    hasNumber,
    hasSpecialChar,
    isStrong,
  };
}
