/* eslint-disable @typescript-eslint/no-unused-vars */

import { exception } from '../core/index.js'
import { assertExceptionAndUnwrap } from './index.js'

{
	const s = exception(123)

	const r = assertExceptionAndUnwrap(s)

	const sResult: number = r
	// @ts-expect-error should be `number`
	const sWrongResult: string = r
}

{
	const o = { isexception: true, isException: false }

	// @ts-expect-error should not accept arbitrary
	assertExceptionAndUnwrap(o)
}
