import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../utility';
import axios from 'axios';
// const DATABASE_URL = "http://127.0.0.1:8000/";
const DATABASE_URL = "http://trippyy-backend.herokuapp.com/"

const initialState = {
	error: null,
	loading: false,
	newTripLoading: false,
	activitiesLoading: false,
	getItineraryLoading: false,
	itineraryFocusDayLoading: false,
	itineraryLoadDirectionsLoading: false,
	suggestionsLoading: false,
	retrieveLoading: false,

	browsingToggle: true,

	user: null,

	trip: {
		'country' : -1,
		'lat' : -1,
		'lng' : -1,
		'startDate': -1,
		'endDate' : -1,
		'lengthOfTrip': 0,
		'activitiesAdded' : [],
		'activitiesAddedLength' : 0,
		'activitiesAddedIds' : [],
		'itinerary' : [[]],
		'itiDirections': [[]],
		'focusedDay' : -1,
		'finished' : false,
		

	},

	map: {
		'bounds': {
			"upper": {
				"lat": -1,
				"lng": -1,

			}, 

			"lower": {
				"lat": -1,
				"lng": -1,
			},

            "center": -1,

            "radius": -1,

            "directions" : null,
		}
	},

	activitiesShown: {
		"currentList": [],
		"fullList": [], 

		"currentCategory": "", 
		"firstActivityCounter": -1, 
		"pageNumber": -1,
		
		"nextPageToken": -1,

		"hasNextPageLoaded": false,
		"pageLoadedUpTo": -1,
	},

	searchActivitiesShown: [],

	focusedActivity: {},
}

const authStart = (state, action) => {
	return updateObject(state, {
		error: null,
		loading: true
	});
}

const authSuccess = (state, action) => {
	const user = {
		'id': action.userId,
		'token': action.token,
		'username': action.username,
	}
	
	localStorage.setItem('user', JSON.stringify(user));

	return updateObject(state, {
		user: user,
		error: null,
		loading: false,
	});
}

const authFail = (state, action) => {
	return updateObject(state, {
		error: action.error,
		loading: false
	});
}

const authLogout = (state, action) => {
	return updateObject(state, {
		user: null,
		loading: false,
	});
}
const newTripStart = (state, action) => {
	return updateObject(state, {
		newTripLoading: true,
	})
}
const newTrip = (state, action) => {
	const activitiesShown = {
		"currentList": [],
		"fullList": [], 

		"currentCategory": "", 
		"firstActivityCounter": -1, 
		"pageNumber": -1,
		
		"nextPageToken": -1,

		"hasNextPageLoaded": false,
		"pageLoadedUpTo": -1,
	}

	localStorage.setItem('trip', JSON.stringify(action.trip));

	return updateObject(state, {
		trip: action.trip,
		newTripLoading: false,
		activitiesShown: activitiesShown,
	})
}

const checkTrip = (state, action) => {
	return updateObject(state, {
		trip: action.trip,
		newTripLoading: false,
	})
}

const updateBounds = (state, action) => {
	const newMap = updateObject(state.map, {
		bounds: action.bounds
	})

	return updateObject(state, {
		map: newMap
	})
}

const mapAddDirections = (state, action) => {
	const newMap = updateObject(state.map, {
		directions: action.directions
	})

	return updateObject(state, {
		map: newMap
	})
}

