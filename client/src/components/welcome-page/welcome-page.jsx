import React, {useEffect, useRef} from 'react'
import './welcome-page.css'
import M from 'materialize-css'

export const WelcomePage = () => {
    const infoRef = useRef()
    const openInfo = () => {
        const infoInstance = M.TapTarget.getInstance(infoRef.current)
        infoInstance.open()
    }
    useEffect(() => {
        // var elems = document.querySelectorAll('.tap-target');
        // var instances = M.TapTarget.init(elems);
        M.TapTarget.init(infoRef.current);
    }, [])
    return (
        <>
            <main>
                <div className="container">
                    <h1 className={''}> Welcome </h1>
                    <div className="row">
                        <p className={'flow-text'}>This is <span className={'brand-name'}>ShrInk.tech</span>, my name
                            is <a className={'teal-text'} href={"https://github.com/erilar-ir"} target="_blank"
                                  rel={'noopener noreferrer'}>Ivan Rudiuk</a>and it's
                            my pet project.</p>
                        <p className={'flow-text'}>The purpose of this app is to let user to create short links for web
                            URLs, collect statistics on this short links clicks and provide some analytics to user about
                            their short links (like
                            popular <strong>bit.ly</strong> or <strong>cutt.ly</strong> services). It's quite useful for
                            marketing purposes i think.</p>
                        <p className="flow-text">
                            This project was created for educational purposes with intention to learn React and
                            MERN stack and have a fun with programming.
                        </p>
                        <p className="flow-text">
                            It uses Node.js and Express.js to run everything on server side. There is custom
                            authorization logic realized with access and refresh tokens to keep user logged in safely.
                        </p>
                        <p className="flow-text">
                            Client app created using React framework. I use Redux as a state management system. For UI components there is
                            Materialize framework used.
                        </p>
                        <p className="flow-text">
                            For dashboards and chart components i use here Chart.js library with react-chartjs-2
                            components library. Most of charts data prepared on server side and transfer to client only
                            clean data to visualize on charts.
                        </p>
                        <p className="flow-text">
                            There is also beautiful custom Hook with HOC for modal buttons, allows me to easily use
                            proper modal with needed component anywhere in app with a single line of code.
                        </p>
                        <p className="flow-text">
                            For the awesome bots thanks to <a className={'teal-text'} href={'https://www.freepik.com/upklyak'}  rel={'noopener noreferrer'}>upklyak from www.freepik.com</a>
                        </p>
                    </div>
                </div>
                <div className="fixed-action-btn direction-top active">
                    <a id="info" className="waves-effect waves-light btn-large btn-floating pulse teal lighten-1" onClick={openInfo}><i
                        className="material-icons">info_outline</i></a>
                </div>
                <div className="tap-target teal lighten-1" ref={infoRef} data-target="info">
                    <div className="tap-target-content white-text">
                        <h5 className={'hide-on-small-and-down show-on-medium-and-up'}>Info Tip</h5>
                        <p>To use all features of this app please Sign
                            In or Sign Up using top navigation, confirm activation email and have a useful marketing
                            instrument for free.</p>
                    </div>
                </div>

            </main>
            <footer className={'page-footer teal lighten-1'}>
                <div className="footer-copyright">
                    <div className="container">
                        Copyright © <a className={'grey-text text-lighten-4'} href="https://github.com/erilar-ir"
                                       rel={'noopener noreferrer'}>erilar.ir</a>
                    </div>
                </div>
            </footer>
        </>


    )
}
