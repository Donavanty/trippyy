// Basic Importsre
import React, { Component } from "react";
// -------------------------------------------------------------------------
import "./CSS/VerticalLine.css";

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
			<div className="verticalLine">
			</div>
		)
	}
}

export default VerticalLine;