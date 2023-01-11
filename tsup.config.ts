import { defineConfig } from 'tsup'

export default defineConfig(({ watch }) => ({
	entry: ['src/index.ts', 'src/core/index.ts', 'src/assert/index.ts'],
	outDir: 'lib',
	format: ['esm', 'cjs', 'iife'],
	dts: true,
	treeshake: true,
	sourcemap: !!watch,
	clean: true,
	minify: !watch,
}))
