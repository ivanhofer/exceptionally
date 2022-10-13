import { defineConfig } from 'tsup'

export default defineConfig(({ watch }) => ({
	entry: ['src/index.ts'],
	outDir: 'lib',
	format: ['esm', 'cjs', 'iife'],
	dts: true,
	treeshake: true,
	sourcemap: true,
	clean: true,
	minify: !watch,
}))
