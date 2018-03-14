import React, { Component } from 'react';
import { HashRouter as Router , Route ,Switch } from 'react-router-dom';
import PubSub from 'pubsub-js';
import Header from './components/header/header';
import Player from './components/player/player';
import List from './components/list/list';
import Lyrics from './components/lyrics/lyrics';
import MusicList from './data/musiclist';
import $ from 'jquery';
import 'jplayer';
import './App.css';



export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      musiclist: MusicList.list,
      currentIndex: 0,
      currentPlayMode: 0,
      playmodelist: ['order','single','random'],
      isplayed: true,
      totaltime: 0,
      progress: 0,
      pauseProgress: 0,
      pauseVolume: 30,
    };
    this.playmusic = this.playmusic.bind(this);
    this.playmodehandler = this.playmodehandler.bind(this);
    this.changemusichandler = this.changemusichandler.bind(this);
    this.confirmplay = this.confirmplay.bind(this);
    this.changepauseprogress = this.changepauseprogress.bind(this);
    this.changepausevolume = this.changepausevolume.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.deletemusic = this.deletemusic.bind(this);
  }
  componentDidMount(){
    var _this = this;
    $('#player').jPlayer({
      supplied: "mp3",
      wmode: "window",
      muted: false,
      volume: 0.3
    });
    this.playmusic(this.state.currentIndex);
    $('#player').bind($.jPlayer.event.loadedmetadata , (e) => {//绑定事件
        _this.setState({
          totaltime: e.jPlayer.status.duration,
        })
    });
    $('#player').bind($.jPlayer.event.timeupdate, (e) => {//绑定事件
        _this.setState({
          pauseProgress: e.jPlayer.status.currentPercentAbsolute, //设置当前播放的秒数百分比 范围是0-100
        });
    });
    $('#player').bind($.jPlayer.event.ended, (e) => {//绑定事件
        var index = null;
        if(this.state.currentPlayMode === 0){
          index = (this.state.currentIndex+1)%this.state.musiclist.length;
          this.changemusichandler(index);
        }else if(this.state.currentPlayMode === 1){
          index = this.state.currentIndex;
          this.changemusichandler(index);
        }else{
          var randomIndex = Math.floor(Math.random()*this.state.musiclist.length);
          while(randomIndex === this.state.currentIndex){
            randomIndex = Math.floor(Math.random()*this.state.musiclist.length);
          }
          this.changemusichandler(randomIndex);
        }
    });
    PubSub.subscribe('PLAY',()=>{
      this.play();
    });
    PubSub.subscribe('PAUSE',()=>{
      this.pause();
    });
    PubSub.subscribe('PAUSEPROGRESS',(msg,pauseProgress)=>{
      this.changepauseprogress(pauseProgress);
    });
    PubSub.subscribe('PAUSEPVOLUME',(msg,pauseVolume)=>{
      this.changepausevolume(pauseVolume);
    });
    PubSub.subscribe('CONFIRMPLAY',()=>{
      this.confirmplay();
    });
    PubSub.subscribe('CHANGE_MUSIC',(msg,index)=>{
      this.changemusichandler(index);
    });
    PubSub.subscribe('PLAY_THIS',(msg,index)=>{
      this.changemusichandler(index);
    });
    PubSub.subscribe('PLAY_MODE',(msg,currentPlayMode)=>{
      this.playmodehandler(currentPlayMode);
    });
    PubSub.subscribe('DELETE_MUSIC',(msg,id)=>{
      this.deletemusic(id);
    });
  }
  componentWillUnmount(){
    $('#player').unbind($.jPlayer.event.loadedmetadata );
    $('#player').unbind($.jPlayer.event.timeupdate);
    $('#player').unbind($.jPlayer.event.volumechange);
    $('#player').unbind($.jPlayer.event.ended);
    PubSub.unsubscribe('PLAY');
    PubSub.unsubscribe('PAUSE');
    PubSub.unsubscribe('PAUSEPROGRESS');
    PubSub.unsubscribe('PAUSEPVOLUME');
    PubSub.unsubscribe('CONFIRMPLAY');
    PubSub.unsubscribe('CHANGE_MUSIC');
    PubSub.unsubscribe('PLAY_THIS');
    PubSub.unsubscribe('DELETE_MUSIC');
  }
  deletemusic(itemindex){
    var _this = this;
    this.setState({
      musiclist: this.state.musiclist.filter((item,index) => {
        return index !== itemindex
      })
    });
    if(this.state.currentIndex === itemindex){
      if(this.state.musiclist.length <=1 ){
        $('#player').jPlayer("stop");
        $('#player').jPlayer("setMedia", {
          mp3: '',
        });
        this.setState({
          currentIndex: null,
          isplayed: false,
          pauseProgress: 0,
        }); 
        $(".content").css('display','none');
      }else{
        var _itemeindex = itemindex === this.state.musiclist.length?0:itemindex; 
        $('#player').jPlayer("stop");
        $('#player').jPlayer("setMedia", {
          mp3: _this.state.musiclist[_itemeindex].file,
        });
        this.setState({
          currentIndex: _itemeindex,
          isplayed: false,
          pauseProgress: 0,
        });
      }
    }else if(this.state.currentIndex > itemindex){
      this.setState({
        currentIndex: this.state.currentIndex - 1,
      });
    }
  }
  playmodehandler(currentPlayMode){
    this.setState({
      currentPlayMode
    })
  }
  changemusichandler(currentIndex){
    var _this = this;
    this.setState({
      currentIndex: currentIndex,
      isplayed: true
    });
    $('#player').jPlayer("setMedia", {
      mp3: _this.state.musiclist[currentIndex].file,
    }).jPlayer('play');
  }
  changepauseprogress(pauseProgress){
    this.setState({
      pauseProgress
    })
  }
  changepausevolume(pauseVolume){
    this.setState({
      pauseVolume
    })
  }
  playmusic(currentIndex){
    var _this = this;
    $('#player').jPlayer("setMedia", {
      mp3: _this.state.musiclist[currentIndex].file,
    }).jPlayer('play');
  }
  play(){
    $('#player').jPlayer('play');
    this.setState({
      isplayed:true
    })
  }
  pause(){
    $('#player').jPlayer('pause');
    this.setState({
      isplayed:false
    })
  }
  confirmplay(){
    this.setState({
      isplayed:true
    })
  }
  render() {
    /*const Players = () => (
      <Player 
        {...this.state}
      />
    );*/
    /*const Lists = () => (
      <List 
        musiclist={this.state.musiclist}
        currentIndex={this.state.currentIndex}
        isplayed={this.state.isplayed}
      />
    );*/
    /*const Lyricss = () => (
      <Lyrics 
        musiclist={this.state.musiclist}
        currentIndex={this.state.currentIndex}
      />
    );*/
    return (
      <Router>
        <div className="App">
          <Header />
          <Switch>
            <Route exact path="/" render={()=>(<Player {...this.state} />)} />
            <Route path="/list" render={()=>(<List {...this.state} />)} />
            <Route path="/lyrics" render={()=>(<Lyrics {...this.state} />)} />
          </Switch>
        </div>  
      </Router>
    );
  }
}
