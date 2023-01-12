/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { exception, success } from '../core/index.js'
import { tryCatch } from './tryCatch.js'

{
	const s = tryCatch(() => 'data')
	if (s.isSuccess) {
		const sType: string = s()
	} else {
		// @ts-expect-error should be unknown
		const eType: string = s()
	}
}

{
	const s = tryCatch(async () => 'data')
	// @ts-expect-error promise should be awaited
	s.isSuccess
}

{
	const s = await tryCatch(async () => 'data')
	if (s.isSuccess) {
		const sType: string = s()
	} else {
		// @ts-expect-error should be unknown
		const eType: string = s()
	}
}

// --------------------------------------------------------------------------------------------------------------------

{
	const s = tryCatch(() => 'data', () => Error())
	if (s.isException) {
		const eType: Error = s()
	}
}

{
	const s = tryCatch(() => 'data', () => 0 as const)
	if (s.isException) {
		const eType: 0 = s()
	}
}

{
	const s = await tryCatch(async () => 1, () => 'oops' as const)
	if (s.isException) {
		const eType: 'oops' = s()
	}
}

// --------------------------------------------------------------------------------------------------------------------

{
	const s = tryCatch(() => exception(4))
	const sIsSuccess: false = s.isSuccess
	const sIsException: true = s.isException

	// @ts-expect-error should be `unknown`
	const eType: number = s()
	// @ts-expect-error should be `unknown`
	const eWrongType: string = s()
}
