/* eslint-disable symbol-description */
/* eslint-disable no-void */

const exceptionally = Symbol()

type Inverted<Success extends boolean> = Success extends true ? false : true

export class Exceptionally<Success extends boolean> {
	constructor(
		readonly isSuccess: Success,
		readonly isException: Inverted<Success> = !isSuccess as Inverted<Success>,
	) {}

	static [Symbol.hasInstance](object: unknown) {
		return object && (object as Record<string, unknown>).exceptionally === exceptionally
	}
}

// --------------------------------------------------------------------------------------------------------------------

type GetDataFn<Data> = () => Data

export type ExceptionallyResult<Success extends boolean, Data> = Success extends true ? SuccessOf<Data>
	: ExceptionOf<Data>

type SuccessOf<Data> = GetDataFn<Data> & Exceptionally<true>
export type ExceptionOf<Data> = GetDataFn<Data> & Exceptionally<false>

type Wrap<Success extends boolean, Data> = Data extends ExceptionallyResult<boolean, unknown> ? Data
	: ExceptionallyResult<Success, Data>

const wrap = <Success extends boolean, Data>(
	success: Success,
	data: Data,
): Data extends ExceptionallyResult<boolean, unknown> ? Data : ExceptionallyResult<Success, Data> =>
	data instanceof Exceptionally
		? data
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		: Object.assign(() => data, { exceptionally }, new Exceptionally(success)) as any

// ----------------

export type Success<Data> = Wrap<true, Data>

export const success = <Data = undefined>(
	...data: undefined extends Data ? [] | [Data] : [Data]
): Data extends ExceptionallyResult<boolean, unknown> ? Data : Success<Data> =>
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	wrap(true, ...data as [Data]) as any

// ----------------

export type Exception<Data> = Wrap<false, Data>

export const exception = <Data = undefined>(
	...data: undefined extends Data ? [] | [Data] : [Data]
): Data extends ExceptionallyResult<boolean, unknown> ? Data : Exception<Data> =>
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	wrap(false, ...data as [Data]) as any

// --------------------------------------------------------------------------------------------------------------------

export type ExtractDataType<Result extends ExceptionallyResult<boolean, unknown>> = Result extends
	ExceptionallyResult<boolean, infer Data> ? Data : never

export type ExtractSuccessType<Result extends Exceptionally<boolean>> = Result extends
	ExceptionallyResult<true, infer Data> ? Success<Data> : never

export type ExtractExceptionType<Result extends Exceptionally<boolean>> = Result extends
	ExceptionallyResult<false, infer Data> ? Exception<Data> : never

// --------------------------------------------------------------------------------------------------------------------

const errorFn: () => never = () => {
	throw Error()
}

export const assertSuccess: <Result extends Success<unknown>>(
	result: Result,
) => asserts result is Result = result => void (!result.isSuccess && errorFn())

export const assertException: <Result extends Exception<unknown>>(
	result: Result,
) => asserts result is Result = result => void (!result.isException && errorFn())
