JS-SKELETON
===

一个web前端页面骨架，快速构建前端DEMO的利器。让你抛掉繁琐的CSS和JS引用，快速的打造DEMO。利用Github Page可以让你快速得到一个可以直接访问的Demo。

[示例](http://yutingzhao.com/js-skeleton/?name=helloworld)

本地使用
---

- 安装**NodeJS**和**npm**
- 代码下载或者clone到本地
- 运行`npm install`安装依赖。
- 在`workspace`文件夹中新建一个文件夹并添加对应的`app.html`,`app.css`,`app.js`，但是都不是必须的。
- 运行`npm run build`，处理过后的结果会输出到`works`文件夹，直接用浏览器打开里面的html即可。
- 开启一个HTTP服务（推荐使用[http-server](https://www.npmjs.com/package/http-server)，或者`python -m SimpleHTTPServer`），打开`http://localhost:8080/index.html?name=helloworld`可以让代码在demo中展示，helloworld替换为你的demo的名字，端口号替换为你的http服务的端口。
- 可以通过运行`npm run watch`来实时监听文件变化，自动build。


把自己的Demo托管到Github
---

- 在github上将本项目fork一个分支到你自己的帐号下。
- 将你自己fork的js-skeleton clone 到本地`git clone git@github.com:yourname/js-skeleton.git`。
- 通过`get checkout -b gh-pages`来新开一个gh-pages分支，这有这个命名的分支能够通过github.io直接访问，详情可以参考git官方文档。
- 编辑文件，去掉`.gitignore`中的`works`，这样使得你可以将build得到的结果也提交到Github。
- 按照上面的[本地使用]中的说明操作，最后运行`npm run build`来build结果。
- 你可以在workspace中添加你的demo并用git命令提交，包括也要提交build之后works文件夹中的文件。
- 最后将gh-pages分支push到github上：`git push --set-upstream origin gh-pages`。
- 然后你就可以访问http://yourname.github.io/js-skeleton?name=helloworld看到你的demo页面了。

