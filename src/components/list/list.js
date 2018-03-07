import React , { Component } from 'react'
import ListItem from './listitem'
import './list.less'

export default class List extends Component {
	render(){
		var musiclist = this.props.musiclist;
		var listGroup = musiclist.map((item,index) => {
			return (
				<ListItem key={item.id} item={item} activeClass={this.props.currentIndex===index?'active':''}/>
			)
		})
		return (
			<ul className="musiclist">
				{ listGroup }
			</ul>
		)
	}
}