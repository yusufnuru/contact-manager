import assert from 'node:assert';
import { AppErrorCode } from '../constants/app-error-code.js';
import AppError from './app-error.js';

type AppAssert = (
  condition: unknown,
  httpStatusCode: number,
  message: string,
  appErrorCode?: AppErrorCode,
) => asserts condition;
/**
 * Asserts a condition and throws an AppError if the condition is falsy.
 */
const appAssert: AppAssert = (condition, httpStatusCode, message, appErrorCode) =>
  assert(condition, new AppError(httpStatusCode, message, appErrorCode));

export default appAssert;
