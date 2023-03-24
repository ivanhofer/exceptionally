import { defineConfig } from 'tsup'
import { getTsupConfig } from './tsup.config.js'

export default defineConfig(({ watch }) => ({
	...getTsupConfig(watch),
	entry: ['src/legacy.ts'],
	target: 'es2015',
}))
