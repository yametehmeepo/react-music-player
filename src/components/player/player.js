import React from 'react'
import { Link } from 'react-router-dom'
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
		};
		this.changeprogress = this.changeprogress.bind(this);
		this.playpausetoggle = this.playpausetoggle.bind(this);
		this.changevolume = this.changevolume.bind(this);
		this.changemusic = this.changemusic.bind(this);
		this.changeplaymode = this.changeplaymode.bind(this);
	}
	componentDidMount(){
		$('#player').bind($.jPlayer.event.timeupdate, (e) => {//绑定事件
		    this.setState({
		      progress: e.jPlayer.status.currentPercentAbsolute, //设置当前播放的秒数百分比 范围是0-100
		      totaltime: e.jPlayer.status.duration, //设置当前音乐总时间
		      volume: e.jPlayer.options.volume*100, //音量范围是0-1
		    })
		});	
		$(document).bind('keyup',(e) => {
		//添加键盘事件可以控制上一曲下一曲增加音量减少音量
		//绑定keyup事件一定要在卸载组件的生命周期函数里解绑
			switch (e.keyCode) {
				case 32://空格
					this.playpausetoggle();
					break;
				case 37://左
					this.changemusic(-1);
					break;
				case 38: //上
					this.changevolume(this.state.volume>=90?1:(this.state.volume + 10)/100);
					break;
				case 39: //右
					this.changemusic(1);
					break;
				case 40: //下
					this.changevolume( this.state.volume<=10?0:(this.state.volume - 10)/100);
					break;
				default: 
					break;
			}
		})
	}
	componentWillUnmount(){
		$('#player').unbind($.jPlayer.event.timeupdate);
		//解绑keyup事件
		$(document).unbind('keyup');
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
		var len = this.props.musiclist.length-1;
		var index = this.props.currentIndex;
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
		//$('.rotateimg').attr('src','');
		$('.rotateimg').attr('class','rotateimg');
	    this.setState({
	      isplayed: true,
	    });
	    this.props.changemusichandler(index);
	    
	}
	changeplaymode(){
		var currentPlayMode = this.props.currentPlayMode+1;
		var playmodelist = this.props.playmodelist;
		if(currentPlayMode>playmodelist.length-1){
			currentPlayMode = 0;
		}
		this.props.playmodehandler(currentPlayMode);
	}
	render(){
		var state = this.state;
		var props = this.props;
		var musiclist = props.musiclist[props.currentIndex];
		var triggerIndex = props.currentIndex%2;
		var imgclassstr;
		if(state.isplayed){
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
	          <div className="player-wrapper">
	          	<h2><Link to="/list" className="op">我的私人乐坊 &gt;</Link></h2>
	          	<div className="music-info clearfix">
	          		<div className="music-cover">
	          			<img src={musiclist.cover} alt={musiclist.artist} className={imgclassstr} />
	          		</div>
	          		<div className="music-controller">
			          	<h3>{musiclist.title}</h3>
			          	<h4>{musiclist.artist}</h4>
			          	<div className="timevolume clearfix">
			          		<span className="time">-{secondTominute((100-state.progress)*state.totaltime/100)}/{secondTominute(state.totaltime)}</span>
			          		<div className="volumeicon">
			          			<div className="progress-volume">
			          				<Progress 
			          					progress={state.volume}
			          					changeprogress={this.changevolume}
			          					barColor="#999"
			          				/>
			          			</div>
			          		</div>
			          	</div>
			          	<div className="progress-time">
			          		<Progress
				          		progress={state.progress}
					            changeprogress={this.changeprogress}
					            barColor={props.barColor}
			          		/>
			          	</div>
			          	<div className="controller-panel clearfix">
			          		<span className="prev op" onClick={this.changemusic.bind(null,-1)} ></span>
			          		<span className={`play ${state.isplayed?'':'pause '}op`} onClick={this.playpausetoggle}></span>
			          		<span className="next op"  onClick={this.changemusic.bind(null,1)}></span>
			          		<span className={`playmode ${props.playmodelist[props.currentPlayMode]}`} onClick={this.changeplaymode}></span>
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

