/* eslint-disable @typescript-eslint/no-unused-vars */

import { exception } from '../core/index.js'
import { assertExceptionAndUnwrap } from './index.js'

{
	const e = exception(123)

	const r = assertExceptionAndUnwrap(e)

	const sResult: number = r
	// @ts-expect-error should be `number`
	const sWrongResult: string = r
}

{
	const o = { isSuccess: true, isException: false }

	// @ts-expect-error should not accept arbitrary
	assertExceptionAndUnwrap(o)
}
