// Basic Imports
import React, { Component } from "react";
// -------------------------------------------------------------------------

//Imports needed for redux
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
// -------------------------------------------------------------------------

import NavBar from '../Components/navBar';
import { Spinner } from 'react-bootstrap';

/** Container, renders sign up page.
* @memberof Container
* @param {Component} Navbar, renders navigation bar.
* @param {ReduxAction} checkTrip, updates redux state of trip with local storage
* @param {ReduxAction} authCheckState, updates redux state of user with local storage
* @param {ReduxAction} authSignup, updates redux state of new user sign up info.
*/
class Signup extends Component {

    componentDidMount() {
      //Updates login status into redux.
      this.props.onTryAutoSignup();

      //If user is logged in, redirect to main page.
      if (localStorage.user !== null && localStorage.user !== undefined) {
        alert("Please logout to create a new account");
        this.props.history.push('/');
      }
    }

    //Happens upon receiving updated login information.
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.isAuthenticated) {
            this.props.history.push('/');
        }
    }

    /**
    * Called upon submission of signup form, then calls redux-action (authLogin) to signup and update redux state.
    * @param {Object} event: contains form information about username, password and email
    */
    handleSubmit = (event) => {
        event.preventDefault();
        this.props.onAuth(event.target.username.value, event.target.email.value,
          event.target.password1.value, event.target.password2.value);
      }

    render() {
        return (
          <div className = "container-fluid align-items-center" id="signupPage">
              <NavBar from={this.props.location.pathname}/>
              
              <div className = "jumbotron bigBox" id="signup-startbox">
                <h1> Sign Up</h1>
                  <form onSubmit={this.handleSubmit}>
                    <div className = "element">
                      <input type = "text" name = "username" placeholder = "Enter Username" />
                    </div>
                    
                    <div className = "element">
                      <input type = "text" name = "email" placeholder = "Enter Email" />
                    </div>

                    <div className = "element">
                      <input type = "password" name = "password1" placeholder = "Enter Password" />
                    </div>

                    <div className = "element">
                      <input type = "password" name = "password2" placeholder = "Enter Password again" />
                    </div>
                    {
                      this.props.loading ? 
                        <Spinner animation="border" role="status" className = "element">
                          <span className="sr-only">Loading...</span>
                        </Spinner>
                      :
                        <button className = "element" type="submit" value = "Submit"> Submit </button>
                    }
                  </form>
              </div>
          </div>);

    }

}

const mapStateToProps = (state) => {
    return {
      loading: state.loading,
      isAuthenticated: state.user !== null

    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (username, email, password1, password2) => dispatch(actions.authSignup(username, email, password1, password2)),
        onTryAutoSignup: () => dispatch(actions.authCheckState()),
        
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);