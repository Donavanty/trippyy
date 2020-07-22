// Basic Imports
import React, { Component } from "react";
// -------------------------------------------------------------------------
import "./CSS/Activity.css";


/**
 * Component, renders a single activity.
 * @memberof Component
 * @param {Object} value: details of the activity
 * @param {number} displayIndex: index to show in website
 * @param {number} index: index of activity
 */
class Activity extends Component{
	state = {
	}

	beautifyText = (text) => {
		var output = ""
		for (var i in text) {
			if (i < 1) {
				output = output + text[i].toUpperCase()
			} else if (text[i] === "_") {
				output = output + " ";
			} else {
				output = output + text[i]
			}
		}
		return output;
	}

	componentDidMount() {

	}
		
	render() {
		return (
			<div className ="activityBox">
		<div className = "row" onMouseEnter={() => this.props.onMouseEnter(this.props.index)} onMouseLeave={() => this.props.onMouseLeave(this.props.index)}>
			<div className = "col-4 imgBox">
				{<img className = "activityImg" src={this.props.value.displayPhoto} alt="activity img"/>}
			</div>

			<div className = "col-8">
				<p className = "activityName"> {this.props.value.name} </p>
				<p className = "activityDes"> {this.props.value.formatted_address} </p>
				<p className = "activityDes"> {this.beautifyText(this.props.value.types[0])} </p>
				{this.props.value.added === true ?
						<button id="added" className="addActivityButton" onClick={() => this.props.activityClickHandlerToSubtract(this.props.value)}>
							Remove
						</button>
					:
						<button id="notAdded" className="addActivityButton" onClick={() => this.props.activityClickHandlerToAdd(this.props.value)}>
							{(this.props.displayIndex) + 1} : Add to trip!
						</button>
				}
			</div>
		</div>
		</div>)
	}
}

export default Activity;