import '../style/rmx-layout.css'
import React from 'react';
import PropsNormalizer from '../PropsNormalizer';
import DataSchema from '../../schema';

/**
 * Компонент контейнер отвечающий за позиционирование дочерних элементов
 * - можно выбрать заранее заготовленный лейаут дочерних компонентов: в ряд по вертикали, плиткой и тд
 * - перетаскивать блоки по направляющим, появляются при перетаскивании
 * - подсветка при наведении
 * - ширину блока можно изменить, потянув за контрол
 * - есть эффект примагничивания к краю или центру
 * - Показ координат top/left блока
 */
class LayoutContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            width: undefined,
            height: undefined,
            magnetsVertical: [
                {left:50, type:'center'},
                {left:0, type:'left', hide: true},
                {left:100, type:'right', hide: true}
            ]
        }
        this.containerRef = React.createRef();
        this.observer = null;
    }

    onWindowResize() {

    }

    componentDidMount() {
        window.addEventListener('resize', this.onWindowResize);

        // http://marcj.github.io/css-element-queries/
        this.observer = new ResizeObserver((event) => {
            console.log('LayoutContainer dimension changed', event);
            this.setState({
                width: event[0].contentRect.width,
                height: event[0].contentRect.height
            });
        }).observe(this.containerRef.current);
        //TODO use also react-sizeme module
    }

    normalizeChildrenWidth() {
        // container width

        // all items initial widthes convert to %

        // sets witdth % for all items

    }

    render() {
        const st = {
            border: (this.props.border) ? '1px solid black': 'none'
        }
        let childrenWithProps = null;
        if (this.state.width > 0 && this.state.height > 0) {
            // container inited and measured
            // we can render children now
            childrenWithProps = React.Children.map(this.props.children, child =>
                React.cloneElement(child, {
                    mod: this.mod,
                    containerWidth: this.state.width,
                    containerHeight: this.state.height,
                    magnetsVertical: this.state.magnetsVertical
                })
            );
        }
        return (
            <div style={st} ref={this.containerRef} className="rmx-layout_container">
                {childrenWithProps}
                {this.state.magnetsVertical && this.state.magnetsVertical.map( (mv) => {
                    if (mv.hide !== true)
                        return <div className="rmx-l_mgn" style={{left:mv.left+'%'}}></div>
                })}
            </div>
        )
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
    }
}

export const Schema = new DataSchema({
    'mode': {
        type: 'string',
        enum: ['absolute'],
        default: 'absolute'
    },
    'border': {
        type: 'boolean',
        default: false
    }
});

export default PropsNormalizer(LayoutContainer, Schema);