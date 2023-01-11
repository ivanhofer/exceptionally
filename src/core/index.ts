/* eslint-disable symbol-description */

const exceptionally = Symbol()

const isExceptionallyInstance = <Success extends boolean, Data>(
	value: unknown,
): value is ExceptionallyResult<Success, Data> =>
	(value as Record<string, unknown> | undefined)?.exceptionally === exceptionally

type Inverted<Success extends boolean> = Success extends true ? false : true

// --------------------------------------------------------------------------------------------------------------------

type GetDataFn<Data> = () => Data

export type ExceptionallyResult<Success extends boolean, Data> = Success extends true ? SuccessOf<Data>
	: ExceptionOf<Data>

type SuccessOf<Data> = GetDataFn<Data> & { isSuccess: true; isException: false }
type ExceptionOf<Data> = GetDataFn<Data> & { isSuccess: false; isException: true }

type Wrap<Success extends boolean, Data> = Data extends ExceptionallyResult<boolean, unknown> ? Data
	: ExceptionallyResult<Success, Data>

const wrap = <Success extends boolean, Data>(
	success: Success,
	data: Data,
): Data extends ExceptionallyResult<boolean, unknown> ? Data : ExceptionallyResult<Success, Data> =>
	(isExceptionallyInstance(data)
		? data
		: Object.assign(
			() => data,
			{
				exceptionally,
				isSuccess: success as Success,
				isException: !success as Inverted<Success>,
			},
		)) as Data extends ExceptionallyResult<boolean, unknown> ? Data : ExceptionallyResult<Success, Data>

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

export type ExtractSuccessType<Result extends ExceptionallyResult<boolean, unknown>> = Result extends
	ExceptionallyResult<true, infer Data> ? Success<Data> : never

export type ExtractExceptionType<Result extends ExceptionallyResult<boolean, unknown>> = Result extends
	ExceptionallyResult<false, infer Data> ? Exception<Data> : never
