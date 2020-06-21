export function getConditionConfig(propName) {
    return {
        master: 'app.sessionsize.width',

        /**
         * Сохранить значение на основе мастер свойства
         */
        onSave: ({ path, data, masterValue }) => {
            // просто обычное сохранение left
            if (masterValue !== undefined) {
                return { [masterValue]: data[path] }
            }
        },

        conditionPath: ({ screenId, componentId, key = '/^[0-9]+$/' }) => {
            return `router.screens.${screenId}.adaptedui.${key}.props.${componentId}.${propName}`
        },

        /**
         * Из условной строки типа "router.screens.123.adaptedui.800.props.456.left"
         * взять ключ 800
         */
        parseKey: condPath => {
            const a = condPath ? condPath.split('.') : []
            return a.length > 5 ? a[4] : undefined
        },

        /**
         * Выбрать самое подходящее условное значение на основе мастер значения
         */
        onMasterChanged: ({ masterValue, savedValues }) => {
            return selectWidth(masterValue, savedValues)
        },
    }
}

/**
 *
 * @param {number} val
 * @param {hash of number} base
 */
export function selectWidth(val, base) {
    // выбрать наиболее подходящее значение из сохраненных
    const widthes = Object.keys(base)
        .map(k => parseInt(k))
        .sort()
    if (widthes.length > 0) {
        let result = widthes[0]
        for (let i = 1; i < widthes.length; i++) {
            if (val > widthes[i] - 10) {
                result = widthes[i]
            }
        }
        return {
            key: result,
            value: base[result],
        }
    }
}
