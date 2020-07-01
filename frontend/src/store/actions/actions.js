import * as actionTypes from './actionTypes';
import axios from 'axios';
import {updateObject} from '../utility';
const DATABASE_URL = "https://trippyy-backend.herokuapp.com/"

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
			const user = {
				'id': userId,
				'token': token,
				'username': username
			}
			localStorage.setItem('user', JSON.stringify(user));
			dispatch(authSuccess(token, username, userId));
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
		if (user === undefined || user === null) {
			dispatch(notLoggedIn());
		} else {
			const token = user['token'];
			const username = user['username'];
			dispatch(authSuccess(token, username));
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
export const newTripData = (tripCountry, tripLat, tripLng, startDate, endDate) => {
	const data = {
				destination: tripCountry,
				tripName: "Trip to " + tripCountry + " from " + startDate + " to " + endDate,
				startDate: startDate,
				endDate: endDate
			}
	axios.post(DATABASE_URL + 'api/trips/', data, {
			headers: {Authorization: "Token " + localStorage.token},
		}).then(res => console.log(res));

	const trip = {
		'country' : tripCountry,
		'lat' : tripLat,
		'lng' : tripLng,
		'startDate' : startDate,
		'endDate' : endDate,
		'activitiesAdded': [],
		'activitiesAddedIds': [],
		'itinerary' : [[]],
		'focusedDayDirections': [],
		'focusedDay': [],
	}
	localStorage.setItem('trip', JSON.stringify(trip));
	return {
		type: actionTypes.NEW_TRIP,
		trip: trip
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
export const newTrip = (tripCountry, tripLat, tripLng, startDate, endDate) => {
	return dispatch => {
		dispatch(authStart());
		dispatch(newTripData(tripCountry, tripLat, tripLng, startDate, endDate));
	}
}

/**
* Gets trip details from local storage, and update it to redux state.
* @memberof ReduxAction
*/
export const checkTrip = () => {
	if (localStorage.trip !== null && localStorage.trip !== undefined) {
		return {
			type: actionTypes.NEW_TRIP,
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
		url = "http://trippyy-backend.herokuapp.com/api/TextSearch/"
	} else if (data.dataType === "NEXTKEYSEARCH") {
		url = "http://trippyy-backend.herokuapp.com/api/NextKeySearch/"
	} else if (data.dataType === "BOUNDEDTEXTSEARCH") {
		url = "http:/trippyy-backend.herokuapp.com/api/BoundedTextSearch/"

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
		axios.get("www.wikipedia.com").then((res) => {console.log("e")});
		dispatch({
			type: actionTypes.ACTIVITIES_LOAD,
			dataType: data.dataType,
			category: data.category,
		})
		return;
	}
	
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

export const activitiesSubtract = (index) => {
	return {
		type: actionTypes.ACTIVITY_SUBTRACT,
		index: index
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
	return (dispatch) => {
	    axios.post("https:/trippyy-backend.herokuapp.com/api/algo/", data).then( (res) => {
	        var iti = JSON.parse(res.data);
	        for (var day in iti) {
	        	for (var activity in iti[day]) {
	        		if (activity !== 0) {
	        			iti[day][activity] = JSON.parse(iti[day][activity])
	        		}
	        	}
	        	iti[day].push("EMPTY")
	        }

	        console.log(iti)
	        dispatch({
				type: actionTypes.ITINERARY_LOAD,
				itinerary: iti,
				getItineraryLoading: false,
			});
	    });
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

export const itineraryFocusDay = (dayActivities) => {
	return (dispatch) => {
		dispatch(itineraryFocusDayStart());
		dispatch(itineraryFocusDayData(dayActivities));
	}
}
export const itineraryFocusDayStart = () => {
	return {
		type: actionTypes.ITINERARY_FOCUS_DAY_LOAD
	}
}

export const itineraryFocusDayData = (dayActivities) => {
	return async (dispatch) => {
		if (dayActivities.length > 3) {
			var directions = [];
			for (var activity = 1; activity < (dayActivities.length - 2); activity++) {
				const directionsService = new window.google.maps.DirectionsService();
				const origin = dayActivities[activity].geometry.location;
			    const destination = dayActivities[activity+1].geometry.location;
			    let promise = new Promise( (resolve, reject) => { 

				    directionsService.route(
				    {
				        origin: origin,
				        destination: destination,
				        travelMode: window.google.maps.TravelMode.TRANSIT,
				    },
				    (result, status) => {
				        if (status === window.google.maps.DirectionsStatus.OK) {
				            // console.log(result);			            
				            resolve("done");			            
				            directions.push(result);
				        } else {
				            console.error("error");
				        }
				    });
				});
				await promise;
			}
			dispatch({
				type: actionTypes.ITINERARY_FOCUS_DAY,
				dayActivities: dayActivities,
				focusedDayDirections: directions,
			})
		} else {
			dispatch ({
				type: actionTypes.ITINERARY_FOCUS_DAY,
				dayActivities: dayActivities,
				focusedDayDirections: [],
			})
		}
	}
}





