export default class Trigger {
    constructor({ eventType, conditions, thenActions }) {
        this._eventType = eventType
        this._conditions = conditions
        this._thenActions = thenActions
    }

    get eventType() {
        return this._eventType
    }
}
