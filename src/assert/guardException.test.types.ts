/* eslint-disable @typescript-eslint/no-unused-vars */

import { type Exception, exception, success } from '../core/index.js'
import { guardException } from './index.js'

{
	const e = exception('data')

	guardException(e)
}

{
	const s = success('data')

	// @ts-expect-error should not accept Success type
	guardException(s)
}

{
	const e = exception('data')
	const s = success(123)
	const r = Math.random() > 0.5 ? s : e

	// @ts-expect-error should not accept Success type
	guardException(r)
}

{
	const o = { isSuccess: false, isException: true }

	// @ts-expect-error should not accept arbitrary
	guardException(o)
}
