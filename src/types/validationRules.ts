export const VALIDATION_RULES = {
  name: {
    minLength: 2,
    maxLength: 100,
  },
  lastName: {
    minLength: 2,
    maxLength: 100,
  },
  phone: {
    pattern: /^\+?54?\s?\d{10}$/,
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  postalCode: {
    pattern: /^\d{4,5}$/,
  },
} as const;
