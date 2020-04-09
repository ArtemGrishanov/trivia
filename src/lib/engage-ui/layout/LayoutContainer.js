import '../style/rmx-layout.css'
import sizeMe from 'react-sizeme'
import React from 'react';
import DataSchema from '../../schema';
import { getAdaptedChildrenProps } from './LayoutAdapter'
import { debounce } from '../../remix/util/util';

class LayoutContainer extends React.Component {

    static getDerivedStateFromProps(props, state) {
        Object.keys(state.magnets).forEach( id => {
            if (id !== 'default' && !props.children.find( c => c.props.id === id)) {
                // children deleted, so delete children related magnets
                delete state.magnets[id];
                // new children will send us a callback in onLayoutItemUpdate() and we'll create magnets
            }
        })
        return {
            ...state,
            magnets: {...state.magnets},
            width: props.size.width >= 0 ? props.size.width: state.width,
            height: props.size.height >= 0 ? props.size.height: state.height
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            width: undefined,
            height: undefined,
            visibleMagnets: null,
            adaptedChildrenProps: {},
            adaptedHeight: undefined,
            // магниты созданные компонентами, края и середина компонента создают магниты - всего 3 вертикальных магнита
            magnets: {},
            // компоненты вокруг которых показать рамку для их подсветки
            borderedComponents: []
        }
        if (props.globalTestId) {
            window[props.globalTestId] = this;
        }
        this.childRefs = {};
        this.userDefinedNormalizedProps = {};
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onDragAndMagnetsAttached = this.onDragAndMagnetsAttached.bind(this);
        this.onLayoutItemUpdate = this.onLayoutItemUpdate.bind(this);
        // магниты видимые в данный момент, те которых коснулся перетаскиваемый компонент
        this.visibleMagnetsComponents = {};
        this.adaptateToNewViewportSize = debounce(this.adaptateToNewViewportSize, 500);
        this.unmounted = false;
    }

    onMouseDown(e) {
        // if (this.props.editable) {
        //     selectComponents([]);
        // }
    }

    /**
     * Вызывается когда компонент перетаскивается и прилепился к одному из магнитов
     *
     * @param {*} magnets
     * @param {*} component
     */
    onDragAndMagnetsAttached(magnets, component) {
        const
            prev = Object.values(this.visibleMagnetsComponents).flat(),
            prevJson = JSON.stringify(prev);
        if (magnets && magnets.length > 0) {
            this.visibleMagnetsComponents[component.props.id] = magnets;
        }
        else if (this.visibleMagnetsComponents.hasOwnProperty(component.props.id)) {
            delete this.visibleMagnetsComponents[component.props.id];
        }
        const next = Object.values(this.visibleMagnetsComponents).flat();
        if (prev.length !== next.length || prevJson != JSON.stringify(next)) {

            this.setState((state, props) => {
                return {
                    visibleMagnets: next,
                    borderedComponents: next.length === 1 ?
                        Object.values(state.magnets)
                        .flat()
                        .filter( m => m.left === next[0].left && m.type === next[0].type && m.componentId !== component.props.id)
                        .map( m => m.componentId )
                        : []
                }
            });
        }
    }

    /**
     * Вызывается когда один из дочерних компонентов меняет размеры или координаты
     * Тогда контейнер обновляет информацию о магнитах
     *
     */
    onLayoutItemUpdate(component) {
        this.setState((state, props) => {
            // every components creates 3 vertical magnets: l1 - left edge, l2 - center, l3 - right edge
            // if compoent geometry changes we must change magnet too
            const ccms = state.magnets[component.props.id],
                l1 = component.state.left,
                l2 = component.state.left + component.state.width / 2,
                l3 = component.state.left + component.state.width;

            if (!ccms || ccms[0].left !== l1 || ccms[1].left !== l2 || ccms[2].left !== l3) {
                state.magnets[component.props.id] = [
                    {left: l1, type: 'edge', componentId: component.props.id},
                    {left: l2, type: 'center', componentId: component.props.id},
                    {left: l3, type: 'edge', componentId: component.props.id}
                ];
                return {
                    magnets: {...state.magnets}
                }
            }
        });
    }

