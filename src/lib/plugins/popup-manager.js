import { Selector } from '../object-path'
import { DYNAMIC_CONTENT_PROP, ContentPropsList, Schemas } from '../engage-ui/DynamicContent'
import HashList from '../../lib/hashlist'
import { getPathes } from '../../lib/object-path'
import { getScreenIdFromPath, getComponentIdFromPath } from '../remix/util/util'
import { postMessage, getPathByComponentId } from '../remix'

const defaultSettings = {
    componentFiltersCapableOfTriggeringEvents: ['displayName=TextOption'],
}

const defaultPopup = { displayName: 'Popup', backgroundColor: 'white' }

const initPopupManager = ({ remix, settings = defaultSettings }) => {
    // common popup settings
    remix.extendSchema({
        'app.popups.enable': {
            type: 'boolean',
            default: false,
        },
        // 'router.[screens HashList]./^[0-9a-z]+$/.popups': {
        //     type: 'hashlist',
        //     default: new HashList([
        //         //no popups in app by default
        //         //{ displayName: 'Popup', backgroundColor: 'yellow' }
        //     ]),
        //     minLength: 0,
        //     maxLength: 32,
        //     // prototypes: [{ id: 'default_prototype', data: { displayName: 'Popup', backgroundColor: 'green' } }],
        // },
    })

    declareDynamicContent({ remix, filters: settings.componentFiltersCapableOfTriggeringEvents })

    for (const filter of settings.componentFiltersCapableOfTriggeringEvents) {
        remix.registerTriggerAction(`show_popup_for_${filter}`, event => {
            const popupId = event.eventData.data.popupId
            if (typeof popupId !== 'string' || popupId.length === 0) {
                return
            }

            const state = event.remix.getState()
            const popup = state.router.screens[state.router.currentScreenId].popups[popupId]

            if (!popup) {
                return
            }

            remix.setData({ 'router.showPopup': true, 'router.activePopupId': popupId })
        })

        remix.addTrigger({
            when: {
                eventType: 'onclick',
                // condition: {
                //     prop: 'path',
                //     clause: 'MATCH',
                //     value: `router.[screens HashList]./^[0-9a-z]+$/.components.[/^[0-9a-z]+$/ ${filter}]`,
                // },
                condition: {
                    prop: 'displayName',
                    clause: 'EQUALS',
                    value: `TextOption`,
                },
            },
            then: { actionType: `show_popup_for_${filter}` },
        })
    }

    remix.registerTriggerAction('closePopup', () => {
        remix.setData({ 'router.showPopup': false })
    })

    remix.addTrigger({
        when: {
            eventType: 'onclick',
            // condition: {
            //     prop: 'path',
            //     clause: 'MATCH',
            //     value: `router.[screens HashList]./^[0-9a-z]+$/.components.[/^[0-9a-z]+$/ ${filter}]`,
            // },
            condition: {
                prop: 'tags',
                clause: 'CONTAINS',
                value: `close_popup`,
            },
        },
        then: { actionType: `closePopup` },
    })
}

