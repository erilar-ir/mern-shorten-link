import React, {useEffect, useRef} from 'react'
import M from "materialize-css";
import './modal.hoc.css'


export const withModal = (WrappedComponent, {...props}) => {
    const modal = useRef()
    const tooltip = useRef()
    let focusedInput = props.focused ? useRef() : null
    useEffect(() => {
        const options = {
            onOpenStart: () => {
                // console.log("Open Start");
            },
            onOpenEnd: () => {
                if (props.focused) {
                    setTimeout(() => focusedInput.current.focus()
                        , 50)
                }
                M.updateTextFields()
                // console.log("Open End");
            },
            onCloseStart: () => {
                if (props.focusedInput) {
                    setTimeout(() => props.focusedInput.current.blur()
                        , 50)
                }
                // console.log("Close Start");
            },
            onCloseEnd: () => {
                // console.log("Close End");
            },
            inDuration: 250,
            outDuration: 250,
            opacity: 0.5,
            dismissible: true,
            startingTop: "4%",
            endingTop: "10%"
        };
        // const tooltips = document.querySelectorAll('.tooltipped')
        M.Modal.init(modal.current, options)
        if (!props.noTooltip) {
            M.Tooltip.init(tooltip.current)
        }
    }, [])


    const {modalButton, modalHeader, modalButtonClass, modalContainerClass, tooltipText} = props

    const modalClose = () => {
        const modalInstance = M.Modal.getInstance(modal.current)
        modalInstance.close();
    }
    const modalId = props.id ? `${modalContainerClass}-${props.id}` : modalButtonClass
    let modalTriggerLinkClassnames = `waves-effect waves-light btn tooltipped modal-trigger modal-link ${modalButtonClass}`
    if (props.flatModal) {
        modalTriggerLinkClassnames = `modal-trigger modal-link`
    }

    return (
        <div>
            <a
                className={modalTriggerLinkClassnames}
                data-target={modalId}
                data-position={'top'}
                data-tooltip={tooltipText}
                ref={tooltip}
            >
                {modalButton}
            </a>

            <div
                ref={modal}
                id={modalId}
                className={`modal ${modalContainerClass} bottom-sheet`}
            >
                {/*<div className={'modal-trigger modal-close closer'}><i className={'material-icons'}>close</i></div>*/}
                <div className={'modal-header'}>
                    <h4 className={'modal-title'}>{modalHeader}</h4>
                </div>
                <div className="modal-content">
                    <WrappedComponent closeModal={modalClose} focusedInput={focusedInput} {...props}/>
                </div>
            </div>
        </div>
    );
}
