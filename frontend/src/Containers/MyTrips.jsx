// Basic Imports
import React, { Component } from "react";
// -------------------------------------------------------------------------

//Imports needed for redux
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
// -------------------------------------------------------------------------

import axios from "axios";
import NavBar from '../Components/navBar';
import { Spinner } from 'react-bootstrap';

const DATABASE_URL = "https://trippyy-backend.herokuapp.com/";

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
				this.setState({tripIDs: res.data.trips});
			}).then(res => {
				// If no trips, finish loading.
				if (this.state.tripIDs.length <= 0) {
					this.setState({local_loading: false});
				}

				// If have trips, get trips.
				for (let i = 0; i < this.state.tripIDs.length; i++) {
					axios.get(DATABASE_URL + "api/trips/" + this.state.tripIDs[i], 
					{
						headers: {Authorization: "Token " + user['token']}
					}).then( res => {
						this.setState(
							{trips: [...this.state.trips, res.data]}
							);

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

render() {
	return (
		<React.Fragment>
		<NavBar from={this.props.location.pathname}/>
		<div className = "jumbotron startBox">
		<h1> My Trips </h1>

		{ 
			this.state.local_loading ? 
				<Spinner animation="border" role="status">
				  <span className="sr-only">Loading...</span>
				</Spinner>
			:
				(this.state.trips.length > 0) ? 
					<ul>
					{this.state.trips.map((value,index) => <li key={index}> {value.tripName} </li>)}
					</ul>
				: 
					<p> No trips available </p>
				
		}
		</div>

		</React.Fragment> 
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
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(MyTrips);