import * as actionTypes from './actionTypes';
import * as utilities from '../../Utilities.js'
import axios from 'axios';
// UNSPLASH hehe
import Unsplash, { toJson } from "unsplash-js";


import {updateObject} from '../utility';
const DATABASE_URL = "http://trippyy-backend.herokuapp.com/"
// const DATABASE_URL = "http://127.0.0.1:8000/"
const API_KEY = "AIzaSyDyb0_iNF_gpoxydk5Vd8IpWj1Hy1Tp5Vc"



/**
 *
 * Sends an action to reducer to change loading to true.
 * @memberof ReduxAction
 */
export const authStart = () => {
	return {
		type: actionTypes.AUTH_START
	}
}

/** 
* Sends an action to reducer to update REDUX token, username, userId upon login.
* @memberof ReduxAction
* @param {String} token: token of user account
* @param {String} username: username
* @param {String} userid: serial number of user
*/
export const authSuccess = (token, username, userId) => {
	return {
		token: token,
		type: actionTypes.AUTH_SUCCESS,
		username: username,
		userId: userId
	}
}

/** 
* Sends an action to alert an error.
* @memberof ReduxAction
* @param {Object} error: error
*/
export const authFail = (error) => {
	alert("Username or password is incorrect.");
	return {
		error: error,
		type: actionTypes.AUTH_FAIL
	}
}

/** 
* Called upon logout, removes everything in LOCALSTORAGE 
* @memberof ReduxAction
*/
export const logout = () => {
	localStorage.clear();
	return {
		type: actionTypes.AUTH_LOGOUT
	}
}

/** 
* Called during checking of authentication state, updates REDUX token, remove all USER attributes in LOCALSTORAGE
* @memberof ReduxAction
*/
export const notLoggedIn = () => {
	localStorage.removeItem('user');
	return {
		type: actionTypes.AUTH_LOGOUT
	}
}

/** 
* Called upon login, logins by checking with backend, updates USER attributes in LOCALSTORAGE, 
* and calls authSuccess or authFailed, depending on outcome.
* @memberof ReduxAction
* @param {String} username: username of user
* @param {String} password: password of user
*/
export const authLogin = (username, password) => {
	return dispatch => {
		dispatch(authStart());
		axios.post(DATABASE_URL + 'api/authenticate/', {
			username: username,
			password: password
		}).then(res => {
			const token = res.data.token;
			const userId = res.data.id;

			if (localStorage.trip) {
				let trip = JSON.parse(localStorage.trip)
				let data = {
					destination: trip["country"],
					tripName: "Trip to " + trip["country"] + " from " + trip["startDate"] + " to " + trip["endDate"],
					startDate: trip["startDate"],
					endDate: trip["endDate"],
					info: JSON.stringify(trip),
				}

				axios.post(DATABASE_URL + 'api/trips/', data, {
						headers: {Authorization: "Token " + token},
				}).then(res => {
					console.log(res);
					// -------------------------
					trip = updateObject(trip, {'id': res.data["id"]})
					dispatch({
						type: actionTypes.NEW_TRIP,
						trip: trip,
					})
					dispatch(authSuccess(token, username, userId));
				});
			} else {
				dispatch(authSuccess(token, username, userId));
			}

			
		})
		.catch(err => {
			dispatch(authFail(err))
		})
	}
}

/** 
* Signs up by sending POST req to backend, then calls authLogin.
* @memberof ReduxAction
* @param {String} username: username of user
* @param {String} email: email of user
* @param {String} password1: password1 of user
* @param {String} password2: password2 of user
*/
export const authSignup = (username, email, password1, password2) => {
	return dispatch => {
		dispatch(authStart());
		axios.post(DATABASE_URL + 'rest-auth/registration/', {
			username: username,
			email: email,
			password1: password1,
			password2: password2
		}).then(res => {
			dispatch(authLogin(username, password1));
		})
		.catch(err => {
			dispatch(authFail(err))
		})
	}
}

/** 
* Checks with LOCALSTORAGE (token) if user is logged in, and updates REDUX token accordingly.
* @memberof ReduxAction
*/
export const authCheckState = () => {
	return dispatch => {
		const user = JSON.parse(localStorage.getItem('user'));
		dispatch(authStart());
		if (user === undefined || user === null) {
			dispatch(notLoggedIn());
		} else {
			const token = user['token'];
			const username = user['username'];
			const userId = user['id'];
			dispatch(authSuccess(token, username, userId));
		}
	}	
}


