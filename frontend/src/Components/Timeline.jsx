// Basic Imports
import React, { Component } from "react";
// -------------------------------------------------------------------------

//Imports needed for redux
import * as actions from '../store/actions/actions';
import * as utilities from '../Utilities'
import { connect } from 'react-redux';
// -------------------------------------------------------------------------

import "./CSS/Timeline.css";
import ResultActivity from './ResultActivity'
import ResultDirection from './ResultDirection'
import VerticalLine from './VerticalLine'


/**
 * Component, renders a list of activities.
 * @memberof Component
 * @param {Component} Activity
 * @param {ReduxAction} activitiesLoad: to load activities from Google API
 * @param {ReduxAction} activitiesAdd: to update redux state when adding an activity to the list of selected activities upon selection
 * @param {ReduxState} map: Redux object with map information (e.g. lng/lat of center, and bounds)
 * @param {ReduxAction} activitiesShown: Redux object with information about the list of activities currently rendered
 * @returns Rendered list of activities
 */
class Timeline extends Component{
    state = {
    }

    componentDidMount() {
    }
        
    render() {
        return (
            <div>
                <div className="timelineHeaderBox">
                    <h3> Your trip from {utilities.getFormattedDate(this.props.trip.startDate.toString())} to {utilities.getFormattedDate(this.props.trip.endDate.toString())} </h3>
                </div>
                <div className="timelineBox">
                    {this.props.trip.itinerary.map((dayValue, dayIndex) => {
                        return (
                            <div className="timeline-day">
                                <div className="timeline-day-box">
                                    Day {dayIndex+1}
                                </div>
                                <VerticalLine/>
                                {dayValue.map((value,index) => {
                                    if ((index !== 0) && (index !== dayValue.length-1)) {
                                        return (
                                            <div className="timeline-combo">
                                                <ResultActivity value={value} index={index} dayIndex={dayIndex}/>
                                                {( (index !== (dayValue.length-2)) || 
                                                    (dayIndex !== (this.props.trip.itinerary.length-1)) ) && <VerticalLine/>}
                                                { this.props.trip.itiDirections[dayIndex][index-1] && 
                                                    <ResultDirection 
                                                        direction={this.props.trip.itiDirections[dayIndex][index-1]}
                                                        mapAddDirections={this.props.mapAddDirections}
                                                    />
                                                }                                            
                                                {( (index !== (dayValue.length-2)) || 
                                                    (dayIndex !== (this.props.trip.itinerary.length-1)) ) && <VerticalLine/>}
                                            </div>)
                                    } else {
                                        return null;
                                    }
                                })}
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        trip: state.trip,
        map: state.map,
        activitiesShown: state.activitiesShown,
        activitiesLoading: state.activitiesLoading,
        isLastPage: (!state.activitiesShown.hasNextPageLoaded) && (state.activitiesShown.nextPageToken === -1),
        isFirstPage: state.activitiesShown.pageNumber === 0,

        focusedActivity: state.focusedActivity
    }
}

const mapDispatchToProps = dispatch => {
    return {
        mapAddDirections: (directions) => dispatch(actions.mapAddDirections(directions))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Timeline);