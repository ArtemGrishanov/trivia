import React from 'react'
import Remix from '../../../lib/remix'

//TODO minContentWidth minContentHeight определяется на ширине контента 1x1 px
// но оказывается что некоторые компоненты например TextOption имеют наименьшую высоту при ширине более чем 70px, а не при ширине 1px
// подумать над другой логикой
// это нужно для того чтобы понимать насколько можно уменьшать компонент при ресайзе
// возможно придется отвечать на вопрос можем ли мы уменьшить компонент прямо во время процедуры ресайза:
// - пробуем уменьшить ширину компонента и смотрим на то как "ответит" компонент - уменьшится ли или нет. Если нет - возвращаем контейнер в исходное состояние

//TODO если слева уменьшаем ширину компонента или сверху уменьшаем ширину то компонент смещается при достижении минимальной ширины
// надо сделать так: когда ширина/высота достигла минимального значения то не менять left/top

//TODO Element {children} не определяет корректно размер контента

//TODO add align properties: vertical and horizonal, when content less then LayoutItem


/**
 * Обладает свойствами:
 * - содержит один элемент (со статичными или динамичными размерами width:100%)
 * - измеряет размер контента который внутри.
 * - измеряет минимальный размер контента
 * - поддерживается перетаскивание
 * - ресайз: можно попытаться расширить или сжать, потянув за уголки
 * - Не меньше чем реальный размер контента или чем 30х20 пикселей. Если LayoutItem больше контента то контент центрируется внутри
 * - Устанавливает размер в % относительно контейнера LayoutContainer
 * - контент центрируется
 * - Показывается рамка обозначающая границы контента и LayoutItem
 *
 *
 */
