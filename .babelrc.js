const presets = [
  [
    "@babel/preset-env",
    {
      targets: {
        node: "current",
      },
    },
  ],
  "@babel/preset-typescript",
];

const plugins = [];

module.exports = {
  presets,
  plugins,
  ignore: ["src/**/*.d.ts", "test/**/*.js", "test/**/*.ts"],
};
