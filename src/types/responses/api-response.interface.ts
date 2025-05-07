export interface ApiResponse<T = any> {
  status: number;
  message?: string;
  data?: T;
  timestamp: string;
  path: string;
}

export interface ApiErrorResponse extends Omit<ApiResponse, 'data'> {
  message: string;
  errors?: any[];
}
