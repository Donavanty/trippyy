import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../utility';

const initialState = {
	error: null,
	loading: false,
	activitiesLoading: false,
	getItineraryLoading: false,

	user: null,

	trip: {
		'country' : -1,
		'lat' : -1,
		'lng' : -1,
		'startDate': -1,
		'endDate' : -1,
		'activitiesAdded' : [],
		'activitiesAddedIds' : [],
		'itinerary' : [[]],
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
		}
	},

	activitiesShown: {
		"currentList": [],
		"fullList": [], 
		"firstActivityCounter": -1, 
		"pageNumber": -1,
		
		"nextPageToken": -1,

		"hasNextPageLoaded": false,
		"pageLoadedUpTo": -1,
	}
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
		'username': action.username
	}
	
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
	});
}

const newTrip = (state, action) => {
	return updateObject(state, {
		trip: action.trip,
		loading: false
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

const activitiesLoad = (state, action) => {
	// If load next page, get and display next page data, and add onto fullActivitiesShown list
	if (action.dataType == "NEXTKEYSEARCH") {
		const newFullList = [...state.activitiesShown.fullList, action.activitiesShown ];
		const activitiesShown = {
			currentList: action.activitiesShown,
			fullList: newFullList,
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
	// ASSERT that fullList at this point would have shit.
	} else if (action.dataType == "GOPREV") {
		const newCurrentList = [...state.activitiesShown.fullList[state.activitiesShown.pageNumber - 1]]
		const activitiesShown = updateObject(state.activitiesShown, {
			currentList: newCurrentList,
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
	} else if (action.dataType == "GONEXT") {
		const newCurrentList = [...state.activitiesShown.fullList[state.activitiesShown.pageNumber + 1]]
		var hasNextPageLoaded;
		if (state.activitiesShown.pageNumber + 1 >= state.activitiesShown.pageLoadedUpTo) {
			hasNextPageLoaded = false
		} else {
			hasNextPageLoaded = true
		}
		const activitiesShown = updateObject(state.activitiesShown, {
			currentList: newCurrentList,
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

	// Retrieve activity that was added by referencing the index (id) 
	// Update the activity such that {added: true}
	var activityAdded = state.activitiesShown.currentList[action.index];
	activityAdded = updateObject(activityAdded, {added: true});

	// Replace the activity in ActivitiesShown with a new one that says added:true
	var activitiesShownCurrentList = [...state.activitiesShown.currentList];
	activitiesShownCurrentList[action.index] = activityAdded;

	var activitiesShownFullList = [...state.activitiesShown.fullList];
	activitiesShownFullList[state.activitiesShown.pageNumber][action.index] = activityAdded;

	var activitiesShown = updateObject(state.activitiesShown, {
		currentList: activitiesShownCurrentList,
		fullList: activitiesShownFullList,
	})


	// Merge all changes into currentTrip
	currentTrip['activitiesAdded'].push(activityAdded);
	currentTrip['activitiesAddedIds'].push(activityAdded.id)

	// Update currentTrip
	localStorage.setItem('trip', JSON.stringify(currentTrip));

	return updateObject(state, {
		trip: currentTrip,
		activitiesShown: activitiesShown,
	})
}

const itineraryLoad = (state, action) => {
	const trip = updateObject(state.trip, {
		itinerary: action.itinerary
	})

	return updateObject(state, {
		trip: trip,
		getItineraryLoading: false,

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

	// Add TO activity
	toDay.splice(action.toIndex[1], 0, fromActivity);

	// Update currentIti
	currentIti[action.fromIndex[0]] = fromDay;
	currentIti[action.toIndex[0]] = toDay;

	const trip = updateObject(state.trip, {
		itinerary: currentIti,
	})
	return updateObject(state, {
		trip: trip,
	})

}

const reducer = (state=initialState, action) => {
	switch(action.type) {

		case actionTypes.ACTIVITY_ADD: return activitiesAdd(state,action);
		case actionTypes.ACTIVITIES_START: return activitiesStart(state, action);
		case actionTypes.ACTIVITIES_LOAD: return activitiesLoad(state, action);
		case actionTypes.MAP_BOUNDS_CHANGED: return updateBounds(state, action);
		case actionTypes.NEW_TRIP: return newTrip(state, action);
		case actionTypes.AUTH_START: return authStart(state, action);
		case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
		case actionTypes.AUTH_FAIL: return authFail(state, action);
		case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
		
		case actionTypes.ITINERARY_LOAD: return itineraryLoad(state, action);
		case actionTypes.ITINERARY_START: return itineraryStart(state, action);
		case actionTypes.ITINERARY_UPDATE: return itineraryUpdate(state, action);

		default:
			return state;
	}
}

export default reducer