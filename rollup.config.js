import pkg from './package.json';

export default [
	{
		input: 'src/overprint.js',
		output: {
			name: 'overprint',
			file: pkg.unpkg,
			format: 'iife'
		}
	},
	{
		input: 'src/overprint.js',
		output: [
			{ file: pkg.browser, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		]
	}
];
