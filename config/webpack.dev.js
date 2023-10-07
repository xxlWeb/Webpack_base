const path=require('path'); //node.js核心模块 专门用来处理路径问题
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports={
  //入口
   entry:'./src/main.js', //相对路径
  //输出
  output:{
    //所有文件输出的位置
    //开发模式没有输出
    path:undefined,
    //入口文件打包输出文件名
    filename:"static/js/main.js",
  },
  //加载器
  module:{
   rules:[
     //loader配置
      {
        test: /\.css$/, //只检测.css文件
        //执行顺序，从右到左（从下到上）
        use: ["style-loader", //将js中css通过创建style标签添加到html文件中生效
             "css-loader"  //将css样式编译成commonjs的模块到js中
         ],
      },
      {
        test: /\.less$/,
        use: [
          //loader:'xxx' 只能使用一个loader ，use：可以使用多个loader
          // compiles Less to CSS
          'style-loader',
          'css-loader',
          'less-loader', //将less文件编译成css文件
        ],
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          // 将 JS 字符串生成为 style 节点
          'style-loader',
          // 将 CSS 转化成 CommonJS 模块
          'css-loader',
          // 将 Sass 编译成 CSS
          'sass-loader',
        ],
      },
      {
        test: /\.styl$/,
        use: [
          // 将 JS 字符串生成为 style 节点
          'style-loader',
          // 将 CSS 转化成 CommonJS 模块
          'css-loader',
          // 将 stlyus 编译成 CSS
          'stylus-loader',
        ],
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
  plugins:[
    //plugin的配置
    new ESLintPlugin({
      //检测哪些文件
      context:path.resolve(__dirname,'../src'),
    }),
    new HtmlWebpackPlugin({
      //模版:以public/index.html文件创建新的html文件
      //新的html文件特点：1.结构和原来一致 2.自动引入打包输出资源
      template:path.resolve(__dirname,'../public/index.html'),
    })
  ],
  // 开发服务器:不会输出资源，在内存中编译打包
  devServer: {
    host: "localhost", // 启动服务器域名
    port: "3000", // 启动服务器端口号
    open: true, // 是否自动打开浏览器
  },
  //模式
  mode:'development', //开发模式
}