const declareDynamicContent = ({ remix, filters = [], iconSettings = void 0 }) => {
    for (const filter of filters) {
        const BASE_SELECTOR = `router.[screens HashList]./^[0-9a-z]+$/.components.[/^[0-9a-z]+$/ ${filter}]`
        const DISPLAY_NAME_SELECTOR = `${BASE_SELECTOR}.displayName`
        const DYNAMIC_CONTENT_SELECTOR = `${BASE_SELECTOR}.${DYNAMIC_CONTENT_PROP}`
        const DATA_POPUP_ID_SELECTOR = `${BASE_SELECTOR}.data.popupId`

        const ICON_STYLES = {
            icons: {
                feedbackScreenEditMode: {
                    name: 'feedback',
                    clickable: true,
                    onClickEvent: `event_feedbackScreenEditMode_for_${filter}`,
                },
            },
            hAlign: 'right',
            vAlign: 'top',
            vPadding: 5,
            hPadding: 5,
            gap: 5,
        }

        remix.extendSchema({
            [DYNAMIC_CONTENT_SELECTOR]: {
                type: 'object',
                default: {},
                serialize: false,
            },
            [DATA_POPUP_ID_SELECTOR]: {
                type: 'string',
                minLength: 0,
                maxLength: 6,
                default: '',
            },
            ...Object.fromEntries(
                Object.entries(Schemas.iconList._schm).map(([key, node]) => {
                    const path = `${DYNAMIC_CONTENT_SELECTOR}.${ContentPropsList.ICON_LIST}.${key}`

                    return [path, node]
                }),
            ),
        })

        const filterDiffBySelector = (state, diff, selector) => {
            return diff
                .filter(({ path }) => selector.match(path, state))
                .map(({ path }) => {
                    const screenId = getScreenIdFromPath(path)
                    const componentId = getComponentIdFromPath(path)

                    return { screenId, componentId }
                })
        }

        const updatePopups = (state, mode, popupsIsEnbale, components) => {
            components.forEach(({ screenId, componentId }) => {
                let popupId = remix.getProperty(`router.screens.${screenId}.components.${componentId}.data.popupId`)

                let popups = remix.getProperty(`router.screens.${screenId}.popups`)
                if (popups === void 0) {
                    popups = new HashList([])

                    remix.setData({ [`router.screens.${screenId}.popups`]: popups }, false, true)
                }

                if (typeof popupId !== 'string' || popupId.length === 0) {
                    popupId = popups.addElement({ ...defaultPopup }).getLast().hashlistId

                    remix.setData(
                        {
                            [`router.screens.${screenId}.components.${componentId}.data.popupId`]: popupId,
                        },
                        false,
                        true,
                    )
                }

                if (popupId in popups) return
                else console.error(`ERROR: Can't find popup id(id:"${popupId}") in screen(id:"${screenId}") popups`)
            })

            // set icons
            const dynamicContentData = components
                .map(({ screenId, componentId }) => `router.screens.${screenId}.components.${componentId}`)
                .map(path => {
                    const dynamicContent = remix.getProperty(`${path}.${DYNAMIC_CONTENT_PROP}`) || {
                        [ContentPropsList.ICON_LIST]: { icons: {} },
                    }
                    if (popupsIsEnbale && mode === 'edit') {
                        const newDynamicContent = {
                            ...dynamicContent,
                            [ContentPropsList.ICON_LIST]: {
                                ...ICON_STYLES,
                                icons: {
                                    ...dynamicContent[ContentPropsList.ICON_LIST].icons,
                                    ...ICON_STYLES.icons,
                                },
                            },
                        }

                        return [`${path}.${DYNAMIC_CONTENT_PROP}`, newDynamicContent]
                    } else if (dynamicContent !== void 0) {
                        const update = JSON.parse(JSON.stringify(dynamicContent))
                        delete update[ContentPropsList.ICON_LIST].icons.feedbackScreenEditMode

                        return [`${path}.${DYNAMIC_CONTENT_PROP}`, update]
                    } else {
                        return [`${path}.${DYNAMIC_CONTENT_PROP}`, {}]
                    }
                })

            remix.setData(Object.fromEntries(dynamicContentData), false, true)
        }

        remix.registerTriggerAction(`update_popups_by_${filter}_1`, event => {
            const state = event.remix.getState()
            if (!state) return
            const mode = state.session.mode
            const popupsIsEnbale = remix.getProperty('popups.enable', state.app) || false

            const components = getPathes(state, BASE_SELECTOR).map(path => {
                const screenId = getScreenIdFromPath(path)
                const componentId = getComponentIdFromPath(path)

                return { screenId, componentId }
            })

            updatePopups(state, mode, popupsIsEnbale, components)

            postMessage('request_popups_edit_mode', { enable: popupsIsEnbale })
        })

        remix.addTrigger({
            when: {
                eventType: 'property_updated',
                condition: { prop: 'path', clause: 'EQUALS', value: 'app.popups.enable' },
            },
            then: { actionType: `update_popups_by_${filter}_1` },
        })

        const displayNameSelector = new Selector(DISPLAY_NAME_SELECTOR)
        remix.registerTriggerAction(`update_popups_by_${filter}_2`, event => {
            const state = event.remix.getState()
            if (!state) return
            const mode = state.session.mode
            const popupsIsEnbale = remix.getProperty('popups.enable', state.app) || false

            const components = filterDiffBySelector(state, event.eventData.diff.added, displayNameSelector)

            updatePopups(state, mode, popupsIsEnbale, components)
        })

        remix.addTrigger({
            when: {
                eventType: 'property_updated',
                condition: {
                    prop: 'path',
                    clause: 'MATCH',
                    value: `router.[screens HashList]./^[0-9a-z]+$/.components`,
                },
            },
            then: { actionType: `update_popups_by_${filter}_2` },
        })

        const baseSelector = new Selector(BASE_SELECTOR)
        remix.registerTriggerAction(`update_popups_by_${filter}_3`, event => {
            const state = event.remix.getState()
            if (!state) return
            const mode = state.session.mode
            const popupsIsEnbale = remix.getProperty('popups.enable', state.app) || false

            const screens = state.router.screens

            const components = screens
                .toArray()
                .filter(screen => {
                    const popups = screen.popups || {}

                    let idCount = 0
                    const isError = screen.components.toArray().some(component => {
                        const popupId = component.data && component.data.popupId
                        if (typeof popupId === 'string' && popupId.length) {
                            idCount++
                            if (popupId in popups) return false
                            else return true
                        }

                        return false
                    })

                    return isError || idCount !== popups.length
                })
                .map(screen => {
                    remix.setData({ [`router.screens.${screen.hashlistId}.popups`]: new HashList() }, false, true)
                    const components = screen.components
                        .toArray()
                        .filter(component => {
                            const path = `router.screens.${screen.hashlistId}.components.${component.hashlistId}`

                            return baseSelector.match(path, state)
                        })
                        .map(component => {
                            remix.setData(
                                {
                                    [`router.screens.${screen.hashlistId}.components.${component.hashlistId}.data.popupId`]: '',
                                },
                                false,
                                true,
                            )

                            return { screenId: screen.hashlistId, componentId: component.hashlistId }
                        })

                    return components
                })
                .reduce((acc, components) => {
                    acc.push(...components)

                    return acc
                }, [])

            updatePopups(state, mode, popupsIsEnbale, components)
        })

        remix.addTrigger({
            when: {
                eventType: 'property_updated',
                condition: {
                    prop: 'path',
                    clause: 'EQUALS',
                    value: 'router.screens',
                },
            },
            then: {
                actionType: `update_popups_by_${filter}_3`,
            },
        })

        remix.registerTriggerAction(`delete_popupId_${filter}`, event => {
            event.eventData.diff.deleted
                .filter(({ path }) => path.includes('.data.popupId'))
                .map(({ path, value }) => {
                    const screenId = getScreenIdFromPath(path)

                    return { screenId, popupId: value }
                })
                .forEach(({ screenId, popupId }) => {
                    if (typeof popupId === 'string' && popupId.length) {
                        const popups = remix.getProperty(`router.screens.${screenId}.popups`)
                        popups.deleteElementById(popupId)
                    }
                })
        })

        remix.addTrigger({
            when: {
                eventType: 'property_updated',
                condition: {
                    prop: 'path',
                    clause: 'MATCH',
                    value: `router.[screens HashList]./^[0-9a-z]+$/.components`,
                },
            },
            then: { actionType: `delete_popupId_${filter}` },
        })

        remix.registerTriggerAction(`handler_feedbackScreenEditMode_for_${filter}`, event => {
            // const path = getPathByComponentId(event.eventData.parentProps.id)
            // const screenId = getScreenIdFromPath(path)
            const popupId = event.eventData.parentProps.data.popupId

            postMessage('request_popup_edit_mode', { popupId })
        })

        remix.addTrigger({
            when: {
                eventType: `event_feedbackScreenEditMode_for_${filter}`,
            },
            then: { actionType: `handler_feedbackScreenEditMode_for_${filter}` },
        })
    }
}

export default initPopupManager
