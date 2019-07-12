import React from 'react'

export default class StartScreen extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const s = {
            backgroundColor: this.props.backgroundColor
        }
        return (
            <div className="eng-screen" style={s}>
                <p>Start quiz screen</p>
                <p>Description</p>
                <button onClick={() => this.props.onStart()}>Start</button>
            </div>
        )
    }
}