    /**
     * Адаптировать разметку под измененный размер контейнера
     * Иметь одно событие (onSize в LayoutContainer) для запуска этой функции очень удобно, вместо установки колбеков на все LayoutItem
     */
    adaptateToNewViewportSize() {
        // только для НЕредакирования. В 'edit' пользователь только настраивает положение элементов
        if (!this.unmounted && !this.props.editable && this.props.size.width > 0) {
            if (this.props.size.width === 800) {
                this.setState({
                    adaptedChildrenProps: {}
                });
            }
            else {
                console.log(`adaptateToNewViewportSize(). Size w=${this.props.size.width} h=${this.props.size.height}`);
                if (990 > 800) {
                    //TODO
                    //setAppSize(990)
                }
                this.setState({
                    adaptedHeight: 990, //TODO return from getAdaptedChildrenProps()
                    adaptedChildrenProps: getAdaptedChildrenProps(this.props.children, this.childRefs, {
                        //TODO 800
                        origCntWidth: 800,
                        userDefinedNormalizedProps: this.userDefinedNormalizedProps,
                        containerWidth: this.props.size.width
                    })
                })
            }
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
            // установить изначальные нормализованные свойства
            this.userDefinedNormalizedProps[componentId] = {...props};
        }
    }

    render() {
        const st = {
                border: (this.props.border) ? '1px solid black': 'none'
            };
        if (this.state.adaptedHeight) {
            st.height = this.state.adaptedHeight+'px'
        }
        let childrenWithProps = null;
        // state.width comes from 'sizeMe' wrapper
        if (this.state.width > 0 && this.state.height > 0) {
            // container inited and measured
            // we can render children now

            //TODO 05.04.2020 эксперимент по удалению - зачем это обнуление нужно было? Так как для adaptateToNewViewportSize нужен childRefs и его нельзя обнулять
            //this.childRefs = {};

            const magnetsVertical = Object.values(this.state.magnets).flat();
            childrenWithProps = React.Children.map(this.props.children, child => {
                const aProps = (!this.props.editable && child.props.id && this.state.adaptedChildrenProps[child.props.id]) ? this.state.adaptedChildrenProps[child.props.id]: {};
                return React.cloneElement(child, {
                    setRef: this.setRef.bind(this, child.props.id),
                    normalizerRef: this.setNormalizedProps.bind(this, child.props.id),
                    containerWidth: this.state.width,
                    containerHeight: this.state.height,
                    magnetsVertical,
                    // 'editable' означает что LayoutItem поддерживает режим редактирования (показ рамки, ресайз и тд). Таким образом, для вложенных друг в друга LayoutItem становится не активным (например иконка внутри TextOption)
                    editable: this.props.editable,
                    onDragAndMagnetsAttached: this.onDragAndMagnetsAttached,
                    onLayoutItemUpdate: this.onLayoutItemUpdate,
                    bordered: this.state.borderedComponents.includes(child.props.id),
                    ...aProps
                })
            });
        }

        return (
            <div style={st} className="rmx-layout_container" onMouseDown={this.onMouseDown}>
                {childrenWithProps}
                {this.props.editable && this.state.visibleMagnets && this.state.visibleMagnets.map( (mv) => {
                    if (mv.hide !== true) {
                        return (<div key={'mv_'+mv.left} className="rmx-l_mgn" style={{left:mv.left+'px'}}></div>)
                    }
                })}
            </div>
        )
    }

    componentDidMount() {
        this.adaptateToNewViewportSize();
    }

    componentDidUpdate(prevProps) {
        if (this.props.size.width >= 0 && !this.state.magnets['default']) {
            this.setState((state, props) => {
                return {
                    magnets: {
                        ...state.magnets,
                        'default': [
                            {left: 0, type: 'edge', componentId: null},
                            {left: this.props.size.width / 2, type: 'center', componentId: null},
                            {left: this.props.size.width-1, type: 'edge', componentId: null}
                        ]
                    }
                }
            });
        }
        //this.props.size.width !== prevProps.size.width - cyclic adaptateToNewViewportSize

        // but when we update current screen we must apadt again

        if (!this.editable && this.props.size.width > 0 && (this.props.size.width !== prevProps.size.width || this.props.id !== prevProps.id)) {
            this.adaptateToNewViewportSize();
        }
    }


    componentWillUnmount() {
        this.unmounted = true;
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