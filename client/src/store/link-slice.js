import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import $api from "../services";
import {logout} from './auth-slice'

export const processRejectedRequest = async (e, thunkAPI) => {
    if (e.status === 401) {
        await thunkAPI.dispatch(logout())
        return thunkAPI.rejectWithValue(e)
    } else {
        return thunkAPI.rejectWithValue(e)
    }
}

export const getLinks = createAsyncThunk('links/fetchLinks', async (_, thunkAPI) => {
    try {
        const response = await $api('/api/link')
        return response.data
    } catch (e) {
        return processRejectedRequest(e, thunkAPI)
    }
})
export const addLink = createAsyncThunk('links/addLink',
    async ({link, title}, thunkAPI) => {
        try {
            const response = await $api.post('/api/link/generate', {from: link, title: title})
            return response.data
        } catch (e) {
            return processRejectedRequest(e, thunkAPI)
        }

    })
export const editLink = createAsyncThunk('links/editLink', async ({linkId, from, title}, thunkAPI) => {
    try {
        const response = await $api.patch(`/api/link/${linkId}`, {from: from, title: title})
        return response.data
    } catch (e) {
        return processRejectedRequest(e, thunkAPI)
    }
})

export const deleteLink = createAsyncThunk('links/deleteLink',
    async (id, thunkAPI) => {
        try {
            const response = await $api.post(`/api/link/remove/${id}`)
            return response.data
        } catch (e) {
            return processRejectedRequest(e, thunkAPI)
        }
    })
export const getDetailedClicks = createAsyncThunk('links/getDetailedClicks', async (id, thunkAPI) => {
    try {
        const response = await $api.get(`/api/link/clicks/${id}`)
        return response.data
    } catch (e) {
        return processRejectedRequest(e, thunkAPI)
    }
})
export const getManyLinksDetailedClicks = createAsyncThunk('links/getManyLinksDetailedClicks', async ({period= 13}, thunkAPI) => {
    try {
        const response = await $api.post(`/api/link/many-clicks`, {period: period})
        return response.data
    } catch (e) {
        return processRejectedRequest(e, thunkAPI)
    }
})

const initialState = {
    links: [],
    status: 'idle',
    error: null,
    addingLinkStatus: false,
    statistics: null,
    statisticsStatus: 'idle',
    linkStatisticsStatus: 'idle',
    statisticsError: null
}

const linkSlice = createSlice({
    name: 'links',
    initialState,
    reducers: { },
    extraReducers(builder) {
        builder
            .addCase(getLinks.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(getLinks.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.links = action.payload
            })
            .addCase(getLinks.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            .addCase(addLink.pending, (state, action) => {
                state.addingLinkStatus = true
            })
            .addCase(addLink.fulfilled, (state, action) => {
                const existingLink = state.links.find(link => link._id === action.payload.link._id)
                if (!existingLink) {
                    state.links.push(action.payload.link)
                }
                state.addingLinkStatus = false
            })
            .addCase(addLink.rejected, (state, action) => {
                // console.log('addlink rejected', action)
                state.error = action.payload
                state.addingLinkStatus = false
            })
            .addCase(deleteLink.fulfilled, (state, action) => {
                const linkId = action.payload.id
                state.links = state.links.filter(link => link._id !== linkId)
            })
            .addCase(editLink.fulfilled, (state, action) => {
                const {link} = action.payload
                const existingLink = state.links.find(link => link._id === action.payload.link._id)

                existingLink.from = link.from
                existingLink.title = link.title
            })
            .addCase(editLink.rejected, (state, action) => {
                state.error = action.payload
            })
            .addCase(getDetailedClicks.pending, ((state) => {
                state.linkStatisticsStatus = 'loading'
            }))
            .addCase(getDetailedClicks.fulfilled, (state, action) => {
                const link = state.links.find(link => link._id === action.payload._id)
                if (!link) {
                    state.statisticsStatus = 'error'
                    state.statisticsError = 'Link not found'
                } else {
                    link.clicksCollection = action.payload.clicksCollection
                    link.clicks = action.payload.clicks
                }
                state.linkStatisticsStatus = 'success'
            })
            .addCase(getDetailedClicks.rejected, (state, action) => {
                state.statisticsStatus = 'error'
                state.linkStatisticsStatus = 'error'
                state.statisticsError = action.payload
            })
            .addCase(getManyLinksDetailedClicks.pending, (state) => {
                state.statisticsStatus = 'loading'
            })
            .addCase(getManyLinksDetailedClicks.fulfilled, (state, action) => {
                state.statisticsStatus = 'success'
                state.statistics = action.payload
            })
            .addCase(getManyLinksDetailedClicks.rejected, (state, action) => {
                state.statisticsStatus = 'error'
                state.statisticsError = action.payload
            })
            .addCase("auth/logout/fulfilled", (state) => {
                state = initialState
                return state
            })
    }
})


// Export actions below
// Action creators are generated for each case reducer function
// export const {setLinksStatus, updateLinkClicksCount, cleanUpLinks} = linkSlice.actions

export default linkSlice.reducer

export const selectAllLinks = state => state.links.links
export const selectAllClickedLinks = state => state.links.links.filter(link => link.clicks > 0)
export const linksSliceStatus = state => state.links.status
export const addingLinkStatus = state => state.links.addingLinkStatus
export const selectStatsStatus = state => state.links.statisticsStatus
export const selectLinkStatisticsStatus = state => state.links.linkStatisticsStatus
export const selectDashBoardStats = state => state.links.statistics
export const selectLinkById = (state, linkId) => state.links.links.find(link => link._id === linkId)
export const selectLinksError = state => state.links.error
