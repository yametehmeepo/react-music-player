import React from 'react'
import Progress from '../progress/progress'
import $ from 'jquery';
import 'jplayer';
import './player.less'

export default class Player extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			progress: 0,
			totaltime: 0,
			volume: 0,
			isplayed: true,
			currentIndex: 0,
		};
		this.changeprogress = this.changeprogress.bind(this);
		this.playpausetoggle = this.playpausetoggle.bind(this);
		this.changevolume = this.changevolume.bind(this);
		this.changemusic = this.changemusic.bind(this);
	}
	componentDidMount(){
		$('#player').bind($.jPlayer.event.timeupdate, (e) => {//绑定事件
		    this.setState({
		      progress: e.jPlayer.status.currentPercentAbsolute, //设置当前播放的秒数百分比 范围是0-100
		      totaltime: e.jPlayer.status.duration, //设置当前音乐总时间
		      volume: e.jPlayer.options.volume*100, //音量范围是0-1
		    })
		});	
		$(document).keyup((e) => {//添加键盘事件可以控制上一曲下一曲增加音量减少音量
			switch (e.keyCode) {
				case 32:
					this.playpausetoggle();
					break;
				case 37:
					this.changemusic(-1);
					break;
				case 38: 
					this.changevolume(this.state.volume>=90?1:(this.state.volume + 10)/100);
					break;
				case 39: 
					this.changemusic(1);
					break;
				case 40: 
					this.changevolume( this.state.volume<=10?0:(this.state.volume - 10)/100);
					break;
				default:
					break;
			}
		})
	}
	componentWillUnmount(){
		$('#player').unbind($.jPlayer.event.timeupdate);
	}
	changeprogress(progress){
	    $('#player').jPlayer('play',progress*this.state.totaltime);
	    this.setState({//拖动播放进度条默认用户想要继续播放
	    	isplayed: true,
	    })
	}
	changevolume(progress){
		$('#player').jPlayer('volume',progress);
		this.setState({//暂停时调节音量不显示所以设置
			volume: progress*100,
		})
	}
	playpausetoggle(){
		if(this.state.isplayed){
			$('#player').jPlayer('pause');
		}else{
			$('#player').jPlayer('play');
		}
		this.setState({
			isplayed: !this.state.isplayed,
		})
	}
	changemusic(flag,e){
		var _this = this;
		var len = _this.props.musiclist.length-1;
		var index = _this.state.currentIndex;
		if(flag>0){
			index+=1;
			if(index>len){
				index = 0;
			}
		}else{
			index-=1;
			if(index<0){
				index = len;
			}
		}
		$('.rotateimg').attr('class','rotateimg');
	    this.setState({
	      currentIndex: index,
	      isplayed: true,
	    });
	    $('#player').jPlayer('destroy');//销毁jPlayer然后重新实例化jPlayer播放新的歌曲
	    $('#player').jPlayer({//API参考http://www.jplayer.cn/developer-guide.html#jPlayer-event-object
	      ready: function(e){
	        $(this).jPlayer("setMedia", {
	          mp3: _this.props.musiclist[_this.state.currentIndex].file,
	          //光辉岁月
	          //http://dl.stream.qqmusic.qq.com/C400002pKRoX4Qbafa.m4a?vkey=8D3655D62B9B4B5307D6A08160AE7045149C7F1B918C89253156C5EB1EED4483E8ED45987A94765B07576BEF003AACB8ABC7E6CA0280C0D8&guid=2099242356&uin=0&fromtag=66
	          //天空之城
	          //http://dl.stream.qqmusic.qq.com/C4L0002vsinZ3VJQz8.m4a?vkey=AF9935B9324CE21EFB1FC37131A079A8CD6A26FFF8DD38148E96003FCD38EAA79B9F85410170DDD7E48EF857141D7DD4595410338814B9A0&guid=2099242356&uin=0&fromtag=66
	        }).jPlayer('play');
	      },
	      ended: function(e){
	        $(this).jPlayer('play');
	      },
	      supplied: "mp3",
	      wmode: "window",
	      muted: false,
	      volume: 0.3
	    });
	}
	render(){
		var musiclist = this.props.musiclist[this.state.currentIndex];
		var triggerIndex = this.state.currentIndex%2;
		var imgclassstr;
		if(this.state.isplayed){
			if(triggerIndex){
				imgclassstr = 'rotateimg restart';
			}else{
				imgclassstr = 'rotateimg';
			}
		}else{
			if(triggerIndex){
				imgclassstr = 'rotateimg restart pause';
			}else{
				imgclassstr = 'rotateimg pause';
			}
		}
		return (
			<div className="content">
	          <div id="player"></div>
	          <div className="player-wrapper">
	          	<h2><a href="" className="op">我的私人乐坊 ></a></h2>
	          	<div className="music-info clearfix">
	          		<div className="music-cover">
	          			<img src={musiclist.cover} alt={musiclist.artist} className={imgclassstr} />
	          		</div>
	          		<div className="music-controller">
			          	<h3>{musiclist.title}</h3>
			          	<h4>{musiclist.artist}</h4>
			          	<div className="timevolume clearfix">
			          		<span className="time">-{secondTominute((100-this.state.progress)*this.state.totaltime/100)}/{secondTominute(this.state.totaltime)}</span>
			          		<div className="volumeicon">
			          			<div className="progress-volume">
			          				<Progress 
			          					progress={this.state.volume}
			          					changeprogress={this.changevolume}
			          					barColor="#999"
			          				/>
			          			</div>
			          		</div>
			          	</div>
			          	<div className="progress-time">
			          		<Progress
				          		progress={this.state.progress}
					            changeprogress={this.changeprogress}
					            barColor={this.props.barColor}
			          		/>
			          	</div>
			          	<div className="controller-panel clearfix">
			          		<span className="prev op" onClick={this.changemusic.bind(null,-1)} ></span>
			          		<span className={`play ${this.state.isplayed?'':'pause '}op`} onClick={this.playpausetoggle}></span>
			          		<span className="next op"  onClick={this.changemusic.bind(null,1)}></span>
			          		<span className="playmode op"></span>
			          	</div>
		          	</div>
	          	</div>
	          </div>
	        </div>
		)
	}
}
Player.defaultProps = {
  barColor: '#01973a'
}

function secondTominute(val){
	return (Math.floor(val/60)+":"+("0"+Math.floor(val%60)).slice(-2));
}

