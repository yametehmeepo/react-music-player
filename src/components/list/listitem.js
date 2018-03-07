import React , { Component } from 'react'

export default class ListItem extends Component {
	render(){
		var item = this.props.item;
		return (
			<li className={this.props.activeClass}>
				<strong>{item.title}</strong> - {item.artist}
				<span className="del"></span>
			</li>
		)
	}
}