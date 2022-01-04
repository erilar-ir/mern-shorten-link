import React, {useEffect} from "react";
import {NavLink, useHistory, useLocation} from "react-router-dom";
import './header.css'
import {useMessage, useModal} from "../../hooks";
import {useDispatch, useSelector} from "react-redux";
import {logout, selectIsAuthenticated} from "../../store/auth-slice";
import M from 'materialize-css'

export const Header = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated)
    const dispatch = useDispatch()
    const history = useHistory()
    const message = useMessage()
    const addModal = useModal('add', {flatModal: true, noTooltip: true, focused: true})
    const logoutHandler = async event => {
        event.preventDefault()
        dispatch(logout())
        history.push('/auth')
        message('Logged Out', 'success')
    }
    const {pathname} = useLocation()
    const split = pathname.split('/')
    useEffect(() => {
        const sideBarElement = document.querySelectorAll('.sidenav')
        if (sideBarElement.length !==0) {
            M.Sidenav.init(sideBarElement, {draggable: true})
        }
        const dropdownTrigger = document.querySelectorAll('.dropdown-trigger')
        if (dropdownTrigger.length !== 0) {
            M.Dropdown.init(dropdownTrigger, {coverTrigger: false, constrainWidth: false})
        }
    }, [])
    if (!isAuthenticated) {
        return (
            <div className="header">
                <nav>
                    <div className="nav-wrapper header teal lighten-1">
                    <span className={` brand-logo ${split[1] === '' ? 'active' : ''}`}><NavLink
                        to={'/'}>ShrInk.tech</NavLink></span>
                        <a href="#" data-target="mobile-menu" className="sidenav-trigger"><i
                            className="material-icons">menu</i></a>
                        <ul id="nav-mobile" className="right hide-on-med-and-down">
                            <li className={split[1] === 'auth' ? 'active' : ''}>
                                <NavLink to={'/auth'}>
                                    <i className={'material-icons left'}>account_circle</i>Sign In | Sign Up
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </nav>
                <ul className="sidenav" id="mobile-menu">
                    <li className={split[1] === 'auth' ? 'active' : ''}><NavLink to={'/auth'} className={'sidenav-close'}><i
                        className={'material-icons'}>account_circle</i>Login /
                        Register</NavLink></li>
                </ul>
            </div>
        )
    }
    return (
        <div className={'header'}>
            <ul id="account-dropdown" className="dropdown-content">
                <li><a href="/" onClick={logoutHandler}><i
                    className="material-icons left">exit_to_app</i>Logout</a></li>
            </ul>
            <nav>
                <div className="nav-wrapper teal lighten-1">
                    <span className={`brand-logo ${split[1] === '' ? 'active' : ''}`}><NavLink
                        to={'/'}>ShrInk.tech</NavLink></span>
                    <a href="#" data-target="mobile-menu" className="sidenav-trigger"><i
                        className="material-icons">menu</i></a>

                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        <li>
                            {addModal}
                        </li>
                        <li className={split[1] === 'links' ? 'active' : ''}><NavLink to={'/links'}>Links</NavLink></li>
                        <li className={split[1] === 'management' ? 'active' : ''}><NavLink
                            to={'/management'}>Groups</NavLink></li>
                        <li><a className="dropdown-trigger" data-target="account-dropdown"><i
                            className={'material-icons'}>account_circle</i></a></li>
                    </ul>
                </div>
            </nav>
            <ul className="sidenav" id="mobile-menu">
                <li className={split[1] === 'create' ? 'active' : ''}>
                    <NavLink className={'sidenav-close'} to={'/create'} ><i className={'material-icons left'}>add</i> Create</NavLink>
                </li>
                <li className={split[1] === 'links' ? 'active' : ''}><NavLink className={'sidenav-close'}
                                                                              to={'/links'}>Links</NavLink></li>
                <li className={split[1] === 'management' ? 'active' : ''}><NavLink className={'sidenav-close'}
                                                                                   to={'/management'}>Groups</NavLink>
                </li>
                <li><a className={'sidenav-close'} href="/" onClick={logoutHandler}><i
                    className={'material-icons'}>account_circle</i>Logout</a></li>
            </ul>
        </div>


    )
}
