/* eslint-disable max-nested-callbacks */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { exception, success } from '../core/index.js'

import { describe, expect, test } from 'vitest'
import { testDataMatrix } from '../../test/test.utils.js'
import { assertExceptionsHandled } from './index.js'

describe('assertExceptionsHandled', () => {
	test('should throw when passing exception to assertExceptionsHandled', () => {
		const result = exception('data')

		// @ts-expect-error
		expect(() => assertExceptionsHandled(result)).toThrow()
	})

	test('should not throw when passing success to assertExceptionsHandled', () => {
		const result = success('data')

		expect(() => assertExceptionsHandled(result)).not.toThrow()
	})

	describe('should throw when passing something random to assertExceptionsHandled', () => {
		testDataMatrix((data: unknown, name?: string) =>
			test(`${name || data}`, () => {
				// @ts-expect-error
				expect(() => assertExceptionsHandled(data)).toThrow()
			})
		)
	})
})
