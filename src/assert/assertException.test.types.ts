/* eslint-disable @typescript-eslint/no-unused-vars */

import { type Exception, exception, success } from '../core/index.js'
import { assertException } from './index.js'

{
	const e = exception('data')

	assertException(e)

	const eResult: Exception<string> = e
}

{
	const s = success('data')

	// @ts-expect-error should not accept Success type
	assertException(s)

	// @ts-expect-error should be of type never
	s.toString()
}

{
	const e = exception('data')
	const s = success(123)
	const r = Math.random() > 0.5 ? s : e

	// @ts-expect-error should not accept Success type
	assertException(r)

	const rResult: Exception<string> = e
}

{
	const o = { isSuccess: false, isException: true }

	// @ts-expect-error should not accept arbitrary
	assertException(o)
}
