import * as actionTypes from './actionTypes';
import axios from 'axios';

const DATABASE_URL = "https://trippyy-backend.herokuapp.com/"

export const authStarted = () => {
	return {
		type: actionTypes.AUTH_START
	}
}

export const authSuccessed = (token, username, userId) => {
	return {
		token: token,
		type: actionTypes.AUTH_SUCCESS,
		username: username,
		userId: userId
	}
}

export const authFailed = (error) => {
	alert(error);
	return {
		error: error,
		type: actionTypes.AUTH_FAIL
	}
}

export const logouted = () => {
	localStorage.removeItem('username');
	localStorage.removeItem('user');
	localStorage.removeItem('expirationDate');
	localStorage.removeItem('token');
	localStorage.removeItem('userId');
	return {
		type: actionTypes.AUTH_LOGOUT
	}
}

export const checkAuthTimeouted = expirationTime => {
	return dispatch => {
		setTimeout( () => {
			dispatch(logouted());
		}, expirationTime * 1000)
	}
}
export const authLogined = (username, password) => {
	return dispatch => {
		dispatch(authStarted());
		axios.post(DATABASE_URL + 'api/authenticate/', {
			username: username,
			password: password
		}).then(res => {
			const token = res.data.token;
			const userId = res.data.id;
			const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
			localStorage.setItem('token', token);
			localStorage.setItem('expirationDate', expirationDate);
			localStorage.setItem('username', username);
			localStorage.setItem('userId', userId);
			dispatch(authSuccessed(token, username, userId));
			dispatch(checkAuthTimeouted(3600));
		})
		.catch(err => {
			dispatch(authFailed(err))
		})
	}
}

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

export const authCheckedState = () => {
	return dispatch => {
		const token = localStorage.getItem('token');
		const username = localStorage.getItem('username');
		if (token === undefined) {
			dispatch(logouted());
		} else {
			const expirationDate = new Date(localStorage.getItem('expirationDate'));
			if (expirationDate <= new Date() ) {
				dispatch(logouted());
			} else {
				dispatch(authSuccessed(token, username));
				dispatch(checkAuthTimeouted( (expirationDate.getTime() - new Date().getTime()) / 1000 ));
			}

		}
	}	
}

// ---------------------------------------------------------------------------------

export const newTrip = (country, startDate, endDate) => {
	const data = {
				destination: country,
				tripName: "Trip to " + country + " from " + startDate + " to " + endDate,
				startDate: startDate,
				endDate: endDate
			}
	axios.post(DATABASE_URL + 'api/trips/', data, {
			headers: {Authorization: "Token " + localStorage.token},
		}).then(res => console.log(res));
	localStorage.setItem('country', country);
	localStorage.setItem('startDate', startDate);
	localStorage.setItem('endDate', endDate);
	return {
		type: actionTypes.NEW_TRIP,
		country: country,
		startDate: startDate,
		endDate: endDate
	}

}