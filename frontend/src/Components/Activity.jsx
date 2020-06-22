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
			{this.props.value.added === true ?
					<div id="added" className={activityClass} onClick={() => this.props.activityClickHandlerToSubtract(this.props.index)}>
						{(this.props.displayIndex) + 1} : {this.props.value.name}
					</div>
				:
					<div id="notAdded" className={activityClass} onClick={() => this.props.activityClickHandlerToAdd(this.props.index)}>
						{(this.props.displayIndex) + 1} : {this.props.value.name}
					</div>
			}
		</div>)
	}
}

export default Activity;