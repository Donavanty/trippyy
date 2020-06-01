import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../utility';

const initialState = {
	token: null,
	error: null,
	loading: false,
	username: null,
	userId: null,

	trip: {
		'country' : null,
		'lat' : null,
		'lng' : null,
		'startDate': null,
		'endDate' : null,
	}
}

const authStart = (state, action) => {
	return updateObject(state, {
		error: null,
		loading: true
	});
}

const authSuccess = (state, action) => {
	return updateObject(state, {
		token: action.token,
		error: null,
		loading: false,
		username: action.username,
		userId: action.userId,
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
		token: null,
		trip: null,
	});
}

const newTrip = (state, action) => {
	return updateObject(state, {
		trip: action.trip,
		loading: false
	})
}

const reducer = (state=initialState, action) => {
	switch(action.type) {

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