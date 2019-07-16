import React from 'react'

export default class QuizBlock extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
        //this.onOptionClick = this.onOptionClick.bind(this);
    }

    onOptionClick(optionId) {
        if (this.props.onOptionSelect) {
            this.props.onOptionSelect(optionId);
        }
    }
    
    render() {
        const arr = this.props.options ? this.props.options.toArray(): [];
        return (
            <div className="rmx-quiz_block">
                <p>{this.props.text}</p>
                {this.props.imageSrc &&
                    <div>
                        <img src={this.props.imageSrc} alt="some"/>
                    </div>
                }
                <div>
                    <ul>
                        {
                            arr.map( (o, i) => {
                                const id = this.props.options.getId(i);
                                return (<button className="rmx-quiz_option" data-oid={id} key={id} onClick={this.onOptionClick.bind(this, id)}>{o.text}</button>)
                            })
                        }
                    </ul>
                </div>
            </div>
        )
    }

}