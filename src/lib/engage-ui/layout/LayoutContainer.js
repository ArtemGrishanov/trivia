import '../style/rmx-layout.css'
import React from 'react'
import { connect } from 'react-redux'
import DataSchema from '../../schema'
import { intersectRect, tryToMagnet, throttle, objectMinus } from '../../remix/util/util'
import {
    setComponentProps,
    selectComponents,
    getActiveScreenId,
    getActiveScreen,
    REMIX_MARK_AS_EXECUTED,
} from '../../remix'

class LayoutContainer extends React.Component {
    static getDerivedStateFromProps(props, state) {
        Object.keys(state.magnets).forEach(id => {
            if (id !== 'default' && !props.children.find(c => c.props.id === id)) {
                // children deleted, so delete children related magnets
                delete state.magnets[id]
                // new children will send us a callback in onLayoutItemUpdate() and we'll create magnets
            }
        })
        return {
            ...state,
            magnets: { ...state.magnets },
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            width: undefined,
            height: undefined,
            visibleMagnets: null,
            // магниты созданные компонентами, края и середина компонента создают магниты - всего 3 вертикальных магнита
            magnets: {},
            // компоненты вокруг которых показать рамку для их подсветки
            borderedComponents: [],
            selectRect: null,
            groupRect: null,
            groupComponents: null,
            componentPropsDeltas: null,
        }
        if (props.globalTestId) {
            window[props.globalTestId] = this
        }
        this.childrenWithProps = null
        this.onMouseDown = this.onMouseDown.bind(this)
        this.onWindowMouseMove = this.onWindowMouseMove.bind(this)
        this.onMouseUp = this.onMouseUp.bind(this)
        this.onDragAndMagnetsAttached = this.onDragAndMagnetsAttached.bind(this)
        this.onLayoutItemUpdate = this.onLayoutItemUpdate.bind(this)
        this.selectionRequestedByChild = this.selectionRequestedByChild.bind(this)
        // магниты видимые в данный момент, те которых коснулся перетаскиваемый компонент
        this.visibleMagnetsComponents = {}
        this.unmounted = false
        this.selectStartPoint = null
        this.groupMouseDown = false
        this.groupDragging = false
        this.childrenComputedProps = {}
        this.magnetsForGroup = null
        this.groupRectRef = React.createRef()
    }

    onMouseDown(e) {
        if (this.props.editable) {
            this.selectStartPoint = {
                left: e.nativeEvent.offsetX,
                top: e.nativeEvent.offsetY,
                clientX: e.clientX,
                clientY: e.clientY,
            }
            if (this.state.groupComponents) {
                this.groupMouseDown = true
            } else {
                this.setState({ groupComponents: null, groupRect: null, componentPropsDeltas: null })
            }
        }
    }

    onWindowMouseMove(e) {
        if (this.props.editable && this.selectStartPoint) {
            const cx = e.clientX - this.selectStartPoint.clientX,
                cy = e.clientY - this.selectStartPoint.clientY
            if (this.groupMouseDown && !this.groupDragging) {
                // сделать подготовку к перетаскиванию. Указать что выделенные компоненты находятся в режиме перетаскивания, это нужно например чтобы скрыть контекстное меню в редакторе и тп
                this.selectGroupComponents(true)
                // оставить только те магниты, которые не созданы компонетами группы
                this.magnetsForGroup = Object.values(objectMinus(this.state.magnets, this.state.groupComponents)).flat()
                this.groupDragging = true
            }
            if (this.groupDragging) {
                const { left, magnets } = tryToMagnet(
                    this.state.groupRect.left + cx,
                    this.state.groupRect.width,
                    Number.NaN,
                    this.magnetsForGroup,
                )
                if (magnets && magnets.length > 0) {
                    this.setState({
                        componentPropsDeltas: {
                            left: left - this.state.groupRect.left,
                            top: cy,
                        },
                    })
                    this.onDragAndMagnetsAttached(magnets, { props: { id: '__group__' } })
                } else {
                    this.setState({
                        componentPropsDeltas: {
                            left: cx,
                            top: cy,
                        },
                    })
                    this.onDragAndMagnetsAttached([], { props: { id: '__group__' } })
                }
            } else {
                const selectRect = {
                    top: Math.min(this.selectStartPoint.top, this.selectStartPoint.top + cy),
                    left: Math.min(this.selectStartPoint.left, this.selectStartPoint.left + cx),
                    width: Math.abs(cx),
                    height: Math.abs(cy),
                }
                this.setState({ selectRect })
                this.filterSelected(this.childrenWithProps, selectRect)
            }
            e.stopPropagation()
            e.preventDefault()
        }
    }

