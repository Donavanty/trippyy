// Basic Imports
import React, { Component, Fragment } from "react";
// -------------------------------------------------------------------------

//Imports needed for redux
import * as actions from '../../store/actions/actions';
import { connect } from 'react-redux';
// -------------------------------------------------------------------------

import "./inputForm.css"
import axios from "axios";
import Calendar from "./Calendar"
import { Link } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import Autocomplete from './Autocomplete'

class InputForm extends Component {

	state = {
		newTripCreated: false,
		goToShoppingPage: false,
	}

	//Called from component Calendar, in which upon input of dates, local state would be updated
	updateDates = (startDate, endDate) => {
		this.setState({startDate, endDate});
	}

	//Called from component Autocomplete, in which upon selection of country,
	//Current state would get updated.
	updateCountry = (countryName, latLng) => {
		this.setState({countryName, latLng});
	}

	// Upon pressing the submit button, creates a new trip, and checks for 
	// basic input validation before submitting.
	newTrip = (event) => {
		if (this.state.startDate == null || this.state.endDate == null) {
			alert("Please choose dates first!");
		} else if (this.state.countryName == null || this.state.latLng == null) {
			alert("Please select a country from the list!");
		} else {
			event.preventDefault();
			this.props.newTrip(this.state.countryName, this.state.latLng["lat"], this.state.latLng["lng"], this.state.startDate, this.state.endDate);
			this.setState({newTripCreated: true});
		}
	}

	//If new trip created is true, and loading is complete, then go to shopping page.
	static getDerivedStateFromProps(nextProps, prevState){
	  if (nextProps.loading===false && prevState.newTripCreated===true){
	     return { goToShoppingPage: true };
	  }
	  else return null;
	}

	//Happens upon receiving updated information.
    componentDidUpdate(prevProps, prevState, snapshot) {
    	if (this.state.goToShoppingPage === true) {
    		this.props.history.push("/shopping");
    	}
    }

	render() {
		return (
	      <div className = "container-fluid align-items-center inputForm">
	      	{
	    		 (this.props.isAuthenticated) ?
	    			 <h1>Hello, {this.props.username}!</h1> : (<h1>Hello stranger:)</h1>)
	    	}
	          <div className = "jumbotron">
	              <form onSubmit = {this.newTrip}> 
	                <div>
	                	<h3> Enter Country: </h3>
	                	<Autocomplete updateCountry={this.updateCountry} name = "country"/>
	                </div>

	                <div className ="inputForm">
	                	<h3> Enter dates: </h3>
	                	<Calendar updateDates={this.updateDates}/>
	                </div>
	                
	                <div className = "inputForm">
	                	{ !this.props.loading ? 
	                		<button> Submit </button> 
	                		:
							<Spinner animation="border" role="status">
							  <span className="sr-only">Loading...</span>
							</Spinner>

	                	}
	                </div>
	              </form>

	              
	          </div>
	      </div>);

	}

}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.token !== null,
        username: state.username,
        loading: state.loading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        newTrip: (tripCountry, tripLat, tripLng, startDate, endDate) => dispatch(actions.newTrip(tripCountry, tripLat, tripLng, startDate, endDate)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InputForm);
