import {useHttp} from "../hooks";

export const GroupService = () => {
    const {request} = useHttp()
    const getGroups = async () => {
        return await request('/api/group/get')
    }
    const getGroupDetails = async (id) => {
        return await request(`/api/group/get/${id}`)
    }
    const createGroup = async (name) => {
        return await request(`/api/group/create`, 'POST', {name: name})
    }
    const removeGroup = async (id) => {
        return await request(`/api/group/remove/${id}`, 'DELETE')
    }

    const assignLinkToGroup = async (groupId, linkId) => {
        return await request(`/api/group/assign`, 'PATCH', {groupId: groupId, linkId: linkId})
    }
    const withdrawLinkFromGroup = async (groupId, linkId) => {
        return await request(`/api/group/withdraw`, 'PATCH', {groupId: groupId, linkId: linkId})
    }



    return {getGroups, getGroupDetails, createGroup, removeGroup, assignLinkToGroup, withdrawLinkFromGroup}
}
