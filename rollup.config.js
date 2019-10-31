import pkg from './package.json';

export default [
	{
		input: 'overprint/overprint.js',
		output: {
			name: 'overprint',
			file: pkg.unpkg,
			format: 'iife'
		}
	},
	{
		input: 'overprint/overprint.js',
		output: [
			{ file: pkg.browser, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		]
	}
];
