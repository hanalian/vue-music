本项目为使用VUE编写的仿网易云音乐移动端应用，项目的UI，布局，功能等仿照了网易云音乐安卓端，实现了不需要登录网易云的部分功能，初次使用VUE编写应用，代码可能写的不好，不过界面还是比较还原网易云的。

### 项目演示

[demo 地址](http://39.106.80.100/)（请用 chrome/firefox浏览器手机模式预览，不能滑动请刷新）

### 如何运行
请先前往 [NeteaseCloudMusicApi](https://binaryify.github.io/NeteaseCloudMusicApi/#/) 获取后端代码并运行
```
# 克隆
git clone https://github.com/hanalian/vue-music.git
```
```
# 修改目录下的vue.config.js文件
http://127.0.0.1:3000 改为自己的后端IP
```
```
# 打开项目目录并安装依赖
npm install
```
```
# 开启本地服务运行项目
npm run serve
```

### 相关依赖
- Vue 全家桶
- Vue-cli3
- vue-awesome-swiper
- better-scroll
- axios
- vux
- [NeteaseCloudMusicApi](https://binaryify.github.io/NeteaseCloudMusicApi/#/)

### 实现功能
- 发现界面
- 我的界面
- 歌单详情
- 播放界面
- 底部播放
- 搜索（单曲，歌单，专辑可点击）
- 歌单广场
- 歌单标签
- 喜欢音乐
- 最近播放

仿网易云音乐还有很多功能效果未实现，后续有时间还会继续更新，也请大家多指教啦。