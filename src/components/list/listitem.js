import React , { Component } from 'react'
import PubSub from 'pubsub-js'
import { Link } from 'react-router-dom'

export default class ListItem extends Component {
	constructor(props){
		super(props);
		this.play = this.play.bind(this);
	}
	play(){
		if(this.props.activeClass === 'active'){
			return false;
		}else{
			PubSub.publish('PLAY_THIS',this.props.item.id)
		}
	}
	render(){
		var item = this.props.item;
		return (
			<li className={this.props.activeClass} onClick={this.play}>
				<strong>{item.title}</strong> - {item.artist}
				<span className="lyrics"><Link to="/lyrics">歌词详情</Link></span>
				<span className="del"></span>
			</li>
		)
	}
}