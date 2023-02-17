import { exception, success } from '../core/index.js'
import { assertSuccess } from './index.js'

import { describe, expect, test } from 'vitest'
import { testDataMatrix } from '../../test/test.utils.js'

describe('assertSuccess', () => {
	test('should not throw when passing success to assertSuccess', () => {
		const result = success('data')

		expect(() => assertSuccess(result)).not.toThrow()
	})

	test('should throw when passing exception to assertSuccess', () => {
		const result = exception('data')

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		expect(() => assertSuccess(result)).toThrow()
	})

	describe('should throw when passing something random to assertSuccess', () => {
		testDataMatrix((data: unknown, name?: string) =>
			test(`${name || data}`, () => {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				// eslint-disable-next-line max-nested-callbacks
				expect(() => assertSuccess(data)).toThrow()
			})
		)
	})
})
