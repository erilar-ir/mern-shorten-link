import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import $api from "../services/api.service";

const storageName = 'userData'

const logoutRoutine = state => {
    state.isAuthenticated = false
    localStorage.removeItem(storageName)
    state.status = 'success'
    state.ready = true
    state.authError = null
}
const loginRoutine = (state, action) => {
    const userData = {
        accessToken: action.payload.accessToken
    }
    localStorage.setItem(storageName, JSON.stringify(userData))
    state.isAuthenticated = true
    state.status = 'success'
    state.ready = true
    state.authError = null
}

const loadingRoutine = state => {
    state.status = 'loading'
    state.ready = false
}

export const login = createAsyncThunk('auth/login', async ({email, password}, thunkAPI) => {
    try {
        const response = await $api.post('/api/auth/login', {email: email, password: password})
        return response.data
    } catch (e) {
        return thunkAPI.rejectWithValue(e)
    }
})
export const register = createAsyncThunk('auth/register', async ({email, password}, thunkAPI) => {
    try {
        const response = await $api.post('/api/auth/register', {email: email, password: password})
        return response.data
    } catch (e) {
        return thunkAPI.rejectWithValue(e)
    }
})
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
    try {
        const response = await $api.post('/api/auth/logout')
        return response.data
    } catch (e) {
        return thunkAPI.rejectWithValue(e)
    }
})
export const checkAuth = createAsyncThunk('auth/check', async (_, thunkAPI) => {
    try {
        // console.log('trying to check')
        const response = await axios.get('/api/auth/refresh', {withCredentials: true})
        return response.data
    } catch (e) {
        // console.log(e.response)
        const error = e.response.data
        error.status = e.response.status
        error.message = 'Session expired. Please login again.'
        // console.log('error in thunk', error)
        return thunkAPI.rejectWithValue(error)
    }
})

const authSlice = createSlice({
        name: 'auth',
        initialState: {
            isAuthenticated: !!localStorage.getItem('userData'),
            authError: null,
            status: 'idle',
            ready: true
        },
        reducers: {
            clearError(state) {
                state.authError = null
            },
            setReady(state, action) {
                state.ready = action.payload
            },
            setAuthError(state, action) {
                state.error = action.payload
            }
        },
        extraReducers(builder) {
            builder
                .addCase(register.pending, (state) => {
                    loadingRoutine(state)
                })
                .addCase(register.fulfilled, (state, action) => {
                    loginRoutine(state, action)
                })
                .addCase(register.rejected, (state, action) => {
                    state.isAuthenticated = false
                    state.ready = true
                    state.status = 'failed'
                    state.authError = {message: action.payload.message, status: action.payload.status}
                })
                .addCase(login.pending, (state) => {
                    loadingRoutine(state)
                })
                .addCase(login.fulfilled, (state, action) => {
                    loginRoutine(state, action)
                })
                .addCase(login.rejected, (state, action) => {
                    state.isAuthenticated = false
                    state.ready = true
                    state.status = 'failed'
                    state.authError = {message: action.payload.message, status: action.payload.status}
                })
                .addCase(logout.pending, (state) => {
                    loadingRoutine(state)
                })
                .addCase(logout.fulfilled, (state) => {
                    logoutRoutine(state)
                })
                .addCase(logout.rejected, (state, action) => {
                    state.authError = {message: action.payload.message, status: action.payload.status}
                })
                .addCase(checkAuth.pending, (state) => {
                    loadingRoutine(state)
                })
                .addCase(checkAuth.fulfilled, (state, action) => {
                    loginRoutine(state, action)
                })
                .addCase(checkAuth.rejected, (state, action) => {
                    state.authError = {message: action.payload.message, status: action.payload.status}
                    logoutRoutine(state)
                })
        }
    }
)
export const {clearError, setAuthError} = authSlice.actions
export default authSlice.reducer

export const selectAuthStatus = state => state.auth.status
export const selectIsAuthenticated = state => state.auth.isAuthenticated
export const selectAuthReady = state => state.auth.ready
export const selectAuthError = state => state.auth.authError
