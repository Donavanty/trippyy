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

class Activity extends Component{
	state = {
		photo : null,
	}

	constructor(props) {
		super(props);
		this.componentDidMount = this.componentDidMount.bind(this);
	}

	componentDidMount(state, props) {
		if (this.props.value["photos"]) {
			const data = {
				key: API_KEY,
				photoRef: this.props.value["photos"][0]["photo_reference"]
			}
			axios.post("http://127.0.0.1:8000/api/GooglePhoto/", data).then(
				res => { 
					console.log(res.data)
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
		<div>

			<div onMouseEnter={() => this.props.onMouseEnter(this.props.index)} onMouseLeave={() => this.props.onMouseLeave(this.props.index)}>
				{this.props.value.added === true ?
						<div id="added" className={activityClass} onClick={() => this.props.activityClickHandlerToSubtract(this.props.index)}>
							{(this.props.displayIndex) + 1} : {this.props.value.name}
						</div>
					:
						<div id="notAdded" className={activityClass} onClick={() => this.props.activityClickHandlerToAdd(this.props.index)}>
							{(this.props.displayIndex) + 1} : {this.props.value.name}
						</div>
				}
			</div>
		</div>)
	}
}

export default Activity;