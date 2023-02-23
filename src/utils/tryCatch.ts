import {
	type Exception,
	exception,
	type ExceptionallyResult,
	isExceptionallyResult,
	type Success,
	success,
} from '../core/index.js'
import { isAsync } from '../utils.js'

type TryCatchResult<
	Type,
	ErrorFn extends (error: unknown) => unknown,
> =
	| Success<Type>
	| Exception<
		ErrorFn extends undefined ? undefined
			: ReturnType<ErrorFn>
	>

type DefineReturnType<
	Fn extends () => unknown | Promise<unknown>,
	ErrorFn extends (error: unknown) => unknown,
> = ReturnType<Fn> extends never ? TryCatchResult<ReturnType<Fn>, ErrorFn>
	: ReturnType<Fn> extends Promise<unknown> ? Promise<TryCatchResult<Awaited<ReturnType<Fn>>, ErrorFn>>
	: TryCatchResult<ReturnType<Fn>, ErrorFn>

export const tryCatch = <
	Fn extends () => unknown | Promise<unknown>,
	ErrorFn extends (error: unknown) => unknown,
>(
	fn: Fn,
	errorFn?: ErrorFn,
	logger: { error: (message: unknown) => void } | false = console,
): DefineReturnType<Fn, ErrorFn> => {
	try {
		const result = fn()
		if (isAsync(result)) {
			// eslint-disable-next-line @typescript-eslint/no-misused-promises, no-async-promise-executor
			return new Promise(async resolve => {
				resolve(handleResult(await result.catch(exception), errorFn, logger))
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			}) as any
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return handleResult(success(result), errorFn, logger) as any
	} catch (err) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return handleError(err, errorFn, logger) as any
	}
}

const handleResult = <ErrorFn extends (error: unknown) => unknown>(
	result: unknown,
	errorFn: ErrorFn | undefined,
	logger: { error: (message: unknown) => void } | false,
) =>
	(isExceptionallyResult(result) && result.isException)
		? handleError(result, errorFn, logger)
		: success(result)

const handleError = <ErrorFn extends (error: unknown) => unknown>(
	error: unknown,
	errorFn: ErrorFn | undefined,
	logger: { error: (message: unknown) => void } | false,
) => {
	const unwrappedError = unwrapExceptionIfNeeded(error)

	const transformedError = errorFn ? errorFn(unwrappedError) : unwrappedError

	logger && logger.error(transformedError || unwrappedError)

	return exception(transformedError)
}

const unwrapExceptionIfNeeded = <Data>(data: Data | ExceptionallyResult<boolean, Data>): Data =>
	isExceptionallyResult(data) ? data() : data
