import React, {useContext} from "react";
import {NavLink, useHistory} from "react-router-dom";
import {AuthContext} from "../../context";
import './header.css'

export const Header = () => {

  const history = useHistory()

  const { logout } = useContext(AuthContext)
  const logoutHandler =  event => {
    event.preventDefault()
    logout()
    history.push('/')
  }

  return (
      <nav>
        <div className="nav-wrapper header teal lighten-1">
          <span className="brand-logo">Shorten Link</span>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li><NavLink to={'/create'}>Create</NavLink></li>
            <li><NavLink to={'/links'}>Links</NavLink></li>
            <li><a href="/" onClick={logoutHandler}>Logout</a></li>
          </ul>
        </div>
      </nav>
  )
}
