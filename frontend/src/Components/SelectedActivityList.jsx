// Basic Imports
import React, { Component, Fragment } from "react";
// -------------------------------------------------------------------------

//Imports needed for redux
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
// -------------------------------------------------------------------------

import "./CSS/SelectedActivityList.css";
import { Link } from 'react-router-dom';
import SelectedActivity from './SelectedActivity'

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
        const data = {
            lengthOfTrip: this.props.trip.lengthOfTrip,
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

       /**
    * Called upon pressing the Clear All button to clear all activities selected.
    * Calls the redux-action (activitiesSubtract) on particular selected activities, and redux-action (clearAllActivities).
    * @param {ReduxAction} activitiesSubtract: to subtract activities from the currentList array state, resulting in all activities in the ActivityList Component being unselected.
    * @param {ReduxAction} clearAllActivities: to clear all activities from the activitiesAdded array state, resulting in SelectedActivityList showing nothing.
    */
    clearAll = () => {
        if (this.props.trip.activitiesAdded.length !== 0) {
      
            const subtractAllSelectedActivities = () => {
                for (let j = 0; j < this.props.activitiesShown.currentList.length; j++) {
                    if (this.props.activitiesShown.currentList[j].added === true) {
                        this.props.activitiesSubtract(this.props.activitiesShown.currentList[j]);
                    }
                }

                for (let j = 0; j < this.props.searchActivitiesShown; j++) {
                    if (this.props.searchActivitiesShown[j].added === true) {
                        this.props.activitiesSubtract(this.props.searchActivitiesShown[j]);
                    }
                }
            }

            //Subtract current categories' activities
            subtractAllSelectedActivities();
            this.props.clearAllActivities();
        }
      
    }
    render() {
        return (
            <Fragment>
                <Link to="/results" className="itiButton" onClick={this.getItinerary} value="general">Get Your Itinerary!</Link>
                <div className ="statsBox">
                    <p className="statsHeader"> TRIP STATISTICS </p>
                    <div className="statsTextBox">
                        <p className="statsText"> Recommended Duration:  </p> 
                        <p className="statsNumber recommended"> {this.props.trip["lengthOfTrip"] * 10}h </p> 
                    </div>

                    <div className="statsTextBox">
                        <p className= "statsText"> Current Duration: </p> 
                        <p className="statsNumber">{this.props.trip["activitiesAddedLength"]}h </p> 
                    </div>
                </div>
            	<div id="selectedActivityList">
                    <div className="yourActivitiesBox">
                        <p className="yourActivitiesText"> ACTIVITIES </p>
                        <button className="clearAll" onClick={this.clearAll}> Clear </button>
                    </div>

                    <div className="selectedActivitiesBox">
            		{
            			this.props.trip["activitiesAdded"].map( (value, index) => 
                            <SelectedActivity
                                activitiesSubtract={this.props.activitiesSubtract}
                                activitiesEdit={this.props.activitiesEdit}
                                key={index}
                                value={value}
                                index={index}
                            />)
            		}
                    </div>
            	</div>
            </Fragment>)
    }
}

const mapStateToProps = (state) => {
    return {
        trip: state.trip,
        activitiesShown: state.activitiesShown,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        itineraryLoad: (data) => dispatch(actions.itineraryLoad(data)),
        activitiesSubtract: (activity) => dispatch(actions.activitiesSubtract(activity)),
        clearAllActivities: () => dispatch(actions.clearAllActivities()),
        activitiesEdit: (activity, newTime) => dispatch(actions.activitiesEdit(activity, newTime)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SelectedActivityList);