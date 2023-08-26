const config = {
  mode: 'production',

  entry: {
    index: './src/js/index.js',
    // contacts: './src/js/contacts.js',
  },

  output: {
    filename: '[name].boundle.js',
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }
    ]
  }
};


module.exports = config;