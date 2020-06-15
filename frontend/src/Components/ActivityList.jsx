// Basic Imports
import React, { Component, Fragment } from "react";
// -------------------------------------------------------------------------

//Imports needed for redux
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
// -------------------------------------------------------------------------

import ReactPullToRefresh from 'react-pull-to-refresh'
import axios from "axios";
import { Spinner ,ButtonGroup , Button} from 'react-bootstrap';
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
            this.props.activitiesAdd(index);
    }

    componentDidMount() {
        // Data parameters as such: 
        // for api/TextSearch/ - key: API_KEY, query: text query
        // for api/BoundedTextSearch/ - key: API_KEY, query: text query, lat: lat of center, lng: lng of center, radius: radius of map
        // for api/NextKeySearch/ - key: API_KEY, next_page_token: next page token
        const data = {
            dataType: "TEXTSEARCH",
            key: API_KEY,
            query: this.convertSpaceToPlus(JSON.parse(localStorage.trip)["country"] + " points of interest")
        }
        // Retrieves Singapore places of interest.
        this.props.activitiesLoad(data);


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

    loadPrev = () => {
        this.refs.myscroll.scrollTop = 0;
        if (!this.props.isFirstPage) {
            const data = {
                dataType: "GOPREV",
            }
            this.props.activitiesLoad(data);
        }

    }

    changeCategory = (event) => {
        if (event.target.value == "general") {
            const data = {
                dataType: "TEXTSEARCH",
                key: API_KEY,
                query: this.convertSpaceToPlus(JSON.parse(localStorage.trip)["country"] + " points of interest")
            }
            // Retrieves Singapore places of interest.
            this.props.activitiesLoad(data);
        } else {
            const data = {
                dataType: "TEXTSEARCH",
                key: API_KEY,
                query: this.convertSpaceToPlus(JSON.parse(localStorage.trip)["country"] + " " + event.target.value + " attractions")
            }
            console.log(data.query)
            this.props.activitiesLoad(data);
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

                      <Button variant="info" className="customButton" onClick={this.changeCategory} value="general">General</Button>
                      <Button variant="info" className="customButton" onClick={this.changeCategory} value="Food">Food</Button>
                      <Button variant="info" className="customButton" onClick={this.changeCategory} value="Outdoor">Outdoors</Button>
                      <Button variant="info" className="customButton" onClick={this.changeCategory} value="Art & Culture">Art & Culture</Button>
                      <Button variant="info" className="customButton" onClick={this.changeCategory} value="Beaches">Beaches</Button>
                      <Button variant="info" className="customButton" onClick={this.changeCategory} value="Museums">Museums</Button>
                      <Button variant="info" className="customButton" onClick={this.changeCategory} value="Amusement park">Amusement Parks</Button>
                      <Button variant="info" className="customButton" onClick={this.changeCategory} value="Local Favorite">Local Favorites</Button>
                    {
                        (!this.props.isFirstPage) &&
                            <button onClick = {this.loadPrev}> Scroll to Prev Page </button>
                    }

                    {this.props.activitiesShown.currentList.map((value,index) => 
                        <Activity 
                        key={index} 
                        value={value} 
                        displayIndex={index + this.props.activitiesShown.firstActivityCounter} 
                        activityClickHandler={this.activityClickHandler}
                        index={index}
                        />)
                    }

                    {
                        this.props.isLastPage ?
                            <div> No more! Try changing category or moving the map </div>
                        :
                            <button onClick = {this.loadNext}> Scroll to Next Page </button>
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
        isLastPage: (!state.activitiesShown.hasNextPageLoaded) && (state.activitiesShown.nextPageToken == -1),
        isFirstPage: state.activitiesShown.pageNumber == 0,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        checkTrip: () => dispatch(actions.checkTrip()),
        mapBoundsChange: (bounds) => dispatch(actions.mapBoundsChange(bounds)),
        activitiesLoad: (data) => dispatch(actions.activitiesLoad(data)),
        activitiesAdd: (index) => dispatch(actions.activitiesAdd(index)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ActivityList);