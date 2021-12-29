import {useCallback} from "react";
import M from 'materialize-css'
import 'materialize-css/dist/css/materialize.css'
import './message.hook.css'

export const useMessage = () => {
    return useCallback(
        (text, type) => {
            if (M && text) {
                switch (type) {
                    case 'success':
                        M.toast({html: text, classes: 'success-toast', displayLength: 2000})
                        break
                    case 'warn':
                        M.toast({html: text, classes: 'warning-toast', displayLength: 2000})
                        break
                    case 'error':
                        M.toast({html: text, classes: 'error-toast', displayLength: 2000})
                        break
                    default:
                        M.toast({html: text})

                }
            }
        }, [])
}
