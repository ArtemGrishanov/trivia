import React from 'react';

/**
 * Обертка для управления размерами компонента
 * Может быть помещена в LayoutContainer
 *
 * Вводная информация:
 * - Элемент внутри LayoutItem может быть как c динамической шириной (width:100%) так и со статичной
 * TODO расширение / сжатие
 * - LayoutItem можно попытаться расширить или сжать, потянув за уголки
 * - Показывается рамка обозначающая границы контента и LayoutItem
 *
 * Обладает свойствами:
 * - Всегда равен реальному размеру контента
 * TODO или нет? И контент должен центроваться в растягивающимся LayoutItem?
 * - В том числе и при расширении/сжатии. То есть уже чем элемент может быть min-width, сжать не получится. И рамка будет в актуальном состоянии
 *
 * - Устанавливает размер в % относительно контейнера LayoutContainer, но если контент статичный то
 *
 *
 * - Если дочерний элемент не обладает адаптивной шириной или высотой, не реагирует на изменение ширины LayoutItem,
 *   то LayoutItem также не должен менять свой размер и соответствует реальному размеру children
 *
 *
 * LayoutItem calcState procedure (согласование размеров потомка и контейнера):
 * - Предположим props.width / props.height для LayoutItem не определены
 * - render()
 * - componentDidMount/componentDidUpdate измеряем width/height children
 * - ставим актуальные width/height для LayoutItem
 * - создаем observer для отслеживания изменений в размерах children
 *
 *
 * TODO формат сохранения лейаута
 */

function getComponentWidthInPercent(widthPx, containerWidth) {
    if (widthPx >= 0 && containerWidth >= 0) {
        return widthPx / containerWidth * 100;
    }
    return undefined;
}

function calcState({
        state,
        propWidth,
        propHeight,
        containerWidth,
        contentWidth,
        contentHeight,
        width,
        height
    }) {

        if (propWidth === undefined && contentWidth > 0 && state.contentWidth === undefined && containerWidth > 0) {
            // как только определился размер контента, устанавливаем ширину LayoutItem равной контенту
            // при условии что в props не указана ширина
            width = getComponentWidthInPercent(contentWidth, containerWidth)
        }

        if (width === undefined) {
            if (propWidth >= 0) {
                width = propWidth;
            }
            else if (containerWidth > 0 && contentWidth > 0) {
                // рассчитать ширину в процентах относительно контейнера
                // делаем это только при первоначальной установке ширины контейнера
                width = getComponentWidthInPercent(contentWidth, containerWidth)
            }
            else {
                width = 33; //%
            }
        }

        if (height === undefined) {
            if (propHeight >= 0) {
                height = propHeight;
            }
            else if (contentHeight > 0) {
                height = contentHeight;
            }
            else {
                height = 30; //px
            }
        }
        else if (contentHeight > height) {
            height = contentHeight;
        }

        return {
            width: width,
            height: height,
            contentWidth: contentWidth,
            contentHeight: contentHeight
        }
}

export default class LayoutItem extends React.Component {

