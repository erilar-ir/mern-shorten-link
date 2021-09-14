import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";

import LinksPage from "../components/links-page";
import CreatePage from "../components/create-page";
import DetailsPage from "../components/details-page";
import AuthPage from "../components/auth-page";

export const Routes = (isAuthenticated) => {
    if (!isAuthenticated) {
        return (
            <Switch>
                <Route path={'/'} exact>
                    <AuthPage />
                </Route>
                <Redirect to={'/'} />
            </Switch>
        )
    }

    return (
        <Switch>
            <Route path={'/links'} exact>
                <LinksPage/>
            </Route>
            <Route path={'/create'} exact>
                <CreatePage/>
            </Route>
            <Route path={'/details/:id'}>
                <DetailsPage/>
            </Route>
            <Redirect to={'/create'}/>
        </Switch>
    )
}
