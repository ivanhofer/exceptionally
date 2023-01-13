import {
	type Exception,
	exception,
	type ExceptionallyResult,
	type ExtractExceptionData,
	type ExtractSuccessData,
	type Success,
	success,
} from '../core/index.js'

type ExtractSuccessDataFromTuple<Tuple extends ReadonlyArray<Promise<unknown>>> = Tuple extends [] ? []
	: Tuple extends readonly [
		infer First extends Promise<ExceptionallyResult<boolean, unknown>>,
		...infer Rest extends ReadonlyArray<Promise<unknown>>,
	] ? [ExtractSuccessData<Awaited<First>>, ...ExtractSuccessDataFromTuple<Rest>]
	: unknown[]

type ParseReturnType<T> = [T] extends [never] ? unknown : T | undefined

type ExtractExceptionDataFromTuple<Tuple extends ReadonlyArray<Promise<unknown>>> = Tuple extends [] ? []
	: Tuple extends readonly [
		infer First extends Promise<ExceptionallyResult<boolean, unknown>>,
		...infer Rest extends ReadonlyArray<Promise<unknown>>,
	] ? [ParseReturnType<ExtractExceptionData<Awaited<First>>>, ...ExtractExceptionDataFromTuple<Rest>]
	: unknown[]

export const processInParallel = async <Data extends ReadonlyArray<Promise<ExceptionallyResult<boolean, unknown>>>>(
	resultsToProcess: Data,
) => {
	const dataResults = await Promise.allSettled(resultsToProcess)
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
