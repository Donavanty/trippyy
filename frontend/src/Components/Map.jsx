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
    
} from "react-google-maps";
import * as utilities from '../Utilities.js'

import Penguin from '../assets/penguinIcon.png'
import PenguinStanding from '../assets/penguinStanding.png'
import PenguinAdded from '../assets/penguinAdded.png'
import PenguinAddedStanding from '../assets/penguinAddedStanding.png'

let ref

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
        firstLoad: false,

        center: 0,
        startCenter: 0,
        zoom: 0,
        startZoom: 0,

        startBounds: null,

        showInfoWindow: false,
        currentInfoWindow: 0,
        directions: null,

    }
    componentDidMount() {

        if (localStorage.trip !== undefined) {
            this.setState({
                startCenter: JSON.parse(localStorage.trip),
                center: JSON.parse(localStorage.trip),
                startZoom: 10,
                zoom: 10,
            })      
        }
    }

    // If bounds in props was changed, update bounds accordingly.
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.map && this.props.map && ref) {
            if (prevProps.map.bounds.newBounds !== this.props.map.bounds.newBounds) {
                ref.fitBounds(this.props.map.bounds.newBounds);
            }
        }
    }

    componentWillUnmount() {
        this.setState({firstLoad: false})
    }

    /**
     * Called upon moving the map.
     * Updates the new bounds of the map to redux-state map.
     * @param {mapBoundsChange} Redux-action: to update redux state object (Map) when changing Google Map bounds with new bounds
     */
    uponBoundsChanged = () => {
        if (ref.getBounds()) {
            const newBounds = ref.getBounds()
            const bounds = {
                "newBounds" : this.props.map.bounds.newBounds,

                "center": ref.getCenter(),

                "radius": utilities.getBoundsRadius(newBounds),
            }
            //Updates new bounds to Redux
            this.props.mapBoundsChange(bounds);
            //Updates zoom and center to local state.
            // this.setState({zoom: ref.getZoom()});
            // this.setState({center: ref.getCenter()});
        }

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
        if (!this.state.firstLoad) {

            const newzoom = ref.getZoom() 

            this.setState({
                startZoom: newzoom,
                zoom: newzoom,
                firstLoad: true,
            })

            this.uponBoundsChanged();
        }
        
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



    markerClickHandler = (event, index) => {
        this.setState({showInfoWindow: true})
        this.setState({currentInfoWindow: index})
    }

    render() {        
        return (
            <Fragment>
                <this.WrappedMap
                    googleMapURL={window.google}
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `92vh`, width: `50vw` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                >


                    { 
                        this.props.browsingToggle && this.props.activitiesShown.currentList.map((value,index) => 
                            (!value.added) && ( 
                                (!(value === this.props.focusedActivity)) 
                                
                                ?

                                    <Marker 
                                        key={index} 
                                        position={value.geometry.location} 
                                        onClick={(event) => this.markerClickHandler(event, index)}
                                        icon = {{
                                            url: Penguin,
                                            scaledSize: new window.google.maps.Size(44, 44),
                                            labelOrigin: new window.google.maps.Point(20, 28), 
                                        }}
                                        label = {{
                                            text: (this.props.activitiesShown.firstActivityCounter + index + 1).toString(),
                                            fontSize:"10px",
                                            fontFamily:"Montserrat"}}

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
                                        onClick={(event) => this.markerClickHandler(event, index)} 
                                        label = {{
                                            text: (this.props.activitiesShown.firstActivityCounter + index + 1).toString(),
                                            fontSize:"14px",
                                            fontFamily:"Montserrat"}}
                                        icon = {{
                                            url: PenguinStanding,
                                            scaledSize: new window.google.maps.Size(44, 60), 
                                            labelOrigin: new window.google.maps.Point(22, 15), 
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
                        !this.props.browsingToggle && this.props.searchActivitiesShown.map( (value,index) => (
                            (!value.added) && (

                            (value.name !== this.props.focusedActivity.name) ?
                            
                                <Marker
                                    position={value.geometry.location}
                                    label = {{
                                            text: (index+1).toString(),
                                            fontSize:"12px",
                                            fontFamily:"Montserrat"}}
                                    onClick={(event) => this.markerClickHandler(event, 0)}
                                    icon = {{
                                        url: Penguin,
                                        scaledSize: new window.google.maps.Size(44, 44),
                                        labelOrigin: new window.google.maps.Point(20, 28), 
                                    }}
                                >

                                    {this.state.showInfoWindow && (this.state.currentInfoWindow === 0) && 
                                        (<InfoWindow onCloseClick= {() => this.setState({showInfoWindow: false})}> 
                                            <span>{value.name}</span> 
                                        </InfoWindow> )
                                    }
                                </Marker>
                            :
                                    <Marker 
                                        key={index} 
                                        position={value.geometry.location} 
                                        onClick={(event) => this.markerClickHandler(event, index)} 
                                        label = {{
                                            text: (index + 1).toString(),
                                            fontSize:"14px",
                                            fontFamily:"Montserrat"}}
                                        icon = {{
                                            url: PenguinStanding,
                                            scaledSize: new window.google.maps.Size(44, 60), 
                                            labelOrigin: new window.google.maps.Point(22, 15), 
                                        }}
                                    >

                                        {this.state.showInfoWindow && (this.state.currentInfoWindow === index) && 
                                            (<InfoWindow onCloseClick= {() => this.setState({showInfoWindow: false})}> 
                                                <span>{value.name}</span> 
                                            </InfoWindow> )
                                        }

                                    </Marker> 

                            ))
                        )
                    }

                    {
                        this.props.trip.activitiesAdded.map((value,index) => 
                            (!(value["name"] === this.props.focusedActivity["name"]) ?
                                <Marker 
                                    key={index} 
                                    position={value.geometry.location} 
                                    label = {{
                                        text: "A" + (index + 1).toString(),
                                        fontSize:"12px",
                                        fontFamily:"Montserrat"}}
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
                                    label = {{
                                        text: "A" + (index + 1).toString(),
                                        fontSize:"14px",
                                        fontFamily:"Montserrat"}}
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
        activitiesLoading: state.activitiesLoading,
        focusedActivity: state.focusedActivity,
        browsingToggle: state.browsingToggle,
        searchActivitiesShown: state.searchActivitiesShown,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        mapBoundsChange: (bounds) => dispatch(actions.mapBoundsChange(bounds)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Map);