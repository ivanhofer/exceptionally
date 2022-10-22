/* eslint-disable symbol-description */
/* eslint-disable no-void */

const exceptionally = Symbol()

type GetDataFn<Data> = () => Data

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

export type ExceptionallyResult<Success extends boolean, Data> = GetDataFn<Data> & Exceptionally<Success>

const wrap = <Success extends boolean, Data>(success: Success, data: Data): ExceptionallyResult<Success, Data> =>
	Object.assign(() => data, { exceptionally }, new Exceptionally(success))

export type Success<Data> = ExceptionallyResult<true, Data>

export const success = <Data = undefined>(...data: undefined extends Data ? [] | [Data] : [Data]): Success<Data> =>
	wrap(true, ...data as [Data])

export type Exception<Data> = ExceptionallyResult<false, Data>

export const exception = <Data = undefined>(...data: undefined extends Data ? [] | [Data] : [Data]): Exception<Data> =>
	wrap(false, ...data as [Data])

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
