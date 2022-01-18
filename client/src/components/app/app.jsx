import React, {useEffect, useLayoutEffect} from 'react'
import 'materialize-css/dist/css/materialize.css'
import './app.css'
import {BrowserRouter as Router} from "react-router-dom";
import Routes from "../../routes";
import {useMessage} from "../../hooks";
import Header from "../header";
import Loader from "../loader";
import {useDispatch, useSelector} from "react-redux";
import {getLinks, linksSliceStatus,} from "../../store/link-slice";
import {getGroups, selectGroupSliceStatus} from '../../store/group-slice'
import {checkAuth, clearError, selectAuthReady, selectAuthStatus, selectIsAuthenticated} from '../../store/auth-slice'
import ErrorBoundary from "../error-boundary";

const storageName = 'userData'

function App() {
    const isAuthenticated = useSelector(selectIsAuthenticated)
    const ready = useSelector(selectAuthReady)
    const groupsStatus = useSelector(selectGroupSliceStatus)
    const linksStatus = useSelector(linksSliceStatus)
    const authStatus = useSelector(selectAuthStatus)
    const routes = Routes(isAuthenticated)
    const dispatch = useDispatch()
    const message = useMessage()

    useLayoutEffect(() => {
        const authCheck = async () => {
            if (localStorage.getItem(storageName)) {
                try {
                    await dispatch(checkAuth()).unwrap()
                } catch (e) {
                    message(e.message, 'warn')
                    return dispatch(clearError)
                }
            }
        }
        authCheck()
    }, [])

    useEffect(() => {

        const fetchData = async () => {
            if (linksStatus === 'idle' && authStatus === 'success' && isAuthenticated) {
                try {
                    await dispatch(getLinks()).unwrap()
                } catch (e) {
                    message(e.message, 'error')
                }
            }
            if (groupsStatus === 'idle' && authStatus === 'success' && isAuthenticated) {
                try {
                    await dispatch(getGroups()).unwrap()
                } catch (e) {
                    message(e.message, 'error')
                }
            }
        }
        fetchData()

    }, [authStatus])

    if (!ready  || linksStatus === 'loading' || groupsStatus === 'loading') {
        return <Loader/>
    }

    return (
        <Router>
            <Header/>
            <ErrorBoundary>
                {routes}
            </ErrorBoundary>
        </Router>
    )
}

export default App
