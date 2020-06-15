// Basic Imports
import React, { Component, Fragment } from "react";
// -------------------------------------------------------------------------

//Imports needed for redux
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
// -------------------------------------------------------------------------

import "./CSS/SelectedActivityList.css";

class SelectedActivityList extends Component{
    componentDidMount() {
    }

    render() {
        return (
        	<div id="selectedActivityList">
        		{
        			this.props.trip["activitiesAdded"].map( (value, index) => <p key={index}> {value.name} </p>)
        		}
        	</div>);
    }
}

const mapStateToProps = (state) => {
    return {
        trip: state.trip,
    }
}

const mapDispatchToProps = dispatch => {
    return {
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SelectedActivityList);