// TRIP ----------------------------------------------------------------------

/** 
* Stores trip variables into local storage, POSTS data if logined, and updates redux state for trip.
* @memberof ReduxAction
* @param {String} tripCountry: country of trip
* @param {number} tripLat: lattitude of country of trip
* @param {number} tripLng: longitude of country of trip
* @param {String} startDate: start date of trip
* @param {String} endDate: end date of trip
*/
export const newTripData = (tripCountry, tripGeometry, tripLatlng, startDate, endDate) => {
	return (dispatch) => {
		const tripLat = tripLatlng["lat"];
		const tripLng = tripLatlng["lng"];
		const radius = utilities.getBoundsRadius(tripGeometry["bounds"])
	    var mathStartDate = new Date(startDate);
	    var mathEndDate = new Date(endDate);
	    var lengthOfTrip = ((mathEndDate - mathStartDate) / (1000*60*60*24)) + 1

		const unsplash = new Unsplash({ 
			accessKey: "2ompLxlB0zcFIfYLJVH7pQV_Lf1JO4YmoSPMW1fjEwc",
			secret:"GkYGqiQ2mDBOSJYV_Cm1OwGlzb7VG5NwihKSHhlOG7o" });

		unsplash.search.photos(tripCountry, 1, 1, {
			orientation: "landscape",
			color:"white"}).then(toJson)
	  		.then(json => {
	  			let trip = {
					'country' : tripCountry,
					'geometry' : tripGeometry,
					'lat' : tripLat,
					'lng' : tripLng,
					'radius' : radius,
					'startDate' : startDate,
					'endDate' : endDate,
					'lengthOfTrip': lengthOfTrip,
					'activitiesAdded': [],
					'activitiesAddedLength' : 0,
					'activitiesAddedIds': [],
					'itinerary' : [[]],
					'itiDirections': [[]],
					'focusedDay': -1,
					'finished': false,
	    			'photo': json.results[0].urls.raw
	    		}

	    		// UPDATING TO DATABASE!!!!!!!
				const data = {
							destination: tripCountry,
							tripName: "Trip to " + tripCountry + " from " + startDate + " to " + endDate,
							startDate: startDate,
							endDate: endDate,
							info: JSON.stringify(trip),
						}
				const user = localStorage.user
				if (user) {
					const token = JSON.parse(user)["token"]
					axios.post(DATABASE_URL + 'api/trips/', data, {
							headers: {Authorization: "Token " + token},
					}).then(res => {
						console.log(res);
						// -------------------------
						trip = updateObject(trip, {'id': res.data["id"]})
						dispatch({
							type: actionTypes.NEW_TRIP,
							trip: trip,
						})
					});
				} else {
					dispatch({
						type: actionTypes.NEW_TRIP,
						trip: trip,
					})
				}
	  		});
	}


}

/** 
* Calls authStart to change REDUX loading to true, then proceeds on to call newTripData.
* @memberof ReduxAction
* @param {String} tripCountry: country of trip
* @param {number} tripLat: lattitude of country of trip
* @param {number} tripLng: longitude of country of trip
* @param {String} startDate: start date of trip
* @param {String} endDate: end date of trip
*/
export const newTrip = (tripCountry, tripGeometry, tripLatlng, startDate, endDate) => {
	return dispatch => {
		dispatch(newTripStart());
		dispatch(newTripData(tripCountry, tripGeometry, tripLatlng, startDate, endDate));
	}
}

export const newTripStart = () => {
	return {type: actionTypes.NEW_TRIP_START}
}


/**
* Gets trip details from local storage, and update it to redux state.
* @memberof ReduxAction
*/
export const checkTrip = () => {
	if (localStorage.trip !== null && localStorage.trip !== undefined) {
		return {
			type: actionTypes.CHECK_TRIP,
			trip: JSON.parse(localStorage.trip)
		}
	} else {
		return {
			type: actionTypes.AUTH_FAIL,
			error: "No trip found"
		}
	}
}


// MAP / ACTIVITIES --------------------------------------------------------------------------

/**
* Sends an action to reducer to update map information with new bounds of map
* @memberof ReduxAction
* @param {Object} bounds: new bounds of map
*/
export const mapBoundsChange = (bounds) => {
	return {
		type: actionTypes.MAP_BOUNDS_CHANGED,
		bounds: bounds
	}
}
export const mapBoundsUpdate = (newBounds) => {
	return {
		type: actionTypes.MAP_UPDATE_BOUNDS,
		newBounds: newBounds,
	}
}
export const mapAddDirections = (directions) => {
	return {
		type: actionTypes.MAP_ADD_DIRECTIONS,
		directions: directions
	}
}
/**
 * Sends an action to reducer to change activities loading to true.
 * @memberof ReduxAction
 */
