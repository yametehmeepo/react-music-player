import React , { Component } from 'react'
import './lyricsshow.less'

export default class Lyrics extends Component {
	render(){
		return (
			<div className="lyricsshow">
				{this.props.musiclist[this.props.currentIndex].lyrics}
			</div>
		)
	}
}