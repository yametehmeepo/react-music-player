import React , { Component } from 'react'
import { Link } from 'react-router-dom'
import ListItem from './listitem'
import './list.less'

export default class List extends Component {
	render(){
		var musiclist = this.props.musiclist;
		var listGroup = musiclist.map((item,index) => {
			return (
				<ListItem key={item.id} isplayed={this.props.isplayed} item={item} index={index} activeClass={this.props.currentIndex===index?'active':''}/>
			)
		})
		return (
			<div>
				<ul className="musiclist">
					{ listGroup }
				</ul>
				<p className="return"><Link to="/">返回播放列表</Link></p>
			</div>
		)
	}
}