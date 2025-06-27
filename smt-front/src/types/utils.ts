/**
 * Converts a string from snake_case to camelCase
 */
function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Converts a string from camelCase to snake_case
 */
function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Recursively transforms object keys from snake_case to camelCase
 */
export function camelizeKeys<T = unknown>(obj: unknown): T {
  if (obj === null || obj === undefined) {
    return obj as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => camelizeKeys(item)) as T;
  }

  if (typeof obj === 'object') {
    const camelized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      const camelKey = toCamelCase(key);
      camelized[camelKey] = camelizeKeys(value);
    }
    return camelized as T;
  }

  return obj as T;
}

/**
 * Recursively transforms object keys from camelCase to snake_case
 */
export function decamelizeKeys<T = unknown>(obj: unknown): T {
  if (obj === null || obj === undefined) {
    return obj as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => decamelizeKeys(item)) as T;
  }

  if (typeof obj === 'object') {
    const decamelized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      const snakeKey = toSnakeCase(key);
      decamelized[snakeKey] = decamelizeKeys(value);
    }
    return decamelized as T;
  }

  return obj as T;
}

/**
 * Type-safe wrapper for API requests that automatically handles key transformation
 */
export function createApiWrapper<TRequest, TResponse>(
  requestFn: (data: Record<string, unknown>) => Promise<Record<string, unknown>>
) {
  return async (data: TRequest): Promise<TResponse> => {
    const decamelizedData = decamelizeKeys(data) as Record<string, unknown>;
    const response = await requestFn(decamelizedData);
    return camelizeKeys<TResponse>(response);
  };
} 