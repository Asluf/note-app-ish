export interface AppResponse<T> {
    success: boolean;
    data: T;
    message: string;
    error?: string;
    errorCode?: number;
    errorData?: unknown;
  }