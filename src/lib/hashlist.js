/**
 * Ordered collection with unique element ids
 *
 * 1) Каждому элементу после добавления присваивается уникальный постоянный id, example '42a7f0'
 *    Получить позже id можно так getId()
 *    обеспечивает уникальный постоянный path к каждому элементу используя уникальные id для элементов
 *    Example: 'id=pm quiz.12ed42a.answer.options.a45f09.text'
 *
 * 2) Элементы упорядочены, порядок важен в вопросах / опциях и прочей предметной области
 *    addElement() / deleteElement() работают с позицией
 *    toArray() возвращает обычный массив значений для работы
 *
 * @constructor
 */
class HashList {

    constructor(initialValue, options = { generateNewIds: false }) {
        this._orderedIds = [];
        if (initialValue !== undefined) {
            if (Array.isArray(initialValue)) {
                for (let i = 0; i < initialValue.length; i++) {
                    const id = this._getUniqueId();
                    this._orderedIds.push(id);
                    this[id] = initialValue[i];
                }
            }
            else if (typeof initialValue === "object" && Array.isArray(initialValue._orderedIds)) {
                if (options.generateNewIds) {
                    initialValue._orderedIds.forEach( (id) => {
                        const newid = this._getUniqueId();
                        this[newid] = initialValue[id];
                        this._orderedIds.push(newid);
                    });
                }
                else {
                    this._orderedIds = initialValue._orderedIds;
                    this._orderedIds.forEach( (id) => this[id] = initialValue[id]);
                }
            }
            // else if (this._validateDataType(initialValue) && Array.isArray(param._orderedIds) === true) {
            //     // это десериализация
            //     this._orderedIds = param._orderedIds;
            //     this. ? = this._normalizeValue(param.value);
            // }
            else {
                throw new Error('Unsupported value type');
            }
        }
    }

    /**
     * Returns list length
     */
    get length() {
        return this._orderedIds.length;
    }

    /**
     * Generates short unique id for key
     * https://stackoverflow.com/questions/6248666/how-to-generate-short-uid-like-ax4j9z-in-js
     */
    _getUniqueId() {
        var firstPart = (Math.random() * 46656) | 0;
        var secondPart = (Math.random() * 46656) | 0;
        firstPart = ("000" + firstPart.toString(36)).slice(-3);
        secondPart = ("000" + secondPart.toString(36)).slice(-3);
        return firstPart + secondPart;
    }

    /**
     * Returns a new regular js array
     * ['value1','value2', ...]
     * Adding new hashlistId property for each 'object' element for convenience
     *
     * @return {Array}
     */
    toArray() {
        return this._orderedIds.map( (id) => {
            if (typeof this[id] === 'object') {
                return {...this[id], hashlistId: id}
            }
            return this[id];
        });
    }

    /**
     * Вернуть id элемента по его позиции
     *
     * @param {number} index
     * @return {string} например '34ea90'
     */
    getId(index) {
        if (Number.isInteger(index) === false || index < 0 || index >= this._orderedIds.length) {
            return undefined;
        }
        return this._orderedIds[index];
    }

    /**
     * Вернуть позицию элемента по его id
     *
     * @param {string} id
     * @returns {number}
     */
    getIndex(id) {
        for (let i = 0; i < this._orderedIds.length; i++) {
            if (this._orderedIds[i] === id) return i;
        }
        return -1;
    }

    /**
     * Вернуть значение элемента по индексу
     *
     * @param {number} index
     */
    getByIndex(index) {
        return this[this._orderedIds[index]];
    }

    /**
     * Добавить новый элемент на позицию. По умолчанию в конец
     *
     * @param {*} element
     * @param {number} position - optional
     * @param {string} newElementId - optional, иногда указывается извне
     */
    addElement(element, position, newElementId) {
        if (Number.isInteger(position) === false || position < 0) {
            position = this._orderedIds.length;
        }
        // id - постоянный на всё время работы и сериализации приложения
        if (typeof newElementId !== "string") {
            newElementId = this._getUniqueId();
        }
        this._orderedIds.splice(position, -1, newElementId);
        this[newElementId] = element;
        return this;
    }

