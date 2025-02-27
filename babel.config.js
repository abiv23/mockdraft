module.exports = (api) => {
  const isTest = api.env('test');
  console.log('NODE_ENV:', process.env.NODE_ENV, 'isTest:', isTest); // Debug
  return {
    presets: [
      [
        '@babel/preset-env',
        { targets: isTest ? 'current node' : '> 0.25%, not dead' },
      ],
      ['@babel/preset-react', { runtime: 'automatic' }],
    ],
  };
};