const activitiesLoad = (state, action) => {
	// If load next page, get and display next page data, and add onto fullActivitiesShown list
	if (action.dataType === "NEXTKEYSEARCH") {
		const newFullList = [...state.activitiesShown.fullList, action.activitiesShown ];
		const activitiesShown = {
			currentList: action.activitiesShown,
			fullList: newFullList,
			currentCategory: action.category,
			pageLoadedUpTo: state.activitiesShown.pageNumber + 1,
			pageNumber: state.activitiesShown.pageNumber + 1,
			firstActivityCounter: state.activitiesShown.firstActivityCounter + 20,
			nextPageToken: action.nextPageToken,
		}
		return updateObject(state, {
			activitiesShown: activitiesShown,
			activitiesLoading: false,
		})


	// If the request was to go to a prev page, 
	// ASSERT that fullList at this point would have activities added already.
	} else if (action.dataType === "GOPREV") {
		const newCurrentList = [...state.activitiesShown.fullList[state.activitiesShown.pageNumber - 1]]
		const activitiesShown = updateObject(state.activitiesShown, {
			currentList: newCurrentList,
			currentCategory: action.category,
			pageNumber: state.activitiesShown.pageNumber - 1,
			firstActivityCounter: state.activitiesShown.firstActivityCounter - 20,
			hasNextPageLoaded: true,
		})
		return updateObject(state, {
			activitiesShown: activitiesShown,
			activitiesLoading: false,
		})


	// If has next page loaded, pressing next page will call to this instead,
	// just reassign the activities shown and hasNextPageLoaded.
	} else if (action.dataType === "GONEXT") {
		const newCurrentList = [...state.activitiesShown.fullList[state.activitiesShown.pageNumber + 1]]
		var hasNextPageLoaded;
		if (state.activitiesShown.pageNumber + 1 >= state.activitiesShown.pageLoadedUpTo) {
			hasNextPageLoaded = false
		} else {
			hasNextPageLoaded = true
		}
		const activitiesShown = updateObject(state.activitiesShown, {
			currentList: newCurrentList,
			currentCategory: action.category,
			pageNumber: state.activitiesShown.pageNumber + 1,
			firstActivityCounter: state.activitiesShown.firstActivityCounter + 20,
			hasNextPageLoaded: hasNextPageLoaded,
		})
		return updateObject(state, {
			activitiesShown: activitiesShown,
			activitiesLoading: false,
		})
	}


	// If data type = bounded search or text search (meaning it is first load)
	else {
		const activitiesShown = {
			currentList: action.activitiesShown,
			fullList: [action.activitiesShown],
			currentCategory: action.category,

			pageNumber: 0,
			firstActivityCounter: 0,
			nextPageToken: action.nextPageToken,
		}
		return updateObject(state, {
			activitiesShown: activitiesShown,
			activitiesLoading: false,
		})
	}
}

const activitiesStart = (state, action) => {
	return updateObject(state, {
		activitiesLoading: true
	})
}

const activitiesAdd = (state, action) => {
	// Retrieve trip for cache, can be done using state too, but both works.
	var currentTrip = JSON.parse(localStorage.trip);

	// Update activity added
	var activityAdded = action.index;
	activityAdded = updateObject(activityAdded, {added: true});

	// Update (activities shown) current list
	var activitiesShownCurrentList = [...state.activitiesShown.currentList];
	for (let activity in activitiesShownCurrentList) {
		if (activitiesShownCurrentList[activity].name === activityAdded.name) {
			activitiesShownCurrentList[activity] = activityAdded;
		}
	}

	// Update (activities shown) full list
	var activitiesShownFullList = [...state.activitiesShown.fullList];
	activitiesShownFullList[state.activitiesShown.pageNumber] = activitiesShownCurrentList;

	// Update activities shown
	var activitiesShown = updateObject(state.activitiesShown, {
			currentList: activitiesShownCurrentList,
			fullList: activitiesShownFullList,
	})

	// Update search activities shown
	var searchActivitiesShown = [...state.searchActivitiesShown];
	for (let activity in searchActivitiesShown) {
		if (searchActivitiesShown[activity].name === activityAdded.name) {
			searchActivitiesShown[activity] = activityAdded;
		}
	}

	// Update total time
	var newTotalTime = currentTrip.activitiesAddedLength + (activityAdded["recommendedTime"] / 60)
	if (newTotalTime > (state.trip.lengthOfTrip*12.0)) {
		alert("You have reached the maximum time for activities!");
		return state;
	}

	// Merge all changes into currentTrip
	currentTrip['activitiesAdded'].push(activityAdded);
	currentTrip['activitiesAddedIds'].push(activityAdded.id);
	currentTrip['activitiesAddedLength'] = newTotalTime;

	// UPDATING ADDITION OF ACTIVITY TO DATABASE!!!!!!!
	const data = {
				info: JSON.stringify(currentTrip),
	}

	// IF LOGGED IN
	const user = localStorage.user
	if (user) {
		const token = JSON.parse(user)["token"]
		axios.patch(DATABASE_URL + ('api/trips/' + currentTrip["id"] + '/'  ), data, {
				headers: {Authorization: "Token " + token},
			}).then(res => console.log(res));
	}
	// ----------------------------------------------------------------------------

	// Update currentTrip
	localStorage.setItem('trip', JSON.stringify(currentTrip));
	

	// ENABLE FOR ALGO TESTING ----------------------------------------
	// console.log(JSON.stringify(currentTrip.activitiesAdded));
	return updateObject(state, {
		trip: currentTrip,
		activitiesShown: activitiesShown,
		searchActivitiesShown: searchActivitiesShown,
	})
}

