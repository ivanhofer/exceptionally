import { exception, success } from '../core/index.js'

import { describe, expect, test } from 'vitest'
import { testDataMatrix } from '../../test/test.utils.js'
import { assertExceptionAndUnwrap } from './index.js'

describe('assertExceptionAndUnwrap', () => {
	test('should not throw when passing exception to assertExceptionAndUnwrap', () => {
		const result = exception('data')

		expect(assertExceptionAndUnwrap(result)).toBe('data')
	})

	test('should not throw when passing async exception to assertExceptionAndUnwrap', async () => {
		const result = Promise.resolve(exception('data'))

		expect(await assertExceptionAndUnwrap(result)).toBe('data')
	})

	test('should throw when passing success to assertExceptionAndUnwrap', () => {
		const result = success('data')

		expect(() => assertExceptionAndUnwrap(result)).toThrow()
	})

	describe('should throw when passing something to assertExceptionAndUnwrap', () => {
		testDataMatrix((data: unknown, name?: string) =>
			test(`${name || data}`, () => {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				// eslint-disable-next-line max-nested-callbacks
				expect(() => assertExceptionAndUnwrap(data)).toThrow()
			})
		)
	})
})
