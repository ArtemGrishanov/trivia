import '../../style/rmx-quiz.css'
import React from 'react'
import DataSchema from '../../../schema'
import RemixWrapper from '../../RemixWrapper'
import TextOption from '../../primitives/TextOption'

class QuizBlock extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        //this.onOptionClick = this.onOptionClick.bind(this);
    }

    onOptionClick(optionId) {
        if (this.props.onOptionSelect) {
            this.props.onOptionSelect(optionId)
        }
    }

    render() {
        const arr = this.props.options ? this.props.options.toArray() : []
        const st = {
            backgroundColor: this.props.backgroundColor,
        }
        return (
            <div className="rmx-quiz_block" style={st}>
                <p>{this.props.questionText}</p>
                {this.props.imageSrc && (
                    <div>
                        <img src={this.props.imageSrc} alt="some" />
                    </div>
                )}
                <div>
                    <ul>
                        {arr.map((o, i) => {
                            const id = this.props.options.getId(i)
                            return (
                                <TextOption data-oid={id} key={id} onClick={this.onOptionClick.bind(this, id)}>
                                    {o.text}>
                                </TextOption>
                            )
                        })}
                    </ul>
                </div>
            </div>
        )
    }
}

export const Schema = new DataSchema({
    questionText: {
        type: 'string',
        minLength: 1,
        maxLength: 1000,
        default: 'input question text',
    },
    //TODO create layout container for options? 'vlist', 'tiles-2col', 'tiles-3col'
    type: {
        type: 'string',
        enum: ['text-column', 'text-tiles', 'text-on-image'],
        default: 'text-column',
    },
    backgroundColor: {
        type: 'color',
        default: '#a7a7a7',
    },
})

export default RemixWrapper(QuizBlock, Schema, 'QuizBlock')
