import pkg from './package.json';

export default [
	{
		input: 'overprint/overprint.js',
		output: {
      name: 'overprint',
			file: pkg.browser,
			format: 'iife'
		}
	},
	{
		input: 'overprint/overprint.js',
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		]
	}
];
