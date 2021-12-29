import {useHttp, useMessage} from '../hooks'
import {useHistory} from "react-router-dom";


export const LinksService = () => {
    const {request} = useHttp()
    const message = useMessage()
    const history = useHistory()

    const fetchLinks = async () => {
        try {
            return await request('/api/link')
        } catch (e) {
          return Promise.reject(e)

        }
    }
    const linkDetails = async (id) => {
        try {
            return await request(`/api/link/${id}`)
        }
        catch (e) {
            history.push('/links')
            message(e.message, 'error')
        }
    }
    const deleteLink = async (id) => {
        try {
            await request(`/api/link/remove/${id}`, 'POST').then(
                data => {
                    history.push('/links')
                    message(data.message, 'success')
                })
        } catch (e) {
            console.log(e)
            message(e.message, 'error')
        }

    }

    const generateLink = async (link) => {
        try {
            const data = await request('/api/link/generate', 'POST', {from: link})
            history.push(`/details/${data.link._id}`)
            message(`Short link created for ${data.link.from}`, 'success')
            // console.log('Generate data', data)
        } catch (e) {
            message(e.message, 'warn')
        }
    }
    return {fetchLinks, linkDetails, deleteLink, generateLink}
}
