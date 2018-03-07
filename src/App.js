import React, { Component } from 'react';
import { HashRouter as Router , Route ,Switch } from 'react-router-dom';
import Header from './components/header/header';
import Player from './components/player/player';
import List from './components/list/list';
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
    };
    this.playmodehandler = this.playmodehandler.bind(this);
    this.changemusichandler = this.changemusichandler.bind(this);
  }
  componentDidMount(){
    var musiclist = this.state.musiclist;
    var currentIndex = this.state.currentIndex;
    var _this = this;
    $('#player').jPlayer({//API参考http://www.jplayer.cn/developer-guide.html#jPlayer-event-object
      ready: function(e){
        $(this).jPlayer("setMedia", {
          mp3: musiclist[currentIndex].file,
        }).jPlayer('play');
      },
      ended: function(e){
        var currentPlayMode = _this.state.currentPlayMode;
        switch(currentPlayMode){
          case 0: 
            var currentIndex = _this.state.currentIndex+1;
            if(currentIndex>musiclist.length-1){
              currentIndex = 0;
            }
            _this.setState({
              currentIndex: currentIndex
            })
            $(this).jPlayer('destroy');
            $(this).jPlayer({
              ready: function(e){
                $(this).jPlayer("setMedia", {
                  mp3: _this.props.musiclist[currentIndex].file,
                }).jPlayer('play');
              },
              supplied: "mp3",
              wmode: "window",
              muted: false,
              volume: 0.3
            });
            break;
          case 1:
            $(this).jPlayer('play');
            break;
          case 2: 

            break;
          default:
            break;
        }
      },
      supplied: "mp3",
      wmode: "window",
      muted: false,
      volume: 0.3
    });
  }
  playmodehandler(currentPlayMode){
    this.setState({
      currentPlayMode
    })
  }
  changemusichandler(currentIndex){
    var _this = this;
    this.setState({
      currentIndex
    });
    $('#player').jPlayer('destroy');//销毁jPlayer然后重新实例化jPlayer播放新的歌曲
    $('#player').jPlayer({//API参考http://www.jplayer.cn/developer-guide.html#jPlayer-event-object
      ready: function(e){
        $(this).jPlayer("setMedia", {
          mp3: _this.state.musiclist[_this.state.currentIndex].file,
        }).jPlayer('play');
      },
      supplied: "mp3",
      wmode: "window",
      muted: false,
      volume: 0.3
    });
  }
  render() {
    const Players = () => (
      <Player 
        musiclist={this.state.musiclist} 
        currentIndex={this.state.currentIndex} 
        currentPlayMode={this.state.currentPlayMode}
        playmodelist={this.state.playmodelist}
        playmodehandler={this.playmodehandler}
        changemusichandler={this.changemusichandler}
      />
    );
    const Lists = () => (
      <List 
        currentIndex={this.state.currentIndex}
        musiclist={this.state.musiclist}
      />
    );
    return (
      <Router>
        <div className="App">
          <Header />
          <Switch>
            <Route exact path="/" component={Players} />
            <Route path="/list" component={Lists} />
          </Switch>
        </div>  
      </Router>
    );
  }
}
