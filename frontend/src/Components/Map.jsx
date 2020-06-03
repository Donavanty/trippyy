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

let ref

class Map extends Component{

    state = {
        trip: null,

        center: null,
        startCenter: null,
        zoom: 0,
        startZoom: 0,

        startBounds: null,
    }
    componentDidMount() {
        if (localStorage.trip !== undefined) {
            this.setState({
                startCenter: JSON.parse(localStorage.trip),
                center: JSON.parse(localStorage.trip),
                startZoom: 12,
                zoom: 12
            })
        }
    }

    static defaultProps = {
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyB-tj53yeTQiKnUmi_Jr2a7caz5RJVY60Y&v=3.exp&libraries=geometry,drawing,places",
    }

    uponBoundsChanged = () => {
        const newBounds = ref.getBounds()
        if (this.state.test === null) {
            this.setState({test: newBounds})
        }
        const bounds = {
            "upper": {
                "lat": newBounds["Ya"]["j"],
                "lng": newBounds["Ua"]["j"],
            },

            "lower": {
                "lat": newBounds["Ya"]["i"],
                "lng": newBounds["Ua"]["i"],
            }
        }

        //Updates new bounds to Redux
        this.props.mapBoundsChanged(bounds);

        //Updates zoom and center to local state.
        this.setState({zoom: ref.getZoom()});
        this.setState({center: ref.getCenter()});

    }

    mapReset = () => {
        //When fitbounds is called, zoom will be set to StartZoom - 1
        ref.fitBounds(this.state.startBounds);
        this.uponBoundsChanged();

    }

    mapLoaded = () => {
        if (this.state.startBounds === null) {
            this.setState({startBounds: ref.getBounds()})
        }
    }
    //First load, thus need to use local storage.
    WrappedMap = withScriptjs(withGoogleMap(props =>
        <GoogleMap
          // Binds GoogleMap to ref, such that in getting info from maps will be easier
          ref={(mapRef) => ref = mapRef}
          
          defaultZoom={this.state.startZoom}
          defaultCenter={this.state.startCenter}
          
          // Custom add-ons to props
          onZoomChanged = {this.uponBoundsChanged}
          onDragEnd = {this.uponBoundsChanged}
          onTilesLoaded={this.mapLoaded}

          zoom = {this.state.zoom}
          center = {this.state.center}
        >
            {props.children}
        </GoogleMap>
      ));


    render() {
        return (
            <Fragment>
                <button onClick={this.mapReset}> Reset </button>

                <this.WrappedMap
                    googleMapURL={this.props.googleMapURL}
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `600px` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                >
                    <Marker
                        position = {{ lat: this.props.map["bounds"]["lower"]["lat"], lng: this.props.map["bounds"]["lower"]["lng"]}}
                    />

                </this.WrappedMap>
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
export default connect(mapStateToProps, mapDispatchToProps)(Map);