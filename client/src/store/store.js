import {configureStore } from "@reduxjs/toolkit";
import linksReducer from "./link-slice";
import groupReducer from "./group-slice";
import authReducer from "./auth-slice"

const store = configureStore({
    reducer: {
        auth: authReducer,
        links: linksReducer,
        groups: groupReducer,
    }
})


export default store
