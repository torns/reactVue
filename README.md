### config.js
#### devStaticPort - dev环境静态资源服务端口
#### distDir - 打包后的文件输出路径
#### assetsFile - 静态资源映射文件路径

### dev环境执行
```
npm start
```
启用本地服务访问静态资源
### prod环境执行
```
npm run build
```
打包输出静态资源到dist目录

### src/app目录

在 /src/app 下新建一个文件夹。这个目录下的每一个文件夹对应了一个页面。
#### app.js - 入口文件(文件名统一为app.js, 否则不能打包编译改目录)
#### components - 组件存放文件夹

### src/common
这个文件夹会单独打成包。里面包含了所有页面共享的一些功能。

### src/components
用来放置公用组件的，比如分页组件。每个文件夹代表了一个组件。

### src/lib
放置的是通用类库。

### customPage.js
在dev环境指定编译src/app文件下的项目，加快编译速度
如：
```
module.exports = ['test'];
```

### 服务端模版页面引用静态资源
服务端需要提供一个getBundle的方法:
```
const getBundle = key => {
    if (argv.dev) {
        return `//localhost:${devStaticPort}${key}`;
    } else {
        return `//```线上环境dist path```${assets[key]}`;
    }
};
```
服务端模版页:
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="{{getBundle '/pc/common/bundle.css'}}"></script>
    <script src="{{getBundle '/pc/app/test/bundle.css'}}"></script>
</head>
<body>
    <script src="{{getBundle '/pc/common/bundle.js'}}"></script>
    <script src="{{getBundle '/pc/app/test/bundle.js'}}"></script>
</body>
</html>
```
#### 执行npm start 
#### 执行npm run testProd
访问http://localhost:3000/index.html查看资源路径
