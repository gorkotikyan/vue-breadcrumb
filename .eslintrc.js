// https://eslint.org/docs/user-guide/configuring

module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "parserOptions": {
        "parser": "babel-eslint"
    },
    "settings": {
        "import/resolver": {
            "node": {
                "extensions": [".js", ".vue"]
            }
        },
    },
    "extends": [
        "airbnb-base",
        "plugin:vue/recommended"
    ],
    "rules": {
        "consistent-return": "off"
    }
};