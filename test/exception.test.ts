import { exception } from '../src/index.js'

import { describe, expect, test } from 'vitest'
import { testDataMatrix } from './test.utils.js'

describe('exception', () => {
	test('should return true for isException', () => {
		const result = exception('data')

		expect(result.isException).toBe(true)
	})

	test('should return false for isSuccess', () => {
		const result = exception('data')

		expect(result.isSuccess).toBe(false)
	})

	describe('should return the passed value', () => {
		testDataMatrix((data: unknown, name?: string) =>
			test(`${name || data}`, () => {
				const result = exception(data)

				expect(result()).toBe(data)
			})
		)
	})
})
