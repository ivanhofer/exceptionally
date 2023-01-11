// @ts-check

const config = [
	{
		path: 'lib/index.js',
		limit: '125 b',
	},
	{
		path: 'lib/index.cjs',
		limit: '222 b',
	},
	{
		path: 'lib/index.global.js',
		limit: '204 b',
	},
]

module.exports = config
