import React from 'react'

export default class Control extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            editedProps: {}
        }
        this.onFocus = this.onFocus.bind(this);
    }

    onFocus(e) {
        this.setState({
            editedProps: {
                ...this.state.editedProps,
                [e.currentTarget.attributes['data-prop-name'].value]: e.currentTarget.value
            }
        });
    }

    //TODO normalize on focus lost

    render() {
        const childrenWithProps = React.Children.map(this.props.children, child =>
            React.cloneElement(child, { ...this.state.editedProps })
        );
        return (
            <div>
                <div className="rmx-control_wr">
                    {childrenWithProps}
                </div>
                <div>
                    <label htmlFor="text">Текст кнопки</label>
                    <input id="text" data-prop-name="text" onBlur={this.onFocus}></input>
                </div>
            </div>
        )
    }
}