export const validation = {
  email: (value: string): { isValid: boolean; error?: string } => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!value) {
      return { isValid: false, error: 'Email is required' };
    }
    if (!emailRegex.test(value)) {
      return { isValid: false, error: 'Invalid email format' };
    }
    return { isValid: true };
  },

  password: (value: string): { isValid: boolean; error?: string } => {
    if (!value) {
      return { isValid: false, error: 'Password is required' };
    }
    if (value.length < 8) {
      return { isValid: false, error: 'Password must be at least 8 characters' };
    }
    if (!/[A-Z]/.test(value)) {
      return { isValid: false, error: 'Password must contain at least one uppercase letter' };
    }
    if (!/[a-z]/.test(value)) {
      return { isValid: false, error: 'Password must contain at least one lowercase letter' };
    }
    if (!/[0-9]/.test(value)) {
      return { isValid: false, error: 'Password must contain at least one number' };
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return { isValid: false, error: 'Password must contain at least one special character' };
    }
    return { isValid: true };
  },

  phone: (value: string): { isValid: boolean; error?: string } => {
    if (!value) {
      return { isValid: false, error: 'Phone number is required' };
    }
    const phoneRegex = /^\+?[0-9\s()-]{9,}$/;
    if (!phoneRegex.test(value)) {
      return { isValid: false, error: 'Invalid phone number format' };
    }
    return { isValid: true };
  },

  name: (value: string): { isValid: boolean; error?: string } => {
    if (!value) {
      return { isValid: false, error: 'This field is required' };
    }
    if (value.length < 2) {
      return { isValid: false, error: 'Must be at least 2 characters' };
    }
    if (!/^[a-zA-Z\s'-]+$/.test(value)) {
      return { isValid: false, error: 'Only letters, spaces, hyphens and apostrophes allowed' };
    }
    return { isValid: true };
  }
};

export const sanitize = {
  text: (value: string): string => {
    return value
      .trim()
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  email: (value: string): string => {
    return value.trim().toLowerCase();
  },

  phone: (value: string): string => {
    return value.trim().replace(/[^\d+\s()-]/g, '');
  }
};
