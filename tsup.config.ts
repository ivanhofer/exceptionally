import { defineConfig, type Options } from 'tsup'

export const getTsupConfig = (watch: Options['watch']) =>
	({
		outDir: 'lib',
		format: ['esm', 'cjs', 'iife'],
		dts: true,
		treeshake: true,
		sourcemap: !!watch,
		minify: !watch,
	}) satisfies Options

export default defineConfig(({ watch }) => ({
	...getTsupConfig(watch),
	clean: true,
	entry: ['src/index.ts', 'src/assert/index.ts', 'src/utils/index.ts'],
}))
