// Basic Imports
import React, { Component, Fragment } from "react";
// -------------------------------------------------------------------------

//Imports needed for redux
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
// -------------------------------------------------------------------------

import { Spinner , Button, Dropdown} from 'react-bootstrap';
import "./CSS/ActivityList.css";
import Activity from './Activity'

const API_KEY = "AIzaSyDyb0_iNF_gpoxydk5Vd8IpWj1Hy1Tp5Vc"



/**
 * Component, renders a list of activities.
 * @memberof Component
 * @param {Component} Activity
 * @param {ReduxAction} activitiesLoad: to load activities from Google API
 * @param {ReduxAction} activitiesAdd: to update redux state when adding an activity to the list of selected activities upon selection
 * @param {ReduxState} map: Redux object with map information (e.g. lng/lat of center, and bounds)
 * @param {ReduxAction} activitiesShown: Redux object with information about the list of activities currently rendered
 * @returns Rendered list of activities
 */
class ActivityList extends Component{
    state = {
        category : "General",
        localLoading: false,
    }

    convertSpaceToPlus(text) {
        for (let i = 0; i < text.length; i++) {
            text = text.replace(" ", "+")  
        }
        return text
    } 

    activityClickHandlerToAdd = (index) => {
            this.props.activitiesAdd(index);
    }

    activityClickHandlerToSubtract = (index) => {
            this.props.activitiesSubtract(index);
    }

    componentDidMount() {
        // Data parameters as such: 
        // for api/TextSearch/ - key: API_KEY, query: text query
        // for api/BoundedTextSearch/ - key: API_KEY, query: text query, lat: lat of center, lng: lng of center, radius: radius of map
        // for api/NextKeySearch/ - key: API_KEY, next_page_token: next page token

        if (localStorage.trip !== undefined) {
            const trip = JSON.parse(localStorage.trip)
            const data = {
                dataType: "BOUNDEDTEXTSEARCH",
                key: API_KEY,
                query: this.convertSpaceToPlus(trip["country"] + " points of interest"),
                category: "General",
                lat: trip["lat"],
                lng: trip["lng"],
                radius: trip["radius"],
            }
            
            if (this.props.activitiesShown.currentList.length === 0) {
            // Retrieves Singapore places of interest.
            this.props.activitiesLoad(data);
            }
        }
        
        // Use this if were to implement infinite scrolling instead.
        // var timeout = null;
        // this.refs.myscroll.addEventListener("scroll", () => {
        //     // timeout = setTimeout( () => console.log("hey"), 500);
        //     const endHeight = this.refs.myscroll.scrollHeight - this.refs.myscroll.clientHeight
            
        //     if (this.refs.myscroll.scrollTop == 0) {
        //         // this.loadPrev(); when the component mounts it will auto call previous :-()
        //     } else if (this.refs.myscroll.scrollTop >= endHeight) {
        //         this.loadNext();
        //     }

        // });
    }

    /**
    * Called upon pressing the next page button.
    * Function to load next page of activities. If next page was loaded before, call
    * redux-action (activitiesLoad) with "GONEXT" parameter to retrieve next page, else
    * call with "NEXTKEYSEARCH" to retrieve next page from calling Google API.
    * @param {ReduxAction} activitiesLoad: to load activities from Google API
    */
    loadNext = () => {
        this.refs.myscroll.scrollTop = 0;
        if (!this.props.isLastPage) {
            if (this.props.activitiesShown.hasNextPageLoaded) {
                const data = {
                    dataType: "GONEXT",
                    pageNumber: this.props.activitiesShown.pageNumber
                }
                this.props.activitiesLoad(data);
                return;
            } else {
                const data = {
                    dataType: "NEXTKEYSEARCH",
                    key: API_KEY,
                    next_page_token: this.props.activitiesShown.nextPageToken,
                }
                this.props.activitiesLoad(data);
                return;
            }
        } 
    }

    /**
    * Called upon pressing the previous page button.
    * Function to load prev page of activities. Call redux-action (activitiesLoad) with
    * "GOPREV" parameter to retrieve activities from prev page.
    * @param {ReduxAction} activitiesLoad: to load activities from Google API
    */
    loadPrev = () => {
        this.refs.myscroll.scrollTop = 0;
        if (!this.props.isFirstPage) {
            const data = {
                dataType: "GOPREV",
            }
            this.props.activitiesLoad(data);
        }

    }

    /**
    * Called upon pressing any of the category buttons to change category.
    * Function to load a new category of activities. Call redux-action (activitiesLoad) with
    * "TEXTSEARCH" parameter to retrieve activities from Google API with new category.
    * @param {ReduxAction} activitiesLoad: to load activities from Google API
    */
    changeCategory = (category) => {
        const trip = JSON.parse(localStorage.trip);
        this.setState({category: category})
        if (category === "General") {
            const data = {
                dataType: "BOUNDEDTEXTSEARCH",
                key: API_KEY,
                query: this.convertSpaceToPlus(trip["country"] + " points of interest"),
                category: "General",
                lat: trip["lat"],
                lng: trip["lng"],
                radius: trip["radius"],
            }
            this.props.activitiesLoad(data);
        
        } else {
            const data = {
                dataType: "BOUNDEDTEXTSEARCH",
                key: API_KEY,
                query: this.convertSpaceToPlus(category + " attractions"),
                category: category,
                lat: trip["lat"],
                lng: trip["lng"],
                radius: trip["radius"],
            }

            // Retrieves Singapore places of interest.
            this.props.activitiesLoad(data);
        }
    }



