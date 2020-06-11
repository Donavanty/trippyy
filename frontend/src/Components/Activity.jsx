// Basic Imports
import React, { Component, Fragment } from "react";
// -------------------------------------------------------------------------
import "./CSS/Activity.css";
class Activity extends Component{
	render() {
		return (
		<div>
			{this.props.value.added ?
					<div id="added" className="activity">
						{(this.props.index) + 1} : {this.props.value.name}
					</div>
				:
					<div id="notAdded" className="activity" onClick={() => this.props.activityClickHandler(this.props.index)}>
						{(this.props.index) + 1} : {this.props.value.name}
					</div>
			}
		</div>)
	}
}

export default Activity;