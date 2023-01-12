export const isAsync = <T>(p: unknown): p is Promise<T> =>
	!!p && typeof p === 'object' && typeof (p as Promise<T>).then === 'function'
