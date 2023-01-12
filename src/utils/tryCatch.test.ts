/* eslint-disable max-nested-callbacks */
import { afterAll, beforeAll, beforeEach, describe, expect, type SpyInstance, test, vi } from 'vitest'
import { exception, success } from '../core/index.js'
import { tryCatch } from './tryCatch.js'

const noop = () => {/* empty function */}

describe('tryCatch', () => {
	let consoleMock: SpyInstance

	beforeAll(() => {
		consoleMock = vi.spyOn(console, 'error').mockImplementation(noop)
	})

	afterAll(() => {
		consoleMock.mockRestore()
	})

	beforeEach(() => {
		consoleMock.mockReset()
	})

	describe('success', () => {
		test('should wrap a return value with `success`', () => {
			const result = tryCatch(() => 'value')

			expect(result.isSuccess).toBe(true)
			expect(result()).toBe('value')
		})

		test('should wrap an async return value with `success`', async () => {
			const result = await tryCatch(async () => 'async value')

			expect(result.isSuccess).toBe(true)
			expect(result()).toBe('async value')
		})
	})

	describe('exception', () => {
		describe('implicit error function', () => {
			test('should not re-wrap a returned `exception`', () => {
				const result = tryCatch(() => exception('exceptionally'))

				expect(result.isException).toBe(true)
				expect(result()).toBe('exceptionally')
			})

			test('should wrap a thrown error with `exception`', () => {
				const result = tryCatch(() => {
					throw Error('oops')
				})

				expect(result.isException).toBe(true)
				expect((result() as Error).message).toBe('oops')
			})

			test('should wrap an async thrown error with `exception`', async () => {
				const result = await tryCatch(async () => {
					throw Error('async oops')
				})

				expect(result.isException).toBe(true)
				expect((result() as Error).message).toBe('async oops')
			})

			test('should wrap a rejected promise with `exception`', async () => {
				const result = await tryCatch(async () => Promise.reject(new Error('rejected')))

				expect(result.isException).toBe(true)
				expect((result() as Error).message).toBe('rejected')
			})
		})

		describe('explicit error function', () => {
			describe('no return value', () => {
				test('should not re-wrap a returned `exception` and invoke the errorCallback', () => {
					const result = tryCatch(() => exception('exceptionally'), noop)

					expect(result.isException).toBe(true)
					expect(result()).toBeUndefined()
				})

				test('should wrap a thrown error with `exception` and invoke the errorCallback', () => {
					const result = tryCatch(() => {
						throw Error('oops')
					}, noop)

					expect(result.isException).toBe(true)
					expect(result()).toBeUndefined()
				})

				test('should wrap an async thrown error with `exception` and invoke the errorCallback', async () => {
					const result = await tryCatch(async () => {
						throw Error('async oops')
					}, noop)

					expect(result.isException).toBe(true)
					expect(result()).toBeUndefined()
				})

				test('should wrap a rejected promise with `exception` and invoke the errorCallback', async () => {
					const result = await tryCatch(async () => Promise.reject(new Error('rejected')), noop)

					expect(result.isException).toBe(true)
					expect(result()).toBeUndefined()
				})
			})

			describe('with return value', () => {
				const errorFn = (error: unknown) => new Error((error as Error).message + ' (wrapped)')

				test('should not re-wrap a returned `exception` and invoke the errorCallback', () => {
					const result = tryCatch(() => exception({ message: 'exceptionally' }), errorFn)

					expect(result.isException).toBe(true)
					expect((result() as Error).message).toBe('exceptionally (wrapped)')
				})

				test('should wrap a thrown error with `exception` and invoke the errorCallback', () => {
					const result = tryCatch(() => {
						throw Error('oops')
					}, errorFn)

					expect(result.isException).toBe(true)
					expect((result() as Error).message).toBe('oops (wrapped)')
				})

				test('should wrap an async thrown error with `exception` and invoke the errorCallback', async () => {
					const result = await tryCatch(async () => {
						throw Error('async oops')
					}, errorFn)

					expect(result.isException).toBe(true)
					expect((result() as Error).message).toBe('async oops (wrapped)')
				})

				test('should wrap a rejected promise with `exception` and invoke the errorCallback', async () => {
					const result = await tryCatch(async () => Promise.reject(new Error('rejected')), errorFn)

					expect(result.isException).toBe(true)
					expect((result() as Error).message).toBe('rejected (wrapped)')
				})
			})
		})
	})

	describe('logging', () => {
		describe('implicit', () => {
			test('should not invoke `console.error` if the result is a `success`', async () => {
				tryCatch(() => success(1), undefined)
				expect(consoleMock).not.toHaveBeenCalled()
			})

			test('should invoke `console.error` if the result is an `exception`', async () => {
				await tryCatch(() => Promise.reject(new Error('rejected')), undefined)
				expect(consoleMock).toHaveBeenCalledTimes(1)
			})
		})

		describe('explicit', () => {
			const logFn = vi.fn()
			const logger = { error: logFn }

			beforeEach(() => {
				logFn.mockReset()
			})

			test('should not invoke the `logger` if the result is a `success`', async () => {
				tryCatch(() => success(1), undefined, logger)
				expect(logFn).not.toHaveBeenCalled()
			})

			test('should invoke the `logger` if the result is an `exception`', async () => {
				tryCatch(() => exception('exceptionally'), undefined, logger)
				expect(logFn).toHaveBeenCalledTimes(1)
			})

			test('should invoke `console.error` if an error occurred', async () => {
				await tryCatch(() => Promise.reject(new Error('rejected')), undefined, logger)
				expect(logFn).toHaveBeenCalledTimes(1)
			})
		})

		describe('disable', () => {
			test('should not invoke `console.error` if the result is a `success`', async () => {
				tryCatch(() => success(1), undefined, false)
				expect(consoleMock).not.toHaveBeenCalled()
			})

			test('should not invoke `console.error` if the result is an `exception`', async () => {
				tryCatch(() => exception('exceptionally'), undefined, false)
				expect(consoleMock).not.toHaveBeenCalled()
			})

			test('should not invoke `console.error` if an error occurred', async () => {
				await tryCatch(() => Promise.reject(new Error('rejected')), undefined, false)
				expect(consoleMock).not.toHaveBeenCalled()
			})
		})
	})
})
