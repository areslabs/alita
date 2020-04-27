module.exports = {
  "presets": [["@babel/preset-env", {
    "targets": {
      "node": "8.0.0"
    }
  }], "@babel/typescript"],

  "plugins": [
    ["module-resolver", {
      "alias": {
        "@shared": "./lib/_shared"
      }
    }]
  ]
}