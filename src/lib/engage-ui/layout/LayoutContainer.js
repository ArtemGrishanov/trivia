import '../style/rmx-layout.css'
import React from 'react';
import PropsNormalizer from '../PropsNormalizer';
import DataSchema from '../../schema';

const MIN_WIDTH = 30; // px
const MIN_HEIGHT = 20; // px

function normalizeWidth(widthPercent, containerWidth) {
    let widthPx = widthPercent / 100 * containerWidth;
    if (widthPx < MIN_WIDTH) {
        widthPx = MIN_WIDTH;
    }
    return widthPx / containerWidth * 100;
}

function normalizeHeight(height) {
    if (height < MIN_HEIGHT) {
        return MIN_HEIGHT;
    }
    return height;
}

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
            height: undefined
        }
        this.isItemMouseDown = false;
        this.markerId = 0;
        this.isDragging = false;
        this.itemNode = null;
        this.itemNodeStartAttrs = null;
        this.mouseStartPosition = null;
        this.onItemMouseDown = this.onItemMouseDown.bind(this);
        this.onWindowMouseMove = this.onWindowMouseMove.bind(this);
        this.onWindowMouseUp = this.onWindowMouseUp.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.containerRef = React.createRef();
        this.observer = null;

    }

    onItemMouseDown(e, target, markerId, widthPercent, heightPx) {
        this.isItemMouseDown = true;
        // TODO force select (hover) while dragging or resizing
        this.markerId = markerId;
        // TODO пока не решил надо ли передавать координаты в реакт компонент, использую просто дом элемент
        this.itemNode = target;
        // if 'px' transform to '%'
        if (this.itemNode.style.left.indexOf('px') > 0) {
            this.itemNode.style.left = this.leftPxToPercent(this.itemNode.style.left) + '%';
        }
        this.itemNodeStartAttrs = {
            left: parseFloat(this.itemNode.style.left),
            top: parseFloat(this.itemNode.style.top),
            width: parseFloat(widthPercent),
            height: parseFloat(heightPx)
        }
        this.mouseStartPosition = {
            left: this.leftPxToPercent(e.clientX),
            top: e.clientY
        }
    }

    leftPxToPercent(lpx) {
        if (this.containerRef.current) {
            return (parseFloat(lpx) / this.containerRef.current.offsetWidth) * 100;
        }
        console.error('LayoutContainer.leftPxToPercent: containerRef.current is undefined');
        return 0;
    }

    onWindowMouseMove(e) {
        if (this.isItemMouseDown) {
            this.isDragging = (this.markerId == 9);
            const dx = this.leftPxToPercent(e.clientX) - this.mouseStartPosition.left; // percents
            const dy = e.clientY - this.mouseStartPosition.top; // px
            if (this.markerId == 9) {
                this.itemNode.style.left = (this.itemNodeStartAttrs.left + dx) + '%';
                this.itemNode.style.top = (this.itemNodeStartAttrs.top + dy) + 'px';
            }
            else if (this.markerId == 3 || this.markerId == 4 || this.markerId == 5) {
                 const w = normalizeWidth(this.itemNodeStartAttrs.width + dx, this.state.width) + '%';
                 this.itemNode.style.width = w;
            }
            else if (this.markerId == 1 || this.markerId == 7 || this.markerId == 8) {
                const w = normalizeWidth(this.itemNodeStartAttrs.width - dx, this.state.width) + '%';
                if (w !== this.itemNode.style.width) {
                    this.itemNode.style.width = w;
                    this.itemNode.style.left = (this.itemNodeStartAttrs.left + dx) + '%';
                }
            }
            else if (this.markerId == 6) {
                this.itemNode.style.height = normalizeHeight(this.itemNodeStartAttrs.height + dy) + 'px';
            }
            else if (this.markerId == 2) {
                const h = normalizeHeight(this.itemNodeStartAttrs.height - dy) + 'px';
                if (h !== this.itemNode.style.height) {
                    this.itemNode.style.height = h;
                    this.itemNode.style.top = (this.itemNodeStartAttrs.top + dy) + 'px';
                }
            }
            //TODO check LayoutItemWidth cannot be less than content width, but text can collapse: break by words and letters
        }
    }

    onWindowMouseUp() {
        if (this.isDragging) {

        }
        this.isItemMouseDown = false;
        this.isDragging = false;
    }

    onWindowResize() {

    }

    componentDidMount() {
        window.addEventListener('mousemove', this.onWindowMouseMove);
        window.addEventListener('mouseup', this.onWindowMouseUp);
        window.addEventListener('resize', this.onWindowResize);

        // http://marcj.github.io/css-element-queries/
        this.observer = new ResizeObserver((event) => {
            console.log('LayoutContainer dimension changed', event);
            this.setState({
                width: event[0].contentRect.width,
                height: event[0].contentRect.height
            });
        }).observe(this.containerRef.current);
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
                    onMouseDown: this.onItemMouseDown.bind(this),
                    containerWidth: this.state.width,
                    containerHeight: this.state.height
                })
            );
        }
        return (
            <div style={st} ref={this.containerRef} className="rmx-layout_container">
                {childrenWithProps}
            </div>
        )
    }

    componentWillUnmount() {
        window.removeEventListener('mousemove', this.onWindowMouseMove);
        window.removeEventListener('mouseup', this.onWindowMouseUp);
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