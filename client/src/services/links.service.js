import {useHttp} from '../hooks/index';

export const LinksService = () => {
    const {request} = useHttp()
    const fetchLinks = async () => {
        return request('/api/link')
            // .catch(err => {
            //     return err
            // })
    }
    const linkDetails = async (id) => {
        return await request(`/api/link/${id}`)
            // .catch(err => {
            //     return err
            // })
    }
    const deleteLink = async (id) => {
        return await request(`/api/link/remove/${id}`, 'POST')
            // .catch(err => {
            //     return err
            // })
    }
    return {fetchLinks, linkDetails, deleteLink}
}
