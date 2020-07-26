// Basic Imports
import React, { Component } from "react";
// -------------------------------------------------------------------------

//Imports needed for redux
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
// -------------------------------------------------------------------------

import NavBar from '../Components/navBar';
import { Spinner } from 'react-bootstrap';
import "./CSS/UserForm.css"
import LazyLoad from 'react-lazy-load';
import SBG from '../assets/startBackground.jpg'


function isASCII(str) {
    return /^[a-zA-Z0-9]*$/.test(str);
}

function isValidEmail(email) 
    {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

/** Container, renders sign up page.
* @memberof Container
* @param {Component} Navbar, renders navigation bar.
* @param {ReduxAction} checkTrip, updates redux state of trip with local storage
* @param {ReduxAction} authCheckState, updates redux state of user with local storage
* @param {ReduxAction} authSignup, updates redux state of new user sign up info.
*/
class Signup extends Component {

    state = {
      approvedUsername: false,
      errorUsername: "",
      approvedEmail: false,
      errorEmail: "",
      approvedPassword: false,
      errorPassword: "",
      
    }

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

        if (event.target.username.value.length < 3) {
          alert("Username must be of length 4 and above.");
          return;

        } else if (!isASCII(event.target.username.value)) {
          alert("Username must not contain any special characters");
          return;

        } else if (!(isValidEmail(event.target.email.value))) {
          alert("Please enter a valid email.");
          return;

        } else if (!isASCII(event.target.password1.value)) {
          alert("Passwords must not contain any special characters");
          return;

        } else if (!isASCII(event.target.password2.value)) {
          alert("Passwords must not contain any special characters");
          return;

        } else if (event.target.password1.value !== event.target.password2.value) {
          alert("Passwords are not identical.");
          return;

        } else if (event.target.password1.value.length < 7) {
          alert("Passwords must be at least of length 8.")
          return;
        }

        this.props.onAuth(event.target.username.value, event.target.email.value,
          event.target.password1.value, event.target.password2.value);
      }

    usernameOnChange = (event) => { 
      // TODO
    }

    emailOnChange = (event) => {
      // TODO
    }

    passwordOnChange = (event) => {
      // TODO
    }

    password2OnChange = (event) => {
      // TODO
    }
    render() {
        return (
          <div>
              <LazyLoad>
                <img 
                  src={SBG} 
                  id="startBg"
                  alt="start-bg"/>
              </LazyLoad>

              <NavBar from={this.props.location.pathname}/>
              
              <div className = "bigBox">
                <div className = "loginBox">
                  <h1> Sign Up</h1>
                  <form onSubmit={this.handleSubmit} className ="loginForm">
                    <div className = "formElement">
                      <input type = "text" name = "username" placeholder = "Enter Username" onChange={this.usernameOnChange}/>
                    </div>
                    
                    <div className = "formElement">
                      <input type = "text" name = "email" placeholder = "Enter Email" onChange={this.emailOnChange}/>
                    </div>

                    <div className = "formElement">
                      <input type = "password" name = "password1" placeholder = "Enter Password" onChange={this.passwordOnChange}/>
                    </div>

                    <div className = "formElement">
                      <input type = "password" name = "password2" placeholder = "Enter Password again" onChange={this.password2OnChange}/>
                    </div>
                    {
                      this.props.loading ? 
                        <Spinner animation="border" role="status" className = "formElement">
                          <span className="sr-only">Loading...</span>
                        </Spinner>
                      :
                        <button className = "formElement" type="submit" value = "Submit"> Submit </button>
                    }
                  </form>
                </div>
              </div>
          </div>);

    }

}

const mapStateToProps = (state) => {
    return {
      isAuthenticated: state.user !== null,
      loading: state.loading,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (username, email, password1, password2) => dispatch(actions.authSignup(username, email, password1, password2)),
        onTryAutoSignup: () => dispatch(actions.authCheckState()),
        
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);