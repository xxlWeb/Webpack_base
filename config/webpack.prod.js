const path = require('path'); //node.js核心模块 专门用来处理路径问题
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

//用来获取处理样式的loader
function getStyleLoader(pre){
  return [
    MiniCssExtractPlugin.loader, //提取css成单独的文件
    "css-loader", //将css样式编译成commonjs的模块到js中
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            "postcss-preset-env", // 能解决大多数样式兼容性问题
          ],
        },
      },
    },
    pre, 
  ].filter(Boolean); //过滤掉 css-loader的undefined
}

module.exports = {
  //入口
  entry: './src/main.js', //相对路径
  //输出
  output: {
    //所有文件输出的位置
    //__dirname nodejs变量，代表当前文件夹目录
     path:path.resolve(__dirname,'../dist'), //绝对路径
    //入口文件打包输出文件名
    filename: "static/js/main.js",
    //自动清空上次的输出结果
    //原理：在打包前，将path整个目录内容清空，再进行打包输出
    clean:true,
  },
  //加载器
  module: {
    rules: [
      //loader配置
      {
        test: /\.css$/, //只检测.css文件
        use: getStyleLoader(), //执行顺序，从右到左（从下到上）
      },
      {
        test: /\.less$/,
        use: getStyleLoader('less-loader'),
      },
      {
        test: /\.s[ac]ss$/,
        use: getStyleLoader('sass-loader'),
      },
      {
        test: /\.styl$/,
        use: getStyleLoader('stylus-loader'),
      },
      {
        test: /\.(png|jpe?g|gif|webp|svg)/,
        type: 'asset', //转base64
        parser: {
          dataUrlCondition: {
            //小于10kb的图标转base64
            //优点：减少请求数量 缺点：体积会更大
            maxSize: 10 * 1024 // 10kb
          }
        },
        generator: {
          //输出图片的名称
          //[hash:10] hash值取前10位
          filename: 'static/images/[name].[hash:10][ext][query]' //文件输出的格式路径
        },
      },
      {
        test: /\.(ttf|woff2?|map4|map3|avi)$/, //|map4|map3|avi 处理其他资源(媒体)
        type: 'asset/resource',
        generator: {
          //输出图片的名称
          filename: 'static/media/[name].[hash:10][ext][query]'
        },
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/, //排除node_modules中的js文件(这些文件不处理)
        loader: 'babel-loader',
        /* options: {  options在外边写(babel.config.js)
          presets: ['@babel/preset-env']
        }      */
      }
    ]
  },
  //插件
  plugins: [
    //plugin的配置
    new ESLintPlugin({
      //检测哪些文件
      context: path.resolve(__dirname, '../src'),
    }),
    new HtmlWebpackPlugin({
      //模版:以public/index.html文件创建新的html文件
      //新的html文件特点：1.结构和原来一致 2.自动引入打包输出资源
      template: path.resolve(__dirname, '../public/index.html'),
    }),
    new MiniCssExtractPlugin({
      filename:'static/css/main.css',
    }),
    new CssMinimizerPlugin(),
  ],
  //模式
  mode: 'production', //开发模式
}