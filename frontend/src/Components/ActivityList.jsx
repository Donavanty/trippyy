// Basic Imports
import React, { Component, Fragment } from "react";
// -------------------------------------------------------------------------

//Imports needed for redux
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
// -------------------------------------------------------------------------

import axios from "axios";

const API_KEY = "AIzaSyDyb0_iNF_gpoxydk5Vd8IpWj1Hy1Tp5Vc"

class ActivityList extends Component{

    state = {
        activities: []
    }

    componentDidMount() {
        axios.get("https://maps.googleapis.com/maps/api/place/textsearch/xml?query=restaurants+in+Sydney&key="+API_KEY) 
          .then( (res) => {

            alert(res);
            console.log(res);
        }).catch( (error) => {
            alert(error);
        });
    }

    render() {
        return (
            <Fragment>
                <ul>
                    <li> Hello sir! </li>
                </ul>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        trip: state.trip,
        map: state.map
    }
}

const mapDispatchToProps = dispatch => {
    return {
        checkedTrip: () => dispatch(actions.checkedTrip()),
        mapBoundsChanged: (bounds) => dispatch(actions.mapBoundsChanged(bounds)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ActivityList);