    onMouseUp(e) {
        if (this.props.editable) {
            if (this.groupMouseDown) {
                if (this.groupDragging) {
                    this.saveGroupComponentsPosition()
                    // так как обновили позицию компонентов, то дальше надо обновить и локальный стейт: прямоугольник выделения.
                    // и сбросить дельты тоже - теперь изменения координат записы в сами компоненты
                    this.setState(prevState => {
                        return {
                            groupRect: {
                                ...prevState.groupRect,
                                top: prevState.groupRect.top + prevState.componentPropsDeltas.top,
                                left: prevState.groupRect.left + prevState.componentPropsDeltas.left,
                            },
                            componentPropsDeltas: null,
                            selectRect: null,
                        }
                    })
                    this.groupDragging = false
                    this.magnetsForGroup = null
                    this.onDragAndMagnetsAttached([], { props: { id: '__group__' } })
                } else {
                    this.setState({
                        groupComponents: null,
                        groupRect: null,
                        componentPropsDeltas: null,
                        selectRect: null,
                    })
                }
            } else if (this.selectStartPoint) {
                this.selectGroupComponents()
                this.setState({
                    selectRect: null,
                })
            }
            this.groupMouseDown = false
            this.selectStartPoint = null
        }
    }

    saveGroupComponentsPosition() {
        if (this.state.groupComponents) {
            const pos = Object.keys(this.state.groupComponents).map(id =>
                this.childrenComputedProps[id]
                    ? {
                          top: this.childrenComputedProps[id].top,
                          left: this.childrenComputedProps[id].left,
                          width: this.childrenComputedProps[id].width,
                          height: this.childrenComputedProps[id].height,
                          id,
                      }
                    : void 0,
            )
            setComponentProps(pos, { putStateHistory: true })
        }
    }

    filterSelected = throttle((children, rect) => {
        const groupComponents = {},
            groupRect = {
                top: Number.MAX_SAFE_INTEGER,
                left: Number.MAX_SAFE_INTEGER,
                right: Number.MIN_SAFE_INTEGER,
                bottom: Number.MIN_SAFE_INTEGER,
            }
        children.forEach(c => {
            if (intersectRect(c.props, rect)) {
                groupComponents[c.props.id] = true
                groupRect.top = Math.min(groupRect.top, c.props.top)
                groupRect.left = Math.min(groupRect.left, c.props.left)
                groupRect.right = Math.max(groupRect.right, c.props.left + c.props.width)
                groupRect.bottom = Math.max(groupRect.bottom, c.props.top + c.props.height)
            }
        })
        if (Object.keys(groupComponents).length === 0) {
            this.setState({ groupComponents: null, groupRect: null })
        } else {
            groupRect.width = groupRect.right - groupRect.left
            groupRect.height = groupRect.bottom - groupRect.top
            this.setState({ groupComponents, groupRect })
        }
    }, 100)

