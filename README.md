### react-music-player  
慕课网视频教程-使用React构建一款音乐播放器(https://www.imooc.com/learn/868)  
跟着教程学习制作音乐播放器  
跟视频里不同点:
1.我是用`create-react-app`脚手架搭建开发环境目录,省去了配置webpack  
2.视频中用的react-router版本是2.x,因为当前react-router官网的版本是4.x,所以我也用的是4.x版本
v4版本相对于v2版本 变动了好多API,本身我react-router部分接触很少,v2版本就没怎么使用过,一下子换到  
v4版本踩了好多坑,如`父组件向子组件传值`是如何实现的,后台获得的数据接口带有html标签  
用`dangerouslySetInnerHTML={{__html: text}}`的方式渲染等等

使用`pubsub-js`注意事项:  
`PubSub.publish(事件名,参数)`  
`PubSub.subscribe(事件名,(msg,参数))`   msg为固定的,一定要带上它, 主要是后面的才是传递过来的参数


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


追加: 研究了一下react 的 `context`  (https://segmentfault.com/a/1190000011386300) 讲的让我理解了一些关于context传递属性  
####  什么是Context
****
当我们使用React时，很容易的通过观察组件的props来跟踪组件间的数据流流向，这种跟踪观察方式也让我们很容易的去理解组件。  

而有的时候，我们不想让一个props从最外层，通过组件一层一层的传递到目标组件上，这时就可以通过context来直接实现我们希望的操作。


####  怎样使用Context  
****

1.用到prop-types 这个包 , npm install prop-types --save  
2.通过给App（Context宿主）添加 `childContextTypes` 和 `getChildContext`,  
可以实现在该组件子结构下的所有组件（e.g. List）直接通过定义`contextTypes`来获取。 
如果未定义contextTypes的话，context是一个空对象。
例:  
childContextTypes:  
<pre><code>
App.childContextTypes = {
  musiclist: PropTypes.array,
  currentIndex: PropTypes.number,
  isplayed: PropTypes.bool
}
</code></pre>  

getChildContext:  

<pre><code>
constructor(){
	...
}  

getChildContext(){
    return {
      musiclist: this.state.musiclist,
      currentIndex: this.state.currentIndex,
      isplayed: this.state.isplayed
    }
  }

render(){
	return (
		...
	)
}
</code></pre>

3.用到上面三个属性的子组件可以通过`this.context.属性名`  获取到属性   
还需定义`contextTypes`  
例: 
<pre><code>
List.contextTypes = {
	musiclist: PropTypes.array,
	currentIndex: PropTypes.number,
	isplayed: PropTypes.bool
}
</code></pre>

4.不要更新Context!




