import React from 'react'
import { connect } from 'react-redux';
import Remix from '../../../lib/remix'
import {
    selectComponents,
    setComponentPosition,
    getActiveScreenId,
    getActiveScreen
} from '../../../lib/remix'

const MIN_WIDTH = 20; // px
const MIN_HEIGHT = 20; // px
const MAGNET_DISTANCE = 7; // px

function toPercent(widthPx, containerWidth) {
    if (widthPx >= 0 && containerWidth >= 0) {
        return widthPx / containerWidth * 100;
    }
    return undefined;
}

function toPx(widthPercent, containerWidth) {
    if (widthPercent >= 0 && containerWidth >= 0) {
        return widthPercent / 100 * containerWidth;
    }
    return undefined;
}

function calcState({
        state,
        propLeft,
        propTop,
        propWidth,
        propHeight,
        propContainerWidth,
        left,
        top,
        width,
        height,

        propMagnetsVertical
    }) {
        const isPercent = typeof propWidth === 'string' && propWidth.length > 2 ? propWidth[propWidth.length-1] === '%': false;
        const newPropWidth = parseInt(propWidth);
        if (width === undefined || state.prevPropWidth != newPropWidth) {
            // auto width
            if (newPropWidth >= 0) {
                // props имеют наибольший приоритет при изначальной установке
                // в props передаются размеры при десериализации
                width = newPropWidth;
            }
        }

        if (height === undefined || state.prevPropHeight != propHeight) {
            // auto height
            if (propHeight >= 0) {
                height = propHeight;
            }
        }

        // width normalization
        if (isPercent) {
            const wpx = toPx(width, propContainerWidth);
            if (wpx < MIN_WIDTH || wpx === undefined) {
                // wpx === undefined when width is not set in props
                width = toPercent(MIN_WIDTH, propContainerWidth);
            }
        }
        else if (width < MIN_WIDTH) {
            width = MIN_WIDTH;
        }

        // height normalization
        if (height < MIN_HEIGHT || height === undefined) {
            height = MIN_HEIGHT;
        }

        if (top === undefined || state.prevPropTop != propTop) {
            // props changed or it's a first setup
            top = propTop;
        }

        if (left === undefined || state.prevPropLeft != propLeft) {
            // props changed or it's a first setup
            left = propLeft;
        }

        // trying to find an appropriate magnet to align 'left'
        //TODO magnets with no type
        if (propMagnetsVertical) {
            const magnet = propMagnetsVertical.find( (mv) => {
                let ll = left;
                if (mv.type === 'center') {
                    ll += width/2;
                }
                else if (mv.type === 'right') {
                    ll += width;
                }
                return Math.abs(mv.left - ll) < MAGNET_DISTANCE //MAGNET_DISTANCE, propContainerWidth)
            });
            if (magnet) {
                if (magnet.type === 'center') {
                    left = magnet.left - width/2;
                }
                else if (magnet.type === 'right') {
                    left = magnet.left - width;
                }
                else {
                    left = magnet.left;
                }
            }
        }

        return {
            top: top,
            left: left,
            width: width,
            height: height,

            prevPropTop: propTop,
            prevPropLeft: propLeft,
            prevPropWidth: propWidth,
            prevPropHeight: propHeight
        }
}

const mapStateToProps = (state, ownProps) => {
    return {
        selected: state.session.selectedComponentIds.indexOf(ownProps.id) >= 0
    }
}

