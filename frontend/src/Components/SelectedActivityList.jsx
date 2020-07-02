// Basic Imports
import React, { Component, Fragment } from "react";
// -------------------------------------------------------------------------

//Imports needed for redux
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
// -------------------------------------------------------------------------

import "./CSS/SelectedActivityList.css";
import { Link } from 'react-router-dom';

/**
 * Component, renders activities currently added into the trip.
 * @memberof Component
 * @param {ReduxState} trip: Contains information about current trip (e.g. trip name/date, and list of current activities added)
 * @param {ReduxAction} itineraryLoad: Updates redux state to generate itinerary.
 */
class SelectedActivityList extends Component{
    componentDidMount() {
    }

    state = {
    }

    /**
    * Called upon clicking button to generate itinerary. Calls Redux-action (itineraryLoad) to generate.
    * @param {ReduxAction} itineraryLoad: Updates redux state to generate itinerary.
    */
    getItinerary = (event) => {
        var startDate = new Date(this.props.trip.startDate);
        var endDate = new Date(this.props.trip.endDate);
        var lengthOfTrip = ((endDate - startDate) / (1000*60*60*24)) + 1
        const data = {
            lengthOfTrip: lengthOfTrip,
            activitiesAdded: this.props.trip.activitiesAdded
        }

        if (this.props.trip.activitiesAdded.length === 0) {
            event.preventDefault();
            alert("Please select some activities first!")
            return;
        }
        this.props.itineraryLoad(data);
    }

    closeModal = () => {
        this.setState({open: false})
    }

    render() {
        return (
            <Fragment>
                <Link to="/results" className="itiButton" onClick={this.getItinerary} value="general">Get Itinerary</Link>
                <div className ="statsBox">
                    <div className = "stats1">
                        <p className="statsDes"> Recommended Activities Duration:</p> 
                        <p className="statsNum"> CMG SOON </p>
                    </div>

                    <div className = "stats1">
                        <p className= "statsDes"> Current Activities Duration:</p> 
                        <p className="statsNum"> {this.props.trip["activitiesAddedLength"]} h </p>
                    </div>
                </div>
            	<div id="selectedActivityList">
            		{
            			this.props.trip["activitiesAdded"].map( (value, index) => <p key={index}>{index+1} : {value.name}</p>)
            		}
            	</div>
            </Fragment>)
    }
}

const mapStateToProps = (state) => {
    return {
        trip: state.trip,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        itineraryLoad: (data) => dispatch(actions.itineraryLoad(data)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SelectedActivityList);