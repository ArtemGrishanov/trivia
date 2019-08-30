import React from 'react'
import './style/rmx-common.css';
import LayoutContainer from './layout/LayoutContainer';
import DataSchema from '../schema'
import RemixWrapper from './RemixWrapper';

/**
 * Это контейнер визуальных элементов,
 * Весь UI приложения разбит на такие вот экраны.
 * Поддерживает условный показ "if"
 * Растягивается по всему доступному пространству приложения
 * Может использоваться анимация для переключения экранов
 */
class Screen extends React.Component {

    static defaultProps = {
        screenId: undefined,
        name: 'screen',
        group: undefined
    }

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const s = {
            backgroundColor: this.props.backgroundColor
        };
        return (
            <div style={s} className="rmx-screen">
                <p>{this.props.id}</p>
                <LayoutContainer>
                    {this.props.children}
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
    "backgroundColor": {
        type: 'string',
        default: ''
    }
});

export default RemixWrapper(Screen, Schema, 'Screen');