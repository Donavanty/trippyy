// Basic Imports
import React, { Component, Fragment } from "react";
// -------------------------------------------------------------------------

//Imports needed for redux
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
// -------------------------------------------------------------------------

import { Spinner , Button} from 'react-bootstrap';
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
        activities: [],
        localLoading: false,
        items: 20,
        isScrolling: null,
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
            const data = {
                dataType: "TEXTSEARCH",
                key: API_KEY,
                query: this.convertSpaceToPlus(JSON.parse(localStorage.trip)["country"] + " points of interest"),
                category: "General",
            }
            
            // Retrieves Singapore places of interest.
            this.props.activitiesLoad(data);
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
    changeCategory = (event) => {
        if (event.target.value === "General") {
            const data = {
                dataType: "TEXTSEARCH",
                key: API_KEY,
                query: this.convertSpaceToPlus(JSON.parse(localStorage.trip)["country"] + " points of interest"),
                category: event.target.value,
            }
            // Retrieves Singapore places of interest.
            this.props.activitiesLoad(data);
            console.log("Previous Category: " + this.props.activitiesShown.currentCategory);
        
        } else {
            const data = {
                dataType: "TEXTSEARCH",
                key: API_KEY,
                query: this.convertSpaceToPlus(JSON.parse(localStorage.trip)["country"] + " " + event.target.value + " attractions"),
                category: event.target.value,
            }
            console.log(data.query);
            // Retrieves Singapore places of interest.
            this.props.activitiesLoad(data);
            console.log("Previous Category: " + this.props.activitiesShown.currentCategory);
        }
    }

    /**
    * Called upon pressing the Clear All button to clear all activities selected.
    * Calls the redux-action (activitiesSubtract) on particular selected activities, and redux-action (clearAllActivities).
    * @param {ReduxAction} activitiesSubtract: to subtract activities from the currentList array state, resulting in all activities in the ActivityList Component being unselected.
    * @param {ReduxAction} clearAllActivities: to clear all activities from the activitiesAdded array state, resulting in SelectedActivityList showing nothing.
    */
    clearAll = () => {
        if (this.props.trip.activitiesAdded.length !== 0) {
      
            const subtractAllSelectedActivities = () => {
                for (let j = 0; j < this.props.activitiesShown.currentList.length; j++) {
                    if (this.props.activitiesShown.currentList[j].added === true) {
                        this.props.activitiesSubtract(j);
                    }
                }
            }

            //Subtract current categories' activities
            subtractAllSelectedActivities();
            this.props.clearAllActivities();
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

                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner> 

                : 
                <Fragment>
                <div>
                    <Button className="customButton" onClick={this.clearAll} value="Reset"
                        variant="warning">Clear All</Button>
                    </div>
                      <Button className="customButton" onClick={this.changeCategory} value="General"
                        variant={"General" === this.props.activitiesShown.currentCategory ? "secondary" : "info"}>General</Button>
                      <Button className="customButton" onClick={this.changeCategory} value="Food"
                        variant={"Food" === this.props.activitiesShown.currentCategory ? "secondary" : "info"}>Food</Button>
                      <Button className="customButton" onClick={this.changeCategory} value="Outdoors"
                        variant={"Outdoors" === this.props.activitiesShown.currentCategory ? "secondary" : "info"}>Outdoors</Button>
                      <Button className="customButton" onClick={this.changeCategory} value="Art & Culture"
                        variant={"Art & Culture" === this.props.activitiesShown.currentCategory ? "secondary" : "info"}>Art & Culture</Button>
                      <Button className="customButton" onClick={this.changeCategory} value="Beaches"
                        variant={"Beaches" === this.props.activitiesShown.currentCategory ? "secondary" : "info"}>Beaches</Button>
                      <Button className="customButton" onClick={this.changeCategory} value="Museums"
                        variant={"Museums" === this.props.activitiesShown.currentCategory ? "secondary" : "info"}>Museums</Button>
                      <Button className="customButton" onClick={this.changeCategory} value="Amusement Parks"
                        variant={"Amusement Parks" === this.props.activitiesShown.currentCategory ? "secondary" : "info"}>Amusement Parks</Button>
                      <Button className="customButton" onClick={this.changeCategory} value="Local Favourites"
                        variant={"Local Favourites" === this.props.activitiesShown.currentCategory ? "secondary" : "info"}>Local Favourites</Button>
                    {
                        (!this.props.isFirstPage) &&
                            <Button id="prevPageButton" variant="primary" className="customButton" onClick ={this.loadPrev}> Scroll to Prev Page </Button>
                    }

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

                    {
                        this.props.isLastPage ?
                            <div> No more! Try changing category or moving the map </div>
                        :
                            <Button variant="primary" className="customButton" id="nextPageButton" onClick ={this.loadNext}> Scroll to Next Page </Button>
                    }
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
        clearAllActivities: () => dispatch(actions.clearAllActivities()),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ActivityList);