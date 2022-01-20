import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import $api from "../services"

const storageName = 'userData'


const logoutRoutine = state => {
    state.isAuthenticated = false
    localStorage.removeItem(storageName)
    state.status = 'success'
    state.ready = true
    state.authError = null
    state.userForm = null
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
    state.userForm = null
}

const loadingRoutine = state => {
    state.status = 'loading'
    state.ready = false
}

const rejectRoutine = (state, action) => {
    state.isAuthenticated = false
    state.ready = true
    state.status = 'failed'
    state.authError = {message: action.payload.message, status: action.payload.status, errors: action.payload.errors ? action.payload.errors : []}
}
export const resetPasswordRequest = createAsyncThunk('auth/resetPasswordRequest', async ({email}, thunkAPI) => {
    try {
        const response = await $api.post('/api/auth/requestReset', {email: email})
        return response.data
    } catch (e) {
        return thunkAPI.rejectWithValue(e)
    }
})
export const resetPassword = createAsyncThunk('auth/resetPassword', async ({userId, token, password}, thunkAPI) => {
    try {
        const response = await $api.post('/api/auth/resetPassword', {userId: userId, token: token, password: password})
        return response.data
    } catch (e) {
        return thunkAPI.rejectWithValue(e)
    }
})
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
            ready: true,
            userForm: null
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
            },
            setUserForm(state, action) {
                state.userForm = action.payload
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
                    rejectRoutine(state, action)
                })
                .addCase(login.pending, (state) => {
                    loadingRoutine(state)
                })
                .addCase(login.fulfilled, (state, action) => {
                    loginRoutine(state, action)
                })
                .addCase(login.rejected, (state, action) => {
                    rejectRoutine(state, action)
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
                .addCase(resetPasswordRequest.pending, (state) => {
                    loadingRoutine(state)
                })
                .addCase(resetPasswordRequest.fulfilled, (state, action) => {
                    state.status = 'idle'
                    state.ready = true
                })
                .addCase(resetPasswordRequest.rejected, (state, action) => {
                    rejectRoutine(state, action)
                }).addCase(resetPassword.pending, (state) => {
                loadingRoutine(state)
                })
                .addCase(resetPassword.fulfilled, (state, action) => {
                    state.status = 'idle'
                    state.ready = true
                })
                .addCase(resetPassword.rejected, (state, action) => {
                    rejectRoutine(state, action)
                })

        }
    }
)
export const {clearError, setAuthError, setUserForm} = authSlice.actions
export default authSlice.reducer
export const selectUserForm = state => state.auth.userForm
export const selectAuthStatus = state => state.auth.status
export const selectIsAuthenticated = state => state.auth.isAuthenticated
export const selectAuthReady = state => state.auth.ready
export const selectAuthError = state => state.auth.authError
