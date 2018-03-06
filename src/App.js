import React, { Component } from 'react';
import Header from './components/header/header';
import Player from './components/player/player';
import $ from 'jquery';
import 'jplayer';
import './App.css';



export default class App extends Component {
  componentDidMount(){
    $('#player').jPlayer({//API参考http://www.jplayer.cn/developer-guide.html#jPlayer-event-object
      ready: function(e){
        $(this).jPlayer("setMedia", {
          mp3: 'http://fs.w.kugou.com/201803051701/92ffe6470cef09066fd4079b1d358754/G012/M01/0A/01/TA0DAFT_BhaAUQwWAEm_q8kA8x0519.mp3',
          //光辉岁月
          //http://fs.w.kugou.com/201803051701/92ffe6470cef09066fd4079b1d358754/G012/M01/0A/01/TA0DAFT_BhaAUQwWAEm_q8kA8x0519.mp3
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
        <Player />
      </div>
    );
  }
}