const MIN_WIDTH = 30; // px
const MIN_HEIGHT = 20; // px
const MAGNET_DISTANCE = 10; // px

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
        contentWidth,
        contentHeight,
        contentMinWidth,
        contentMinHeight,
        left,
        top,
        width,
        height,

        propMagnetsVertical
    }) {

        if (width === undefined || state.prevPropWidth != propWidth) {
            // auto width
            if (propWidth >= 0) {
                // props имеют наибольший приоритет при изначальной установке
                // в props передаются размеры при десериализации
                width = propWidth;
            }
            else if (contentWidth > 0 && state.contentWidth === undefined && propContainerWidth > 0) {
                // как только определился размер контента, устанавливаем ширину LayoutItem равной контенту
                // при условии что в props не указана ширина
                width = toPercent(contentWidth, propContainerWidth);
            }
        }

        if (height === undefined || state.prevPropHeight != propHeight) {
            // auto height
            if (propHeight >= 0) {
                height = propHeight;
            }
            else if (contentHeight > 0 && state.contentHeight === undefined) {
                // как только определен размер контента ставим высоту
                height = contentHeight;
            }
        }

        // set min width first time
        if (contentMinWidth === undefined && contentWidth >= 0) {
            //TODO
            // минимальный размер контента пока определяется не всегда корректно
            //contentMinWidth = contentWidth;
        }

        // set min width first time
        if (contentMinHeight === undefined && contentHeight >= 0) {
            //TODO
            // минимальный размер контента пока определяется не всегда корректно
            //contentMinHeight = contentHeight;
        }

        // width cannot be less then min content
        if (contentMinWidth > 0 && toPx(width, propContainerWidth) < contentMinWidth) {
            width = toPercent(contentMinWidth, propContainerWidth);
        }

        // width normalization
        if (toPx(width, propContainerWidth) < MIN_WIDTH) {
            width = toPercent(MIN_WIDTH, propContainerWidth);
        }

        // height cannot be less then content
        if (contentMinHeight > 0 && height < contentMinHeight) {
            height = contentMinHeight;
        }

        // height normalization
        if (height < MIN_HEIGHT) {
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
        if (propMagnetsVertical) {
            const magnet = propMagnetsVertical.find( (mv) => {
                let ll = left;
                if (mv.type === 'center') {
                    ll += width/2;
                }
                else if (mv.type === 'right') {
                    ll += width;
                }
                return Math.abs(mv.left - ll) < toPercent(MAGNET_DISTANCE, propContainerWidth)
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
            contentWidth: contentWidth,
            contentHeight: contentHeight,
            contentMinWidth: contentMinWidth,
            contentMinHeight: contentMinHeight,

            prevPropTop: propTop,
            prevPropLeft: propLeft,
            prevPropWidth: propWidth,
            prevPropHeight: propHeight
        }
}

export default function LayoutItem() {

    return function(Component) {
        return class extends React.Component {

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
                        contentWidth: state.contentWidth,
                        contentHeight: state.contentHeight,
                        width: state.width,
                        height: state.height,
                        top: state.top,
                        left: state.left,
                        contentMinWidth: state.contentMinWidth,
                        contentMinHeight: state.contentMinHeight
                    })
                }
            }

            static defaultProps = {
                mod: 'absolute',
                left: 33,
                top: 50,
                width: undefined,
                height: undefined,
                containerWidth: undefined,
                magnetsVertical: null
            }

            constructor(props) {
                //TODO props чтобы задать начальную позицию для компонента а не 33 50
                super(props);
                this.state = {
                    top: undefined,
                    left: undefined,
                    width: undefined,
                    height: undefined,
                    contentWidth: undefined,
                    contentHeight: undefined,
                    selected: false
                }
                this.thisRef = React.createRef();
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
            }

            onMouseDown(e) {
                if (Remix.getMode() === 'edit') {
                    this.itemNode = this.thisRef.current;
                    if (this.itemNode) {
                        this.markerId = e.currentTarget.getAttribute('datamarker');
                        e.stopPropagation();
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
                            left: toPercent(e.clientX, this.props.containerWidth),
                            top: e.clientY
                        }
                    }
                }
            }

            leftPxToPercent(lpx) {
                return (parseFloat(lpx) / this.props.containerWidth) * 100;
            }

            onWindowMouseMove(e) {
                if (this.isItemMouseDown) {
                    this.isDragging = true;
                    this.setState({
                        selected: true
                    });
                    const dx = toPercent(e.clientX, this.props.containerWidth) - this.mouseStartPosition.left; // percents
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
                        // ????
                        l = this.startAttr.left + dx;
                        // if (w !== this.itemNode.style.width) {
                        //     this.itemNode.style.width = w;
                        //     this.itemNode.style.left = (this.startAttr.left + dx) + '%';
                        // }
                    }
                    else if (this.markerId == 6) {
                        h = this.startAttr.height + dy;
                    }
                    else if (this.markerId == 2) {
                        h = this.startAttr.height - dy;
                        t = this.startAttr.top + dy;
                        // ????
                        // if (h !== this.itemNode.style.height) {
                        //     this.itemNode.style.height = h;
                        //     this.itemNode.style.top = (this.startAttr.top + dy) + 'px';
                        // }
                    }
                    if (l !== undefined || t !== undefined || w !== undefined || h != undefined) {
                        this.setState({
                            ...calcState({
                                state: this.state,
                                contentWidth: this.state.contentWidth,
                                contentHeight: this.state.contentHeight,
                                propContainerWidth: this.props.containerWidth,
                                propLeft: this.props.left,
                                propTop: this.props.top,
                                propWidth: this.props.width,
                                propHeight: this.props.height,
                                width: w === undefined ? this.state.width: w,
                                height: h === undefined ? this.state.height: h,
                                top: t === undefined ? this.state.top: t,
                                left: l === undefined ? this.state.left: l,
                                contentMinWidth: this.state.contentMinWidth,
                                contentMinHeight: this.state.contentMinHeight,

                                propMagnetsVertical: this.props.magnetsVertical
                            })
                        });
                    }
                    //TODO check LayoutItemWidth cannot be less than content width, but text can collapse: break by words and letters
                }
            }

            onWindowMouseUp() {
                if (this.isDragging) {
                    this.isDragging = false;
                    this.setState({
                        selected: false
                    });
                }
                this.isItemMouseDown = false;
            }

            componentDidMount() {
                window.addEventListener('mousemove', this.onWindowMouseMove);
                window.addEventListener('mouseup', this.onWindowMouseUp);
            }

            componentWillUnmount() {
                window.removeEventListener('mousemove', this.onWindowMouseMove);
                window.removeEventListener('mouseup', this.onWindowMouseUp);
            }

            onContentSize(size) {

                //console.log('onContentSize', size);
                this.setState({
                    ...calcState({
                        state: this.state,
                        contentWidth: size.width,
                        contentHeight: size.height,
                        propLeft: this.props.left,
                        propTop: this.props.top,
                        propContainerWidth: this.props.containerWidth,
                        propWidth: this.props.width,
                        propHeight: this.props.height,
                        width: this.state.width,
                        height: this.state.height,
                        top: this.state.top,
                        left: this.state.left,
                        contentMinWidth: this.state.contentMinWidth,
                        contentMinHeight: this.state.contentMinHeight
                    })
                });
            }

            onClick() {
                if (Remix.getMode() !== 'edit') {
                    Remix.fireEvent('onclick', {...this.props});
                }
            }

            render() {
                const st = {
                    left: this.state.left+'%',
                    top: this.state.top+'px',
                    width: this.state.width+'%',
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

                const editing = Remix.getMode() === 'edit';
                const sizemsg = Math.round(toPx(this.state.width, this.props.containerWidth)) + 'x' + Math.round(this.state.height);
                return (
                    <div ref={this.thisRef} className={"rmx-layout_item __"+this.props.mod} style={st} datamarker="9" onMouseDown={this.onMouseDown} onClick={this.onClick}>
                        <div className="rmx-l_child_cnt" style={cst}>
                            <Component {...this.props} onSize={this.onContentSize.bind(this)}></Component>
                        </div>
                        {editing &&
                            <div className={"rmx-layout_item_selection_cnt " + (this.state.selected ? '__selected': '')}>
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
        }
    }
}