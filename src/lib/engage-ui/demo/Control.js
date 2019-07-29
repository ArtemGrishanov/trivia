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

    render() {
        const childrenWithProps = React.Children.map(this.props.children, child =>
            React.cloneElement(child, { ...this.state.editedProps })
        );
        const selectors = this.props.schema ? this.props.schema.selectorsInProcessOrder: [];
        return (
            <div className="rmx-control">
                <div className="rmx-control_elem_wr">
                    {childrenWithProps}
                </div>
                <div className="rmx-control_fields_wr">
                    {selectors.map((sel) => {
                        return (
                            <div key={sel}>
                                <label htmlFor={sel}>{sel}</label>
                                {this.props.schema.getDescription(sel).enum &&
                                    <select data-prop-name={sel} defaultValue="" onChange={this.onFocus}>
                                        {this.props.schema.getDescription(sel).enum.map((enval) =>
                                            <option key={sel+':'+enval}>{enval}</option>
                                        )}
                                    </select>
                                }
                                {!this.props.schema.getDescription(sel).enum &&
                                    <input id={sel} data-prop-name={sel} onBlur={this.onFocus}></input>
                                }
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}