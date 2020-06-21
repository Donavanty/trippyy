import React from 'react';
import ReactDOM from 'react-dom';
import BaseRouter from './routes';
import { BrowserRouter as Router} from 'react-router-dom';
// import * as serviceWorker from './serviceWorker';

import reducer from './store/reducers/reducer';
import { createStore , compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux'
import thunk from 'redux-thunk' 

const composeEnhances = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(reducer, composeEnhances(
		applyMiddleware(thunk)
	));


/**
 * Actions
 * @module Actions
 */

 /**
 * Components
 * @module Components
 */

 /**
 * Containers
 * @module Containers
 */
 
const app = (
	<Provider store={store}>
		<Router>
	  		<BaseRouter />
	  	</Router>
	</Provider>);

ReactDOM.render(
  app, document.getElementById('root')
);