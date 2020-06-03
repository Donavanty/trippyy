// Basic Imports
import React, { Component, Fragment } from "react";
// -------------------------------------------------------------------------

//Imports needed for redux
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
// -------------------------------------------------------------------------


class ActivityList extends Component{

    state = {
    }
    componentDidMount() {

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