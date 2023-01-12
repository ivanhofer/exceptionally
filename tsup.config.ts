import { defineConfig } from 'tsup'

export default defineConfig(({ watch }) => ({
	entry: ['src/index.ts', 'src/assert/index.ts', 'src/utils/index.ts'],
	outDir: 'lib',
	format: ['esm', 'cjs', 'iife'],
	dts: true,
	treeshake: true,
	sourcemap: !!watch,
	clean: true,
	minify: !watch,
}))
