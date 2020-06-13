import * as actionTypes from './actionTypes';
import axios from 'axios';
import {updateObject, recommendTime} from '../utility';
const DATABASE_URL = "https://trippyy-backend.herokuapp.com/"

// Sends an action to reducer to change loading to true.
export const authStarted = () => {
	return {
		type: actionTypes.AUTH_START
	}
}

// Sends an action to reducer to update REDUX token, username, userId upon login.
export const authSuccessed = (token, username, userId) => {
	return {
		token: token,
		type: actionTypes.AUTH_SUCCESS,
		username: username,
		userId: userId
	}
}

// Sends an action to alert an error.
export const authFailed = (error) => {
	return {
		error: error,
		type: actionTypes.AUTH_FAIL
	}
}

// Called upon logout, removes everything in LOCALSTORAGE 
export const logouted = () => {
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
// and calls authSuccessed or authFailed, depending on outcome.
export const authLogined = (username, password) => {
	return dispatch => {
		dispatch(authStarted());
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
			dispatch(authSuccessed(token, username, userId));
		})
		.catch(err => {
			dispatch(authFailed(err))
		})
	}
}

// Signs up by sending POST req to backend, then calls authLogined.
export const authSignuped = (username, email, password1, password2) => {
	return dispatch => {
		dispatch(authStarted());
		axios.post(DATABASE_URL + 'rest-auth/registration/', {
			username: username,
			email: email,
			password1: password1,
			password2: password2
		}).then(res => {
			dispatch(authLogined(username, password1));
		})
		.catch(err => {
			dispatch(authFailed(err))
		})
	}
}

// Checks with LOCALSTORAGE (token) if user is logged in, and updates REDUX token accordingly.
export const authCheckedState = () => {
	return dispatch => {
		const user = JSON.parse(localStorage.getItem('user'));
		if (user === undefined || user === null) {
			dispatch(notLoggedIn());
		} else {
			const token = user['token'];
			const username = user['username'];
			dispatch(authSuccessed(token, username));
		}
	}	
}

// ---------------------------------------------------------------------------------

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
	}
	localStorage.setItem('trip', JSON.stringify(trip));
	return {
		type: actionTypes.NEW_TRIP,
		trip: trip
	}

}

// Calls authStarted to change REDUX loading to true, then proceeds on to call newTripData.
export const newTrip = (tripCountry, tripLat, tripLng, startDate, endDate) => {
	return dispatch => {
		dispatch(authStarted());
		dispatch(newTripData(tripCountry, tripLat, tripLng, startDate, endDate));
	}
}

//Gets trip details from local storage
export const checkedTrip = () => {
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

export const mapBoundsChanged = (bounds) => {
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

export const activitiesLoaded = (data) => {
	return (dispatch) => {
		dispatch(activitiesStart());
		dispatch(activitiesLoadedData(data));
	}
}

export const activitiesLoadedData = (data) => {
	return (dispatch) => {
	// Change URL depending on dataType.
	var url;
	if (data.dataType == "TEXTSEARCH") {
		url = "http://trippyy-backend.herokuapp.com/api/TextSearch/"
	} else if (data.dataType == "NEXTKEYSEARCH") {
		url = "http://trippyy-backend.herokuapp.com/api/NextKeySearch/"
	} else if (data.dataType == "BOUNDEDTEXTSEARCH") {
		url = "http://trippyy-backend.herokuapp.com/api/BoundedTextSearch/"
	}
	axios.post(url, data)
          .then( (res) => {
          	// Upon loading data, check if the activities ID are already added into trip, by comparing with local
          	// if added already, add a {added: true} to the activity
          	res = (JSON.parse(res.data));
          	console.log(res);
          	// Check for next page token, if exist, store it.
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

          	// Dispatch results
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

export const activitiesAdded = (index) => {
	return {
		type: actionTypes.ACTIVITY_ADD,
		index: index
	}
}

