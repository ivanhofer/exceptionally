/* eslint-disable @typescript-eslint/no-unused-vars */

import { exception, type Success, success } from '../core/index.js'
import { guardSuccess } from './index.js'

{
	const s = success('data')

	guardSuccess(s)
}

{
	const e = exception('data')

	// @ts-expect-error should not accept Success type
	guardSuccess(e)
}

{
	const s = success('data')
	const e = exception(123)
	const r = Math.random() > 0.5 ? e : s

	// @ts-expect-error should not accept Success type
	guardSuccess(r)
}

{
	const o = { isSuccess: true, isException: false }

	// @ts-expect-error should not accept arbitrary
	guardSuccess(o)
}
