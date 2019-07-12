import React from 'react'
import './style/eng-common.css';

export default class Screen extends React.Component {
    
    static defaultProps = {
        screenId: undefined,
        name: 'screen',
        group: undefined
    }

    constructor(props) {
        super(props);
        this.state = {};
    }

    //TODO no content stub in the screen

    render() {
        return (
            <div className="eng-screen">
                {this.props.children}
            </div>
        )
    }
}