import { exception, success } from '../core/index.js'
import { assertSuccessAndUnwrap } from './index.js'

import { describe, expect, test } from 'vitest'
import { testDataMatrix } from '../../test/test.utils.js'

describe('assertSuccessAndUnwrap', () => {
	test('should not throw when passing success to assertSuccessAndUnwrap', () => {
		const result = success('data')

		expect(assertSuccessAndUnwrap(result)).toBe('data')
	})

	test('should not throw when passing async success to assertSuccessAndUnwrap', async () => {
		const result = Promise.resolve(success('data'))

		expect(await assertSuccessAndUnwrap(result)).toBe('data')
	})

	test('should throw when passing exception to assertSuccessAndUnwrap', () => {
		const result = exception('data')

		expect(() => assertSuccessAndUnwrap(result)).toThrow()
	})

	describe('should throw when passing something to assertSuccessAndUnwrap', () => {
		testDataMatrix((data: unknown, name?: string) =>
			test(`${name || data}`, () => {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				// eslint-disable-next-line max-nested-callbacks
				expect(() => assertSuccessAndUnwrap(data)).toThrow()
			})
		)
	})
})
