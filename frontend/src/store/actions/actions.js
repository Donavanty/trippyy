import * as actionTypes from './actionTypes';
import axios from 'axios';
import {updateObject, recommendTime} from '../utility';
const DATABASE_URL = "https://trippyy-backend.herokuapp.com/"

// Sends an action to reducer to change loading to true.
export const authStart = () => {
	return {
		type: actionTypes.AUTH_START
	}
}

// Sends an action to reducer to update REDUX token, username, userId upon login.
export const authSuccess = (token, username, userId) => {
	return {
		token: token,
		type: actionTypes.AUTH_SUCCESS,
		username: username,
		userId: userId
	}
}

// Sends an action to alert an error.
export const authFail = (error) => {
	return {
		error: error,
		type: actionTypes.AUTH_FAIL
	}
}

// Called upon logout, removes everything in LOCALSTORAGE 
export const logout = () => {
	localStorage.clear();
	return {
		type: actionTypes.AUTH_LOGOUT
	}
}

// Called during checking of authentication state, updates REDUX token, remove all USER attributes in LOCALSTORAGE
export const notLoggedIn = () => {
	localStorage.removeItem('user');
	return {
		type: actionTypes.AUTH_LOGOUT
	}
}

// Called upon login, logins by checking with backend, updates USER attributes in LOCALSTORAGE, 
// and calls authSuccess or authFailed, depending on outcome.
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

// Signs up by sending POST req to backend, then calls authLogin.
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

// Checks with LOCALSTORAGE (token) if user is logged in, and updates REDUX token accordingly.
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

// TRIP // --------------------------------------------------------------------------------------------------------------------------------------------------

// Stores trip variables into local storage, POSTS data if logined, and updates redux state for trip.
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
	}
	localStorage.setItem('trip', JSON.stringify(trip));
	return {
		type: actionTypes.NEW_TRIP,
		trip: trip
	}

}

// Calls authStart to change REDUX loading to true, then proceeds on to call newTripData.
export const newTrip = (tripCountry, tripLat, tripLng, startDate, endDate) => {
	return dispatch => {
		dispatch(authStart());
		dispatch(newTripData(tripCountry, tripLat, tripLng, startDate, endDate));
	}
}

//Gets trip details from local storage
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

// MAP / ACTIVITIES // --------------------------------------------------------------------------
export const mapBoundsChange = (bounds) => {
	return {
		type: actionTypes.MAP_BOUNDS_CHANGED,
		bounds: bounds
	}
}

export const activitiesStart = () => {
	return {
		type: actionTypes.ACTIVITIES_START
	}
}

export const activitiesLoad = (data) => {
	return (dispatch) => {
		dispatch(activitiesStart());
		dispatch(activitiesLoadData(data));
	}
}

export const activitiesLoadData = (data) => {
	return (dispatch) => {
	// Change URL depending on dataType.
	var url;
	if (data.dataType === "TEXTSEARCH") {
		url = "http://trippyy-backend.herokuapp.com/api/TextSearch/"
	} else if (data.dataType === "NEXTKEYSEARCH") {
		url = "http://trippyy-backend.herokuapp.com/api/NextKeySearch/"
	} else if (data.dataType === "BOUNDEDTEXTSEARCH") {
		url = "http://trippyy-backend.herokuapp.com/api/BoundedTextSearch/"

		// If input type was to go to previous page, simply change activities shown
		// inside reducer.
	} else if (data.dataType === "GOPREV") {
		dispatch({
			type: actionTypes.ACTIVITIES_LOAD,
			dataType: data.dataType,
		})
		return;

		// If input type was to go to next page, simply change activities shown
		// inside reducer.
	} else if (data.dataType === "GONEXT") {
		axios.get("www.wikipedia.com").then((res) => {console.log("e")});
		dispatch({
			type: actionTypes.ACTIVITIES_LOAD,
			dataType: data.dataType,
		})
		return;
	}
	
	axios.post(url, data)
          .then( (res) => {
          	// Upon loading data, check if the activities ID are already added into trip, by comparing with local
          	// if added already, add a {added: true} to the activity
          	res = (JSON.parse(res.data));
          	console.log(res);
          	// Check for next page token, if it exists, store it.
          	var nextPageToken;
          	if (res["next_page_token"]) {
          		nextPageToken = res["next_page_token"];
          	} else {
          		nextPageToken = -1;
          	}

          	// Storing results, and checking if place is alr added
          	var results = res["results"]
          	for (var i = 0; i < results.length; i++) {
          		if (JSON.parse(localStorage.trip)["activitiesAddedIds"].includes(results[i].id)) {
          			const newPlace = updateObject(results[i], {added: true})
          			results[i] = newPlace
          		}
          	}

          	// Dispatch results IF LOADING NEW PAGE DATA
            dispatch({
            	type: actionTypes.ACTIVITIES_LOAD,
            	dataType: data.dataType,
            	activitiesShown: results,
            	nextPageToken: nextPageToken,
            })
        }).catch( (error) => {
            alert(error);
            dispatch({
            	type: actionTypes.ACTIVITIES_LOAD,
            	dataType: data.dataType,
            	activitiesShown: [],
            })
        });

    }
}

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

// GET ITINERARY // --------------------------------------------------------------------------

export const itineraryLoadStart = () => {
	return {
		type: actionTypes.ITINERARY_START,
	}
}

export const itineraryLoadData = (data) => {
	return (dispatch) => {
	    axios.post("https://trippyy-backend.herokuapp.com/api/algo/", data).then( (res) => {
	        var iti = JSON.parse(res.data);
	        dispatch({
				type: actionTypes.ITINERARY_LOAD,
				itinerary: iti,
				getItineraryLoading: false,
			});
	    });
	}
}

export const itineraryLoad = (data) => {
	return (dispatch) => {
		dispatch(itineraryLoadStart());
		dispatch(itineraryLoadData(data));
	}
}

export const itineraryUpdate = (toIndex, fromIndex) => {
	return {
		type: actionTypes.ITINERARY_UPDATE,
		toIndex: toIndex,
		fromIndex: fromIndex,
	}
}






