import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../utility';

const initialState = {
	error: null,
	loading: false,
	activitiesLoading: false,

	user: null,

	trip: {
		'country' : "",
		'lat' : -1,
		'lng' : -1,
		'startDate': "",
		'endDate' : "",
		'activitiesAdded' : [],
		'activitiesAddedIds' : [],
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

            "center": null,

            "radius": -1,
		}
	},

	activitiesShown: [],
	fullActivitiesShown: [],
	firstActivityCounter: 0, 
	nextPageToken: -1,
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
		const newFullActivitiesShown = [...state.fullActivitiesShown, action.activitiesShown ];
		return updateObject(state, {
			activitiesShown: action.activitiesShown,
			fullActivitiesShown: newFullActivitiesShown,
			activitiesLoading: false,
			nextPageToken: action.nextPageToken,
			pageNumber: state.pageNumber + 1
		})

	// On first load of data, re-initiate everything.
	} else {
		return updateObject(state, {
			activitiesShown: action.activitiesShown,
			fullActivitiesShown: [action.activitiesShown],
			activitiesLoading: false,
			pageNumber: 0,
			nextPageToken: action.nextPageToken,
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
	var activityAdded = state.activitiesShown[action.index];
	activityAdded = updateObject(activityAdded, {added: true});

	// Replace the activity in ActivitiesShown with a new one that says added:true
	var activitiesShown = [...state.activitiesShown];
	activitiesShown[action.index] = activityAdded;

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

		default:
			return state;
	}
}

export default reducer