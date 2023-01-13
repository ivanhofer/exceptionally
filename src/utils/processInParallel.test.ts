import { describe, expect, test } from 'vitest'
import { exception, success } from '../core/index.js'
import { processInParallel } from './processInParallel.js'

describe('processInParallel', () => {
	describe('success', () => {
		test('should unwrap the results of all functions', async () => {
			const result = await processInParallel([
				Promise.resolve(success('value-1')),
				Promise.resolve(success('value-2')),
			])

			expect(result()).toMatchObject(['value-1', 'value-2'])
		})
	})

	describe('exception', () => {
		test('should unwrap the exceptions of all functions', async () => {
			const result = await processInParallel([
				Promise.resolve(success('value-1')),
				Promise.resolve(exception('error-1')),
				Promise.resolve(success('value-2')),
			])

			expect(result()).toMatchObject([undefined, 'error-1', undefined])
		})
	})
})