    onMouseEnter = (index) => {
        this.props.activitiesFocus(index);
    }

    onMouseLeave = (index)  => {
        this.props.activitiesUnfocus(index);
    }

    //Category Buttons: Buttons change to grey ("secondary") when they are clicked, 
    //and remain turquoise ("info") when they are not.
    render() {
        return (
            <div id="activityList" ref = "myscroll">
            { this.props.activitiesLoading ?
                <div className="loadingBox">
                    <p> Getting your activities, hang tight! </p>
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </div> 

                : 
                <Fragment>

                    <div className="dropdownBox">
                        <p className="filterText"> Filter: </p>
                        <Dropdown>
                          <Dropdown.Toggle className="filterButton">
                                {this.state.category}
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                              <Dropdown.Item className="customButton" onClick={() => this.changeCategory("General")} value="General"
                                variant={"General" === this.props.activitiesShown.currentCategory ? "secondary" : "info"}>General</Dropdown.Item>
                              <Dropdown.Item className="customButton" onClick={() => this.changeCategory("Food")} value="Food"
                                variant={"Food" === this.props.activitiesShown.currentCategory ? "secondary" : "info"}>Food</Dropdown.Item>
                              <Dropdown.Item className="customButton" onClick={() => this.changeCategory("Outdoors")} value="Outdoors"
                                variant={"Outdoors" === this.props.activitiesShown.currentCategory ? "secondary" : "info"}>Outdoors</Dropdown.Item>
                              <Dropdown.Item className="customButton" onClick={() => this.changeCategory("Art & Culture")} value="Art & Culture"
                                variant={"Art & Culture" === this.props.activitiesShown.currentCategory ? "secondary" : "info"}>Art & Culture</Dropdown.Item>
                              <Dropdown.Item className="customButton" onClick={() => this.changeCategory("Beaches")} value="Beaches"
                                variant={"Beaches" === this.props.activitiesShown.currentCategory ? "secondary" : "info"}>Beaches</Dropdown.Item>
                              <Dropdown.Item className="customButton" onClick={() => this.changeCategory("Museums")} value="Museums"
                                variant={"Museums" === this.props.activitiesShown.currentCategory ? "secondary" : "info"}>Museums</Dropdown.Item>
                              <Dropdown.Item className="customButton" onClick={() => this.changeCategory("Amusement Parks")} value="Amusement Parks"
                                variant={"Amusement Parks" === this.props.activitiesShown.currentCategory ? "secondary" : "info"}>Amusement Parks</Dropdown.Item>
                              <Dropdown.Item className="customButton" onClick={() => this.changeCategory("Local Favourites")} value="Local Favourites"
                                variant={"Local Favourites" === this.props.activitiesShown.currentCategory ? "secondary" : "info"}>Local Favourites</Dropdown.Item>

                          </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    {this.props.activitiesShown.currentList.map((value,index) => 
                        <Activity
                        key={index} 
                        value={value} 
                        displayIndex={index + this.props.activitiesShown.firstActivityCounter} 
                        activityClickHandlerToAdd={this.activityClickHandlerToAdd}
                        activityClickHandlerToSubtract={this.activityClickHandlerToSubtract}
                        index={index}
                        onMouseEnter={this.onMouseEnter}
                        onMouseLeave={this.onMouseLeave}
                        />)
                    
                    }

                    <div className="pageButtonsBox">
                        {
                            (!this.props.isFirstPage) &&
                                <Button id="prevPageButton" variant="primary" className="customButton" onClick ={this.loadPrev}> Prev </Button>
                        }

                        {
                            this.props.isLastPage ?
                                <div> No more! Try changing category or moving the map </div>
                            :
                                <Button variant="primary" className="customButton" id="nextPageButton" onClick ={this.loadNext}> Next </Button>
                        }
                    </div>
                </Fragment>
            }
            </div>
            );
    }
}

const mapStateToProps = (state) => {
    return {
        trip: state.trip,
        map: state.map,
        activitiesShown: state.activitiesShown,
        activitiesLoading: state.activitiesLoading,
        isLastPage: (!state.activitiesShown.hasNextPageLoaded) && (state.activitiesShown.nextPageToken === -1),
        isFirstPage: state.activitiesShown.pageNumber === 0,

        focusedActivity: state.focusedActivity
    }
}

const mapDispatchToProps = dispatch => {
    return {
        activitiesLoad: (data) => dispatch(actions.activitiesLoad(data)),
        activitiesAdd: (index) => dispatch(actions.activitiesAdd(index)),
        activitiesSubtract: (index) => dispatch(actions.activitiesSubtract(index)),

        activitiesFocus: (index) => dispatch(actions.activitiesFocus(index)),
        activitiesUnfocus: (index) => dispatch(actions.activitiesUnfocus(index)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ActivityList);