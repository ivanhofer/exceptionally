import { exception, success } from '../index.js'

import { describe, expect, test } from 'vitest'
import { testDataMatrix } from '../../test/test.utils.js'

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
		test('no data passed', () => {
			const result = exception()

			expect(result()).toBe(undefined)
		})

		test('nested success', () => {
			const result = exception(success('value'))

			expect(result.isException).toBe(false)
			expect(result()).toBe('value')
		})

		test('nested exception', () => {
			const result = exception(exception(false))

			expect(result.isException).toBe(true)
			expect(result()).toBe(false)
		})

		testDataMatrix((data: unknown, name?: string) =>
			test(`${name || data}`, () => {
				const result = exception(data)

				expect(result()).toBe(data)
			})
		)
	})
})