export default function LayoutItem() {

    return function(Component) {
        return connect(mapStateToProps)(class extends React.Component {

            static getDerivedStateFromProps(props, state) {
                return {
                    ...state,
                    ...calcState({
                        state: state,
                        propLeft: props.left,
                        propTop: props.top,
                        propWidth: props.width,
                        propHeight: props.height,
                        propContainerWidth: props.containerWidth,
                        width: state.width,
                        height: state.height,
                        top: state.top,
                        left: state.left
                    })
                }
            }

            static defaultProps = {
                left: 33,
                top: 50,
                width: undefined,
                height: undefined,
                containerWidth: undefined,
                magnetsVertical: null
            }

            constructor(props) {
                super(props);
                this.state = {
                    top: undefined,
                    left: undefined,
                    width: undefined,
                    height: undefined,
                    contentWidth: undefined,
                    contentHeight: undefined
                }
                this.thisRef = React.createRef();
                this.childCntRef = React.createRef();
                this.contentObserver = null;

                // dragging/resizing
                this.isItemMouseDown = false;
                this.markerId = 0;
                this.isDragging = false;
                this.itemNode = null;
                this.startAttr = null;
                this.mouseStartPosition = null;
                this.onMouseDown = this.onMouseDown.bind(this);
                this.onWindowMouseMove = this.onWindowMouseMove.bind(this);
                this.onWindowMouseUp = this.onWindowMouseUp.bind(this);
                this.onClick = this.onClick.bind(this);
                this.mouseDownRecently = false;
                this.doubleClicked = false;
                this.minWidthPx = null;
            }

            onMouseDown(e) {
                if (this.props.editable) {
                    selectComponents([]);
                    this.itemNode = this.thisRef.current;
                    this.doubleClicked = false;
                    if (this.mouseDownRecently) {
                        this.doubleClicked = true;
                        console.log('dblclicked');
                    }
                    this.mouseDownRecently = true;
                    setTimeout(() => {
                        this.mouseDownRecently = false;
                    }, 200);
                    if (this.itemNode && !this.doubleClicked) {
                        this.markerId = e.currentTarget.getAttribute('datamarker');
                        this.isItemMouseDown = true;
                        // TODO force select (hover) while dragging or resizing
                        if (this.itemNode.style.left.indexOf('px') > 0) {
                            // if 'px' transform to '%'
                            this.itemNode.style.left = this.leftPxToPercent(this.itemNode.style.left) + '%';
                        }
                        this.startAttr = {
                            left: parseFloat(this.state.left),
                            top: parseFloat(this.state.top),
                            width: parseFloat(this.state.width),
                            height: parseFloat(this.state.height)
                        }
                        this.mouseStartPosition = {
                            left: e.clientX, //toPercent(e.clientX, this.props.containerWidth),
                            top: e.clientY
                        }
                        this.minWidthPx = toPercent(MIN_WIDTH, this.props.containerWidth);
                        e.stopPropagation();
                    }
                }
            }

            leftPxToPercent(lpx) {
                return (parseFloat(lpx) / this.props.containerWidth) * 100;
            }

            onWindowMouseMove(e) {
                if (this.isItemMouseDown) {
                    this.isDragging = true;
                    const dx = e.clientX - this.mouseStartPosition.left;//toPercent(e.clientX, this.props.containerWidth) - this.mouseStartPosition.left; // percents
                    const dy = e.clientY - this.mouseStartPosition.top; // px
                    let l, t, w, h;
                    if (this.markerId == 9) {
                        l = this.startAttr.left + dx;
                        t = this.startAttr.top + dy;
                    }
                    else if (this.markerId == 3 || this.markerId == 4 || this.markerId == 5) {
                        w = this.startAttr.width + dx;
                    }
                    else if (this.markerId == 1 || this.markerId == 7 || this.markerId == 8) {
                        w = this.startAttr.width - dx;
                        if (w > this.minWidthPx) {
                            l = this.startAttr.left + dx;
                        }
                    }
                    else if (this.markerId == 6) {
                        h = this.startAttr.height + dy;
                    }
                    else if (this.markerId == 2) {
                        h = this.startAttr.height - dy;
                        if (h > MIN_HEIGHT) {
                            t = this.startAttr.top + dy;
                        }
                    }
                    if (l !== undefined || t !== undefined || w !== undefined || h != undefined) {
                        this.setState({
                            ...calcState({
                                state: this.state,
                                propContainerWidth: this.props.containerWidth,
                                propLeft: this.props.left,
                                propTop: this.props.top,
                                propWidth: this.props.width,
                                propHeight: this.props.height,
                                width: w === undefined ? this.state.width: w,
                                height: h === undefined ? this.state.height: h,
                                top: t === undefined ? this.state.top: t,
                                left: l === undefined ? this.state.left: l,

                                propMagnetsVertical: this.props.magnetsVertical
                            })
                        });
                    }
                    //TODO check LayoutItemWidth cannot be less than content width, but text can collapse: break by words and letters
                }
            }

            onWindowMouseUp(e) {
                if (this.props.editable) {
                    if (this.isDragging) {
                        this.isDragging = false;
                        // save size and position after dragging
                        setComponentPosition({
                            id: this.props.id,
                            top: this.state.top,
                            left: this.state.left,
                            width: this.state.width,
                            height: this.state.height
                        });
                    }
                    else if (this.isItemMouseDown) {
                        // use selection mode for external services (like Editor)
                        // and keep element selected (show selection border)
                        selectComponents([this.props.id], {
                            componentProps: {[this.props.id]: {...this.props}},
                            clientRect: this.thisRef.current ? this.thisRef.current.getBoundingClientRect(): {},
                            screenProps: {...getActiveScreen()},
                            screenId: getActiveScreenId()
                        });
                    }
                    this.isItemMouseDown = false;
                }
            }

            componentDidMount() {
                if (this.props.editable) {
                    window.addEventListener('mousemove', this.onWindowMouseMove);
                    window.addEventListener('mouseup', this.onWindowMouseUp);
                }
            }

            componentWillUnmount() {
                if (this.props.editable) {
                    window.removeEventListener('mousemove', this.onWindowMouseMove);
                    window.removeEventListener('mouseup', this.onWindowMouseUp);
                }
            }

            onContentSize(size) {
                // if (!this.props.editable) {
                //     this.checkVerticalOverflow();
                // }
            }

            onClick() {
                if (this.props.editable) {

                }
                else {
                    Remix.fireEvent('onclick', {...this.props});
                }
            }

            render() {
                const st = {
                    left: this.state.left+'px',
                    top: this.state.top+'px',
                    width: this.state.width+'px',
                    height: this.state.height+'px'
                };
                // align child inside container
                const cst = {
                    //TODO trying to prevent progressive image overflow
                    //maxHeight: this.state.height+'px'

                    // left: Math.round((toPx(this.state.width, this.props.containerWidth) - this.state.contentWidth) / 2) + 'px',
                    // top: Math.round((this.state.height - this.state.contentHeight) / 2) + 'px'
                }

                //TODO
                // была попытка определить минимальный размер контента при установке размера блока 1х1 пиксель
                // но далеко не всегда это работает например текст вытягивается по вертикали сильно, картинки надо проверить и тп
                // if (this.state.contentMinWidth === undefined) {
                //     cst.width = '1px';
                //     cst.height = '1px';
                // }
                //TODO

                const sizemsg = Math.round(toPx(this.state.width, this.props.containerWidth)) + 'x' + Math.round(this.state.height);
                return (
                    <div ref={this.thisRef} dataid={this.props.id} className="rmx-layout_item" style={st} datamarker="9" onMouseDown={this.onMouseDown} onClick={this.onClick}>
                        <div ref={this.props.setRef} className="rmx-l_child_cnt" style={cst}>
                            {/* Передать измененные width,height из this.state которые пользователь изменил при перетаскивании и ресайзе */}
                            <Component {...this.props} {...this.state} /*onSize={this.onContentSize.bind(this)}*/></Component>
                        </div>
                        {this.props.editable &&
                            <div className={"rmx-layout_item_selection_cnt " + (this.props.selected ? '__selected': '')}>
                                {/* TODO uncomment */}
                                {/* <p className="rmx-l-info">{sizemsg}</p> */}
                                <div className="rmx-l-sel-m __1" datamarker="1" onMouseDown={this.onMouseDown}></div>
                                <div className="rmx-l-sel-m __2" datamarker="2" onMouseDown={this.onMouseDown}></div>
                                <div className="rmx-l-sel-m __3" datamarker="3" onMouseDown={this.onMouseDown}></div>
                                <div className="rmx-l-sel-m __4" datamarker="4" onMouseDown={this.onMouseDown}></div>
                                <div className="rmx-l-sel-m __5" datamarker="5" onMouseDown={this.onMouseDown}></div>
                                <div className="rmx-l-sel-m __6" datamarker="6" onMouseDown={this.onMouseDown}></div>
                                <div className="rmx-l-sel-m __7" datamarker="7" onMouseDown={this.onMouseDown}></div>
                                <div className="rmx-l-sel-m __8" datamarker="8" onMouseDown={this.onMouseDown}></div>
                            </div>
                        }
                    </div>
                )
            }

            exportLayout() {
                return {
                    top: this.state.top,
                    left: this.state.left,
                    width: this.state.width,
                    height: this.state.height
                }
            }
        });
    }
}