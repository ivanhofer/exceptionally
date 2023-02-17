/* eslint-disable no-console */

import { exception, success } from '../core/index.js'
import { guardExceptionsHandled } from './index.js'

{
	const s = success('data')

	guardExceptionsHandled(s)
}

{
	const e = exception('data')

	// @ts-expect-error exception was not handled
	guardExceptionsHandled(e)
}

{
	const e = exception('data')
	const x = e()
	if (typeof x === 'string') {
		console.log(x)
	} else {
		guardExceptionsHandled(x)
	}
}

{
	const e = Math.random() > 0.5 ? exception('data') : exception(123)
	const x = e()
	if (typeof x === 'string') {
		console.log(x)
	} else {
		// @ts-expect-error number exception was not handled
		guardExceptionsHandled(x)
	}
}
