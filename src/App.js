import React, { Component } from 'react';
import Header from './components/header/header';
import Player from './components/player/player';
import MusicList from './data/musiclist'
import $ from 'jquery';
import 'jplayer';
import './App.css';



export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      musiclist: MusicList.list,
    };
  }
  componentDidMount(){
    var musiclist = this.state.musiclist;
    $('#player').jPlayer({//API参考http://www.jplayer.cn/developer-guide.html#jPlayer-event-object
      ready: function(e){
        $(this).jPlayer("setMedia", {
          mp3: musiclist[0].file,
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
  
  render() {
    return (
      <div className="App">
        <Header />
        <Player musiclist={this.state.musiclist} currentIndex={this.state.currentIndex} />
      </div>
    );
  }
}