export const activitiesStart = () => {
	return {
		type: actionTypes.ACTIVITIES_START
	}
}

/**
 * Calls activitiesStart to change REDUX activities loading to true, then proceeds on to call activitiesLoadData
 * @memberof ReduxAction
 * @param {Object} data: contains parameters to call for Google API to load data
 */
export const activitiesLoad = (data) => {
	return (dispatch) => {
		dispatch(activitiesStart());
		dispatch(activitiesLoadData(data));
	}
}

/**
 * Loads data to update activities in their corresponding category shown in redux state according to data type entered,
 * and update it to redux state.
 * @memberof ReduxAction
 * @param {Object} data: contains parameters to call for Google API to load data
 */
export const activitiesLoadData = (data) => {
	return (dispatch) => {
	// * Change URL depending on dataType.
	
	var url;
	if (data.dataType === "TEXTSEARCH") {
		url = DATABASE_URL + "api/TextSearch/"
	} else if (data.dataType === "NEXTKEYSEARCH") {
		url = DATABASE_URL + "api/NextKeySearch/"
	} else if (data.dataType === "BOUNDEDTEXTSEARCH") {
		url = DATABASE_URL + "api/BoundedTextSearch/"

		// If input type was to go to previous page, simply change activities shown
		// inside reducer.
	} else if (data.dataType === "GOPREV") {
		dispatch({
			type: actionTypes.ACTIVITIES_LOAD,
			dataType: data.dataType,
			category: data.category,
		})
		return;
		// If input type was to go to next page, simply change activities shown
		// inside reducer.
	} else if (data.dataType === "GONEXT") {
		dispatch({
			type: actionTypes.ACTIVITIES_LOAD,
			dataType: data.dataType,
			category: data.category,
		})
		return;
	}
	console.log(data);
	
	axios.post(url, data)
          .then( (res) => {
          	// * Upon loading data, check if the activities ID are already added into trip, by comparing with local
          	// * if added already, add a {added: true} to the activity
          	res = (JSON.parse(res.data));
          	console.log(res);
          	// Check for next page token, if it exists, store it.
          	var nextPageToken;
          	if (res["next_page_token"]) {
          		nextPageToken = res["next_page_token"];
          	} else {
          		nextPageToken = -1;
          	}

          	 
          	// * Storing results, and checking if place is alr added
          	
          	var results = res["results"]
          	for (var i = 0; i < results.length; i++) {
          		if (JSON.parse(localStorage.trip)["activitiesAddedIds"].includes(results[i].id)) {
          			const newPlace = updateObject(results[i], {added: true})
          			results[i] = newPlace
          		}
          	}



          	// * Dispatch results IF LOADING NEW PAGE DATA

            dispatch({
            	type: actionTypes.ACTIVITIES_LOAD,
				dataType: data.dataType,
				category: data.category,
            	activitiesShown: results,
            	nextPageToken: nextPageToken,
            })
        }).catch( (error) => {
            alert(error);
            dispatch({
            	type: actionTypes.ACTIVITIES_LOAD,
				dataType: data.dataType,
				category: data.category,
            	activitiesShown: [],
            })
        });

    }
}

/**
* Adds activity, update redux state to change status of activity to {added: true} 
* @memberof ReduxAction
* @param {number} index: index of activity added.
*/
export const activitiesAdd = (index) => {
	return {
		type: actionTypes.ACTIVITY_ADD,
		index: index
	}
}

export const activitiesSubtract = (activity) => {
	return {
		type: actionTypes.ACTIVITY_SUBTRACT,
		activity: activity
	}
}

export const activitiesEdit = (activity, newTime) => {
	return {
		type: actionTypes.ACTIVITY_EDIT,
		activity: activity,
		newTime: newTime,
	}
}
export const clearAllActivities = () => {
	return {
		type: actionTypes.ACTIVITY_CLEARALL,
	}
}

export const activitiesFocus = (index) => {
	return {
		type: actionTypes.ACTIVITY_FOCUS,
		index: index
	}
}

export const activitiesUnfocus = (index) => {
	return {
		type: actionTypes.ACTIVITY_UNFOCUS,
		index: index
	}
}
 
