import js from '@eslint/js';
import angular from 'angular-eslint';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	// Global ignores
	{
		ignores: ['dist/**/*', '.angular/**/*', 'coverage/**/*', 'node_modules/**/*'],
	},
	// TypeScript files
	{
		files: ['**/*.ts'],
		extends: [
			js.configs.recommended,
			...tseslint.configs.recommended,
			...angular.configs.tsRecommended,
		],
		processor: angular.processInlineTemplates,
		rules: {
			'@angular-eslint/directive-selector': [
				'error',
				{
					type: 'attribute',
					prefix: 'app',
					style: 'camelCase',
				},
			],
			'@angular-eslint/component-selector': [
				'error',
				{
					type: 'element',
					prefix: 'app',
					style: 'kebab-case',
				},
			],
			// The UI wrapper components (app-button, app-card, …) intentionally
			// alias an input to `class` so callers can write `class="…"` on the host
			// and have it forward to the inner Material element. Allow that one name.
			'@angular-eslint/no-input-rename': ['error', { allowedNames: ['class'] }],
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
					ignoreRestSiblings: true,
				},
			],
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
		},
	},
	// Template files
	{
		files: ['**/*.html'],
		extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
		rules: {},
	},
);
