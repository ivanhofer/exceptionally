/* eslint-disable @typescript-eslint/no-unused-vars */

import { type Exception, exception, type Success, success } from './index.js'

type CheckIfSuccess<T extends Success<string>> = T

type C1 = CheckIfSuccess<Success<'value'>>
type C2 = CheckIfSuccess<Exception<Success<'random string'>>>
type C3 = CheckIfSuccess<Exception<Exception<Success<'random string'>>>>

// @ts-expect-error is not a Success Type
type E1 = CheckIfSuccess<Exception<'value'>>
// @ts-expect-error is not a Success Type
type E2 = CheckIfSuccess<Success<Exception<'value'>>>

{
	const s = success('data')
	const sIsSuccess: true = s.isSuccess
	const sIsException: false = s.isException
}

{
	const s = success()
	const sIsSuccess: true = s.isSuccess
	const sIsException: false = s.isException

	const sType: undefined = s()
}

// --------------------------------------------------------------------------------------------------------------------

{
	const s = success(success(true as const))
	const sIsSuccess: true = s.isSuccess
	const sIsException: false = s.isException

	const sType: true = s()
}

{
	const s = success(exception(5 as const))
	const sIsSuccess: false = s.isSuccess
	const sIsException: true = s.isException

	const sType: 5 = s()
}

// --------------------------------------------------------------------------------------------------------------------

{
	// @ts-expect-error need to pass data if type is specified
	const s = success<string>()
}

{
	// @ts-expect-error cannot pass `undefined` if type is specified
	const s = success<string>(undefined)
}

{
	const s = success(undefined)
	const sType: undefined = s()
	// @ts-expect-error should be `undefined`
	const sWrongType: null = s()
}

{
	const s = success(null)
	const sType: null = s()
	// @ts-expect-error should be `null`
	const sWrongType: number = s()
}

{
	const s = success(true)
	const sBooleanIsBoolean: boolean = s()
	// @ts-expect-error should be `boolean`
	const sBooleanIsNotNumber: number = s()
}

{
	const s = success(false)
	const sBooleanIsBoolean: boolean = s()
	// @ts-expect-error should be `boolean`
	const sBooleanIsNotNumber: object = s()
}

{
	const s = success(123)
	const sType: number = s()
	// @ts-expect-error should be `number`
	const sWrongType: string = s()
}

{
	const s = success('value')
	const sType: string = s()
	// @ts-expect-error should be `string`
	const sWrongType: null = s()
}

{
	const s = success(new Date())
	const sType: Date = s()
	// @ts-expect-error should be `Date`
	const sWrongType: number = s()
}

{
	const s = success(Symbol.for('sym'))
	const sType: symbol = s()
	// @ts-expect-error should be `symbol`
	const sWrongType: string = s()
}

{
	const s = success(() => false)
	const sType: () => false = s()
	// @ts-expect-error should be `() => false`
	const sWrongType: boolean = s()
}

{
	const s = success({ data: true })
	const sType: { data: boolean } = s()
	// @ts-expect-error should be `{ data: boolean }`
	const sWrongType: boolean = s()
}

{
	const s = success(['this', 'is', 'an', 'array'])
	const sType: string[] = s()
	// @ts-expect-error should be `string[]`
	const sWrongType: string = s()
}

{
	const value = Math.random() < 0.5 ? 123 : new Date()
	const s = success(value)
	const sType: number | Date = s()
	// @ts-expect-error should be `number | Date`
	const sWrongType: null = s()
}