// GET ITINERARY --------------------------------------------------------------------------

/**
 * Sends an action to reducer to change itinerary loading to true, and update it to redux state.
 * @memberof ReduxAction
 */
export const itineraryLoadStart = () => {
	return {
		type: actionTypes.ITINERARY_START,
	}
}

/**
 * Calls itineraryLoadStart to change REDUX itinerary loading to true, then proceeds on to call itineraryLoadData.
 * @memberof ReduxAction
 * @param {Object} data: contains a list of activities selected to generate itinerary
 */
export const itineraryLoad = (data) => {
	return (dispatch) => {
		dispatch(itineraryLoadStart());
		dispatch(itineraryLoadData(data));
	}
}

/**
 * Calls backend request to generate itinerary and update it to redux state.
 * @memberof ReduxAction
 * @param {Object} data: contains a list of activities selected to generate itinerary
 */
export const itineraryLoadData = (data) => {
	return async (dispatch) => {
	    axios.post(DATABASE_URL + "api/algo/", data).then( async (res) => {
	        var iti = JSON.parse(res.data);
	        for (var day in iti) {
	        	for (var activity in iti[day]) {
	        		if (parseInt(activity) !== 0) {
	        			iti[day][activity] = JSON.parse(iti[day][activity])
	        		}
	        	}
	        	iti[day].push("EMPTY")
			}
			dispatch(itineraryLoadDirections(iti));
	    }).catch((error) => {
	    	alert("Directions API capacity reached, try again in awhile :-(");
	    	console.log(error)
	    	dispatch({
	    		type: actionTypes.ITINERARY_LOAD,
				itinerary: [[]],
				itiDirections: [[]],
				getItineraryLoading: false,
	    	})
	    });
	}
}

export const itineraryLoadDirections = (iti) => {
	return async (dispatch) => {
		dispatch({type: actionTypes.ITINERARY_LOAD_DIRECTIONS_START});
    	let startDate = new Date(JSON.parse(localStorage.trip)["startDate"]);
        let itiDirections = [];
        for (let day in iti) {
        	// Resets total time.
        	iti[day][0] = 0;

		    let date = new Date()
			date.setDate(startDate.getDate() + parseInt(day))
			date.setMinutes(0)
			date.setHours(9)

        	for (let activity in iti[day]) {
        		if (parseInt(activity) !== 0 && parseInt(activity) !== (iti[day].length - 1)) {
        			// Add time based on without directions first. --------------------

        			// Adding start time
        			iti[day][activity]["startTime"] = date;						

					// Adding activity time
					const activityLength = iti[day][activity]["recommendedTime"] * 1000 * 60
					date = new Date(date.getTime() + activityLength)

					// Updating total time
					iti[day][0] = iti[day][0] + iti[day][activity]["recommendedTime"];

					// Adding end time
					iti[day][activity]["endTime"] = date;
        		}
        	}
        	// GETTING DIRECTIONS
	        if (iti[day].length > 3) {
				let directions = [];
				for (let activity = 1; activity < (iti[day].length - 2); activity++) {
					// Redeclare date.
					let date = new Date();
					
					const directionsService = new window.google.maps.DirectionsService();
					const origin = iti[day][activity].geometry.location;
				    const destination = iti[day][activity+1].geometry.location;
				    let promise = new Promise( (resolve, reject) => {
				    	const transitOptions = {
				    		departureTime: iti[day][activity]["endTime"]
				    	}
					    setTimeout(() => {
					    return directionsService.route(
					    {
					        origin: origin,
					        destination: destination,
					        travelMode: window.google.maps.TravelMode.TRANSIT,
					        transitOptions: transitOptions,
					    },
					    (result, status) => {
					        if (status === window.google.maps.DirectionsStatus.OK) {

					        	// Adding direction time
					        	const travelLength = result.routes[0].legs[0].duration.value * 1000
								date = new Date(iti[day][activity]["endTime"].getTime() + travelLength)
								iti[day][activity+1]["startTime"] = date;

								// Updating total time
								iti[day][0] = iti[day][0] + travelLength/(1000.0 * 60.0)

								// Adding activity time
								const activityLength = iti[day][activity+1]["recommendedTime"] * 1000 * 60
								date = new Date(date.getTime() + activityLength)
								iti[day][activity+1]["endTime"] = date;

					            directions.push(result);

					            resolve("done");
					        } else {
							    setTimeout( directionsService.route(
							    {
							        origin: origin,
							        destination: destination,
							        travelMode: window.google.maps.TravelMode.DRIVING,
							    },
							    (result, status) => {
							        if (status === window.google.maps.DirectionsStatus.OK) {
							        	// Adding direction time
							        	const travelLength = result.routes[0].legs[0].duration.value * 1000
										date = new Date(iti[day][activity]["endTime"].getTime() + travelLength)
										iti[day][activity+1]["startTime"] = date;

										// Updating total time.
										iti[day][0] = iti[day][0] + travelLength/60.0

										// Adding activity time
										const activityLength = iti[day][activity+1]["recommendedTime"] * 1000 * 60
										date = new Date(date.getTime() + activityLength)
										iti[day][activity+1]["endTime"] = date;

							            directions.push(result);

							            resolve("done");
							        } else {
							            directions.push(null);
							            resolve("done");
							        }
							    }), 500);
					        }
					    })}, 500);
					});
					await promise;
				}

				itiDirections.push(directions);
			} else {
				itiDirections.push([]);
			}
		}
		dispatch({
			itiDirections: itiDirections,
			type: actionTypes.ITINERARY_LOAD,
			itinerary: iti,
		})
	}
}

