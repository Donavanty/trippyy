// Basic Imports
import React, { Component, Fragment } from "react";
// -------------------------------------------------------------------------
import "./CSS/Activity.css";
class Activity extends Component{
	render() {
		var activityClass;
		if (this.props.index < 10) {
			activityClass = "activityTop"
		} else {
			activityClass = "activityBottom"
		}
		return (
		<div>
			{this.props.value.added ?
					<div id="added" className={activityClass}>
						{(this.props.index) + 1} : {this.props.value.name}
					</div>
				:
					<div id="notAdded" className={activityClass} onClick={() => this.props.activityClickHandler(this.props.index)}>
						{(this.props.index) + 1} : {this.props.value.name}
					</div>
			}
		</div>)
	}
}

export default Activity;