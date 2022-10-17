/* eslint-disable @typescript-eslint/no-unused-vars */

import { exception } from './index.js'

{
	const e = exception('data')
	const eIsException: true = e.isException
	// @ts-expect-error should be `false`
	const eIsSuccess: true = e.isSuccess
}

// --------------------------------------------------------------------------------------------------------------------

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
