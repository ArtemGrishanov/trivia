import { createAction } from './api'

/**
 * @typedef {{type: string, actionType: string}} Action
 */
/**
 * @typedef {{engagement: number}} EngagementAction
 */

class Analytics {
    /**
     * @type {Action[]} key: typeof Action.actionType
     */
    _actions = []
    /**
     * @type {{[key: string]: Action}} key: typeof Action.actionType
     */
    _engagementActions = {}
    /**
     *
     */
    _conversionActionIds = {}

    constructor() {
        window.addEventListener('beforeunload', event => {
            for (const key in this._engagementActions) this._actions.push(this._engagementActions[key])
            for (let i = 0; i < this._actions.length; i++) createAction(this._actions[i])
        })
    }

    /**
     * @typedef {{method: string} & {[key: string]: any}} TriggerData
     * @param {TriggerData} data
     */
    trigger = data => {
        delete data['method']

        const type = (data.type = data.type.toUpperCase())
        const actionType = (data.actionType = data.actionType.toUpperCase())

        switch (type) {
            case 'ENGAGEMENT': {
                const prev = this._engagementActions[actionType]

                if (prev === void 0 || prev.engagement < data.engagement) this._engagementActions[actionType] = data

                break
            }
            case 'CONVERSION': {
                if (actionType in this._conversionActionIds) {
                    data.projectActionId = this._conversionActionIds[actionType]
                } else {
                    return
                }
            }
            default:
                this._actions.push(data)

                break
        }
    }

    /** */
    setConversionActionIds = types => (this._conversionActionIds = types)
}

export default Analytics
