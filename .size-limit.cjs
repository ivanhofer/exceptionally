// @ts-check

const config = [
	{
		path: 'lib/index.js',
		limit: '125 b',
	},
	{
		path: 'lib/index.cjs',
		limit: '219 b',
	},
	{
		path: 'lib/index.global.js',
		limit: '203 b',
	},
]

module.exports = config