const activitiesSubtract = (state, action) => {
	// Retrieve trip for cache, can be done using state too, but both works.
	var currentTrip = JSON.parse(localStorage.trip);

	// Retrieve activity that was selected/clicked on by referencing the index (id) 
	// Update the activity such that {added: false}
	var activitySelected = action.activity;
	activitySelected = updateObject(activitySelected, {added: false});

	// Update (activities shown) current list
	var activitiesShownCurrentList = [...state.activitiesShown.currentList];
	for (var activity in activitiesShownCurrentList) {
		if (activitiesShownCurrentList[activity].name === activitySelected.name) {
			activitiesShownCurrentList[activity] = activitySelected;
		}
	}

	// Update (activities shown) full list
	var activitiesShownFullList = [...state.activitiesShown.fullList];
	activitiesShownFullList[state.activitiesShown.pageNumber] = activitiesShownCurrentList;

	// Update activities shown
	var activitiesShown = updateObject(state.activitiesShown, {
			currentList: activitiesShownCurrentList,
			fullList: activitiesShownFullList,
	})

	// Update search activities shown
	var searchActivitiesShown = [...state.searchActivitiesShown];
	for (let activity in searchActivitiesShown) {
		if (searchActivitiesShown[activity].name === activitySelected.name) {
			searchActivitiesShown[activity] = activitySelected;
		}
	}

	// Update new total time
	var newTotalTime = currentTrip.activitiesAddedLength - (activitySelected["recommendedTime"] / 60)

	// Merge all changes into currentTrip
	var filteredTrip = currentTrip['activitiesAdded'].filter(
		(activity) => activity.name !== activitySelected.name);
	console.log(activitySelected.name)

	currentTrip['activitiesAdded'] = filteredTrip;

	var filteredTripIds = currentTrip['activitiesAddedIds'].filter(
		(id) => id !== activitySelected.id);
	
	currentTrip['activitiesAddedIds'] = filteredTripIds;
	currentTrip['activitiesAddedLength'] = newTotalTime;


	// UPDATING ADDITION OF ACTIVITY TO DATABASE!!!!!!!
	const data = {
				info: JSON.stringify(currentTrip),
	}

	// IF LOGGED IN
	const user = localStorage.user
	if (user) {
		const token = JSON.parse(user)["token"]
		axios.patch(DATABASE_URL + ('api/trips/' + currentTrip["id"] + '/'  ), data, {
				headers: {Authorization: "Token " + token},
			}).then(res => console.log(res));
	}

	// Update currentTrip
	localStorage.setItem('trip', JSON.stringify(currentTrip));

	return updateObject(state, {
		trip: currentTrip,
		activitiesShown: activitiesShown,
		searchActivitiesShown: searchActivitiesShown,
	})
}

const activitiesEdit = (state, action) => {
	// Retrieve trip for cache, can be done using state too, but both works.
	var currentTrip = JSON.parse(localStorage.trip);
	var activitySelected = action.activity;
	// Update new total time
	var newTotalTime = currentTrip.activitiesAddedLength - (activitySelected["recommendedTime"] / 60)

	// Retrieve activity that was selected/clicked on by referencing the index (id) 
	// Update the activity such that {added: false}
	activitySelected = updateObject(activitySelected, {recommendedTime: action.newTime});

	newTotalTime = newTotalTime + (activitySelected["recommendedTime"] / 60.0);

	// Update (activities shown) current list
	var activitiesShownCurrentList = [...state.activitiesShown.currentList];
	for (var activity in activitiesShownCurrentList) {
		if (activitiesShownCurrentList[activity].name === activitySelected.name) {
			activitiesShownCurrentList[activity] = activitySelected;
		}
	}

	// Update (activities shown) full list
	var activitiesShownFullList = [...state.activitiesShown.fullList];
	activitiesShownFullList[state.activitiesShown.pageNumber] = activitiesShownCurrentList;

	// Update activities shown
	var activitiesShown = updateObject(state.activitiesShown, {
			currentList: activitiesShownCurrentList,
			fullList: activitiesShownFullList,
	})

	// Update search activities shown
	var searchActivitiesShown = [...state.searchActivitiesShown];
	for (let activity in searchActivitiesShown) {
		if (searchActivitiesShown[activity].name === activitySelected.name) {
			searchActivitiesShown[activity] = activitySelected;
		}
	}

	// Merge all changes into currentTrip
	for (let activity in currentTrip['activitiesAdded']) {
		if (currentTrip['activitiesAdded'][activity].name === activitySelected.name) {
			currentTrip['activitiesAdded'][activity] = activitySelected;
		}
	}
	currentTrip['activitiesAddedLength'] = newTotalTime;

	// Update currentTrip
	localStorage.setItem('trip', JSON.stringify(currentTrip));

	console.log(currentTrip)

	return updateObject(state, {
		trip: currentTrip,
		activitiesShown: activitiesShown,
		searchActivitiesShown: searchActivitiesShown,
	})
}

