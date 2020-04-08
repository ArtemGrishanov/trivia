import { cloneLayoutItemProps } from './LayoutAdapter'

/**
 * Ряд - класс представляющий горизонтальную последовательность flow элементов
 */
export default class Row {
  /**
   * Создать новый ряд без ширины
   *
   * @param  {...any} components
   */
  constructor(originalComponentsProps, originalContainerWidth, containerWidth, horizMargin) {
    this.originalComponentProps = originalComponentsProps
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
    let minLeft

    if (this.components.length > 0 && this.components[0].left < 0) {
      // не допустить уход ряда влево в минус
      const dl = -this.components[0].left
      this.components.forEach(c => (c.left += dl))
    }

    this.components.forEach(c => {
      const originProps = this.originalComponentProps[c.id],
        ow = parseInt(originProps.width),
        r1 = (this.containerWidth - this.originalContainerWidth) / this.originalContainerWidth
      // 800: { left: 10px, leftStrategy: '%' } // leftStrategy: 'fixed' by default
      // 400: { left: 5px, leftStrategy: 'fixed' }
      if (c.widthStrategy === 'fixed') {
        // do nothing
      } else {
        c.width = Math.round(c.width * (this.containerWidth / this.originalContainerWidth))
      }
      if (c.leftStrategy === 'fixed') {
        // do nothing
      } else {
        // default c.leftStrategy === '%'
        // координата смещается пропорционально изменению ширины
        const l = parseInt(c.left),
          r = this.containerWidth / this.originalContainerWidth
        if (c.widthStrategy === 'fixed') {
          // ширина остается постоянной, и значит мы сильнее сдвигаем left для выравнивания
          c.left = Math.round(l * r + (c.width * r1) / 2)
        } else {
          // ширина уже изменилась (см выше)
          c.left = Math.round(l * r)
        }
        // чтобы сохранить минимальный отступ между элементами и не лепить вплотную
        c.left = minLeft > 0 && minLeft > c.left ? minLeft : c.left
        minLeft = c.left + c.width + this.horizMargin
      }
    })

    // так как мы не лепим компоненты близко к друг другу и всегда сохраняем this.horizMargin
    // то проверять компоненты которые не умещаются можно только с правой стороны
    // i > 0 - как минимум один компонент должен остаться
    for (let i = this.components.length - 1; i > 0; i--) {
      const c = this.components[i]
      if (c.left + c.width >= this.containerWidth) {
        droppedComponents.push(this.deleteRightComponent())
      } else {
        // остальные слева должны умещаться. выходим
        break
      }
    }

    if (this.components.length === 1) {
      const c = this.components[0]
      if (c.left + c.width >= this.containerWidth) {
        c.left = this.containerWidth - c.width
        if (c.left < 0) {
          c.left = 0
        }
        if (c.left + c.width > this.containerWidth) {
          c.width = this.containerWidth
        }
      }
    }

    this._resized = droppedComponents.length > 0
    return droppedComponents.reverse()
  }

  /**
   * Отцентровать содержимое ряда
   */
  center() {
    let l = Math.round(
      (this.containerWidth - this._allComponentsWidth - this.horizMargin * (this.components.length - 1)) / 2,
    )
    this.components.forEach(c => {
      c.left = l
      l += c.width + this.horizMargin
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
   * Получить ширину ряда
   */
  getWidth() {}

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
    this._allComponentsWidth += pr.width
    this._height = Math.max(this._height, pr.height)
    if (centerize) {
      this.center()
    }
  }

  deleteRightComponent() {
    const c = this.components.pop()
    this._allComponentsWidth -= c.width
    if (this._height === c.height) {
      if (this.components.length > 0) {
        this._height = this.components.reduce((memo, c) => Math.max(memo, c.height), 0)
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
    return this._allComponentsWidth + this.horizMargin + componentProps.width < this.containerWidth
  }

  /**
   * Проверить является ли компонент родственным для компонентов ряда
   * Проверка выполняется по тегам 'layout:*'
   *
   * @param {*} component
   * @returns {boolean}
   */
  isRelated(component) {}
}