    /**
     * Вызывается когда компонент перетаскивается и прилепился к одному из магнитов
     *
     * @param {*} magnets
     * @param {*} component
     */
    onDragAndMagnetsAttached(magnets, component) {
        const prev = Object.values(this.visibleMagnetsComponents).flat(),
            prevJson = JSON.stringify(prev)
        if (magnets && magnets.length > 0) {
            this.visibleMagnetsComponents[component.props.id] = magnets
        } else if (this.visibleMagnetsComponents.hasOwnProperty(component.props.id)) {
            delete this.visibleMagnetsComponents[component.props.id]
        }
        const next = Object.values(this.visibleMagnetsComponents).flat()
        if (prev.length !== next.length || prevJson != JSON.stringify(next)) {
            this.setState((state, props) => {
                return {
                    visibleMagnets: next,
                    borderedComponents:
                        next.length === 1
                            ? Object.values(state.magnets)
                                  .flat()
                                  .filter(
                                      m =>
                                          m.left === next[0].left &&
                                          m.type === next[0].type &&
                                          m.componentId !== component.props.id,
                                  )
                                  .map(m => m.componentId)
                            : [],
                }
            })
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
                l3 = component.state.left + component.state.width

            if (!ccms || ccms[0].left !== l1 || ccms[1].left !== l2 || ccms[2].left !== l3) {
                state.magnets[component.props.id] = [
                    { left: l1, type: 'edge', componentId: component.props.id },
                    { left: l2, type: 'center', componentId: component.props.id },
                    { left: l3, type: 'edge', componentId: component.props.id },
                ]
                return {
                    magnets: { ...state.magnets },
                }
            }
        })
    }

    selectGroupComponents(dragging = false) {
        // use selection mode for external services (like Editor)
        // and keep element selected (show selection border)
        if (this.state.groupComponents) {
            const componentProps = {}
            this.childrenWithProps.forEach(c => {
                componentProps[c.props.id] = { ...c.props }
            })
            selectComponents(Object.keys(this.state.groupComponents), {
                componentProps,
                clientRect: this.groupRectRef.current ? this.groupRectRef.current.getBoundingClientRect() : {},
                screenProps: { ...getActiveScreen() },
                screenId: getActiveScreenId(),
                doubleClicked: false,
                dragging,
            })
        } else {
            selectComponents([])
        }
    }

    /**
     * Дочерние компоненты LayoutItem в контейнере запрашивают выделение или сброс выделения
     *
     * @param {Array} componentIds
     * @param {object} data
     */
    selectionRequestedByChild(componentIds = [], data) {
        if (!this.state.groupComponents) {
            selectComponents(componentIds, data)
        }
    }

    /**
     * Вычислить геометрические пропсы дочерних компонентов
     * Зависит от перетаскивания и адаптированных "мобильных" свойств
     */
    computeComponentProps() {
        const aPropsMap =
                this.props.adaptedui && this.props.adaptedui[this.props.width] && this.props.adaptedui[this.props.width].props
                    ? this.props.adaptedui[this.props.width].props
                    : {},
            deltas = {},
            result = {}

        if (this.state.componentPropsDeltas && this.state.groupComponents) {
            this.props.children.forEach(c => {
                if (this.state.groupComponents[c.props.id]) {
                    deltas[c.props.id] = {
                        left: c.props.left + this.state.componentPropsDeltas.left,
                        top: c.props.top + this.state.componentPropsDeltas.top,
                    }
                    if (aPropsMap.top) {
                        deltas[c.props.id].top = aPropsMap.top + this.state.componentPropsDeltas.top
                    }
                    if (aPropsMap.left) {
                        deltas[c.props.id].left = aPropsMap.left + this.state.componentPropsDeltas.left
                    }
                }
            })
        }

        if (this.props.children) {
            this.props.children.forEach(child => {
                result[child.props.id] = {
                    ...child.props,
                    ...aPropsMap[child.props.id],
                    ...deltas[child.props.id],
                }
            })
        }

        return result
    }

    render() {
        if (this.props.width > 0 && this.props.height > 0) {
            const magnetsVertical = Object.values(this.state.magnets).flat()
            this.childrenComputedProps = this.computeComponentProps()
            this.childrenWithProps = React.Children.map(this.props.children, child => {
                return React.cloneElement(child, {
                    requestSelection: this.selectionRequestedByChild,
                    containerWidth: this.props.width,
                    containerHeight: this.props.height,
                    magnetsVertical,
                    // 'editable' означает что LayoutItem поддерживает режим редактирования (показ рамки, ресайз и тд). Таким образом, для вложенных друг в друга LayoutItem становится не активным (например иконка внутри TextOption)
                    editable: this.props.editable,
                    onDragAndMagnetsAttached: this.onDragAndMagnetsAttached,
                    onLayoutItemUpdate: this.onLayoutItemUpdate,
                    // когда компонент входит в выделеннуую группу то подсвечивается рамкой, или когда к нему примагнитился другой компонент
                    bordered:
                        this.state.borderedComponents.includes(child.props.id) ||
                        (this.state.groupComponents ? this.state.groupComponents[child.props.id] : false),
                    // если выделена группа, то не надо передавать пропс 'selected' так как иначе будут доступна маркеры ресайза и компонент можно будет ресайзить а это не нужно в группе
                    selected: this.state.groupComponents ? false : this.props.remixSelectedComponents[child.props.id],
                    ...this.childrenComputedProps[child.props.id],
                })
            })
        }

        return (
            <div className="rmx-layout_container" onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp}>
                {this.childrenWithProps}
                {this.props.editable &&
                    this.state.visibleMagnets &&
                    this.state.visibleMagnets.map(mv => {
                        if (mv.hide !== true) {
                            return (
                                <div key={'mv_' + mv.left} className="rmx-l_mgn" style={{ left: mv.left + 'px' }}></div>
                            )
                        }
                    })}
                {this.state.selectRect && (
                    <div
                        style={{
                            position: 'absolute',
                            top: this.state.selectRect.top + 'px',
                            left: this.state.selectRect.left + 'px',
                            width: this.state.selectRect.width + 'px',
                            height: this.state.selectRect.height + 'px',
                            pointerEvents: 'none',
                        }}
                    >
                        <div className="rmx-layout_item_selection_cnt __selected"></div>
                    </div>
                )}
                {this.state.groupRect && (
                    <div
                        ref={this.groupRectRef}
                        style={{
                            position: 'absolute',
                            top:
                                this.state.groupRect.top +
                                (this.state.componentPropsDeltas ? this.state.componentPropsDeltas.top : 0) +
                                'px',
                            left:
                                this.state.groupRect.left +
                                (this.state.componentPropsDeltas ? this.state.componentPropsDeltas.left : 0) +
                                'px',
                            width: this.state.groupRect.width + 'px',
                            height: this.state.groupRect.height + 'px',
                        }}
                    >
                        <div className="rmx-layout_item_selection_cnt __selected"></div>
                    </div>
                )}
            </div>
        )
    }

    componentDidMount() {
        window.addEventListener('mousemove', this.onWindowMouseMove)
    }

    componentDidUpdate(prevProps) {
        if (this.props.width >= 0 && !this.state.magnets['default']) {
            this.setState((state, props) => {
                return {
                    magnets: {
                        ...state.magnets,
                        default: [
                            { left: 0, type: 'edge', componentId: null },
                            { left: this.props.width / 2, type: 'center', componentId: null },
                            { left: this.props.width - 1, type: 'edge', componentId: null },
                        ],
                    },
                }
            })
        }
    }

    componentWillUnmount() {
        window.removeEventListener('mousemove', this.onWindowMouseMove)
        this.unmounted = true
    }
}

const mapStateToProps = (state, ownProps) => {
    const remixSelectedComponents = {}
    state.session.selectedComponentIds.forEach(id => (remixSelectedComponents[id] = true))
    return {
        remixSelectedComponents,
    }
}

export const Schema = new DataSchema({
    border: {
        type: 'boolean',
        default: false,
    },
})

export default connect(mapStateToProps)(LayoutContainer)
