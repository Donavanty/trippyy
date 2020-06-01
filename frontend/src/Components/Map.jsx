// Basic Imports
import React, { Component, Fragment } from "react";
// -------------------------------------------------------------------------

//Imports needed for redux
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
// -------------------------------------------------------------------------
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker
} from "react-google-maps";


class Map extends Component{

    state = {
        trip: null,
        startLat: 0,
        startLng: 0
    }
    componentDidMount() {
        if (localStorage.trip !== undefined) {
            this.setState({
                startLng: JSON.parse(localStorage.trip)["lng"],
                startLat: JSON.parse(localStorage.trip)["lat"],
            })
        }
    }

    static defaultProps = {
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyB-tj53yeTQiKnUmi_Jr2a7caz5RJVY60Y&v=3.exp&libraries=geometry,drawing,places",
    }

    //First load, thus need to use local storage.
    WrappedMap = withScriptjs(withGoogleMap(props =>
        <GoogleMap
          defaultZoom={12}
          defaultCenter={{ lat: this.state.startLat, lng: this.state.startLng }}
        >
            {props.children}
        </GoogleMap>
      ));



    render() {
        return (
            <Fragment>
                <this.WrappedMap
                    googleMapURL={this.props.googleMapURL}
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `600px` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    center= {{ lat: 40.730610, lng:  -73.935242 }} 
                >
                    <Marker
                        position={{ lat: this.props.trip["lat"], lng: this.props.trip["lng"] }}
                    />

                </this.WrappedMap>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        trip: state.trip
    }
}

const mapDispatchToProps = dispatch => {
    return {
        checkedTrip: () => dispatch(actions.checkedTrip()),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Map);