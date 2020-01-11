import Row from './Row'

/**
 * Получить новые props для компонентов в соответствии с параметрами пережаннами в init
 * @param {array} components
 */
export function getAdaptedChildrenProps(components, {
    userDefinedNormalizedProps,
    origCntWidth,
    containerWidth,
    HORIZ_MARGIN = 6,
    VERTICAL_MARGIN = 12,
    // отклонение по координате top при котором элементы все равно считаются одним рядом
    rowTopDeviation = 5
}) {
    //TODO get nearest user verified layout
    //TODO учесть ретина размер экрана?
    // userDefinedNormalizedProps = get for specific origCntWidth

    // отсортируем все компоненты children сверху вниз
    const { rows, decorRows } = createInitialRows(components, userDefinedNormalizedProps, origCntWidth, containerWidth, HORIZ_MARGIN);

    //TODO set component id if not specified


    // декоративные компоненты ровняем по ширине просто. Пользуемся тем же кодом что и для блочных, но для декора один компонент - один ряд
    for (let i = 0; i < decorRows.length; i++) {
        decorRows[i].resize(containerWidth);
    }

    let droppedComponents = [];
    for (let i = 0; i < rows.length; i++) {
        droppedComponents = rows[i].resize(containerWidth);
        if (droppedComponents.length > 0) {
            rows[i].center();
        }
        // если выбывшие компоненты являются родственными тем что на след ряду, то пытаемся поместить туда
        // это полезно для реализации сеток
        if (droppedComponents.length > 0 && i + 1 < rows.length) {
            //TODO isRelated ?
            while (droppedComponents.length > 0) rows[i+1].add(droppedComponents.pop(), 0)
        }

        // создать новые ряды из неуместившихся компонентов
        while (droppedComponents.length > 0) {
            i++
            const newRow = new Row(userDefinedNormalizedProps, origCntWidth, containerWidth, HORIZ_MARGIN);
            rows.splice(i, -1, newRow);
            newRow.add(droppedComponents.shift());
            while (droppedComponents.length > 0 && newRow.canAdd(droppedComponents[0])) {
                newRow.add(droppedComponents.shift());
            }
            newRow.center();
        }
    }

    // выстроить ряды по вертикали
    // пока не достигнем ряда, подвергшегося переносу сохраняем вертикальные координаты
    let t, optimize = false;
    for (let i = 0; i < rows.length; i++) {
        if (optimize) {
            t += rows[i].getHeight() + VERTICAL_MARGIN;
            rows[i].setTop(t);
        }
        else if (rows[i].resized()) {
            // нашли ряд который "пострадал" от изменения ширины, возникли переносы
            // значит все нижние ряды будем перестраивать по вертикали
            optimize = true;
            t = rows[i].getTop();
        }
    }

    // всегда сбрысываем прежние изменения в adaptedChildrenProps
    const adaptedChildrenProps = cloneObject(userDefinedNormalizedProps);
    rows.forEach( (r) => {
        r.components.forEach( (c) => {
            adaptedChildrenProps[c.id] = {...adaptedChildrenProps[c.id], ...c}
        })
    })
    decorRows.forEach( (r) => {
        r.components.forEach( (c) => {
            adaptedChildrenProps[c.id] = {...adaptedChildrenProps[c.id], ...c}
        })
    })

    //TODO компоненты с одним тегом специального формата можно переносить и заново группировать на одной строке. Как карточки в мемори. Таким образом, можно строить сетки, которые будут нормально адаптироваться к ширине

    //TODO групповое выделение (shift / rect) и групповое перемещение например сетки целиком

    //TODO если пользователь специально запланировал пересечение элементов

    // for (let i = 0; i < sortedTopLeft.length;) {
    //     let componentProps = adaptedChildrenProps[sortedTopLeft[i].props.id];
    //     let elem;
    //     let lineTop = componentProps.top;
    //     let maxOverflow = 0;

    //     // проходим по горизонтальной линии компонентов и вычисляем максимальный overflow
    //     while (componentProps.top === lineTop) {
    //         elem = this.childRefs[componentProps.id];
    //         if (elem) {
    //             //console.log(`Checking overflow ${componentProps.id}`)
    //             //TODO однажды увеличив высоту scrollHeight уже не уменьшится
    //             if (elem.scrollHeight > componentProps.height) {
    //                 const ov = elem.scrollHeight - componentProps.height;
    //                 // увеличиваем высоту компонента чтобы показать весь контент
    //                 console.log(`Enlarge height ${componentProps.id} += ${ov}`);
    //                 adaptedChildrenProps[componentProps.id].height += ov;
    //                 maxOverflow = Math.max(maxOverflow, ov);
    //             }
    //         }
    //         else {
    //             throw new Error('Error');
    //         }
    //         i++;
    //         if (i >= sortedTopLeft.length) break;
    //         componentProps = adaptedChildrenProps[sortedTopLeft[i].props.id];
    //     }
    //     // закончили проходить линию компонентов.
    //     // если есть overflow по вертикали - сдвинуть вниз все нижележащие компоненты
    //     if (maxOverflow > 0) {
    //         console.log(`Max overflow ${maxOverflow} for line ${lineTop}`);
    //         this.shiftDown(adaptedChildrenProps, lineTop, maxOverflow);
    //     }
    // }

    return adaptedChildrenProps;
}

export function cloneLayoutItemProps(props) {
    return {
        top: props.top,
        left: props.left,
        leftStrategy: props.leftStrategy,
        width: props.width,
        widthStrategy: props.widthStrategy,
        height: props.height,
        id: props.id
    }
}

function createInitialRows(components, userDefinedNormalizedProps, origCntWidth, containerWidth, horizMargin) {
    const rows = [], decorRows = [];
    const sortedTopLeft = components.filter( c => userDefinedNormalizedProps[c.props.id].displayType === 'flow')
        .sort( (c1,  c2) => {
            return c1.props.top === c2.props.top ? c1.props.left  - c2.props.left : c1.props.top - c2.props.top;
        });
    let row;
    sortedTopLeft.forEach( (c) => {
        //TODO deviation models rowTopDeviation
        if (!row || (row.getTop() !== undefined && row.getTop() !== c.props.top)) {
            row = new Row(userDefinedNormalizedProps, origCntWidth, containerWidth, horizMargin);
            rows.push(row);
        }
        row.add({...userDefinedNormalizedProps[c.props.id], ...c.props}, undefined, false);
    });
    components.forEach( c => {
        if (userDefinedNormalizedProps[c.props.id].displayType === 'decor') {
            const dr = new Row(userDefinedNormalizedProps, origCntWidth, containerWidth, horizMargin);
            dr.add({...userDefinedNormalizedProps[c.props.id], ...c.props}, undefined, false);
            decorRows.push(dr);
        }
    });
    return {
        rows,
        decorRows
    }
}

function intersectRect(r1, r2) {
    return !(r2.left > (r1.left+parseInt(r1.width)) ||
                (r2.left+parseInt(r2.width)) < r1.left ||
                (r2.top > r1.top+r1.height) ||
                (r2.top+r2.height) < r1.top);
}

function cloneObject(obj) {
    const r = {};
    Object.keys(obj).forEach( (key) => {
        r[key] = {...obj[key]}
    })
    return r;
}