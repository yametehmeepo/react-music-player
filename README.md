### react-music-player  
慕课网视频教程-使用React构建一款音乐播放器(https://www.imooc.com/learn/868)  
跟着教程学习制作音乐播放器  
跟视频里不同点:
1.我是用`create-react-app`脚手架搭建开发环境目录,省去了配置webpack  
2.视频中用的react-router版本是2.x,因为当前react-router官网的版本是4.x,所以我也用的是4.x版本
v4版本相对于v2版本 变动了好多API,本身我react-router部分接触很少,v2版本就没怎么使用过,一下子换到  
v4版本踩了好多坑,如`父组件向子组件传值`是如何实现的,后台获得的数据接口带有html标签用dangerouslySetInnerHTML={{__html: text}}的方式渲染等等

最终完成的音乐播放器具备如下功能:  
#### 1.播放页面  
a)播放进度控制  
b)音量控制  
c)暂停&播放  
d)切换歌曲  
e)当前歌曲播放完后自动根据当前的播放模式进行接续播放、  
f)查看歌词
g)歌曲封面的旋转效果

#### 2.播放列表  
a)高亮当前播放歌曲  
b)点击列表播放歌曲  
c)查看歌词  
d)删除歌曲  
e)返回播放页面

#### 3.歌词页面  
a)返回播放页面  
b)返回播放列表  


PS.  
本地创建一个json数据文件,歌曲的地址有可能失效,请用chrome访问酷狗音乐 并在network里查看有效歌曲地址