/**
 * Updates activities of itinerary, deletes the activity at fromIndex, and adds the activity
 * in the position of toIndex, and update it to redux state.
 * @memberof ReduxAction
 * @param {number} toIndex: index of intended new position of activity
 * @param {number} fromIndex: index of original position of activity
 */
export const itineraryUpdate = (toIndex, fromIndex) => {
	return {
		type: actionTypes.ITINERARY_UPDATE,
		toIndex: toIndex,
		fromIndex: fromIndex,
	}
}

/**
 * Updates and calculates, displays route of day.
 * @memberof ReduxAction
 * @param {array} dayActivities: array of activities in given day.
 */
export const itineraryFocusDay = (dayActivities) => {
	return (dispatch) => {
		dispatch(itineraryFocusDayStart());
		dispatch(itineraryFocusDayData(dayActivities));
	}
}

/**
 * Changes itineraryFocusDayLoading loading to true.
 * @memberof ReduxAction
 */
export const itineraryFocusDayStart = () => {
	return {
		type: actionTypes.ITINERARY_FOCUS_DAY_LOAD
	}
}

/**
 * Updates and calculates, displays route of day.
 * @memberof ReduxAction
 * @param {array} dayActivities: array of activities in given day.
 */
export const itineraryFocusDayData = (index) => {
	return {
		focusedDay: index,
		type: actionTypes.ITINERARY_FOCUS_DAY
	}
}

// ACTIVITY SEARCH ACTIONS ------------------------------------------------------

export const addSuggestions = (suggestion) => {
	return (dispatch) => {
		dispatch(addSuggestionsStart());
		dispatch(addSuggestionsData(suggestion))
	}
}

export const addSuggestionsStart = () => {
	return({
		type: actionTypes.SUGGESTIONS_START,
		suggestionsLoading: false,
	})
}

export const addSuggestionsData = (suggestion) => {
	return (dispatch) => {
		const url = DATABASE_URL + "api/PlaceDetails/";
		const data = {
			"placeId" : suggestion,
			"key" : API_KEY
		}
		axios.post(url, data).then((results) => {
			var suggestion = results["data"]["result"]
      		if (JSON.parse(localStorage.trip)["activitiesAddedIds"].includes(suggestion.id)) {
				const newPlace = updateObject(suggestion, {added: true});
				suggestion = newPlace;
			}
			dispatch({
				type: actionTypes.SUGGESTIONS_ADD,
				suggestion: suggestion,
			})
		})
	}
}
// TOGGLE SEARCH MODES

export const changeBrowsing = (browse) => {
	if (browse === "BROWSE") {
		return ({
			type: actionTypes.CHANGE_BROWSING,
			browsingToggle: true,
		})
	} else {
		return ({
			type: actionTypes.CHANGE_BROWSING,
			browsingToggle: false,
		})
	}
}

export const suggestionsClear = () => {
	return {
		type: actionTypes.SUGGESTIONS_CLEAR,
	}
}

export const retrieveTrip = (trip) => {
	return (dispatch) => {
		dispatch({type: actionTypes.RETRIEVE_START});
		dispatch({type: actionTypes.RETRIEVE_TRIP,
			trip: trip})
	}
}



