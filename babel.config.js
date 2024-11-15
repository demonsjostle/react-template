module.exports = (api) => {
  api.cache.using(() => process.env.NODE_ENV);

  const isProduction = api.env("production");

  return {
    presets: [
      "@babel/preset-typescript",
      [
        "@babel/preset-env",
        {
          useBuiltIns: "usage",
          corejs: 3,
        },
      ],
      [
        "@babel/preset-react",
        {
          development: !isProduction,
          runtime: "automatic",
        },
      ],
    ],
    plugins: [!isProduction && require.resolve("react-refresh/babel")].filter(
      Boolean,
    ),
  };
};
