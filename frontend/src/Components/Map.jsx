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
    Marker,
    InfoWindow
} from "react-google-maps";

let ref


// Given bounds, gets radius.
function getBoundsRadius(bounds){
    // r = radius of the earth in km
    var r = 6378.8
    // degrees to radians (divide by 57.2958)
    var ne_lat = bounds.getNorthEast().lat() / 57.2958
    var ne_lng = bounds.getNorthEast().lng() / 57.2958
    var c_lat = bounds.getCenter().lat() / 57.2958
    var c_lng = bounds.getCenter().lng() / 57.2958
    // distance = circle radius from center to Northeast corner of bounds
    var r_km = r * Math.acos(
    Math.sin(c_lat) * Math.sin(ne_lat) + 
    Math.cos(c_lat) * Math.cos(ne_lat) * Math.cos(ne_lng - c_lng)
    )
    return r_km *1000 // radius in meters
}

/**
 * Component, renders Google Map.
 * @memberof Component
 * @param {ReduxAction} mapBoundsChange: to update redux state object (Map) when changing Google Map bounds with new bounds
 * @param {ReduxState} trip: Contains information about current trip (e.g. trip name/date, and list of current activities added)
 * @param {ReduxState} map: Contains map information (e.g. lng/lat of center, and bounds)
 * @param {ReduxAction} activitiesShown: Contains information about the list of activities currently rendered
 * @returns Rendered Google Map with Markers of activities shown, and activities added.
 */
class Map extends Component{

    state = {
        trip: null,

        center: 0,
        startCenter: 0,
        zoom: 0,
        startZoom: 0,

        startBounds: null,

        showInfoWindow: false,
        currentInfoWindow: 0,
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

    /**
     * Called upon moving the map.
     * Updates the new bounds of the map to redux-state map.
     * @param {mapBoundsChange} Redux-action: to update redux state object (Map) when changing Google Map bounds with new bounds
     */
    uponBoundsChanged = () => {
        const newBounds = ref.getBounds()
       
        if (this.state.test === null) {
            this.setState({test: newBounds})
        }
        const bounds = {
            "upper": {
                "lat": newBounds["Za"]["j"],
                "lng": newBounds["Ua"]["j"],
            },

            "lower": {
                "lat": newBounds["Za"]["i"],
                "lng": newBounds["Ua"]["i"],
            },

            "center": ref.getCenter(),

            "radius": getBoundsRadius(newBounds),
        }

        //Updates new bounds to Redux
        this.props.mapBoundsChange(bounds);

        //Updates zoom and center to local state.
        this.setState({zoom: ref.getZoom()});
        this.setState({center: ref.getCenter()});

    }

    /**
     * Called upon clicking button to reset map view to starting stage.
     * Zooms out the map to default stage. 
     */
    mapReset = () => {
        //When fitbounds is called, zoom will be set to StartZoom - 1
        ref.fitBounds(this.state.startBounds);
        this.uponBoundsChanged();

    }

    /**
     * Called upon first load of map.
     * Updates local state of bounds, and subsequently the redux-state by calling uponBoundsChanged
     */
    mapLoaded = () => {        
        if (this.state.startBounds === null) {
            this.setState({startBounds: ref.getBounds()})
        }
        this.uponBoundsChanged();
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

    markerClickHandler = (event, index) => {
        this.setState({showInfoWindow: true})
        this.setState({currentInfoWindow: index})
    }

    render() {
        return (
            <Fragment>
                <this.WrappedMap
                    googleMapURL={this.props.googleMapURL}
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `92vh`, width: `50vw` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                >
                 
                    { 
                        this.props.activitiesShown.currentList.map((value,index) => 
                            (!value.added) && <Marker key={index} position={value.geometry.location} label={(this.props.activitiesShown.firstActivityCounter + index + 1).toString()}
                                    onClick={(event) => this.markerClickHandler(event, index)}>

                                    {this.state.showInfoWindow && (this.state.currentInfoWindow === index) && 
                                        (<InfoWindow onCloseClick= {() => this.setState({showInfoWindow: false})}> 
                                            <span>{value.name}</span> 
                                        </InfoWindow> )
                                    }

                                </Marker> )

                    }

                    {
                        this.props.trip.activitiesAdded.map((value,index) => 
                            <Marker key={index} 
                                position={value.geometry.location} 
                                label={(this.props.activitiesShown.firstActivityCounter + index + 1).toString()}
                                onClick={(event) => this.markerClickHandler(event, index)} 
                                icon = {{url:"http://maps.google.com/mapfiles/ms/icons/blue.png",
                                        scaledSize: new window.google.maps.Size(44, 44), 
                                        labelOrigin: new window.google.maps.Point(22, 15), }}>
                                
                                {this.state.showInfoWindow && (this.state.currentInfoWindow === index) && 
                                    (<InfoWindow onCloseClick= {() => this.setState({showInfoWindow: false})}> 
                                        <span>{value.name}</span> 
                                    </InfoWindow> )
                                }

                            </Marker> )

                    }

                </this.WrappedMap>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        trip: state.trip,
        map: state.map,
        activitiesShown: state.activitiesShown
    }
}

const mapDispatchToProps = dispatch => {
    return {
        mapBoundsChange: (bounds) => dispatch(actions.mapBoundsChange(bounds)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Map);