import '../style/rmx-layout.css'
import sizeMe from 'react-sizeme'
import React from 'react';
import DataSchema from '../../schema';
import { getAdaptedChildrenProps } from './LayoutAdapter'

//TODO hide/show magnet lines when operation in action

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
            adaptedChildrenProps: {}
        }
        if (props.globalTestId) {
            window[props.globalTestId] = this;
        }
        this.childRefs = {};
        this.userDefinedNormalizedProps = {};
    }

    /**
     * Адаптировать разметку под измененный размер контейнера
     * Иметь одно событие (onSize в LayoutContainer) для запуска этой функции очень удобно, вместо установки колбеков на все LayoutItem
     */
    adaptateToNewViewportSize() {
        console.log(`AdaptateToNewViewportSize. Size w=${this.props.size.width} h=${this.props.size.height}`);
        // только для НЕредакирования. В 'edit' пользователь только настраивает положение элементов
        if (Remix.getMode() !== 'edit') {
            this.setState({
                adaptedChildrenProps: getAdaptedChildrenProps(this.props.children, {
                    //TODO 800
                    origCntWidth: 800,
                    userDefinedNormalizedProps: this.userDefinedNormalizedProps,
                    containerWidth: this.props.size.width
                })
            })
            //TODO увеличение высоты самого контейнера (и приложения?) при необходимости
        }
    }

    /**
     * Сохраняем ссылки на все отрендеренные элементы children
     * @param {string} id
     * @param {DomElement} element
     */
    setRef(componentId, element) {
        if (componentId) {
            this.childRefs[componentId] = element;
            //TODO zombie components? Подумать нужна ли здесь эта проверка
            // if (this.props.children.length < Object.keys(this.childRefs).length) {
            //     throw new Error('Zombie components, check pls');
            // }
        }
    }

    /**
     * Сохраняем ссылки на все отрендеренные элементы children
     * @param {string} componentId
     * @param {object} props
     */
    setNormalizedProps(componentId, props) {
        //TODO когда именно и сколько раз надо устанавливать оригинальные нормализованные свойства?
        if (componentId && this.userDefinedNormalizedProps[componentId] === undefined) {
            console.log('setNormalizedProps');
            // установить изначальные нормализованные свойства
            this.userDefinedNormalizedProps[componentId] = {...props};
        }
    }

    render() {
        console.log('render()')
        const st = {
                border: (this.props.border) ? '1px solid black': 'none'
            },
            isEditMode = Remix.getMode() === 'edit';
        let childrenWithProps = null;
        // state.width comes from 'sizeMe' wrapper
        if (this.state.width > 0 && this.state.height > 0) {
            // container inited and measured
            // we can render children now
            this.childRefs = {};
            childrenWithProps = React.Children.map(this.props.children, child => {
                const aProps = (!isEditMode && child.props.id && this.state.adaptedChildrenProps[child.props.id]) ? this.state.adaptedChildrenProps[child.props.id]: {};
                return React.cloneElement(child, {
                    setRef: this.setRef.bind(this, child.props.id),
                    normalizerRef: this.setNormalizedProps.bind(this, child.props.id),
                    containerWidth: this.state.width,
                    containerHeight: this.state.height,
                    magnetsVertical: this.state.magnetsVertical,
                    // 'editable' означает что LayoutItem поддерживает режим редактирования (показ рамки, ресайз и тд). Таким образом, для вложенных друг в друга LayoutItem становится не активным (например иконка внутри TextOption)
                    editable: isEditMode,
                    ...aProps
                })
            });
        }

        return (
            <div style={st} className="rmx-layout_container">
                {childrenWithProps}
                {isEditMode && this.state.magnetsVertical && this.state.magnetsVertical.map( (mv) => {
                    if (mv.hide !== true)
                        return <div key={'mv_'+mv.left} className="rmx-l_mgn" style={{left:mv.left+'%'}}></div>
                })}
            </div>
        )
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps) {
        console.log('componentDidUpdate');
        if (this.props.size.width !== prevProps.size.width) {
            this.adaptateToNewViewportSize();
        }
    }
}

export const Schema = new DataSchema({
    'border': {
        type: 'boolean',
        default: false
    }
});

export default sizeMe({
    refreshMode: 'debounce',
    refreshRate: 400,
    monitorHeight: true,
    noPlaceholder: true
})(LayoutContainer)