import {useCallback} from "react";
import './message.hook.css'
import {success} from "concurrently/src/defaults";

export const useMessage = () => {
    return useCallback(
        (text, type) => {
            if (window.M && text) {
                switch (type) {
                    case 'success':
                        window.M.toast({html: text, classes: 'success'})
                        break
                    case 'warn':
                        window.M.toast({html: text, classes: 'warning'})
                        break
                    case 'error':
                        window.M.toast({html: text, classes: 'error'})
                        break
                    default:
                        window.M.toast({html: text})

                }
            }
        },
        []
    )
}
