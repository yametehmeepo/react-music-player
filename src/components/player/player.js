import React from 'react'
import Progress from '../progress/progress'
import MusicList from '../../data/musiclist'
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
			musiclist: MusicList.list[0]
		};
		this.changeprogress = this.changeprogress.bind(this);
		this.playpausetoggle = this.playpausetoggle.bind(this);
		this.changevolume = this.changevolume.bind(this);
	}
	componentDidMount(){
		$('#player').bind($.jPlayer.event.timeupdate, (e) => {//绑定事件
		    this.setState({
		      progress: e.jPlayer.status.currentPercentAbsolute, //设置当前播放的秒数百分比 范围是0-100
		      totaltime: e.jPlayer.status.duration, //设置当前音乐总时间
		      volume: e.jPlayer.options.volume*100, //音量范围是0-1
		    })
		});	
		/*setTimeout(()=>{
			console.log(this.state.volume);
		},500)*/
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
	render(){
		var musiclist = this.state.musiclist;
		return (
			<div className="content">
	          <div id="player"></div>
	          <div className="player-wrapper">
	          	<h2><a href="" className="op">我的私人乐坊 ></a></h2>
	          	<div className="music-info clearfix">
	          		<div className="music-cover">
	          			<img src={musiclist.cover} alt={musiclist.artist} />
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
			          		<span className="prev op"></span>
			          		<span className={`play ${this.state.isplayed?'':'pause '}op`} onClick={this.playpausetoggle}></span>
			          		<span className="next op"></span>
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