const clearAllActivities = (state, action) => {
	// Retrieve trip for cache, can be done using state too, but both works.
	var currentTrip = JSON.parse(localStorage.trip);

	//Reset these arrays to [] so that the SelectedActivityList component no longer shows any stored acitivities.
	//This reducer only focuses on handling the SelectedActivityList component.
	//For the ActivityList's 'currentList',
	//the {added: false} is done via the traditional 'activitiesSubtract' reducer.
	currentTrip['activitiesAdded'] = [];
	currentTrip['activitiesAddedIds'] = [];
	currentTrip['activitiesAddedLength'] = 0;

	// UPDATING ADDITION OF ACTIVITY TO DATABASE!!!!!!!
	const data = {
				info: JSON.stringify(currentTrip),
	}

	// IF LOGGED IN
	const user = localStorage.user
	if (user) {
		const token = JSON.parse(user)["token"]
		axios.patch(DATABASE_URL + ('api/trips/' + currentTrip["id"] + '/'  ), data, {
				headers: {Authorization: "Token " + token},
			}).then(res => console.log(res));
	}
	

	// Update currentTrip
	localStorage.setItem('trip', JSON.stringify(currentTrip));

	return updateObject(state, {
		trip: currentTrip,
	})
}

const activitiesFocus = (state, action) => {
	var list;
	if (state.browsingToggle) {
		list = [...state.activitiesShown["currentList"]];
	} else {
		list = [...state.searchActivitiesShown];
	}
	return updateObject(state, {
		focusedActivity: list[action.index]
	})
}

const activitiesUnfocus = (state, action) => {
	return updateObject(state, {
		focusedActivity: {},
	})
}

//ITINERARY --------------------------------------------------------------------------
const itineraryLoad = (state, action) => {
	const trip = updateObject(state.trip, {
		itinerary: action.itinerary,
		itiDirections: action.itiDirections,
		finished: true,
	})

		// IF LOGGED IN
	const data = {
		info: JSON.stringify(trip)
	}
	const user = localStorage.user
	if (user) {
		const token = JSON.parse(user)["token"]
		axios.patch(DATABASE_URL + ('api/trips/' + trip["id"] + '/'  ), data, {
				headers: {Authorization: "Token " + token},
			}).then(res => console.log(res));
	}
	// ----------------------------------------------------------------------------

	localStorage.setItem("trip", JSON.stringify(trip));

	return updateObject(state, {
		trip: trip,
		getItineraryLoading: false,
		itineraryLoadDirectionsLoading: false,

	})

}

const itineraryStart = (state, action) => {
	return updateObject(state, {
		getItineraryLoading: true,
	})
}

const itineraryUpdate = (state, action) => {
	var currentIti = [...state.trip.itinerary];
	var fromDay = currentIti[action.fromIndex[0]];
	var toDay = currentIti[action.toIndex[0]];
	var fromActivity = fromDay[action.fromIndex[1]]

	// Delete FROM activity
	fromDay.splice(action.fromIndex[1], 1);
	fromDay[0] = fromDay[0] - fromActivity.recommendedTime;

	// Add TO activity
	toDay.splice(action.toIndex[1], 0, fromActivity);
	toDay[0] = toDay[0] + fromActivity.recommendedTime;

	// Update currentIti
	currentIti[action.fromIndex[0]] = fromDay;
	currentIti[action.toIndex[0]] = toDay;

	const trip = updateObject(state.trip, {
		itinerary: currentIti,
	})

	localStorage.setItem("trip", JSON.stringify(trip));

	return updateObject(state, {
		trip: trip,
	})

}

const itineraryLoadDirectionsStart = (state,action) => {
	return updateObject(state, {
		itineraryLoadDirectionsLoading: true,
	})
}

const itineraryLoadDirections = (state, action) => {
	const trip = updateObject(state.trip, {
		itiDirections: action.itiDirections,
		itinerary: action.itinerary
	})

	localStorage.setItem("trip", JSON.stringify(trip));

	return updateObject(state, {
		trip: trip,
		itineraryLoadDirectionsLoading: false,
	})
}

