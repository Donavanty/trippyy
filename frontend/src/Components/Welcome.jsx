// Basic Imports
import React, { Component } from "react";
// -------------------------------------------------------------------------

//Imports needed for redux
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
// -------------------------------------------------------------------------


// UNSPLASH
import "./CSS/Welcome.css"




class Welcome extends Component {

	state = {
	}

    componentDidUpdate(prevProps, prevState, snapshot) {
	}

	componentDidMount() {
	}

	render() {
		return (
			<div id="welcomeBox">
				<div className="animate__animated animate__fadeIn">
					<img className="welcomeImg animate__animated animate__fadeIn" alt="bg" src={this.props.trip.photo}/>
				</div>
				<div className="welcomeInnerBox">
					<div className="welcomeTextBox">
						Welcome to {this.props.trip.country}!
					</div>

					<div className="viewTextBox" onClick={this.props.scrollToTimetable}>
						View your timetable at a glance
					</div>

					<div className="viewTextBox" onClick={this.props.scrollToTimeline}>
						View your detailed itinerary
					</div>
				</div>
			</div>)

	}

}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.user !== null,
        user: state.user,
        loading: state.loading,
        trip: state.trip
    }
}

const mapDispatchToProps = dispatch => {
    return {
        newTrip: (tripCountry, tripLat, tripLng, startDate, endDate) => dispatch(actions.newTrip(tripCountry, tripLat, tripLng, startDate, endDate)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);
