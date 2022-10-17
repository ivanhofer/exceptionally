import { success } from '../src/index.js'

import { describe, expect, test } from 'vitest'
import { testDataMatrix } from './test.utils.js'

describe('success', () => {
	test('should return true for isSuccess', () => {
		const result = success('data')

		expect(result.isSuccess).toBe(true)
	})

	test('should return false for isException', () => {
		const result = success('data')

		expect(result.isException).toBe(false)
	})

	describe('should return the passed value', () => {
		testDataMatrix((data: unknown, name?: string) =>
			test(`${name || data}`, () => {
				const result = success(data)

				expect(result()).toBe(data)
			})
		)
	})
})
