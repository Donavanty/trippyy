// Basic Imports
import React, { Component } from "react";
// -------------------------------------------------------------------------

//Imports needed for redux
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
// -------------------------------------------------------------------------

import "./CSS/InputForm.css"
import Calendar from "./Calendar"
import { Spinner } from 'react-bootstrap';
import Autocomplete from './Autocomplete'
import Logo from '../assets/logo.PNG'
import LazyLoad from 'react-lazy-load';
import CalendarIcon from "../assets/calendar.png"
import PlaneIcon from "../assets/plane.png"
import ShoppingBg from "../assets/shoppingBg.jpg"

/**
 * Component, renders input form for user to input City and dates of trip.
 * @memberof Component
 * @param {user} Redux-state: Contains information about user if logged in. (e.g. token, username)
 * @param {ReduxAction} newTrip: Updates redux state with new trip information.
 */
class InputForm extends Component {

	state = {
		newTripCreated: false,
		goToShoppingPage: false,
		latLng: [],
	}

	/** 
	* Called from component Calendar, in which upon input of dates, local state dates would be updated
	* @param {String} startDate: start date of trip.
	* @param {String} endDate: start date of trip.
	*/
	updateDates = (startDate, endDate) => {
		this.setState({startDate, endDate});
	}

	/** 
	* Called from component Autocomplete, in which upon input of country, local state country would be updated
	* @param {String} countryName: name of country.
	* @param {Object} latLng: coordinates of country.
	*/
	updateCountry = (countryName, geometry, latLng) => {
		this.setState({
			"countryName" : countryName, 
			"geometry" : geometry,
			"latLng" : latLng, 
		})
	}

	scrollToTheTop = () => window.scrollTo(0,0);

	
	

	/** Called upon pressing the submit button, creates a new trip, 
	* and checks for basic input validation before submitting, 
	* and calling the redux-action (newTrip) to update redux-state with trip information.
	* @param {ReduxAction} newTrip: Updates redux state with new trip information.
	*/
	newTrip = (event) => {
		if (this.state.startDate == null || this.state.endDate == null) {
			alert("Please choose dates first!");
			event.preventDefault();
		} else if (this.state.countryName == null || this.state.geometry == null || this.state.latLng == null) {
			alert("Please select a country from the list!");
			event.preventDefault();
		} else {
			event.preventDefault();
			this.scrollToTheTop(); //Scroll back to the top
			this.props.newTrip(this.state.countryName, this.state.geometry, this.state.latLng, this.state.startDate, this.state.endDate);
			this.setState({newTripCreated: true});
			
		}
	}

	//Happens upon receiving updated information.
    componentDidUpdate(prevProps, prevState, snapshot) {
    	if (this.props.newTripLoading === false && this.state.newTripCreated===true) {
    		this.props.history.push("/shopping");
    	}
	}


	render() {
		return (
	      <div>
	    	<div className = "row">
		    	<div className = "col-4 logo-container">
		    		<LazyLoad>
						<img src={Logo} alt="trippyy-logo" className="trippyy-logo"/>
					</LazyLoad>
				</div>

	          <div className = "col-8">
	          <div className ="inputForm-box">
	          	<div className="inputForm-container">
				  	<form onSubmit = {this.newTrip} className="inputForm-form col-6">
				  	<div className="welcomeText">
					  	{
			    		 (this.props.isAuthenticated) ?
			    			 <h3>Welcome back, {this.props.user.username}!</h3> : (<h3>Get Started</h3>)
			    		} 
		    		</div>
		                <div className ="inputForm-fields inputForm-dates" id="input" >
		                	<div className="icon">
		                	<img src={CalendarIcon} className="iconImg" alt="icon"/>
		                	</div>
		                	<Calendar updateDates={this.updateDates}/>
		                </div>

	                	<div id="input" className="inputForm-fields">
	                		<div className="icon">
	                		<img src={PlaneIcon} className="iconImg" alt="plane"/>
	                		</div>
		                	<Autocomplete className="autocomplete" updateCountry={this.updateCountry} name = "country" 
							/>
		                </div>

		                
						<style type="text/css">
									{`
									.btn-trippyy {
									background-color: #5CCFE9;
									color: black;
									}
									`}
									</style>
		                <div className = "inputForm-submit" id="input">
		                	{ !this.props.newTripLoading ? 
								
		                		<button className="inputForm-button" variant="trippyy" onClick = {(event) => {this.newTrip(event);}} > Submit </button> 
		                		:
								<Spinner animation="border" role="status">
								  <span className="sr-only">Loading...</span>
								</Spinner>

		                	}
		                </div>
		              </form>
			              <div className="photoBox col-6">
				              <div className="triangle"/> 
				              <img src={ShoppingBg} className="randomPhoto" alt="eek"/>
			              </div>
		              </div>
	              </div>
	              </div>

	              
	          </div>
	      </div>);

	}

}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.user !== null,
        user: state.user,
        loading: state.loading,
        newTripLoading: state.newTripLoading,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        newTrip: (tripCountry, tripLat, tripLng, startDate, endDate) => dispatch(actions.newTrip(tripCountry, tripLat, tripLng, startDate, endDate)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InputForm);
