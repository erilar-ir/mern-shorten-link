import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";

import WelcomePage from "../components/welcome-page";
import LinksPage from "../components/links-page";
import CreatePage from "../components/create-page";
import DetailsPage from "../components/details-page";
import AuthPage from "../components/auth-page";
import GroupsManagement from "../components/groups-manage";
import GroupDetails from "../components/group-details";
import DashboardPage from "../components/dashboard-page";

export const Routes = (isAuthenticated) => {
    if (!isAuthenticated) {
        return (
            <Switch>
                <Route path={'/'} exact>
                    <WelcomePage />
                </Route>
                <Route path={'/auth'} exact>
                    <AuthPage />
                </Route>
                <Redirect to={'/'} />
            </Switch>
        )
    }

    return (
        <Switch>
            <Route path={'/'} exact>
                <DashboardPage />
            </Route>
            <Route path={'/links'} exact>
                <div className={'container'}>
                    <LinksPage/>
                </div>
            </Route>
            <Route path={'/create'} exact>
                <div className={'container'}>
                    <CreatePage/>
                </div>
            </Route>
            <Route path={'/details/:id'}>
                <div className={'container'}>
                    <DetailsPage/>
                </div>
            </Route>
            <Route path={'/groups/:id'}>
                <div className={'container'}>
                    <GroupDetails />
                </div>
            </Route>
            <Route path={'/management'}>
                <div className={'container'}>
                    <GroupsManagement/>
                </div>
            </Route>
            <Redirect to={'/'}/>
        </Switch>
    )
}
