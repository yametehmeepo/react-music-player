import React , { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import ListItem from './listitem'
import './list.less'

export default class List extends Component {
	render(){
		var musiclist = this.context.musiclist;
		var listGroup = musiclist.map((item,index) => {
			return (
				<ListItem key={item.id} isplayed={this.context.isplayed} item={item} index={index} activeClass={this.context.currentIndex===index?'active':''}/>
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

List.contextTypes = {
	musiclist: PropTypes.array,
	currentIndex: PropTypes.number,
	isplayed: PropTypes.bool
}








