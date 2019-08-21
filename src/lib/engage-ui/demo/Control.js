import React from 'react'

const NARROW_WIDTH = 340;
export default class Control extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            editedProps: {},
            normalizedProps: {}
        }
        this.controlRefs = {};
        props.schema.selectorsInProcessOrder.forEach((sel) => this.controlRefs[sel] = React.createRef());
        this.onFocus = this.onFocus.bind(this);
        this.normalizePropsCallback = this.normalizePropsCallback.bind(this);
    }

    onFocus(e) {
        this.setState({
            editedProps: {
                ...this.state.editedProps,
                [e.currentTarget.attributes['data-prop-name'].value]: e.currentTarget.value
            }
        });
    }

    normalizePropsCallback(props) {
        const self = this;
        setTimeout( () => {
            Object.keys(props).forEach((sel) => {
                if (self.controlRefs[sel] && self.controlRefs[sel].current) {
                    self.controlRefs[sel].current.value = props[sel]
                }
            });
            //console.log('Control:normalizePropsCallback ', props);
        }, 200)
    }

    render() {
        const childrenWithProps = React.Children.map(this.props.children, child =>
            React.cloneElement(child, { ...this.state.editedProps, normalizePropsCallback: this.normalizePropsCallback })
        );
        const selectors = this.props.schema ? this.props.schema.selectorsInProcessOrder: [];
        return (
            <div className="rmx-control">
                <div className={'rmx-control_elem_wr ' + (this.props.width <= NARROW_WIDTH ? 'narrow': '')} style={{width:this.props.width+'px', height:this.props.height+'px'}}>
                    {childrenWithProps}
                </div>
                <div className="rmx-control_fields_wr">
                    {selectors.map((sel) => {
                        return (
                            <div key={sel}>
                                <label htmlFor={sel}>{sel}</label>
                                {this.props.schema.getDescription(sel).enum &&
                                    <select ref={this.controlRefs[sel]} data-prop-name={sel} onChange={this.onFocus}>
                                        {this.props.schema.getDescription(sel).enum.map((enval) =>
                                            <option
                                                key={sel+':'+enval}
                                                value={enval}
                                                >{enval}</option>
                                        )}
                                    </select>
                                }
                                {!this.props.schema.getDescription(sel).enum &&
                                    <input ref={this.controlRefs[sel]} id={sel} data-prop-name={sel} onBlur={this.onFocus} defaultValue={this.state.editedProps[sel]}></input>
                                }
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}