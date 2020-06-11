// Basic Imports
import React, { Component, Fragment } from "react";
// -------------------------------------------------------------------------

//Imports needed for redux
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
// -------------------------------------------------------------------------

import axios from "axios";
import { Spinner } from 'react-bootstrap';
import "./CSS/ActivityList.css";
import Activity from './Activity'

const API_KEY = "AIzaSyDyb0_iNF_gpoxydk5Vd8IpWj1Hy1Tp5Vc"


class ActivityList extends Component{

    state = {
        activities: []
    }

    convertSpaceToPlus(text) {
        for (let i = 0; i < text.length; i++) {
            text = text.replace(" ", "+")  
        }
        return text
    }

    activityClickHandler = (index) => {
        this.props.activitiesAdded(index);
    }

    componentDidMount() {
        // Data parameters as such: 
        // for api/TextSearch/ - key: API_KEY, query: text query
        // for api/BoundedTextSearch/ - key: API_KEY, query: text query, lat: lat of center, lng: lng of center, radius: radius of map
        // for api/NextKeySearch/ - key: API_KEY, next_page_token: next page token
        const data = {
            key: API_KEY,
            query: this.convertSpaceToPlus(JSON.parse(localStorage.trip)["country"]) + "+places+of+interest"
        }

        // Retrieves Singapore places of interest.
        this.props.activitiesLoaded(data);
    }

    render() {
        return (
            <div id="activityList">
                    
                    { this.props.activitiesLoading ?
                     
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner> 

                        : 

                        this.props.activitiesShown.map((value,index) => <Activity key ={index} value={value} index={index} activityClickHandler={this.activityClickHandler}/>)

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
        activitiesLoading: state.activitiesLoading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        checkedTrip: () => dispatch(actions.checkedTrip()),
        mapBoundsChanged: (bounds) => dispatch(actions.mapBoundsChanged(bounds)),
        activitiesLoaded: (data) => dispatch(actions.activitiesLoaded(data)),
        activitiesAdded: (index) => dispatch(actions.activitiesAdded(index)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ActivityList);