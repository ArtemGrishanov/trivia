import '../style/rmx-layout.css'
import React from 'react'
import DataSchema from '../../schema'

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
        }
        if (props.globalTestId) {
            window[props.globalTestId] = this
        }
        this.onMouseDown = this.onMouseDown.bind(this)
        this.onDragAndMagnetsAttached = this.onDragAndMagnetsAttached.bind(this)
        this.onLayoutItemUpdate = this.onLayoutItemUpdate.bind(this)
        // магниты видимые в данный момент, те которых коснулся перетаскиваемый компонент
        this.visibleMagnetsComponents = {}
        this.unmounted = false
    }

    onMouseDown(e) {}

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

    render() {
        let childrenWithProps = null
        // state.width comes from 'sizeMe' wrapper
        if (this.props.width > 0 && this.props.height > 0) {
            // container inited and measured
            // we can render children now

            const magnetsVertical = Object.values(this.state.magnets).flat(),
                aPropsMap =
                    this.props.adaptedui &&
                    this.props.adaptedui[this.props.width] &&
                    this.props.adaptedui[this.props.width].props
                        ? this.props.adaptedui[this.props.width].props
                        : {}

            childrenWithProps = React.Children.map(this.props.children, child => {
                return React.cloneElement(child, {
                    containerWidth: this.props.width,
                    containerHeight: this.props.height,
                    magnetsVertical,
                    // 'editable' означает что LayoutItem поддерживает режим редактирования (показ рамки, ресайз и тд). Таким образом, для вложенных друг в друга LayoutItem становится не активным (например иконка внутри TextOption)
                    editable: this.props.editable,
                    onDragAndMagnetsAttached: this.onDragAndMagnetsAttached,
                    onLayoutItemUpdate: this.onLayoutItemUpdate,
                    bordered: this.state.borderedComponents.includes(child.props.id),
                    ...aPropsMap[child.props.id],
                })
            })
        }

        return (
            <div className="rmx-layout_container" onMouseDown={this.onMouseDown}>
                {childrenWithProps}
                {this.props.editable &&
                    this.state.visibleMagnets &&
                    this.state.visibleMagnets.map(mv => {
                        if (mv.hide !== true) {
                            return (
                                <div key={'mv_' + mv.left} className="rmx-l_mgn" style={{ left: mv.left + 'px' }}></div>
                            )
                        }
                    })}
            </div>
        )
    }

    componentDidMount() {}

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
        this.unmounted = true
    }
}

export const Schema = new DataSchema({
    border: {
        type: 'boolean',
        default: false,
    },
})

export default LayoutContainer
