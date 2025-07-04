export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
  totalPages?: number;
  total?: number;
  totalItems?: number;
}