    /**
     * Переместить элемент с одной позиции на другую
     * Остальные элементы сдвигаются, это не swap
     *
     * @param {number} elementIndex текущий индекс элемента
     * @param {number} newElementIndex новая позиция элемента
     */
    changePosition(elementIndex, newElementIndex) {
        if (Number.isInteger(elementIndex) === false || elementIndex < 0 || elementIndex >= this._orderedIds.length) {
            throw new Error('Illegal elementIndex param');
        }
        if (Number.isInteger(newElementIndex) === false || newElementIndex < 0) {
            throw new Error('Illegal newElementIndex param');
        }
        if (newElementIndex >= this._orderedIds.length) {
            newElementIndex = this._orderedIds.length-1;
        }
        const movedElem = this._orderedIds.splice(elementIndex, 1)[0];
        this._orderedIds.splice(newElementIndex, -1, movedElem);
    }

    /**
     * Перемешать случайным образом порядок элементов
     * https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
     */
    shuffle() {
        for (let i = this._orderedIds.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this._orderedIds[i], this._orderedIds[j]] = [this._orderedIds[j], this._orderedIds[i]];
        }
    }

    /**
     * Удалить элемент массива по определеной позиции
     *
     * @param {number} index
     */
    deleteElement(index) {
        if (Number.isInteger(index) === false || index < 0) {
            throw new Error('deleteElement: index must be specified');
        }
        if (index >= this._orderedIds.length) {
            index = this._orderedIds.length-1;
        }
        const deletedId = this._orderedIds[index];
        // const deletedElement = this[deletedId];
        // согласно допущениям по документации ссылка на один MutAppProperty может быть объявлена только в одном месте в приложении
        // исследуем удаляемый элемент масива на то, что внутри могут быть MutAppProperty которые также надо теперь удалить
        // var deletedSubProperties = MutApp.Util.findMutAppPropertiesInObject(deletedElement);
        // if (deletedSubProperties && deletedSubProperties.length > 0) {
        //     for (var i = 0; i < deletedSubProperties.length; i++) {
        //         deletedSubProperties[i].destroy();
        //     }
        // }
        // после того как удалили сабпроперти можно удалить и сам элемент
        this._orderedIds.splice(index, 1);
        const res = this[deletedId];
        delete this[deletedId];
        return res;
    }

    /**
     * Удалить элемент по id
     * @param {string} id
     */
    deleteElementById(id) {
        const index = this.getIndex(id);
        if (index >= 0) {
            return this.deleteElement(index);
        }
        return null;
    }

    /**
     *
     * @param {number} index
     * @param {boolean} options.cloneChildHashlists, default 'false'
     */
    getElementCopy(index, options = {cloneChildHashlists: false}) {
        if (Number.isInteger(index) === false || index < 0 || index >= this._orderedIds.length) {
            throw new Error('getElementCopy: illegal index');
        }
        const newElem = JSON.parse(JSON.stringify(this[this._orderedIds[index]]));
        if (options.cloneChildHashlists && typeof newElem === 'object') {
            this._cloneAllHashlistsInObject(newElem);
        }
        return newElem;
    }

    /**
     * Рекурсивно пройти по всем свойствам объекта и создать новый инстантсы hashlist с новыми id
     */
    _cloneAllHashlistsInObject(obj) {
        Object.keys(obj).forEach( (key) => {
            if (obj[key] && typeof obj[key] === 'object') {
                if (this._isHashlistInstance(obj[key])) {
                    // creating new HL with new element ids
                    obj[key] = new HashList(obj[key], { generateNewIds: true });
                }
                this._cloneAllHashlistsInObject(obj[key]);
            }
        });
        return obj;
    }

    /**
     * Check object is hashlist instance, ducktyping
     * @param {*} obj
     */
    _isHashlistInstance(obj) {
        return obj && obj._orderedIds && obj._orderedIds.length >= 0;
    }

    /**
     * Вернуть новый объект с ключами и значениями
     *
     * @returns {object}
     */
    // _getValuesShallowCopy() {
    //     const v = {};
    //     this._orderedIds.forEach( (id) => v[id] = this[id])
    //     return v;
    // }

    _isPrimitive(value) {
        return value === undefined || value === null || typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean';
    }

    /**
     * Compares elements count, ids and values
     * @param {boolean}
     */
    equal(otherHashlist) {
        if (this.length !== otherHashlist.length) {
            return false;
        }
        const arr = otherHashlist.toArray();
        for (let i = 0; i < arr.length; i++) {
            const otid = otherHashlist.getId(i);
            const id = this.getId(i);
            if (otid !== id) {
                // compare id order
                return false;
            }
            // кажется, что достаточно будет сравнить только ids двух hashlists так как они уникальны
            // и не сравнивать значения внутри списков
            // сравнение значений внутри будет произведено отдельно в remix.diff()
        }
        return true;
    }

    /**
     * Create a clone with the same ids and value instances
     */
    shallowClone() {
        const cloned = new HashList();
        cloned._orderedIds = this._orderedIds.slice();
        cloned._orderedIds.forEach( (id) => cloned[id] = this[id])
        return cloned;
    }

    /**
     * Use different ids for cloning
     */
    clone() {
        const cloned = new HashList();
        this._orderedIds.forEach( (id) => cloned.addElement( JSON.parse(JSON.stringify(this[id])) ));
        return cloned;
    }

    /**
     *
     * @param obj
     * @param result
     * @returns {{}}
     * @private
     */
    _serializeSubProperty(obj, result = {}) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key) === true) {
                if (this._isPrimitive(obj[key])) {
                    result[key] = obj[key];
                }
                else if (Array.isArray(obj[key]) === true) {
                    result[key] = this._serializeSubProperty(obj[key], []);
                }
                else {
                    result[key] = this._serializeSubProperty(obj[key]);
                }
            }
        }
        return result;
    }

    /**
     * Десериализовать свойство из json-строки
     * В MutAppPropertyDictionary могут быть суб-свойства, включая hashlist
     *
     * @param {string|object} data
     */
    deserialize(data) {
        // перед десериализацией надо удалить существующие саб свойства в Dictionary, так как значение будет полностью заменено
        // согласно допущениям по документации ссылка на один MutAppProperty может быть объявлена только в одном месте в приложении
        // исследуем удаляемый элемент масива на то, что внутри могут быть MutAppProperty которые также надо теперь удалить
        // var deletedSubProperties = MutApp.Util.findMutAppPropertiesInObject(this._value);
        // if (deletedSubProperties && deletedSubProperties.length > 0) {
        //     for (var i = 0; i < deletedSubProperties.length; i++) {
        //         deletedSubProperties[i].destroy();
        //     }
        // }
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        // предполагается, что в data только валидные значения. Проверки не делаются
        this.id = data.id;
        this._deserializeSubProperty(data.value); // значение массива это сложный объект, внутри могут быть другие MutAppProperty
        //this._value = this._normalizeValue(data.value);
        this._orderedIds = data._orderedIds;
    }

    /**
     * Пройти рекурсивно по структуре объекта
     *
     * @param data
     * @private
     */
    _deserializeSubProperty(data) {
        // for (var key in data) {
        //     // data[key] can be 'undefined'
        //     if (data[key] && data[key].hasOwnProperty('_mutAppConstructor') === true) {
        //         // создаем новое MutAppProperty прямо в сериализации
        //         var param = data[key];
        //         param.application = this._application;
        //         param.model = this._model;
        //         var ap = this._application.getProperty(param.propertyString);
        //         if (ap) {
        //             // свойство может уже создано (пример id=pm results.0.title). Например уже есть элемент в массиве, внутри которого id=pm results.0.title
        //             // и потом решили десериализовать массив целиком id=pm results
        //             ap.deserialize(data[key]);
        //         }
        //         else {
        //             ap = new window[data[key]['_mutAppConstructor']](param);
        //         }
        //         data[key] = ap;
        //         if (MutApp.Util.isPrimitive(ap._value) === false &&
        //             ap._value instanceof MutApp.Model === false &&
        //             ap._value instanceof MutApp === false) {
        //             // дальше вглубь продолжаем если MutAppProperty.value сложный объект, там внутри могут быть еще MutAppProperty
        //             // примечательно что этот код работает только когда десериализуется одно MutAppProperty свойство, а это только в автотестах
        //             // когда десериализуется всё приложение целиком при старте, то н
        //             this._deserializeSubProperty(ap._value);
        //         }
        //     }
        //     else if (MutApp.Util.isDomElement(data[key]) === true ||
        //         MutApp.Util.isDomNode(data[key]) === true) {
        //         console.error('MutAppPropertyDictionary.prototype._deserializeSubProperty: dom node deserialization was rejected');
        //     }
        //     else if (MutApp.Util.isPrimitive(data[key]) === false &&
        //         data[key] instanceof MutApp.Model === false &&
        //         data[key] instanceof MutApp === false) {
        //         this._deserializeSubProperty(data[key]);
        //     }
        // }
    }

}

export default HashList