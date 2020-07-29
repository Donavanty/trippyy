// Basic Imports
import React, { Component } from "react";
// -------------------------------------------------------------------------
import "./CSS/Activity.css";
import Popup from "reactjs-popup";	
import xCrossIcon from '../assets/xCrossIcon.png';
import axios from 'axios';

const DATABASE_URL = "http://trippyy-backend.herokuapp.com/"
// const DATABASE_URL = "http://127.0.0.1:8000/"
const API_KEY = "AIzaSyDyb0_iNF_gpoxydk5Vd8IpWj1Hy1Tp5Vc"
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
		details: null,
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

		const data = {
			"name": this.props.value.name,
			"key": API_KEY,
			"id" : this.props.value.place_id

		}

	    axios.post(DATABASE_URL + "api/PlaceAdditionalDetails/", data).then( 
	    	(res) => {
	    		console.log(res.data)
	    		this.setState({details: res.data})
			}
	    )
	}
		
	closeModal = () => {
		this.setState({open: false})
	}

	activityClick = (type) => {
		if (type === "BOX") {
			this.setState({open: !this.state.open});
		} else if (type === "ADD") {
			this.props.activityClickHandlerToAdd(this.props.value)
		} else if (type === "SUBTRACT") {
			this.props.activityClickHandlerToSubtract(this.props.value)
		} else {
			return;
		}
	}
	render() {
		return (
			<div className ="" onClick ={() => this.activityClick("BOX")}>
				<div className = "activityBox row" onMouseEnter={() => this.props.onMouseEnter(this.props.index)} onMouseLeave={() => this.props.onMouseLeave(this.props.index)}>
					<div className = "col-4 imgBox">
						{<img className = "activityImg" src={this.props.value.displayPhoto} alt="activity img"/>}
					</div>

					<div className = "col-8">
						<p className = "activityName"> {this.props.value.name} </p>
						<p className = "activityDes"> {this.props.value.formatted_address} </p>
						<p className = "activityDes"> {this.beautifyText(this.props.value.types[0])} </p>
						{this.props.value.added === true ?
								<button id="added" className="addActivityButton" onClick={() => this.activityClick("SUBTRACT")}>
									Remove
								</button>
							:
								<button id="notAdded" className="addActivityButton" onClick={() => this.activityClick("ADD")}>
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
		            <div className="activityPopup row">
		                <img src={xCrossIcon} alt="xCrossIcon" className="close" onClick={this.closeModal} id="xCrossIcon"/>
		               
		                <div className="activityInfoBox">
		                	<div className="activityPopupIntroBox">
		                		<div className="activityPopupDesBox">
									<h3> {this.props.value.name} </h3>
									<p className="activityPopupNameText"> {this.props.value.formatted_address} </p>
									{
										this.state.details && this.state.details.website &&
											<a className="activityPopupLinkText" href={this.state.details.website} rel="noopener noreferrer" target="_blank"> {this.state.details.website} </a>
									}
								</div>
								<img alt="activity-pic" src={this.props.value.displayPhoto} className="activityPopupImage"/>
							</div>

							<div className="activityPopupOpeningHoursBox">
								{ this.state.details && this.state.details.opening_hours &&
									<div>
										<h3> Opening Hours </h3>
										{
											this.state.details.opening_hours.weekday_text.map((value, index) => {
												return <p className="openingHoursText"> {value} </p>
											})
										}
									</div>
								}
							</div>
							{
								this.state.details && 
								<div>
						            <div className="googleReviewsBox">
							            <h3> Google Reviews {this.state.details.rating} / 5 </h3>
							            <p className="reviewGreyText"> {this.state.details.user_ratings_total} reviews </p>
							            {
							            	this.state.details.reviews &&
							            		this.state.details.reviews.map((value,index) => {
							            			return (
								            			<div className="singleReview">
								            				<div className ="reviewAuthorBox">
									            				<div className="reviewAuthorDesBox">	
										            				<img alt="author pic" className="reviewAuthorPic" src={value.profile_photo_url} href={value.author_url}/>
										            				<div className="reviewAuthorInfoBox">
										            					<a href={value.author_url} className=""> <p> {value.author_name} </p> </a>
										            					<p className=""> {value.rating} / 5 </p>
										            				</div>
										            			</div>
									            				<p className="reviewGreyText"> {value.relative_time_description} </p>
									            			</div>

									            			<div className="reviewDexBox">
									            				<p> {value.text} </p>
									            			</div>
								            			</div>)
							            		})
							            }
							            <a className="activityPopupLinkText" href={this.state.details.url} rel="noopener noreferrer" target="_blank"> See more </a>
							        </div>
						        </div>

							}

						</div>
		            </div>	
		        </Popup>
			</div>)
	}
}

export default Activity;