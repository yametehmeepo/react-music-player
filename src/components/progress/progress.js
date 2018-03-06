import React , { Component } from 'react'
import './progress.less'

export default class Progress extends Component {
	constructor(props){
		super(props);
		this.clickprogressbar = this.clickprogressbar.bind(this);
	}
	clickprogressbar(e){
		var mouseX = e.clientX,//鼠标相对浏览器左边的距离
			divX = this.left.getBoundingClientRect().left,//获取容器相对浏览器左边的距离
			divW = this.left.offsetWidth,//获取容器宽度
			percentResult = ( mouseX - divX )/divW;
			this.props.changeprogress(percentResult);
	}
	render(){
		return (
			<div className="component-progress" onClick={this.clickprogressbar} ref={left => this.left = left}>
				<div className="progress" style={{width:this.props.progress+'%',backgroundColor: this.props.barColor}}></div>
			</div>
		)
	}
}