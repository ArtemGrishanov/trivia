import React from 'react'
import './style/rmx-common.css';
import LayoutContainer from './layout/LayoutContainer';

/**
 * Это контейнер визуальных элементов,
 * Весь UI приложения разбит на такие вот экраны.
 * Поддерживает условный показ "if"
 * Растягивается по всему доступному пространству приложения
 * Может использоваться анимация для переключения экранов
 */
export default class Screen extends React.Component {

    static defaultProps = {
        screenId: undefined,
        name: 'screen',
        group: undefined
    }

    constructor(props) {
        super(props);
        this.state = {};
    }

    //TODO no content stub in the screen

    render() {
        const s = {
            backgroundColor: this.props.backgroundColor
        };
        return (
            <div style={s} className="rmx-screen">
                <LayoutContainer>
                    {this.props.children}
                </LayoutContainer>
            </div>
        )
    }
}