import React from 'react'
import './style/rmx-common.css';
import LayoutContainer from './layout/LayoutContainer';
import DataSchema from '../schema'
import HashList from '../hashlist'
import RemixWrapper from './RemixWrapper';
import { getComponentClass } from './RemixWrapper'
import BasicImage from './bricks/BasicImage';

/**
 * Это контейнер визуальных элементов,
 * Весь UI приложения разбит на такие вот экраны.
 * Поддерживает условный показ "if"
 * Растягивается по всему доступному пространству приложения
 * Может использоваться анимация для переключения экранов
 */
class Screen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const s = {
            backgroundColor: this.props.backgroundColor
        };
        const components = this.props.components.toArray().map( (cmpn, i) => {
            // Screen produces components based in their displayName and props saved in state
            const cmpnId = this.props.components.getId(i);
            const RemixComponent = getComponentClass(cmpn.displayName);
            return ( <RemixComponent {...cmpn} id={cmpnId} key={cmpnId}/> )
        });
        return (
            <div style={s} className="rmx-screen" data-id={this.props.id}>
                {this.props.backgroundImage &&
                    <div className="rmx-screen_back_wr">
                        <BasicImage width={this.props.width} height={this.props.height} src={this.props.backgroundImage} backgroundSize='cover'></BasicImage>
                    </div>
                }
                <LayoutContainer>
                    {components}
                </LayoutContainer>
            </div>
        )
    }
}

/**
 * Props schema
 * Which props could be edited and how (types, range and other rules)
 */
export const Schema = new DataSchema({
    'backgroundColor': {
        type: 'string',
        default: ''
    },
    'backgroundImage': {
        type: 'string',
        default: ''
    },
    'components': {
        type: 'hashlist',
        minLength: 0,
        maxLength: 128,
        default: new HashList( [
            // {displayName: 'Text', id: '123456'}
        ] ),
        prototypes: [
            { id: 'dumb_component', data: { displayName: 'Element', backgroundColor: '#fff' }}
        ]
    },
    'tags': {
        type: 'string',
        minLength: 0,
        maxLength: 1024,
        default: ''
    },
    // html string of rendered screen
    'staticMarkup': {
        type: 'string',
        minLength: 0,
        maxLength: 32000,
        default: '',
        serialize: false
    },
    // ability to disable screen
    'disabled': {
        type: 'boolean',
        default: false
    }
});

export default RemixWrapper(Screen, Schema, 'Screen');