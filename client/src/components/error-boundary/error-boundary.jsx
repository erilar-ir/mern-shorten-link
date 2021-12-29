import React from 'react'
import ErrorView from "../error";

export default class ErrorBoundary extends React.Component {

    constructor(props) {
        super(props);
        this.state = { error: null, errorInfo: null, hasError: false};
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    componentDidCatch(error, errorInfo) {
        console.log('catch in boundary', error, errorInfo)

        this.setState({
            error: error,
            errorInfo: errorInfo
        })
    }

    render() {
        const {error, errorInfo, hasError} = this.state
        if (hasError) {
            return (
                <ErrorView err={{error, errorInfo}} />
            );
        }
        return this.props.children;
    }
}
