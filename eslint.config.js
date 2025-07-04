// eslint.config.js
import eslintPluginJs from '@eslint/js'

export default [
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
        plugins: {
            js: eslintPluginJs,
        },
        rules: {
            ...eslintPluginJs.configs.recommended.rules,
        },
    },
]
