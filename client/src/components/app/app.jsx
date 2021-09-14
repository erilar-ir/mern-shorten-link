import React from 'react'
import 'materialize-css'
import 'materialize-css/dist/css/materialize.min.css'
import './app.css'
import {BrowserRouter as Router} from "react-router-dom";
import Routes from "../../routes";
import {AuthContext} from "../../context";
import {useAuth} from "../../hooks/auth.hook";
import Header from "../header";
import Loader from "../loader";


function App() {
    const {token, userId, login, logout, ready} = useAuth()
    const isAuthenticated = !!token
    const routes = Routes(isAuthenticated)

    if (!ready) {
        return <Loader />
    }

    return (
        <AuthContext.Provider value={
            {token, userId, login, logout, isAuthenticated}
        }>

            <Router>
                {isAuthenticated && <Header/>}
                <div className={'container'}>
                    {routes}
                </div>

            </Router>
        </AuthContext.Provider>
    )
}

export default App
