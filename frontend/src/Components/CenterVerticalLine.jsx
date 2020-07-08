// Basic Importsre
import React, { Component } from "react";
// -------------------------------------------------------------------------
import "./CSS/CenterVerticalLine.css";

/**
 * Component, renders a single activity.
 * @memberof Component
 * @param {Object} value: details of the activity
 * @param {number} displayIndex: index to show in website
 * @param {number} index: index of activity
 */
class VerticalLine extends Component{
	state = {
	}
		
	render() {
		return(
				<div className="row">
					<div className="centerVerticalLine col-6">
					</div>
					
					<div className="col-6">
						<p className="stepDuration"> {this.props.value.duration.text} </p>
					</div>
					
				</div>
		)
	}
}

export default VerticalLine;