    static getDerivedStateFromProps(props, state) {
        return {
            ...state,
            ...calcState({
                state: state,
                propWidth: props.width,
                propHeight: props.height,
                containerWidth: props.containerWidth,
                contentWidth: state.contentWidth,
                contentHeight: state.contentHeight,
                width: state.width,
                height: state.height
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
        onMouseDown: null
    }

    constructor(props) {
        //TODO props чтобы задать начальную позицию для компонента а не 33 50
        super(props);
        this.state = {
            width: undefined,
            height: undefined,
            contentWidth: undefined,
            contentHeight: undefined
        }
        this.childRef = React.createRef();
        this.thisRef = React.createRef();
        this.contentObserver = null;
        this.onMouseDown = this.onMouseDown.bind(this);
    }

    componentDidMount() {
        try {
            this.contentObserver = new ResizeObserver((event) => {
                // console.log('content dimension changed', event);
                const rect = event[0].contentRect;
                // if (rect.width !== this.state.contentWidth || rect.height !== this.state.contentHeight) {
                if (!this.state.contentWidth || !this.state.contentHeight) {
                    console.log('content dimension init', event);
                    //TODO пока просто первый раз измеряем размеры контента
                    this.setState({
                        ...calcState({
                            state: this.state,
                            contentWidth: rect.width,
                            contentHeight: rect.height,
                            containerWidth: this.props.containerWidth,
                            propWidth: this.props.width,
                            propHeight: this.props.height,
                            width: this.state.width,
                            height: this.state.height
                        })
                    });
                    this.initObserver();
                }
            }).observe(this.childRef.current);
        }
        catch(error) {
            console.error('Element con not be observed');
        }
    }

    /**
     * Observe component width/height changes and recalculate the state
     * It could be resize operations in LayoutContainer.js
     *
     * Library: http://marcj.github.io/css-element-queries/
     */
    initObserver() {
        this.borderObserver = new ResizeObserver((event) => {
            //TODO как мы хотим выравнивать контент внутри LayoutItem?
            // контент меньше по ширине
            // контент больше по ширине
            // контент меньше по высоте
            // контент больше по высоте
            //
            //
            const rect = event[0].contentRect;
            if (rect.width !== this.state.width || rect.height != this.state.height) {
                this.setState({
                    ...calcState({
                        state: this.state,
                        contentWidth: this.state.contentWidth,
                        contentHeight: this.state.contentHeight,
                        containerWidth: this.props.containerWidth,
                        propWidth: this.props.width,
                        propHeight: this.props.height,
                        width: getComponentWidthInPercent(rect.width, this.props.containerWidth),
                        height: rect.height
                    })
                });
            }
        }).observe(this.thisRef.current);
    }

    isResizeable(elem) {
        //TODO нужен ли этот метод вообще?

        //TODO определить можно ли увеличить измерение блока
        //TODO определить можно ли увеличить другое измерение блока

        //maxWidth === '' || maxWidth > contentWidth
        return elem.style.width === '100%';
    }

    componentDidUpdate() {

    }

    onMouseDown(event) {
        if (this.props.onMouseDown) {
            const markerId = event.currentTarget.getAttribute('datamarker');
            this.props.onMouseDown(event, this.thisRef.current, markerId, this.state.width, this.state.height, this.resize);
        }
        event.stopPropagation();
    }

    render() {
        const st = {
            left: this.props.left+'%',
            top: this.props.top+'px',
            width: this.state.width+'%',
            height: this.state.height+'px'
        };
        const children = React.Children.map(this.props.children, child =>
            React.cloneElement(child, {ref: this.childRef})
        );
        return (
            <div ref={this.thisRef} className={"rmx-layout_item __"+this.props.mod} style={st} datamarker="9" onMouseDown={this.onMouseDown}>
                {children}
                <div className="rmx-layout_item_selection_cnt">
                    <div className="rmx-l-sel-m __1" datamarker="1" onMouseDown={this.onMouseDown}></div>
                    <div className="rmx-l-sel-m __2" datamarker="2" onMouseDown={this.onMouseDown}></div>
                    <div className="rmx-l-sel-m __3" datamarker="3" onMouseDown={this.onMouseDown}></div>
                    <div className="rmx-l-sel-m __4" datamarker="4" onMouseDown={this.onMouseDown}></div>
                    <div className="rmx-l-sel-m __5" datamarker="5" onMouseDown={this.onMouseDown}></div>
                    <div className="rmx-l-sel-m __6" datamarker="6" onMouseDown={this.onMouseDown}></div>
                    <div className="rmx-l-sel-m __7" datamarker="7" onMouseDown={this.onMouseDown}></div>
                    <div className="rmx-l-sel-m __8" datamarker="8" onMouseDown={this.onMouseDown}></div>
                </div>
            </div>
        )
    }
}