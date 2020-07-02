// Basic Imports
import React, { Component } from "react";
// -------------------------------------------------------------------------
import "./CSS/Activity.css";
import axios from "axios";

/**
 * Component, renders a single activity.
 * @memberof Component
 * @param {Object} value: details of the activity
 * @param {number} displayIndex: index to show in website
 * @param {number} index: index of activity
 */

const API_KEY = "AIzaSyDyb0_iNF_gpoxydk5Vd8IpWj1Hy1Tp5Vc"
const DATABASE_URL = "https://trippyy-backend.herokuapp.com/"
// const DATABASE_URL = "http://127.0.0.1:8000/"
class Activity extends Component{
	state = {
		photo : null,
	}

	constructor(props) {
		super(props);
		this.componentDidMount = this.componentDidMount.bind(this);
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
	componentDidMount(state, props) {
		if (this.props.value["photos"]) {
			const data = {
				key: API_KEY,
				photoRef: this.props.value["photos"][0]["photo_reference"]
			}
			axios.post(DATABASE_URL + "api/GooglePhoto/", data).then(
				res => { 
					this.setState({photo: res.data})
			});
		}

	}
	render() {
		var activityClass;
		if (this.props.index < 10) {
			activityClass = "activityTop"
		} else {
			activityClass = "activityBottom"
		}
		return (
			<div className ="activityBox">
		<div className = "row" onMouseEnter={() => this.props.onMouseEnter(this.props.index)} onMouseLeave={() => this.props.onMouseLeave(this.props.index)}>
			<div className = "col-4 imgBox">
				{this.state.photo && <img className = "activityImg" src={this.state.photo} alt="activity img"/>}
			</div>

			<div className = "col-8">
				<p className = "activityName"> {this.props.value.name} </p>
				<p className = "activityDes"> {this.beautifyText(this.props.value.types[0])} </p>
				{this.props.value.added === true ?
						<button id="added" className={activityClass} onClick={() => this.props.activityClickHandlerToSubtract(this.props.index)}>
							Remove
						</button>
					:
						<button id="notAdded" className={activityClass} onClick={() => this.props.activityClickHandlerToAdd(this.props.index)}>
							{(this.props.displayIndex) + 1} : Add to trip!
						</button>
				}
			</div>
		</div>
		</div>)
	}
}

export default Activity;