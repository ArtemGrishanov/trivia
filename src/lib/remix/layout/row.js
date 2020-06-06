import { cloneLayoutItemProps } from './adapter'

/**
 * Ряд - класс представляющий горизонтальную последовательность flow элементов
 */
export default class Row {
    /**
     * Создать новый ряд без ширины
     *
     * @param  {...any} components
     */
    constructor(originalContainerWidth, containerWidth, horizMargin) {
        this.originalContainerWidth = originalContainerWidth
        this.containerWidth = containerWidth
        this.horizMargin = horizMargin || 1
        this.components = []
        this._allComponentsWidth = 0
        this._height = 0
        this._resized = false
    }

    resized() {
        return this._resized
    }

    /**
     * Произвести адаптацию компонентов к ширине containerWidth
     * Returns - компоненты которые не уместились
     * оставшиеся компоненты будут отцентрованы
     * но перед этим мы попробуем сжать ряд без потерь компонентов
     *
     * @returns {Array} выбывшие компоненты которые не уместились
     */
    resize() {
        const droppedComponents = []
        // move 'left' coordinate depending in current size.width
        // будет автоматически смещена пропорционально изменению ширины экрана
        let minLeft,
            sumWidth = 0

        if (this.components.length > 0 && this.components[0].left < 0) {
            // не допустить уход ряда влево в минус
            const dl = -this.components[0].left
            this.components.forEach(c => (c.left += dl))
        }

        // ШАГ 1 - поменять ширину в зависимости от стратегии компонентов
        this.components.forEach(c => {
            // 800: { left: 10px, leftStrategy: '%' } // leftStrategy: 'fixed' by default
            // 400: { left: 5px, leftStrategy: 'fixed' }
            if (c.widthStrategy === 'fixed') {
                // do nothing
            } else {
                c.width = Math.round(c.width * (this.containerWidth / this.originalContainerWidth))
            }
            sumWidth += this._getw(c)
        })

        // ШАГ 2 - сдвинуть left в зависимости от стратегии компонентов
        this.components.forEach(c => {
            if (c.leftStrategy === 'fixed') {
                // do nothing
            } else {
                // default c.leftStrategy === '%'
                // координата смещается пропорционально изменению ширины
                const l = parseInt(c.left),
                    r = this.containerWidth / this.originalContainerWidth
                if (c.widthStrategy === 'fixed') {
                    // ширина остается постоянной, и значит мы сильнее сдвигаем left для выравнивания
                    c.left = Math.round((l + c.width / 2) * r - c.width / 2)
                } else {
                    // ширина уже изменилась (см выше)
                    c.left = Math.round(l * r)
                }
                if (c.left < 0) {
                    c.left = c.szLeft
                }
                // чтобы сохранить минимальный отступ между элементами и не лепить вплотную
                // uncomment?
                // c.left = minLeft > 0 && minLeft > c.left? minLeft: c.left;
                // minLeft = c.left + c.width + this.horizMargin;
            }
        })

        // ШАГ 3 - определить есть ли пересечения в ряду и если есть отцентровать все элементы (уже не пытаемся сохранить прежнее положение элементов по горизонтали)
        for (let i = 1; i < this.components.length; i++) {
            let prev = this.components[i - 1]
            if (
                prev.left + prev.width + prev.szRight + this.horizMargin >
                this.components[i].left - this.components[i].szLeft
            ) {
                this.center()
                break
            }
        }

        // ШАГ 4 - проверяем что все компоненты уместились. Если нет, удаляем компоненты справа
        // так как мы не лепим компоненты близко к друг другу и всегда сохраняем this.horizMargin
        // то проверять компоненты которые не умещаются можно только с правой стороны
        // i > 0 - как минимум один компонент должен остаться
        for (let i = this.components.length - 1; i > 0; i--) {
            const c = this.components[i]
            if (c.left + c.width + c.szRight >= this.containerWidth) {
                droppedComponents.push(this.deleteRightComponent())
                this.center()
            } else {
                // остальные слева должны умещаться. выходим
                break
            }
        }

        // ШАГ 5 - когда остался один компонент проверяем что его ширина не больше ширины котейнера
        if (this.components.length === 1) {
            const c = this.components[0]
            if (c.left + c.width + c.szRight >= this.containerWidth) {
                c.left = this.containerWidth - c.width - c.szLeft - c.szRight
                if (c.left < c.szLeft) {
                    c.left = c.szLeft
                }
                if (c.left + c.width + c.szRight > this.containerWidth) {
                    c.width = this.containerWidth - c.szRight - c.szLeft
                }
            }
        } else if (droppedComponents.length > 0) {
            this.center()
        }

        this._resized = droppedComponents.length > 0
        return droppedComponents.reverse()
    }

    /**
     * Нормализовать высоту ряда, передав размеры элементов
     *
     * @param {Object} rects
     */
    updateHeight(rects) {
        this.components.forEach(c => {
            if (c.id) {
                this._height = Math.max(this._height, rects[c.id])
            } else {
                console.error(`No ref was found for ${c.id}. Can not detect vertical overflow`)
            }
        })
    }

    /**
     * Отцентровать содержимое ряда
     */
    center() {
        let l = Math.round(
            (this.containerWidth - this._allComponentsWidth - this.horizMargin * (this.components.length - 1)) / 2,
        )
        this.components.forEach(c => {
            c.left = l + c.szLeft
            l += c.width + c.szRight + this.horizMargin
        })
    }

    setTop(newTop) {
        this.components.forEach(c => {
            c.top = newTop
        })
    }

    getTop() {
        return this.components.length ? this.components[0].top : undefined
    }

    /**
     * Получить высоту ряда
     */
    getHeight() {
        return this._height
    }

    /**
     *
     * @param {*} componentProps
     * @param {number} index
     */
    add(componentProps, index, centerize = true) {
        const pr = cloneLayoutItemProps(componentProps)
        pr.top = this.getTop() || pr.top
        if (index === undefined) {
            this.components.push(pr)
        } else {
            this.components.splice(index, -1, pr)
        }
        this._allComponentsWidth += this._getw(pr)
        this._height = Math.max(this._height, this._geth(pr))
        if (centerize) {
            this.center()
        }
    }

    deleteRightComponent() {
        const c = this.components.pop()
        this._allComponentsWidth -= this._getw(c)
        if (this._height === this._geth(c)) {
            if (this.components.length > 0) {
                this._height = this.components.reduce((memo, c) => Math.max(memo, this._geth(c)), 0)
            } else {
                this._height = 0
            }
        }
        return c
    }

    /**
     * Можно ли добавить новый компонент, хватает ли места для него
     * @param {*} componentProps
     */
    canAdd(componentProps) {
        return this._allComponentsWidth + this.horizMargin + this._getw(componentProps) < this.containerWidth
    }

    /**
     * Проверить является ли компонент родственным для компонентов ряда
     * Проверка выполняется по тегам 'layout:*'
     *
     * @param {*} component
     * @returns {boolean}
     */
    isRelated(component) {
        //TODO
    }

    _getw(component) {
        return component.szLeft + component.width + component.szRight
    }

    _geth(component) {
        return component.szTop + component.height + component.szBottom
    }
}