const itineraryFocusDay = (state, action) => {
	var newTrip = updateObject(state.trip, {
		focusedDay: action.focusedDay,
	})

	return updateObject(state, {
		trip: newTrip,
		itineraryFocusDayLoading: false,
	})
}

const itineraryFocusDayLoad = (state, action) => {
	return updateObject(state, {
		itineraryFocusDayLoading: true,
	})
}

const suggestionsStart = (state, action) => {
	return updateObject(state, {
		suggestionsLoading: true,
	})
}
const suggestionsAdd = (state, action) => {
	var newSearchActivitiesShown = [...state.searchActivitiesShown];
	newSearchActivitiesShown = newSearchActivitiesShown.filter( (activity) => activity.name !== action.suggestion.name)
	newSearchActivitiesShown = [ action.suggestion , ...newSearchActivitiesShown]
	
	return updateObject(state, {
		searchActivitiesShown: newSearchActivitiesShown,
		suggestionsLoading: false,
	})
}

const suggestionsClear = (state, action) => {
	var newSearchActivitiesShown = [...state.searchActivitiesShown]
	newSearchActivitiesShown = [newSearchActivitiesShown[0]];

	return updateObject(state, {
		searchActivitiesShown: newSearchActivitiesShown
	})
}
const changeBrowsing = (state, action) => {
	return updateObject(state, {
		browsingToggle: action.browsingToggle
	})
}

const retrieveStart = (state, action) => {
	return updateObject(state, {
		retrieveLoading: true,
	})
}

const retrieveTrip = (state, action) => {
	localStorage.setItem('trip', JSON.stringify(action.trip))
	return updateObject(state, {
		trip: action.trip,
		retrieveLoading: false,
	})
}
const reducer = (state=initialState, action) => {
	switch(action.type) {

		case actionTypes.ACTIVITY_EDIT: return activitiesEdit(state,action);
		case actionTypes.ACTIVITY_SUBTRACT: return activitiesSubtract(state, action);
		case actionTypes.ACTIVITY_ADD: return activitiesAdd(state, action);
		case actionTypes.ACTIVITY_FOCUS: return activitiesFocus(state, action);
		case actionTypes.ACTIVITY_UNFOCUS: return activitiesUnfocus(state, action);
		case actionTypes.ACTIVITIES_START: return activitiesStart(state, action);
		case actionTypes.ACTIVITIES_LOAD: return activitiesLoad(state, action);
		case actionTypes.ACTIVITY_CLEARALL: return clearAllActivities(state, action);
		case actionTypes.MAP_BOUNDS_CHANGED: return updateBounds(state, action);
		case actionTypes.MAP_ADD_DIRECTIONS: return mapAddDirections(state, action);
		case actionTypes.NEW_TRIP: return newTrip(state, action);
		case actionTypes.CHECK_TRIP: return checkTrip(state,action);
		case actionTypes.NEW_TRIP_START: return newTripStart(state, action);
		case actionTypes.AUTH_START: return authStart(state, action);
		case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
		case actionTypes.AUTH_FAIL: return authFail(state, action);
		case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
		
		case actionTypes.ITINERARY_LOAD: return itineraryLoad(state, action);
		case actionTypes.ITINERARY_START: return itineraryStart(state, action);
		case actionTypes.ITINERARY_UPDATE: return itineraryUpdate(state, action);
		case actionTypes.ITINERARY_FOCUS_DAY: return itineraryFocusDay(state, action);
		case actionTypes.ITINERARY_FOCUS_DAY_LOAD: return itineraryFocusDayLoad(state, action);
		case actionTypes.ITINERARY_LOAD_DIRECTIONS_START: return itineraryLoadDirectionsStart(state,action);
		case actionTypes.ITINERARY_LOAD_DIRECTIONS: return itineraryLoadDirections(state, action);

		case actionTypes.SUGGESTIONS_ADD: return suggestionsAdd(state,action);
		case actionTypes.SUGGESTIONS_START: return suggestionsStart(state,action);
		case actionTypes.SUGGESTIONS_CLEAR: return suggestionsClear(state,action);
		case actionTypes.CHANGE_BROWSING: return changeBrowsing(state, action);

		case actionTypes.RETRIEVE_START: return retrieveStart(state,action);
		case actionTypes.RETRIEVE_TRIP: return retrieveTrip(state,action);

		default:
			return state;
	}
}

export default reducer