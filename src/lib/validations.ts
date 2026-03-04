import * as yup from 'yup';

// ─── Auth Schemas ────────────────────────────────────────────────────────────

export const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;

// ─────────────────────────────────────────────────────────────────────────────

export const registerSchema = yup.object({
  name: yup
    .string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
});

export type RegisterFormValues = yup.InferType<typeof registerSchema>;

// ─────────────────────────────────────────────────────────────────────────────

export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
});

export type ForgotPasswordFormValues = yup.InferType<typeof forgotPasswordSchema>;

// ─────────────────────────────────────────────────────────────────────────────

export const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
});

export type ResetPasswordFormValues = yup.InferType<typeof resetPasswordSchema>;

// ─── Todo Schemas ─────────────────────────────────────────────────────────────

export const createTodoSchema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .min(1, 'Title cannot be empty')
    .max(100, 'Title must be at most 100 characters'),
  description: yup
    .string()
    .max(500, 'Description must be at most 500 characters')
    .default(''),
});

export type CreateTodoFormValues = yup.InferType<typeof createTodoSchema>;

// ─────────────────────────────────────────────────────────────────────────────

export const updateTodoSchema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .min(1, 'Title cannot be empty')
    .max(100, 'Title must be at most 100 characters'),
  description: yup
    .string()
    .max(500, 'Description must be at most 500 characters')
    .default(''),
});

export type UpdateTodoFormValues = yup.InferType<typeof updateTodoSchema>;
