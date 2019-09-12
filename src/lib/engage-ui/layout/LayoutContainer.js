import '../style/rmx-layout.css'
import sizeMe from 'react-sizeme'
import React from 'react';
import RemixWrapper from '../RemixWrapper';
import DataSchema from '../../schema';

//TODO у компонента с которым работаю временно менять zOrder на максимальный, потом обратно

//TODO hide/show magnet lines when operation in action

//TODO calc actiual size of all layoutItems (for auto height for example)

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

    static getDerivedStateFromProps(props, state) {
        return {
            ...state,
            width: props.size.width >= 0 ? props.size.width: state.width,
            height: props.size.height >= 0 ? props.size.height: state.height
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            width: undefined,
            height: undefined,
            magnetsVertical: [
                {left:50, type:'center'},
                {left:0, type:'left', hide: true},
                {left:100, type:'right', hide: true}
            ],
            flow: []
        }
        if (props.globalTestId) {
            window[props.globalTestId] = this;
        }
        this.childRefs = [];
        this.flowElementIndex = -1;
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
            this.childRefs = [];
            this.flowElementIndex = -1;
            childrenWithProps = React.Children.map(this.props.children, child =>
                React.cloneElement(child, {
                    //TODO I got an error about refs from React in console while adding a new component. Temporarily switched off.
                    //ref: (childLi) => { if (childLi) this.childRefs.push(childLi)},
                    mod: this.mod,
                    containerWidth: this.state.width,
                    containerHeight: this.state.height,
                    magnetsVertical: this.state.magnetsVertical
                    //,...this.getNextElementInFlow()
                })
            );
        }
        return (
            <div style={st} className="rmx-layout_container">
                {childrenWithProps}
                {this.state.magnetsVertical && this.state.magnetsVertical.map( (mv) => {
                    if (mv.hide !== true)
                        return <div key={'mv_'+mv.left} className="rmx-l_mgn" style={{left:mv.left+'%'}}></div>
                })}
            </div>
        )
    }

    componentDidMount() {
        if (this.props.layout) {
            this.setLayout(this.props.layout);
        }
    }

    exportLayout() {
        let elements = [];
        //React.Children.forEach(this.props.children, child => {
        this.childRefs.forEach( (li) => {
            //FirstChild.displayName = 'FirstChild';
            //console.log('name =', child.type.displayName);
            elements.push({
                selector: 'Option', //TODO selector
                ...li.exportLayout()
            });
        })
        return {
            [this.state.width]: {
                elements: elements
            }
        }
    }

    // {"600":{"elements":[{"selector":"Option","top":193,"left":25,"width":50,"height":71},{"selector":"Option","top":252,"left":25,"width":50,"height":71}]}}
    setLayout(data) {
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data)
            }
            catch(err) {
                return;
            }
        }
        const widthArr = Object.keys(data);
        const w = widthArr[0]; //TODO find closest width
        let i = 0;
        let flow = [];
        const elements = data[w].elements;
        const flowElements = this.childRefs; //TODO get flow by component type (LayoutItem content/child type), maybe id, maybe props
        flowElements.forEach( (li) => {
            if (i < elements.length) {
                //
                flow.push(elements[i]);
                i++
            }
        });
        //TODO flowElements.length > elements.length. Heuristic algorithm


        this.setState({
            flow: flow
        })
    }

    getNextElementInFlow() {
        //TODO этой крутой штуки, сейчас она переписывает нормальные сериализованные коорндинаты
        if (this.state.flow.length === 0) {
            this.state.flow.push({
                top: 10,
                left: 10,
                width: undefined,
                height: undefined
            })
        }
        if (this.flowElementIndex < this.state.flow.length-1) {
            this.flowElementIndex++;
            return this.state.flow[this.flowElementIndex];
        }
        const last = this.state.flow[this.state.flow.length-1]
        return {
            top: last.top+10, //px
            left: last.left+5, //%
            width: last.width,
            height: last.height
        }
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

//export default RemixWrapper(LayoutContainer, Schema, 'LayoutContainer')
export default sizeMe({monitorHeight: true, noPlaceholder: true})(LayoutContainer)