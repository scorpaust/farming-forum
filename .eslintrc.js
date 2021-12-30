module.exports = {
  "root": true,
  "env": {
    es2022: true
  },
  "extends": [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
  ],
  "rules": {
    "no-unused-vars": "off",
    "vue/comment-directive": ["off", {
      "reportUnusedDisableDirectives": false,
      "@typescript-eslint/ban-ts-ignore": "off"

    }]
  }
}
