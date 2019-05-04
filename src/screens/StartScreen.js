import React from 'react'

export default class StartScreen extends React.Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="">
                <p>Start quiz screen</p>
                <p>Description</p>
                <button onClick={() => this.props.onStart()}>Start</button>
            </div>
        )
    }
}