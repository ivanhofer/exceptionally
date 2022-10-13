// @ts-check

/** @type { import('eslint').Linter.Config } */
const config = {
	root: true,
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'xo'],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	overrides: [
		{
			files: ['*.ts', '*.mts', '*.cts', '*.tsx'],
			rules: {
				'no-undef': 'off',
			},
		},
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		project: [
			'./tsconfig.json',
			'./tsconfig.eslint.json',
		],
	},
	rules: {
		// deactivate defaults
		'capitalized-comments': 'off',
		'comma-spacing': 'off',
		'no-implicit-coercion': 'off',
		camelcase: 'off',
		'no-redeclare': 'off',
		'no-undef': 'off',

		// modify defaults
		'no-multi-spaces': 'warn',
		'no-trailing-spaces': 'warn',
		'no-multiple-empty-lines': 'warn',
		'no-mixed-spaces-and-tabs': 'warn',
		'object-shorthand': 'warn',
		'space-in-parens': 'warn',
		'comma-dangle': 'warn',
		'key-spacing': 'warn',
		'padded-blocks': 'warn',

		// TypeScript overrides
		'no-useless-constructor': 'off',
		'@typescript-eslint/no-useless-constructor': 'warn',
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': 'warn',
		'@typescript-eslint/no-redeclare': 'error',
		'no-return-assign': 'off',
		'@typescript-eslint/no-floating-promises': 'error',
		'@typescript-eslint/no-misused-promises': 'error',

		// modify rules
		'no-var': 'error',
		'no-console': ['error'],
		quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
		semi: ['error', 'never'],
		indent: ['off', 'tab'],
		'object-curly-spacing': ['warn', 'always'],
		curly: ['warn', 'multi-line'],
		'no-unused-expressions': ['warn', { allowShortCircuit: true }],
		'@typescript-eslint/no-empty-function': ['warn'],
	},
}

module.exports = config
