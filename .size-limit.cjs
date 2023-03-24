// @ts-check

const config = [
	{
		path: 'lib/index.js',
		limit: '132 b',
	},
	{
		path: 'lib/index.cjs',
		limit: '192 b',
	},
	{
		path: 'lib/index.global.js',
		limit: '176 b',
	},
]

module.exports = config
