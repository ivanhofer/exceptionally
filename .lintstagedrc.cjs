// @ts-check

/** @type { Record<string, string[]> } */
const config = {
	'*.{json,md,dockerfile}': [
		'pnpm format:fix',
	],
	'*.{js,cjs,mjs,ts,mts,d.ts}': [
		'pnpm format:fix',
		'pnpm eslint:fix:base',
	],
}

module.exports = config
