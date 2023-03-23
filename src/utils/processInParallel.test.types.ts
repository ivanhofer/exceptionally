/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-expressions */
import { exception, success } from '../core/index.js'
import { processInParallel } from './processInParallel.js'

// eslint-disable-next-line @typescript-eslint/no-inferrable-types
const decision: boolean = true

{
	const r = await processInParallel(
		[
			Promise.resolve(success('data')),
			Promise.resolve((decision) ? exception('oops') : success(1)),
		],
	)
	if (r.isSuccess) {
		const sType: [string, number] = r()
	} else {
		// @ts-expect-error should be [never, string | undefined]
		const eType: [never, undefined] = r()
	}
}

{
	const r = await processInParallel([
		Promise.resolve((decision) ? exception(1) : success('One')),
		Promise.resolve((decision) ? exception('oops') : success(5)),
	])
	if (r.isSuccess) {
		const sType: [string, number] = r()
		const sType0: string = sType[0]
		const sType1: number = sType[1]
		// @ts-expect-error should not allow to access index 2 of tuple
		sType[2]
	} else {
		const eType: [number | undefined, string | undefined] = r()
		const eType0: number | undefined = eType[0]
		const eType1: string | undefined = eType[1]
		// @ts-expect-error should not allow to access index 2 of tuple
		eType[2]
	}
}

{
	const r = await processInParallel(
		[
			Promise.resolve(success('One')),
			Promise.resolve(exception('oops')),
		],
	)
	if (r.isSuccess) {
		const sType: [string, never] = r()
		const sType0: string = sType[0]
		// @ts-expect-error should not allow to access index 2 of tuple
		sType[2]
	} else {
		const eType: [never, string | undefined] = r()
	}
}

{
	const items = new Array(5).fill(null).map((_, i) => Promise.resolve(i % 2 ? success(1) : exception('')))
	const r = await processInParallel(items)

	if (r.isSuccess) {
		const sType: number[] = r()
		// @ts-expect-error should be number | undefined
		const sType0: number = sType[0]
	} else {
		const eType: (string | undefined)[] = r()
	}
}

{
	const items = new Array(5).fill(null).map((_, i) => Promise.resolve(success(i % 2 ? 'message' : true)))
	const r = await processInParallel(items)

	if (r.isSuccess) {
		const sType: (string | boolean)[] = r()
	} else {
		const eType: never[] = r()
	}
}

{
	const r = await processInParallel(
		[
			// @ts-expect-error must be promises (or else calling the function does not make sense)
			success('One'),
		],
	)
}

{
	const r = await processInParallel(
		[
			// @ts-expect-error functions must return an ExceptionallyResult
			Promise.resolve(1),
		],
	)
}
