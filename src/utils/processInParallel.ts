import {
	type Exception,
	exception,
	type ExceptionallyResult,
	type ExtractExceptionData,
	type ExtractSuccessData,
	type Success,
	success,
} from '../core/index.js'

type ExtractSuccessDataFromTuple<Tuple extends ReadonlyArray<Promise<ExceptionallyResult<boolean, unknown>>>> =
	Tuple extends [] ? []
		: Tuple extends readonly [
			infer First extends Promise<ExceptionallyResult<boolean, unknown>>,
			...infer Rest extends ReadonlyArray<Promise<ExceptionallyResult<boolean, unknown>>>,
		] ? [ExtractSuccessData<Awaited<First>>, ...ExtractSuccessDataFromTuple<Rest>]
		: Tuple extends Array<Promise<ExceptionallyResult<boolean, unknown>>>
			? Array<ExtractSuccessData<Awaited<Tuple[number]>>>
		: never[]

type ExceptionReturnType<T> = [T] extends [never] ? never : T | undefined

type ExceptionArrayReturnType<T> = T extends Array<infer D> ? ExceptionReturnType<D>[] : T

type ExtractExceptionDataFromTuple<Tuple extends ReadonlyArray<Promise<ExceptionallyResult<boolean, unknown>>>> =
	Tuple extends [] ? []
		: Tuple extends readonly [
			infer First extends Promise<ExceptionallyResult<boolean, unknown>>,
			...infer Rest extends ReadonlyArray<Promise<ExceptionallyResult<boolean, unknown>>>,
		] ? [ExceptionReturnType<ExtractExceptionData<Awaited<First>>>, ...ExtractExceptionDataFromTuple<Rest>]
		: Tuple extends Array<Promise<ExceptionallyResult<boolean, unknown>>>
			? ExceptionArrayReturnType<Array<ExtractExceptionData<Awaited<Tuple[number]>>>>
		: never[]

export const processInParallel = async <
	// dprint-ignore
	const Data extends
	| ReadonlyArray<Promise<ExceptionallyResult<boolean, unknown>>>
	| Array<Promise<ExceptionallyResult<boolean, unknown>>>,
>(
	resultsToProcess: Data,
) => {
	const dataResults = await Promise.allSettled(resultsToProcess as unknown[])
	const results: ExceptionallyResult<boolean, unknown>[] = dataResults.map(r =>
		r.status === 'fulfilled' ? success(r.value) : exception(r.reason)
	)
	if (results.some(result => result.isException)) {
		return exception(results.map(result => result.isException ? result() : undefined)) as Exception<
			ExtractExceptionDataFromTuple<Data>
		>
	}

	return success(results.map(result => result())) as Success<ExtractSuccessDataFromTuple<Data>>
}
