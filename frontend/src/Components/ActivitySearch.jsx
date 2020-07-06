// Basic Imports
import React, { Component } from "react";
// -------------------------------------------------------------------------

//Imports needed for redux
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
// -------------------------------------------------------------------------

import { Spinner } from 'react-bootstrap';
import "./CSS/ActivitySearch.css";
import Activity from './Activity'




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
class ActivitySearch extends Component{
    state = {

    }


    componentDidMount() {
        this.props.checkTrip();
    }   

    selectAddress = (address, placeId) => {
        this.props.addSuggestions(placeId);
    }
    //Category Buttons: Buttons change to grey ("secondary") when they are clicked, 
    //and remain turquoise ("info") when they are not.
    render() {
        return (
            <div id="activitySearchBox" onClick={this.props.onClick}> 
                {
                    this.props.suggestionsLoading && (
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>)
                        
                }

                {
                    this.props.searchActivitiesShown[0] && <Activity 
                            value={this.props.searchActivitiesShown[0]} 
                            index={0}
                            displayIndex={0} 
                            activityClickHandlerToAdd={this.props.activitiesAdd}
                            activityClickHandlerToSubtract={this.props.activitiesSubtract}
                            onMouseEnter={this.props.activitiesFocus}
                            onMouseLeave={this.props.activitiesUnfocus}
                        />
                }

                {
                    (this.props.searchActivitiesShown.length > 1) && (
                        <div className="historyRow">
                            <h2 className="historyText"> History </h2>
                            <button className="historyButton" onClick={this.props.suggestionsClear}> Clear </button>
                        </div>)
                }

                {
                    this.props.searchActivitiesShown.map((value, index) => {
                        if (index !== 0) {
                            return (<Activity 
                                value={value} 
                                index={index}
                                displayIndex={index} 
                                activityClickHandlerToAdd={this.props.activitiesAdd}
                                activityClickHandlerToSubtract={this.props.activitiesSubtract}
                                onMouseEnter={this.props.activitiesFocus}
                                onMouseLeave={this.props.activitiesUnfocus}
                            />)
                        } else {
                            return null;
                        }
                    })
                }
            </div>
            );
    }
}

const mapStateToProps = (state) => {
    return {
        trip: state.trip,
        map: state.map,
        activitiesShown: state.activitiesShown,
        activitiesLoading: state.activitiesLoading,
        searchActivitiesShown: state.searchActivitiesShown,

        focusedActivity: state.focusedActivity,
        suggestionsLoading: state.suggestionsLoading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        activitiesLoad: (data) => dispatch(actions.activitiesLoad(data)),
        activitiesAdd: (index) => dispatch(actions.activitiesAdd(index)),
        activitiesSubtract: (index) => dispatch(actions.activitiesSubtract(index)),

        activitiesFocus: (index) => dispatch(actions.activitiesFocus(index)),
        activitiesUnfocus: (index) => dispatch(actions.activitiesUnfocus(index)),
        clearAllActivities: () => dispatch(actions.clearAllActivities()),
        suggestionsClear: () => dispatch(actions.suggestionsClear()),
        checkTrip: () => dispatch(actions.checkTrip()),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ActivitySearch);

