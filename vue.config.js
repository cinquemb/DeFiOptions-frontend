module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/DeFiOptions-frontend/'
    : '/',
  configureWebpack: {
        module: {
            rules: [
                {
                    test: /react\/\*\.?(js|tsx)(\?.*)?$/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-react'],
                            plugins: ['transform-react-jsx']
                        }
                    }
                },
                {
                    test: /chart.js/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-react'],
                            plugins: ['transform-react-jsx']
                        }
                    }
                },
            ]
        }
    },
}

/*
module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/'
    : '/'
}*/
