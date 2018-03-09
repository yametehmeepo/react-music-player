import React from 'react'

export default class Imgcover extends React.Component {
	shouldComponentUpdate(){
		return false;
	}
	render(){
		return (
      		<div className="music-cover">
      			<img src={this.props.musicitem.cover} alt={this.props.musicitem.artist} className="" />
      		</div>
		)
	}
}