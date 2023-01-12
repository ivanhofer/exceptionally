/* eslint-disable @typescript-eslint/no-unused-vars */

import { success } from '../core/index.js'
import { assertSuccessAndUnwrap } from './index.js'

{
	const s = success('data')

	const r = assertSuccessAndUnwrap(s)

	const sResult: string = r
	// @ts-expect-error should be `string`
	const sWrongResult: number = r
}

{
	const o = { isSuccess: true, isException: false }

	// @ts-expect-error should not accept arbitrary
	assertSuccessAndUnwrap(o)
}
