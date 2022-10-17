import { assertException, exception, success } from '../src/index.js'

import { describe, expect, test } from 'vitest'
import { testDataMatrix } from './test.utils.js'

describe('assertException', () => {
	test('should not throw when passing exception to assertException', () => {
		const result = exception('data')

		expect(() => assertException(result)).not.toThrow()
	})

	test('should throw when passing success to assertException', () => {
		const result = success('data')

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		expect(() => assertException(result)).toThrow()
	})

	describe('should throw when passing something to assertException', () => {
		testDataMatrix((data: unknown, name?: string) =>
			test(`${name || data}`, () => {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				// eslint-disable-next-line max-nested-callbacks
				expect(() => assertException(data)).toThrow()
			})
		)
	})
})
