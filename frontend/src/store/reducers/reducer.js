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

	activitiesShown: []
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
	return updateObject(state, {
		activitiesShown: action.activitiesShown,
		activitiesLoading: false
	})
}

const activitiesStart = (state, action) => {
	return updateObject(state, {
		activitiesLoading: true
	})
}

const reducer = (state=initialState, action) => {
	switch(action.type) {

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