import React, {useEffect, useLayoutEffect} from 'react'
// import 'materialize-css'
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
    // const linksError = useSelector(selectLinksError)
    // const authError = useSelector(selectAuthError)
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

    if (!ready || linksStatus === 'loading' || groupsStatus === 'loading') {
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
// 0. Done Refactoring for whole application to use redux instead of hooks, context and local component states
// 1. Done Refactor auth logic to use redux.
// 2. Done Add createLink button to Links list to work in modal
// 2.1 Done Rearrange createPage component to have layout for page view and separate clean form for link creation
// 3. Done Add createLink button to Group details page
// 4. Done Logout logic. Instead of using logout in components added Errors Processing logic inside async thunks so it.s dispatching logout actions if app got 401 error from api and can't refresh it.s accessToken
// 5. Done Add Dashboard Page to view statistics.
// 5.1 Done Add Chart to view group statistics (Done first version)
//
// 6.1 Done Add auth-page link to top navigation
// 7. Done Add active status to active route and navigation link
// 9. Done Add responsiveness to top menu. Add sidebar menu?
// 10. Done Refactor overall responsiveness for all application
//
// 12. Done added description field for groups and title field for links
// 13. Done Add edit-modals and forms to edit links and groups
// 14. Done Add ErrorBoundary for components
// 15. Done Add deletion confirmation modal
// 16. Done Move add new link in group to higher buttons level and do automatic new link assignment to active group

//todo 6. Add Welcome page for unauthorized users. (Done dummy page creation)
//todo 11. Improve Url validation before short link generation
