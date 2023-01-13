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
		] as const,
	)
	if (r.isSuccess) {
		const sType: [string, number] = r()
	} else {
		// @ts-expect-error should be [unknown, unknown, string | undefined]
		const eType: [unknown, undefined] = r()
	}
}

{
	const r = await processInParallel([
		Promise.resolve((decision) ? exception(1) : success('One')),
		Promise.resolve((decision) ? exception('oops') : success(5)),
	])
	if (r.isSuccess) {
		const sType: unknown[] = r()
		const sType0: unknown = sType[0]
	} else {
		// @ts-expect-error should be unknown[]
		const eType: number[] = r()
	}
}

{
	const r = await processInParallel(
		[
			Promise.resolve(success('One')),
			Promise.resolve(exception('oops')),
		] as const,
	)
	if (r.isSuccess) {
		const sType: [string, never] = r()
		const sType0: string = sType[0]
		// @ts-expect-error should not allow to access index 2 of tuple
		sType[2]
	} else {
		// @ts-expect-error should be [unknown, string | undefined]
		const eType: [string, string | undefined] = r()
	}
}

{
	const r = await processInParallel(
		// @ts-expect-error must be promises (or else calling the function does not make sense)
		[
			success('One'),
		] as const,
	)
}

{
	const r = await processInParallel(
		// @ts-expect-error functions must return an ExceptionallyResult
		[
			Promise.resolve(1),
		] as const,
	)
}
