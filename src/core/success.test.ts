import { exception, success } from './index.js'

import { describe, expect, test } from 'vitest'
import { testDataMatrix } from '../../test/test.utils.js'

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
		test('no data passed', () => {
			const result = success()

			expect(result()).toBe(undefined)
		})

		test('nested success', () => {
			const result = success(success('value'))

			expect(result.isSuccess).toBe(true)
			expect(result()).toBe('value')
		})

		test('nested exception', () => {
			const result = success(exception(false))

			expect(result.isSuccess).toBe(false)
			expect(result()).toBe(false)
		})

		testDataMatrix((data: unknown, name?: string) =>
			test(`${name || data}`, () => {
				const result = success(data)

				expect(result()).toBe(data)
			})
		)
	})
})
