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
        alert("Note: Current list of data is hard-coded to be Singapore, retrieving of data should be moved to redux store.")

        // Data parameters as such: 
        // for api/TextSearch/ - key: API_KEY, query: text query
        // for api/BoundedTextSearch/ - key: API_KEY, query: text query, lat: lat of center, lng: lng of center, radius: radius of map
        // for api/NextKeySearch/ - key: API_KEY, next_page_token: next page token
        const data = {
            key: API_KEY,
            query: "singapore+places+of+interest"
        }

        // Retrieves Singapore places of interest.
        axios.post("http://trippyy-backend.herokuapp.com/api/TextSearch/", data)
          .then( (res) => {
            console.log(res.data.results);
            this.setState({activities: res.data.results});
        }).catch( (error) => {
            alert(error);
        });
    }

    render() {
        return (
            <Fragment>
                <ul>
                    <li> Hello sir! </li>
                    { 
                        this.state.activities.map((value,index) => <li key={index}> {value.name} </li>)
                    }
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