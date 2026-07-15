module.exports = {
    root: true,
    extends: '@react-native',
    'rules': {
        'indent': [
            'error',
            4,
        ],
        'react-native/no-inline-styles': 0,
        'quotes': [
            'error',
            'single',
        ],
        'semi': [
            'error',
            'always',
        ],
        'prettier/prettier': 0,
        '@typescript-eslint/no-empty-interface': 'off',
        'react/no-unstable-nested-components': 0,
    },
};
