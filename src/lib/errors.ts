// src/lib/errors.ts
import { AxiosError } from 'axios';

export function getReadableError(error: unknown): string {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const detail = error.response?.data?.detail;

    // Use FastAPI's plain-English messages if they exist
    if (detail && typeof detail === 'string') return detail;

    // Otherwise map by standard HTTP status code
    switch (status) {
      case 400: return 'Something is wrong with the information you entered. Please check and try again.';
      case 401: return 'Your session has expired. Please log in again.';
      case 403: return 'You do not have permission to do this.';
      case 404: return 'We could not find what you were looking for.';
      case 422: return 'Some of the information entered is invalid. Please check all fields.';
      case 429: return 'You are doing that too quickly. Please wait a moment and try again.';
      case 500: return 'Something went wrong on our end. Please try again in a moment.';
      default:  return 'Something went wrong. Please try again.';
    }
  }
  
  // Handle native JavaScript errors (e.g., TypeError, ReferenceError)
  if (error instanceof Error) return error.message;
  
  return 'An unexpected error occurred.';
}