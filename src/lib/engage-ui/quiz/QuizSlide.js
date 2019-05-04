import React from 'react'
import DataSchema from '../../schema'
import HashList from '../../hashlist'

export default class QuizSlide extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }
    
    render() {
        const arr = this.props.options ? this.props.options.toArray(): [];
        return (
            <div className="eng-quiz-slide">
                <p>{this.props.text}</p>
                {this.props.imageSrc &&
                    <div>
                        <img src={this.props.imageSrc} alt="some"/>
                    </div>
                }
                <div>
                    <ul>
                        {
                            arr.map( (o, i) => <button key={i}>{o.text}</button>)
                        }
                    </ul>
                </div>
            </div>
        )
    }

}

/**
 * Props schema
 * Which props could be edited and how (types, range and other rules)
 */
export const QuizSlideSchema = new DataSchema({
    "text": {
        type: 'string',
        default: "Input question text"
    },
    "options": {
        type: 'HashList',
        default: [],
        minLength: 1
    }
});