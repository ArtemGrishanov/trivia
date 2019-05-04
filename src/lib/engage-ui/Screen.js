import React from 'react'
import './style/eng-common.css';

export default class Screen extends React.Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="eng-screen">
                {this.props.children}
            </div>
        )
    }
}