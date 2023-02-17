/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, no-void */
import type { Exception, ExceptionallyResult, ExtractException, ExtractSuccess, Success } from '../core/index.js'
import { isAsync } from '../utils.js'

const errorFn: () => never = () => {
	throw Error()
}

export const assertSuccess: <Result extends Success<unknown>>(
	result: Result,
) => asserts result is Result = result => void (!result.isSuccess && errorFn())

export const guardSuccess: <Result extends Success<unknown>>(
	result: Result,
) => void = _ => undefined

export const assertException: <Result extends Exception<unknown>>(
	result: Result,
) => asserts result is Result = result => void (!result.isException && errorFn())

export const guardException: <Result extends Exception<unknown>>(
	result: Result,
) => void = _ => undefined

export const assertExceptionsHandled: <Result extends Success<unknown> | never>(
	result: Result,
) => asserts result is never = result => !result.isSuccess && errorFn()

export const guardExceptionsHandled: <Result extends Success<unknown> | never>(result: Result) => void = _ => undefined

// --------------------------------------------------------------------------------------------------------------------

const checkForSuccess = <R extends ExceptionallyResult<boolean, unknown>>(result: R) => {
	const castedResult = result as unknown as ExtractSuccess<R>
	assertSuccess(castedResult)
	return castedResult() as ReturnType<ExtractSuccess<R>>
}

export function assertSuccessAndUnwrap<R extends ExceptionallyResult<boolean, unknown>>(
	value: R,
): ReturnType<ExtractSuccess<R>>

export function assertSuccessAndUnwrap<R extends Promise<ExceptionallyResult<boolean, unknown>>>(
	value: R,
): Promise<ReturnType<ExtractSuccess<Awaited<R>>>>

export function assertSuccessAndUnwrap(value: any) {
	if (isAsync(value)) {
		// eslint-disable-next-line @typescript-eslint/no-misused-promises, no-async-promise-executor
		return new Promise(async (resolve, reject) => {
			try {
				resolve(checkForSuccess(await value as any))
			} catch (error) {
				reject(error)
			}
		}) as any
	}

	return checkForSuccess(value) as any
}

// --------------------------------------------------------------------------------------------------------------------

const checkForException = <R extends ExceptionallyResult<boolean, unknown>>(result: R) => {
	const castedResult = result as unknown as ExtractException<R>
	assertException(castedResult)
	return castedResult() as ReturnType<ExtractException<R>>
}

export function assertExceptionAndUnwrap<R extends ExceptionallyResult<boolean, unknown>>(
	value: R,
): ReturnType<ExtractException<R>>

export function assertExceptionAndUnwrap<R extends Promise<ExceptionallyResult<boolean, unknown>>>(
	value: R,
): Promise<ReturnType<ExtractException<Awaited<R>>>>

export function assertExceptionAndUnwrap(value: any) {
	if (isAsync(value)) {
		// eslint-disable-next-line @typescript-eslint/no-misused-promises, no-async-promise-executor
		return new Promise(async (resolve, reject) => {
			try {
				resolve(checkForException(await value as any))
			} catch (error) {
				reject(error)
			}
		}) as any
	}

	return checkForException(value) as any
}
