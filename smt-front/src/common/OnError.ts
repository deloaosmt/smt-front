export const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'object' && error !== null && 'errors' in error) {
    const backendError = error as { errors: string[] };
    return backendError.errors.at(0) || 'Произошла неизвестная ошибка';
  }
  
  return 'Произошла неизвестная ошибка';
}; 