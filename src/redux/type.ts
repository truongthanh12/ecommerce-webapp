export const PENDING = "PENDING";
export const FULFILLED = "FULFILLED";
export const REJECTED = "REJECTED";
export interface LoadingState {
  loading: boolean;
  error: Error | null;
}
