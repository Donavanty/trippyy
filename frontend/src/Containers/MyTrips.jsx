// Basic Imports
import React, { Component } from "react";
// -------------------------------------------------------------------------

//Imports needed for redux
import * as actions from '../store/actions/actions';
import * as utilities from '../Utilities'
import { connect } from 'react-redux';
// -------------------------------------------------------------------------

import "./CSS/MyTrips.css"
import axios from "axios";
import NavBar from '../Components/navBar';
import { Spinner } from 'react-bootstrap';

const DATABASE_URL = "https://trippyy-backend.herokuapp.com/";
// const DATABASE_URL = "http://127.0.0.1:8000/"

/** Container, renders my trips page.
* @memberof Container
* @param {Component} Navbar, renders navigation bar.
* @param {ReduxAction} checkTrip, updates redux state of trip with local storage
* @param {ReduxAction} authCheckState, updates redux state of user with local storage
*/
class MyTrips extends Component {
	state = {
		tripIDs: [],
		trips: [],
		local_loading: null
	}

	/** 
	* Called upon page load, loads trips from backend.
	*/
	loadTrips = () => {
		try {
			const user = JSON.parse(localStorage.user);
			axios.get(DATABASE_URL + "api/users/" + user['id'], {
				headers: {Authorization: "Token " + user['token']}
			}).then(res => {
				// STEP 1 : GETTING TRIP IDS
				this.setState({tripIDs: res.data.trips});
			}).then(res => {
				// If no trips, finish loading.
				if (this.state.tripIDs.length <= 0) {
					this.setState({local_loading: false});
				}

				// STEP 2 If have trips, get trips individually
				for (let i = 0; i < this.state.tripIDs.length; i++) {
					axios.get(DATABASE_URL + "api/trips/" + this.state.tripIDs[i], 
					{
						headers: {Authorization: "Token " + user['token']}
					}).then( res => {
						this.setState(
							{trips: [...this.state.trips, res.data]}
							);
						const img = new Image();
        				img.src = JSON.parse(res.data.info)["photo"];

						//If it is loaded last item, then change loading to false.
						if (i === this.state.tripIDs.length - 1) {
							this.setState({local_loading: false});
						}
					});	
				}
			})
		} catch (error) {
			alert(error);
			this.props.history.push("/");
		}
	}


	componentDidMount() {

		this.setState({local_loading: true});

		//Updates login status to redux.
		this.props.onTryAutoSignup();

		//If user is not logged in, redirect to Login page
		if (localStorage.user === null || localStorage.user === undefined) {
			this.props.history.push({
					pathname: "/login",
					state: { from: this.props.location.pathname }
				});
		} else {
			this.loadTrips()
		}

		// Loads trips from backend assuming logged in, catch doesnt handle!
		// Need to add checks 
	}

	retrieveDraftTrip = (event, trip) => {
		if (event.target.tagName === "BUTTON") {
			return;
		}
		this.props.retrieveTrip(trip);
		this.props.history.push("/shopping");
	}

	retrieveCompleteTrip = (event, trip) => {
		if (event.target.tagName === "BUTTON") {
			return;
		}
		this.props.retrieveTrip(trip);
		this.props.history.push("/results");
	}

	deleteTrip = (trip) => {
		const user = JSON.parse(localStorage.user);
		axios.delete(DATABASE_URL + "api/trips/" + trip["id"], 
			{
				headers: {Authorization: "Token " + user['token']}
			}).then( (res) => {
				this.setState({tripIDs: [], trips: []})
				this.setState({local_loading: true})
				this.loadTrips();
			})
	}
render() {
	if (this.state.local_loading) {
		return (<div className="loadingBox">
			<h4> Getting your trips! </h4>
			<Spinner animation="border" role="status">
			  <span className="sr-only">Loading...</span>
			</Spinner>
		</div>)
	}

	return (
		<div>
			<NavBar from={this.props.location.pathname}/>

			<div className = "bigBox animate__animated animate__fadeIn animate__fast">
				<h3 className="heading-text"> My Trips </h3>

				<div className ="trips-box">
				{ 
						(this.state.trips.length > 0) ? 

							(
								this.state.trips.map( (value,index) => {
									const trip = JSON.parse(value.info);
									if (trip["finished"] ) {
										return (
											<div key={index} className="trip-container" onClick={(event) => this.retrieveCompleteTrip(event, trip)}>
											<button className="myTripsDeleteButton" onClick={() => this.deleteTrip(trip)}> Delete </button>
												<img src={trip.photo} className="trip-photo" alt="trip"/>
												<p className="trip-text"> {trip.country} </p>
												<p className="trip-date"> {utilities.getFormattedDate(trip.startDate)} - {utilities.getFormattedDate(trip.endDate)} </p>
											</div>)

									} else {
										return (
											<div key={index} className="trip-container" onClick={(event) => this.retrieveDraftTrip(event , trip)}>
												<button className="myTripsDeleteButton" onClick={() => this.deleteTrip(trip)}> Delete </button>
												<img src={trip.photo} className="trip-photo" alt="trip"/>
													<p className="trip-text"> [DRAFT] {trip.country} </p>
													<p className="trip-date"> {utilities.getFormattedDate(trip.startDate)} - {utilities.getFormattedDate(trip.endDate)} </p>
											</div>)
									}
								})
							)

							:

							<p> No trips available </p>
						
				}
				</div>
			</div>

		</div> 
		);
}
}

const mapStateToProps = (state) => {
	return {
		isAuthenticated: state.user !== null,
		user: state.user
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onTryAutoSignup: () => dispatch(actions.authCheckState()),
		retrieveTrip: (trip) => dispatch(actions.retrieveTrip(trip)),
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(MyTrips);