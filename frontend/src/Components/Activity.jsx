// Basic Imports
import React, { Component } from "react";
// -------------------------------------------------------------------------
import "./CSS/Activity.css";
import Popup from "reactjs-popup";	
import xCrossIcon from '../assets/xCrossIcon.png';
import axios from 'axios';

// const DATABASE_URL = "http://trippyy-backend.herokuapp.com/"
const DATABASE_URL = "http://127.0.0.1:8000/"
/**
 * Component, renders a single activity.
 * @memberof Component
 * @param {Object} value: details of the activity
 * @param {number} displayIndex: index to show in website
 * @param {number} index: index of activity
 */
class Activity extends Component{
	state = {
		open: false,
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
		const img = new Image();
		img.src = this.props.value.displayPhoto;
		img.onload = () => console.log("Loaded!")


	    axios.post(DATABASE_URL + "api/PlaceAdditionalDetails/", {"name": this.props.value.name}).then( 
	    	(res) => {
	    		console.log(res.data)
			}
	    )

		// let name = this.props.value.name;
		// name = name.replace(" ", "%20")
		// axios.get().then(
		// 	(res) => {
		// 		console.log(res);
		// 	})


	}
		
	render() {
		return (
			<div className ="activityBox" onClick ={() => this.setState({open: false})}>
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

				<Popup
			        open={this.state.open}
			        closeOnDocumentClick
			        onClose={this.closeModal}
		        >
		            <div className="popupBox row">
		                <img src={xCrossIcon} alt="xCrossIcon" className="close" onClick={this.closeModal} id="xCrossIcon"/>
		               
		                <div className="infoBox col-6">
							<h4> {this.props.value.name} </h4> 
							<div className="selectedActivityDesBox">
								<p className="popupNameText"> {this.beautifyText(this.props.value.types[0])} </p>
				                <p className="popupDesText"> {this.props.value.formatted_address} </p>
				            </div>

						</div>

						<div className="photoBox col-6">
					        <div className="selectedActivityTriangle"/> 
					        <img src={this.props.value.displayPhoto} className="activityPhoto" alt="eek"/>
						</div>
		            </div>	
		        </Popup>
			</div>)
	}
}

export default Activity;