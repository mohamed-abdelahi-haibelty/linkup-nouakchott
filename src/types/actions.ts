export type ActionsResponse<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
};
