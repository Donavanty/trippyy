import React from 'react';
import { Route, Switch } from 'react-router-dom';
import StartPage from './Containers/StartPage';
import Login from './Containers/Login';
import Signup from './Containers/Signup';
import MyTrips from './Containers/MyTrips';
import Shopping from './Containers/Shopping';
import Results from './Containers/Results';

import ActivitySearch from './Components/ActivitySearch'

const BaseRoute = () => (
	<Switch> 
		<Route exact path='/' component = {StartPage} />
		<Route exact path ='/login/' component = {Login} />
		<Route exact path ='/signup/' component = {Signup} />
		<Route exact path ='/mytrips' component = {MyTrips} />
		<Route exact path ='/shopping' component = {Shopping} />
		<Route exact path ='/results' component = {Results} />
		<Route exact path ='/hehetesting' component = {ActivitySearch}/>

	</Switch> );

export default BaseRoute;
		
