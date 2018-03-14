import React , { Component } from 'react'
import { Link } from 'react-router-dom'
import './lyricsshow.less'

export default class Lyrics extends Component {
	componentDidMount(){
		//this.text.innerHTML = this.props.musiclist[this.props.currentIndex].lyrics;
	}
	render(){
		var text = this.props.musiclist[this.props.currentIndex].lyrics;
		//console.log(text);
		return (
			<div>
				{/*
				<div className="lyricsshow" ref={text => this.text = text}>
					{text}
				</div>
				*/}
				<div className="lyricsshow" dangerouslySetInnerHTML={{__html: text}}></div>
				<p className="returnlist"><Link to="/list">返回播放列表</Link></p>
				<p className="returncontrol"><Link to="/">返回控制界面</Link></p>
			</div>
		)
	}
}