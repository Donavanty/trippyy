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
    InfoWindow,
    Polyline,
    
} from "react-google-maps";
import { Spinner } from 'react-bootstrap';
import PenguinAdded from '../assets/penguinAdded.png'
import PenguinAddedStanding from '../assets/penguinAddedStanding.png'
import PenguinRoute from '../assets/penguinRoute.png'
import PenguinRouteStanding from '../assets/penguinRouteStanding.png'

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
class ResultsMap extends Component{

    state = {
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

    mapIncludes = (value, focusedDay) => {
        for (var activity in focusedDay) {
            if (value["name"] === focusedDay[activity]["name"]) {
                return true;
            }
        }

        return false;
    }

                            // directions={value} 
                            // key={index}
                            // options={{
                            //     preserveViewport: true,
                            //     suppressMarkers: true,
                            // }}
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


            {
                this.props.trip.itiDirections && (this.props.trip.focusedDay !== -1) && this.props.trip.itiDirections[this.props.trip.focusedDay].map((value, index) => {
                    return (
                        <Polyline
                        key={index}
                        path={value.routes[0].overview_path}
                        geodesic={true}
                        options={{
                        strokeColor: "#008B8B",
                        strokeOpacity: 0.8,
                        strokeWeight: 5,
                        clickable: false
                        }}
                        />)
                })

            }
            {props.children}
        </GoogleMap>
      ));

    markerClickHandler = (event, index) => {
        this.setState({showInfoWindow: true})
        this.setState({currentInfoWindow: index})
    }

    render() {
        if (this.props.itineraryFocusDayLoading) {
            return (
                <div className="loadingBox">
                    <h1> Updating your routes! </h1>
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>

                </div>)
        }
        return (
            <Fragment>
                <this.WrappedMap
                    googleMapURL={window.google}
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `92.5vh`, width: `33vw` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                >

                    {
                        this.props.map.directions && 
                            <Polyline
                                path={this.props.map.directions.routes[0].overview_path}
                                geodesic={true}
                                options={{
                                strokeColor: "#008B8B",
                                strokeOpacity: 0.8,
                                strokeWeight: 5,
                                clickable: false
                            }}
                            />
                    }


                    {
                        (this.props.trip.focusedDay !== -1) && this.props.trip.itinerary[this.props.trip.focusedDay].map((value,index) => 
                            (value["name"]) &&

                                (!(value["name"] === this.props.focusedActivity["name"]) ?
                                    <Marker 
                                        key={index} 
                                        position={value.geometry.location} 
                                        label = {{
                                            text: (this.props.activitiesShown.firstActivityCounter + index + 1).toString(),
                                            fontSize:"12px",
                                            fontFamily:"Montserrat",
                                            fontColor:"white"}}
                                        onClick={(event) => this.markerClickHandler(event, index)} 
                                        icon = {{
                                            url: PenguinRoute,
                                            scaledSize: new window.google.maps.Size(36, 44), 
                                            labelOrigin: new window.google.maps.Point(16, 32), 
                                        }}
                                    >
                                    
                                    {this.state.showInfoWindow && (this.state.currentInfoWindow === index) && 
                                        (<InfoWindow onCloseClick= {() => this.setState({showInfoWindow: false})}> 
                                            <span>{value.name}</span> 
                                        </InfoWindow> )
                                    }

                                    </Marker> 
                                :
                                    <Marker 
                                        key={index} 
                                        position={value.geometry.location} 
                                        label = {{
                                            text: (index).toString(),
                                            fontSize:"12px",
                                            fontFamily:"Montserrat"}}
                                        onClick={(event) => this.markerClickHandler(event, index)} 
                                        icon = {{
                                            url: PenguinRouteStanding,
                                            scaledSize: new window.google.maps.Size(44, 44), 
                                            labelOrigin: new window.google.maps.Point(22, 30), 
                                        }}
                                    >
                                    
                                    {this.state.showInfoWindow && (this.state.currentInfoWindow === index) && 
                                        (<InfoWindow onCloseClick= {() => this.setState({showInfoWindow: false})}> 
                                            <span>{value.name}</span> 
                                        </InfoWindow> )
                                    }

                                    </Marker> 
                                    )

                        )

                    }

                   {
                        this.props.trip.activitiesAdded && this.props.trip.activitiesAdded.map((value,index) => 
                            !(this.mapIncludes(value, this.props.trip.itinerary[this.props.trip.focusedDay])) &&

                                (!(value["name"] === this.props.focusedActivity["name"]) ?
                                    <Marker 
                                        key={index} 
                                        position={value.geometry.location} 
                                        label={(index).toString()}
                                        onClick={(event) => this.markerClickHandler(event, index)} 
                                        icon = {{
                                            url: PenguinAdded,
                                            scaledSize: new window.google.maps.Size(44, 44), 
                                            labelOrigin: new window.google.maps.Point(22, 30), 
                                        }}
                                    >
                                    
                                    {this.state.showInfoWindow && (this.state.currentInfoWindow === index) && 
                                        (<InfoWindow onCloseClick= {() => this.setState({showInfoWindow: false})}> 
                                            <span>{value.name}</span> 
                                        </InfoWindow> )
                                    }

                                    </Marker> 
                                :
                                    <Marker 
                                        key={index} 
                                        position={value.geometry.location} 
                                        label={(index).toString()}
                                        onClick={(event) => this.markerClickHandler(event, index)} 
                                        icon = {{
                                            url:PenguinAddedStanding,
                                            scaledSize: new window.google.maps.Size(44, 60), 
                                            labelOrigin: new window.google.maps.Point(21, 13), 
                                        }}
                                    >
                                    
                                    {this.state.showInfoWindow && (this.state.currentInfoWindow === index) && 
                                        (<InfoWindow onCloseClick= {() => this.setState({showInfoWindow: false})}> 
                                            <span>{value.name}</span> 
                                        </InfoWindow> )
                                    }

                                    </Marker> 
                                    )

                        )

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
        activitiesShown: state.activitiesShown,
        focusedActivity: state.focusedActivity,
        itineraryFocusDayLoading: state.itineraryFocusDayLoading,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        mapBoundsChange: (bounds) => dispatch(actions.mapBoundsChange(bounds)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ResultsMap);