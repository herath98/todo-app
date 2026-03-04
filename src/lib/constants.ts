export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  LOGOUT_ALL: '/auth/logout-all',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',
  VERIFY_EMAIL: '/auth/verify-email',
  RESEND_VERIFICATION: '/auth/resend-verification',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  CHANGE_PASSWORD: '/auth/change-password',

  // Users
  USERS: '/users',
  USER_BY_ID: (id: string) => `/users/${id}`,
  USER_PROFILE: '/users/profile',

  // Todos
  TODOS: '/todos',
  TODO_BY_ID: (id: string) => `/todos/${id}`,
  TODO_TOGGLE: (id: string) => `/todos/${id}/done`
};