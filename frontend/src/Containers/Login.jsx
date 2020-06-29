// Basic Imports
import React, { Component } from "react";
// -------------------------------------------------------------------------

//Imports needed for redux
import * as actions from '../store/actions/actions';
import { connect } from 'react-redux';
// -------------------------------------------------------------------------

import NavBar from '../Components/navBar';
import "./CSS/global.css"
import { Spinner } from 'react-bootstrap';

/** Container, renders login page.
* @memberof Container
* @param {Component} Navbar, renders navigation bar.
* @param {ReduxAction} checkTrip, updates redux state of trip with local storage
* @param {ReduxAction} authCheckState, updates redux state of user with local storage
* @param {ReduxAction} authLogin, updates redux state of user with logged in information.
*/
class Login extends Component {

    componentDidMount() {
      //Updates login status into redux.
      this.props.onTryAutoSignup();

      //Checks if logged in, redirect to mainpage/startpage.
      if (localStorage.user !== null && localStorage.user !== undefined) {
        this.props.history.push('/');
      }
    }

    //Happens upon receiving updated login information.
    componentDidUpdate(prevProps, prevState, snapshot) {
        //Checks where the page came from, if legit page, then redirect to where they came from.
        if (this.props.isAuthenticated) {
          if (this.props.location.state === undefined || this.props.location.state === null) {
            this.props.history.push('/');
          } else {
            const from = this.props.location.state.from;
            this.props.history.push(from);
            this.setState({from: null});
          }
        }
    }
    /**
    * Called upon submission of login form, then calls redux-action (authLogin) to login and update redux state.
    * @param {Object} event: contains form information about username and password.
    */
    handleSubmit = (event) => {
        event.preventDefault();
        this.props.onAuth(event.target.username.value, event.target.password.value);
      }

    render() {
        return (
          <div className = "container-fluid align-items-center" id="login">
              <NavBar from={this.props.location.pathname}/>
              <div className = "jumbotron startBox" id="login-startbox">
                <h1> Login</h1> 
                  <form onSubmit={this.handleSubmit}>
                    <div className = "element">
                      <input type = "text" name = "username" placeholder = "Enter Username" />
                    </div>
                    
                    <div className = "element">
                      <input type = "password" name = "password" placeholder = "Enter Password" />
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
      isAuthenticated: state.user !== null,
      loading: state.loading,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignup: () => dispatch(actions.authCheckState()),
        onAuth: (username, password) => dispatch(actions.authLogin(username, password)) 
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);