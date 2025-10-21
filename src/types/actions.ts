export type ActionsResponse<T = undefined> = {
  success: boolean;
  message: string;
  data?: T | null;
  error?: Record<string, string[]> | null;
  errorCode?: string;
};
