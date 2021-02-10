module.exports = {
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = "CognectEd";
                return args;
            })
    },
    configureWebpack: config => {
        devtool: 'source-map'
    }
}