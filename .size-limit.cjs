// @ts-check

const config = [
	{
		path: 'lib/index.js',
		limit: '132 b',
	},
	{
		path: 'lib/index.cjs',
		limit: '226 b',
	},
	{
		path: 'lib/index.global.js',
		limit: '208 b',
	},
]

module.exports = config
