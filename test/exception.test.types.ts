/* eslint-disable @typescript-eslint/no-unused-vars */

import { type Exception, exception, type Success, success } from './index.js'

type CheckIfException<T extends Exception<string>> = T

type C1 = CheckIfException<Exception<'value'>>
type C2 = CheckIfException<Success<Exception<'random string'>>>
type C3 = CheckIfException<Success<Success<Exception<'random string'>>>>

// @ts-expect-error is not a Exception Type
type E1 = CheckIfException<Success<'value'>>
// @ts-expect-error is not a Exception Type
type E2 = CheckIfException<Exception<Success<'value'>>>

{
	const e = exception('data')
	const eIsException: true = e.isException
	// @ts-expect-error should be `false`
	const eIsSuccess: true = e.isSuccess
}

{
	const e = exception()
	const eIsException: true = e.isException
	// @ts-expect-error should be `false`
	const eIsSuccess: true = e.isSuccess

	const eType: undefined = e()
}

// --------------------------------------------------------------------------------------------------------------------

{
	const s = exception(success(true as const))
	const sIsSuccess: true = s.isSuccess
	// @ts-expect-error should be `false`
	const sIsException: true = s.isException

	const sType: true = s()
}

{
	const s = exception(exception(5 as const))
	const sIsSuccess: false = s.isSuccess
	// @ts-expect-error should be `false`
	const sIsException: false = s.isException

	const sType: 5 = s()
}

// --------------------------------------------------------------------------------------------------------------------

{
	// @ts-expect-error need to pass data if type is specified
	const e = exception<string>()
}

{
	// @ts-expect-error cannot pass `undefined` if type is specified
	const e = exception<string>(undefined)
}

{
	const e = exception(undefined)
	const eType: undefined = e()
	// @ts-expect-error should be `undefined`
	const eWrongType: null = e()
}

{
	const e = exception(null)
	const eType: null = e()
	// @ts-expect-error should be `null`
	const eWrongType: number = e()
}

{
	const e = exception(true)
	const eBooleanIsBoolean: boolean = e()
	// @ts-expect-error should be `boolean`
	const eBooleanIsNotNumber: number = e()
}

{
	const e = exception(false)
	const eBooleanIsBoolean: boolean = e()
	// @ts-expect-error should be `boolean`
	const eBooleanIsNotNumber: object = e()
}

{
	const e = exception(123)
	const eType: number = e()
	// @ts-expect-error should be `number`
	const eWrongType: string = e()
}

{
	const e = exception('value')
	const eType: string = e()
	// @ts-expect-error should be `string`
	const eWrongType: null = e()
}

{
	const e = exception(new Date())
	const eType: Date = e()
	// @ts-expect-error should be `Date`
	const eWrongType: number = e()
}

{
	const e = exception(Symbol.for('sym'))
	const eType: symbol = e()
	// @ts-expect-error should be `symbol`
	const eWrongType: string = e()
}

{
	const e = exception(() => false)
	const eType: () => false = e()
	// @ts-expect-error should be `() => false`
	const eWrongType: boolean = e()
}

{
	const e = exception({ data: true })
	const eType: { data: boolean } = e()
	// @ts-expect-error should be `{ data: boolean }`
	const eWrongType: boolean = e()
}

{
	const e = exception(['this', 'is', 'an', 'array'])
	const eType: string[] = e()
	// @ts-expect-error should be `string[]`
	const eWrongType: string = e()
}

{
	const value = Math.random() < 0.5 ? 123 : new Date()
	const e = exception(value)
	const eType: number | Date = e()
	// @ts-expect-error should be `number | Date`
	const eWrongType: null = e()
}
