/* eslint-disable @typescript-eslint/no-unused-vars */

import { assertSuccess, type Exception, exception, type Success, success } from './index.js'

{
	const s = success('data')

	assertSuccess(s)

	const sResult: Success<string> = s
}

{
	const e = exception('data')

	// @ts-expect-error should not accept Success type
	assertSuccess(e)

	// @ts-expect-error should be of type never
	e.toString()
}

{
	const s = success('data')
	const e = exception(123)
	const r = Math.random() > 0.5 ? e : s

	// @ts-expect-error should not accept Success type
	assertSuccess(r)

	const rResult: Success<string> = s
}

{
	const o = { isSuccess: true, isException: false }

	// @ts-expect-error should not accept arbitrary
	assertSuccess(o)
}
