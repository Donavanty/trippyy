// Basic Imports
import React, { Component, Fragment } from "react";
// -------------------------------------------------------------------------

//Imports needed for redux
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
// -------------------------------------------------------------------------

import axios from "axios"
import { Button , Spinner} from 'react-bootstrap'
import "./CSS/SelectedActivityList.css";
import Popup from "reactjs-popup";
import { Link } from 'react-router-dom';

class SelectedActivityList extends Component{
    componentDidMount() {
    }

    state = {
    }

    getItinerary = () => {
        const data = {
            lengthOfTrip: 5,
            activitiesAdded: this.props.trip.activitiesAdded
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
            	<div id="selectedActivityList">
            		{
            			this.props.trip["activitiesAdded"].map( (value, index) => <p key={index}> {value.name} </p>)
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