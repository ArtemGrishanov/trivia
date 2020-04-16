import Row from './Row'

/**
 * Получить новые props для компонентов в соответствии с параметрами пережаннами в init
 *
 * @param {array} components
 * @param {object} refs
 */
export function getAdaptedChildrenProps(
    components,
    {
        origCntWidth,
        containerWidth,
        HORIZ_ROW_DEVIATION = 9, // разброс координат в этих пределах - считается одним и рем же рядом
        HORIZ_MARGIN = 6,
        VERTICAL_MARGIN = 12,
    },
    returnedAttributes = {},
) {
    //TODO get nearest user verified layout

    //TODO если пользователь специально запланировал пересечение элементов?

    // отсортируем все компоненты children сверху вниз
    const { rows, decorRows } = createInitialRows(
        components,
        origCntWidth,
        containerWidth,
        HORIZ_MARGIN,
        HORIZ_ROW_DEVIATION,
    )

    // декоративные компоненты ровняем по ширине просто. Пользуемся тем же кодом что и для блочных, но для декора один компонент - один ряд
    for (let i = 0; i < decorRows.length; i++) {
        decorRows[i].resize(containerWidth)
    }

    let droppedComponents = []
    for (let i = 0; i < rows.length; i++) {
        droppedComponents = rows[i].resize(containerWidth)

        // если выбывшие компоненты являются родственными тем что на след ряду, то пытаемся поместить туда
        // это полезно для реализации сеток
        if (droppedComponents.length > 0 && i + 1 < rows.length && rows[i + 1].canAdd(droppedComponents[0])) {
            //TODO isRelated
            while (droppedComponents.length > 0) rows[i + 1].add(droppedComponents.pop(), 0)
        }

        // создать новые ряды из неуместившихся компонентов
        while (droppedComponents.length > 0) {
            i++
            const newRow = new Row(origCntWidth, containerWidth, HORIZ_MARGIN)
            rows.splice(i, -1, newRow)
            newRow.add(droppedComponents.shift())
            while (droppedComponents.length > 0 && newRow.canAdd(droppedComponents[0])) {
                newRow.add(droppedComponents.shift())
            }
            newRow.center()
        }
    }

    // выстроить ряды по вертикали
    // пока не достигнем ряда, подвергшегося переносу сохраняем вертикальные координаты
    let t = rows.length > 0 ? rows[0].getTop() : 0
    for (let i = 1; i < rows.length; i++) {
        t += rows[i - 1].getHeight() + VERTICAL_MARGIN
        rows[i].setTop(t)
    }
    if (rows.length > 0) {
        returnedAttributes.contentHeight = rows[rows.length - 1].getTop() + rows[rows.length - 1].getHeight()
    }

    // всегда сбрысываем прежние изменения в adaptedChildrenProps
    const adaptedChildrenProps = {}
    rows.forEach(r => {
        r.components.forEach(c => {
            adaptedChildrenProps[c.id] = { ...adaptedChildrenProps[c.id], ...c }
        })
    })
    decorRows.forEach(r => {
        r.components.forEach(c => {
            adaptedChildrenProps[c.id] = { ...adaptedChildrenProps[c.id], ...c }
        })
    })

    return adaptedChildrenProps
}

export function cloneLayoutItemProps(props) {
    return {
        top: props.top,
        left: props.left,
        leftStrategy: props.leftStrategy,
        width: props.width,
        widthStrategy: props.widthStrategy,
        height: props.height,
        id: props.id,
    }
}

function createInitialRows(components, origCntWidth, containerWidth, horizMargin, horizDeviation) {
    const userDefinedNormalizedProps = {},
        rows = [],
        decorRows = []
    components.forEach(c => (userDefinedNormalizedProps[c.id] = { ...c }))
    const sortedTopLeft = components
        .filter(c => userDefinedNormalizedProps[c.id].displayType === 'flow')
        .sort((c1, c2) => {
            return c1.top === c2.top ? c1.left - c2.left : c1.top - c2.top
        })
    let row
    sortedTopLeft.forEach(c => {
        // horizDeviation - компоненты с этим отклонением top, считаются одним рядом
        if (!row || (row.getTop() !== undefined && Math.abs(row.getTop() - c.top) > horizDeviation)) {
            row = new Row(origCntWidth, containerWidth, horizMargin)
            rows.push(row)
        }
        row.add({ ...userDefinedNormalizedProps[c.id], ...c }, undefined, false)
    })
    components.forEach(c => {
        if (userDefinedNormalizedProps[c.id].displayType === 'decor') {
            const dr = new Row(origCntWidth, containerWidth, horizMargin)
            dr.add({ ...userDefinedNormalizedProps[c.id], ...c }, undefined, false)
            decorRows.push(dr)
        }
    })
    return {
        rows,
        decorRows,
    }
}
