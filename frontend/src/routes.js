import React from 'react';
import { Route, Switch } from 'react-router-dom';
import StartPage from './Containers/StartPage';
import Login from './Containers/Login';
import Signup from './Containers/Signup';
import MyTrips from './Containers/MyTrips';

const BaseRoute = () => (
	<Switch> 
		<Route exact path='/' component = {StartPage} />
		<Route exact path ='/login/' component = {Login} />
		<Route exact path ='/signup/' component = {Signup} />
		<Route exact path ='/mytrips' component = {MyTrips} />
	</Switch> );

export default BaseRoute;
		
