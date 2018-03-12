import React from 'react'
import PubSub from 'pubsub-js';
import { Link } from 'react-router-dom'
import Progress from '../progress/progress'
import $ from 'jquery';
import 'jplayer';
import './player.less'

export default class Player extends React.Component {
	constructor(props){
		super(props);
		this.changeprogress = this.changeprogress.bind(this);
		this.playpausetoggle = this.playpausetoggle.bind(this);
		this.changevolume = this.changevolume.bind(this);
		this.changemusic = this.changemusic.bind(this);
		this.changeplaymode = this.changeplaymode.bind(this);
		this.recordVP = this.recordVP.bind(this);
	}
	componentDidMount(){
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
					this.changevolume(this.props.pauseVolume>=90?1:(this.props.pauseVolume + 10)/100);
					break;
				case 39: //右
					this.changemusic(1);
					break;
				case 40: //下
					this.changevolume( this.props.pauseVolume<=10?0:(this.props.pauseVolume - 10)/100);
					break;
				default: 
					break;
			}
		})
	}
	componentWillUnmount(){
		//解绑keyup事件
		$(document).unbind('keyup');
	}

	changeprogress(progress){
	    $('#player').jPlayer('play',progress*this.props.totaltime);
	    PubSub.publish('CONFIRMPLAY');
	}
	changevolume(progress){
		$('#player').jPlayer('volume',progress);
		PubSub.publish('PAUSEPVOLUME',progress*100);
	}
	playpausetoggle(){
		if(this.props.isplayed){
			PubSub.publish('PAUSE');
			//PubSub.publish('PAUSEPVOLUME',this.state.volume);
		}else{
			PubSub.publish('PLAY');
		}
	}
	changemusic(flag,e){
		var len = this.props.musiclist.length-1;
		var index = null;
		if(this.props.currentPlayMode === 2){
			index = Math.floor(Math.random()*this.props.musiclist.length);
			while(index === this.props.currentIndex){
				index = Math.floor(Math.random()*this.props.musiclist.length);
			}
		}else{
			index = this.props.currentIndex;
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
		}
		
		//$('.rotateimg').attr('src','');
		$('.rotateimg').attr('class','rotateimg');
	    PubSub.publish('CONFIRMPLAY');
	    PubSub.publish('CHANGE_MUSIC',index);
	    PubSub.publish('PAUSEPROGRESS',0);
	}
	changeplaymode(){
		var currentPlayMode = this.props.currentPlayMode+1;
		var playmodelist = this.props.playmodelist;
		if(currentPlayMode>playmodelist.length-1){
			currentPlayMode = 0;
		}
		this.recordVP();
		PubSub.publish("PLAY_MODE",currentPlayMode)
	}
	recordVP(){
		PubSub.publish('PAUSEPVOLUME',this.props.pauseVolume);
	}
	render(){
		var props = this.props;
		var musiclist = props.musiclist[props.currentIndex];
		var triggerIndex = props.currentIndex%2;
		var imgclassstr;
		if(props.isplayed){
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
		if(props.musiclist.length<1){
			return null;
		}
		return (
			<div className="content">
	          <div className="player-wrapper">
	          	<h2><Link to="/list" className="op" onClick={this.recordVP}>我的私人乐坊 &gt;</Link></h2>
	          	<div className="music-info clearfix">
	          		<div className="music-cover">
		      			<img src={musiclist.cover} alt={musiclist.artist} className={imgclassstr} />
		      		</div>
	          		<div className="music-controller">
			          	<h3>{musiclist.title}</h3>
			          	<h4>{musiclist.artist}</h4>
			          	<div className="timevolume clearfix">
			          		<span className="time">-{secondTominute((100-props.pauseProgress)*props.totaltime/100)}/{secondTominute(props.totaltime)}</span>
			          		<div className="volumeicon">
			          			<div className="progress-volume">
			          				<Progress 
			          					progress={props.pauseVolume}
			          					changeprogress={this.changevolume}
			          					barColor="#999"
			          				/>
			          			</div>
			          		</div>
			          		<div className="lyricsbox">
			          			<Link to="/lyrics">查看歌词</Link>
			          		</div>
			          	</div>
			          	<div className="progress-time">
			          		<Progress
				          		progress={props.pauseProgress}
					            changeprogress={this.changeprogress}
					            barColor={props.barColor}
			          		/>
			          	</div>
			          	<div className="controller-panel clearfix">
			          		<span className="prev op" onClick={this.changemusic.bind(null,-1)} ></span>
			          		<span className={`play ${props.isplayed?'':'pause '}op`} onClick={this.playpausetoggle}></span>
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

