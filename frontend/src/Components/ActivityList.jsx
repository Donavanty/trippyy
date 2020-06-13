// Basic Imports
import React, { Component, Fragment } from "react";
// -------------------------------------------------------------------------

//Imports needed for redux
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
// -------------------------------------------------------------------------

import ReactPullToRefresh from 'react-pull-to-refresh'
import axios from "axios";
import { Spinner } from 'react-bootstrap';
import "./CSS/ActivityList.css";
import Activity from './Activity'
import InfiniteScroll from 'react-infinite-scroller';

const API_KEY = "AIzaSyDyb0_iNF_gpoxydk5Vd8IpWj1Hy1Tp5Vc"


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

    activityClickHandler = (index) => {
            this.props.activitiesAdded(index);
    }

    componentDidMount() {
        // Data parameters as such: 
        // for api/TextSearch/ - key: API_KEY, query: text query
        // for api/BoundedTextSearch/ - key: API_KEY, query: text query, lat: lat of center, lng: lng of center, radius: radius of map
        // for api/NextKeySearch/ - key: API_KEY, next_page_token: next page token
        const data = {
            dataType: "TEXTSEARCH",
            key: API_KEY,
            query: this.convertSpaceToPlus(JSON.parse(localStorage.trip)["country"]) + "+points+of+interest"
        }
        // Retrieves Singapore places of interest.
        this.props.activitiesLoaded(data);


        var timeout = null;
        this.refs.myscroll.addEventListener("scroll", () => {
            // timeout = setTimeout( () => console.log("hey"), 500);
            const endHeight = this.refs.myscroll.scrollHeight - this.refs.myscroll.clientHeight
            
            if (this.refs.myscroll.scrollTop == 0) {
                console.log( "Go prev page")
            } else if (this.refs.myscroll.scrollTop >= endHeight) {
                this.loadMore();
            }

        });
    

    }

    loadMore() {
        if (!this.props.isLastPage) {
            const data = {
                dataType: "NEXTKEYSEARCH",
                key: API_KEY,
                next_page_token: this.props.nextPageToken,
            }
            this.props.activitiesLoaded(data);
        } 
    }
    render() {
        return (
            <div id="activityList" ref="myscroll">
            { this.props.activitiesLoading ?

                <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
                </Spinner> 

                : 
                <Fragment>
                <div id="prevPage"> Scroll to Prev Page </div>
                {this.props.activitiesShown.map((value,index) => <Activity key={index} value={value} index={index} activityClickHandler={this.activityClickHandler}/>)}
                {this.props.isLastPage 
                    ? 
                        <div> No more! Try changing category or moving the map </div>
                    :
                        <div id="nextPage"> Scroll to Next Page </div>
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
        isLastPage: state.nextPageToken == -1,
        nextPageToken: state.nextPageToken
    }
}

const mapDispatchToProps = dispatch => {
    return {
        checkedTrip: () => dispatch(actions.checkedTrip()),
        mapBoundsChanged: (bounds) => dispatch(actions.mapBoundsChanged(bounds)),
        activitiesLoaded: (data) => dispatch(actions.activitiesLoaded(data)),
        activitiesAdded: (index) => dispatch(actions.activitiesAdded(index)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ActivityList);