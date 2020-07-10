// Basic Importsre
import React, { Component } from "react";
import * as utilities from '../Utilities'
// -------------------------------------------------------------------------
import "./CSS/ResultActivity.css";


/**
 * Component, renders a single activity.
 * @memberof Component
 * @param {Object} value: details of the activity
 * @param {number} displayIndex: index to show in website
 * @param {number} index: index of activity
 */
class ResultActivity extends Component{
	state = {
	}
		
	render() {
		return(
			<div className="row resultActivityBox">

				<div className="col-2 timeBox">
					<p className="startTime"> {this.props.value.startTime && utilities.formatDate(this.props.value.startTime)} </p>
 					<p className="endTime"> {this.props.value.endTime && utilities.formatDate(this.props.value.endTime)} </p>
				</div>
				<div className="col-4 timelineImgBox">
					<img className="timelineImg" alt="google-pic" src={this.props.value.displayPhoto}/>
				</div>

				<div className="col-6 descBox">
					<h4 className="resultsName"> {this.props.value.name} </h4>
					<p className="resultsAddress"> {this.props.value.formatted_address} </p>
				</div>
			</div>
		)
	}
}

export default ResultActivity;