module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
          alias: {
            '~': './',
            '@clipo/core': './packages/core/src',
          },
        },
      ],
      'react-native-reanimated/plugin', // ✅ 마지막 줄 필수
    ],
  };
};
