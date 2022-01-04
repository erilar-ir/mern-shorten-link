import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import $api from "../services";
import {logout} from './auth-slice'

export const processRejectedRequest = async (e, thunkAPI) => {
    if (e.status === 401) {
        await thunkAPI.dispatch(logout())
        return thunkAPI.rejectWithValue(e)
    } else {
        return  thunkAPI.rejectWithValue(e)
    }
}
export const getGroups = createAsyncThunk('groups/fetchGroups', async (_, thunkAPI) => {
    try {
        const response = await $api('/api/group')
        return response.data
    } catch (e) {
        return  processRejectedRequest(e, thunkAPI)
    }
})
export const createGroup = createAsyncThunk('groups/createGroup', async ({name, description}, thunkAPI) => {
    try {
        const response = await $api.post('/api/group/create', {name: name, description: description})
        return response.data
    } catch (e) {
        return  processRejectedRequest(e, thunkAPI)
    }
})
export const editGroup = createAsyncThunk('groups/editGroup', async ({id, name, description}, thunkAPI) => {
    try {
        const response = await $api.patch(`/api/group/edit/${id}`, {name: name, description: description})
        return response.data
    } catch (e) {
        return  processRejectedRequest(e, thunkAPI)
    }
})
export const deleteGroup = createAsyncThunk('groups/deleteGroup', async (id, thunkAPI) => {
    try {
        const response = await $api.delete(`/api/group/remove/${id}`)
        return response.data
    } catch (e) {
        return  processRejectedRequest(e, thunkAPI)
    }
})
export const assignLinkToGroup = createAsyncThunk('groups/assignLinkToGroup', async ({groupId, linkId}, thunkAPI) => {
    try {
        const response = await $api.patch('/api/group/assign', {groupId: groupId, linkId: linkId})
        const data = response.data
        return {data: data, linkId: linkId, groupId: groupId}
    } catch (e) {
        return  processRejectedRequest(e, thunkAPI)
    }
})
export const withdrawLinkFromGroup = createAsyncThunk('groups/withdrawLinkFromGroup', async ({groupId, linkId}, thunkAPI) => {
    try {
        const response = await $api.patch('/api/group/withdraw', {groupId: groupId, linkId: linkId})
        const data = response.data
        return {data: data, linkId: linkId, groupId: groupId}
    } catch (e) {
        return  processRejectedRequest(e, thunkAPI)
    }
})

const initialState = {
    groups: [],
    status: 'idle',
    error: null,
    lockAssignAndDeleteButtons: false
}

export const groupSlice = createSlice({
    name: 'groups',
    initialState ,
    reducers: {
    },
    extraReducers(builder) {
        builder
            .addCase(getGroups.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(getGroups.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.groups = action.payload
            })
            .addCase(getGroups.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error
            })
            .addCase(createGroup.fulfilled, (state, action) => {
                state.groups.push(action.payload.group)
            })
            .addCase(deleteGroup.fulfilled, (state, action) => {
                state.groups = state.groups.filter(group => group._id !== action.payload.id)
            })
            .addCase(assignLinkToGroup.pending, (state) => {
                state.lockAssignAndDeleteButtons = true
            })
            .addCase(assignLinkToGroup.fulfilled, (state, action) => {
                state.lockAssignAndDeleteButtons = false
                const group = state.groups.find(group => group._id === action.payload.groupId)
                group.links.push(action.payload.linkId)
            })
            .addCase(withdrawLinkFromGroup.pending, (state) => {
                state.lockAssignAndDeleteButtons = true
            })
            .addCase(withdrawLinkFromGroup.fulfilled, (state, action) => {
                state.lockAssignAndDeleteButtons = false
                const group = state.groups.find(group => group._id === action.payload.groupId)
                group.links = group.links.filter(link => link !== action.payload.linkId)
            })
            .addCase(editGroup.fulfilled, (state, action) => {
                const {group} = action.payload
                const existingGroup = state.groups.find(group => group._id === action.payload.group._id)

                existingGroup.name = group.name
                existingGroup.description = group.description
            })
            .addCase(editGroup.rejected, (state, action) => {
                state.error = action.payload
            })
            .addCase("auth/logout/fulfilled", (state) => {
                state = initialState
                return state
            })
    }
})

export default groupSlice.reducer

export const selectGroups = state => state.groups.groups
export const selectGroupSliceStatus = state => state.groups.status
export const selectLockAssignAndDeleteButtons = state => state.groups.lockAssignAndDeleteButtons
export const errorSelector = state => state.groups.error
export const selectGroupById = (state, groupId) => state.groups.groups.find(group => group._id === groupId)
