import React from "react";
import './create-page.css'
import {useSelector} from "react-redux";
import {selectIsAuthenticated} from "../../store/auth-slice";
import GenerateLinkForm from "./generate-link-form";
export const CreatePage = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated)

    if (!isAuthenticated) {
        return history.push('/auth')
    }

    return (
        <div className={'create-page'}>
            <div className="row">
                <div className="col s8 offset-s2">
                    <GenerateLinkForm />
                </div>
            </div>

        </div>
    )
}
