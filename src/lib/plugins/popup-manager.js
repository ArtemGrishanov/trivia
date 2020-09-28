import { Selector } from '../object-path'
import { DYNAMIC_CONTENT_PROP, ContentPropsList, Schemas } from '../engage-ui/DynamicContent'
import HashList from '../../lib/hashlist'
import { getPathes } from '../../lib/object-path'
import { getScreenIdFromPath, getComponentIdFromPath } from '../remix/util/util'
import { postMessage } from '../remix'
import { getTranslation } from '../engage-ui/translations'

const defaultSettings = {
    enablePopupsByDefault: false,
    componentFilters: ['displayName=TextOption'],
}

const getDefaultPopup = (deviceType = 'desktop') => ({
    margin: 100,
    backgroundColor: 'white',
    backgroundImage: '',
    components: new HashList([
        {
            text: `<p class="ql-align-center"><span class="ql-size-large ql-font-Roboto">${getTranslation(
                'okNext',
            )}</span></p>`,
            styleVariant: 'primary',
            sizeMod: 'normal',
            borderRadius: 34,
            borderWidth: 0,
            borderColor: '',
            dropShadow: false,
            backgroundColor: '#2990FB',
            isArrow: false,
            arrowType: 'default',
            arrowDirection: 'right',
            arrowPosition: 'center',
            arrowColor: '#fff',
            iconName: '',
            iconColor: '',
            iconColorHover: '',
            iconPosition: 'left',
            iconGap: 10,
            openUrl: '',
            imageSrc: '',
            id: '00ml7o',
            tags: 'close_popup',
            displayName: 'Button',
            widthStrategy: 'fixed',
            leftStrategy: 'dynamic',
            displayType: 'flow',

            ...(deviceType === 'desktop'
                ? {
                      top: 417,
                      left: 335.5,
                      width: 129,
                      height: 44,
                      szTop: 10,
                      szLeft: 10,
                      szRight: 10,
                      szBottom: 10,
                  }
                : {
                      top: 372.5,
                      left: 95,
                      width: 129,
                      height: 44,
                      szTop: 10,
                      szLeft: 10,
                      szRight: 10,
                      szBottom: 10,
                  }),
        },
        {
            text: `<p class="ql-align-center"><strong class="ql-font-Roboto ql-size-huge">${getTranslation(
                'popupHeading',
            )}</strong></p>`,
            fontShadow: false,
            fontShadowColor: 'rgba(0,0,0,0.2)',
            fontShadowDistance: 3,
            animationOnAppearance: 'none',
            id: '8y58o1',
            tags: 'remixcomponent',
            displayName: 'Text',
            widthStrategy: 'fixed',
            leftStrategy: 'dynamic',
            displayType: 'flow',

            ...(deviceType === 'desktop'
                ? {
                      top: 163.5,
                      left: 272,
                      width: 256,
                      height: 63,
                      szTop: 10,
                      szLeft: 10,
                      szRight: 10,
                      szBottom: 10,
                  }
                : {
                      top: 163.5,
                      left: 32,
                      width: 256,
                      height: 63,
                      szTop: 10,
                      szLeft: 10,
                      szRight: 10,
                      szBottom: 10,
                  }),
        },
        {
            text: `<p class="ql-align-center"><span class="ql-font-Roboto ql-size-large">${getTranslation(
                'popupDescription',
            )}</span></p><p class="ql-align-center"><span class="ql-font-Roboto ql-size-large"></span></p><p class="ql-align-center"><br></p>`,
            fontShadow: false,
            fontShadowColor: 'rgba(0,0,0,0.2)',
            fontShadowDistance: 3,
            animationOnAppearance: 'none',
            id: 'uwmgl9',
            tags: 'remixcomponent',
            displayName: 'Text',
            widthStrategy: 'fixed',
            leftStrategy: 'dynamic',
            displayType: 'flow',

            ...(deviceType === 'desktop'
                ? {
                      top: 238.5,
                      left: 260.5,
                      width: 279,
                      height: 122,
                      szTop: 10,
                      szLeft: 10,
                      szRight: 10,
                      szBottom: 10,
                  }
                : {
                      top: 248.5,
                      left: 20,
                      width: 279,
                      height: 102,
                      szTop: 10,
                      szLeft: 10,
                      szRight: 10,
                      szBottom: 10,
                  }),
        },
    ]),
    // adaptedui: {
    //     '320': {
    //         props: {
    //             '8y58o1': {
    //                 top: 163.5,
    //                 left: 32,
    //                 width: 256,
    //                 height: 63,
    //                 szTop: 10,
    //                 szLeft: 10,
    //                 szRight: 10,
    //                 szBottom: 10,
    //             },
    //             uwmgl9: {
    //                 top: 248.5,
    //                 left: 20,
    //                 width: 279,
    //                 height: 102,
    //                 szTop: 10,
    //                 szLeft: 10,
    //                 szRight: 10,
    //                 szBottom: 10,
    //             },
    //             '00ml7o': {
    //                 top: 372.5,
    //                 left: 95,
    //                 width: 129,
    //                 height: 44,
    //                 szTop: 10,
    //                 szLeft: 10,
    //                 szRight: 10,
    //                 szBottom: 10,
    //             },
    //         },
    //     },
    //     '800': {
    //         props: {
    //             '00ml7o': {
    //                 top: 417,
    //                 left: 335.5,
    //                 width: 129,
    //                 height: 44,
    //                 szTop: 10,
    //                 szLeft: 10,
    //                 szRight: 10,
    //                 szBottom: 10,
    //             },
    //             '8y58o1': {
    //                 top: 163.5,
    //                 left: 272,
    //                 width: 256,
    //                 height: 63,
    //                 szTop: 10,
    //                 szLeft: 10,
    //                 szRight: 10,
    //                 szBottom: 10,
    //             },
    //             uwmgl9: {
    //                 top: 238.5,
    //                 left: 260.5,
    //                 width: 279,
    //                 height: 102,
    //                 szTop: 10,
    //                 szLeft: 10,
    //                 szRight: 10,
    //                 szBottom: 10,
    //             },
    //         },
    //     },
    // },
    displayName: 'Popup',
})

const initPopupManager = ({ remix, settings = {} }) => {
    settings = { ...defaultSettings, ...settings }
    // common popup settings
    remix.extendSchema({
        'app.popups.enable': {
            type: 'boolean',
            default: false,
        },
    })
    // remix.setData({ 'app.popups.enable': settings.enablePopupsByDefault }, false, false)

    for (const filter of settings.componentFilters) {
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
            if (popupsIsEnbale) {
                components.forEach(({ screenId, componentId }) => {
                    let popupId = remix.getProperty(`router.screens.${screenId}.components.${componentId}.data.popupId`)
                    let copyPopupId = remix.getProperty(
                        `router.screens.${screenId}.components.${componentId}.data.copyPopupId`,
                    )

                    let popups = remix.getProperty(`router.screens.${screenId}.popups`)
                    if (popups === void 0) {
                        popups = new HashList([])

                        remix.setData({ [`router.screens.${screenId}.popups`]: popups }, false, true)
                    }

                    if (typeof popupId !== 'string' || popupId.length === 0) {
                        let newPopup =
                            (copyPopupId && popups[copyPopupId]) ||
                            getDefaultPopup(remix.getProperty('app.screen', state))
                        popupId = popups.addElement({ ...newPopup }).getLast().hashlistId

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
            }

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
            postMessage('request_popups_edit_mode', { enable: popupsIsEnbale })

            const components = getPathes(state, BASE_SELECTOR).map(path => {
                const screenId = getScreenIdFromPath(path)
                const componentId = getComponentIdFromPath(path)

                return { screenId, componentId }
            })
            if (components.length) updatePopups(state, mode, popupsIsEnbale, components)
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
            if (components.length) updatePopups(state, mode, popupsIsEnbale, components)
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
                .map(screen => {
                    const components = screen.components
                        .toArray()
                        .filter(component => {
                            const popupId = component.data && component.data.popupId
                            if (typeof popupId !== 'string' || !popupId.length) return true

                            if (popupId in screen.popups) {
                                return false
                            } else {
                                const index = screens
                                    .toArray()
                                    .map(screen => screen.popups.getIndex(popupId))
                                    .filter(index => index !== -1)[0]

                                if (index !== void 0) {
                                    const newId = screen.popups.getId(index)
                                    if (typeof newId === 'string' && newId.length) {
                                        event.remix.setData({
                                            [`router.screens.${screen.hashlistId}.components.${component.hashlistId}.data.popupId`]: screen.popups.getId(
                                                index,
                                            ),
                                        })

                                        return false
                                    }
                                }

                                console.log('should be unreachable code! this case needs to be handle')
                            }

                            return true
                        })
                        .map(component => ({ screenId: screen.hashlistId, componentId: component.hashlistId }))
                        .filter(({ screenId, componentId }) => {
                            const path = `router.screens.${screenId}.components.${componentId}`

                            return baseSelector.match(path, state)
                        })

                    return components
                })
                .reduce((acc, components) => {
                    acc.push(...components)

                    return acc
                }, [])

            if (components.length) updatePopups(state, mode, popupsIsEnbale, components)
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
            // debugger
            if (event.eventData.diff.deleted.length) {
                event.eventData.diff.deleted
                    .filter(({ path }) => path.includes('.data.popupId'))
                    .map(({ path, value }) => {
                        const screenId = getScreenIdFromPath(path)

                        return { screenId, popupId: value }
                    })
                    .forEach(({ screenId, popupId }) => {
                        if (typeof popupId === 'string' && popupId.length) {
                            const popups = remix.getProperty(`router.screens.${screenId}.popups`)
                            if (popups && popups.length) popups.deleteElementById(popupId)
                        }
                    })
            }
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
            const popupId = event.eventData.parentProps.data.popupId

            postMessage('request_popup_edit_mode', { popupId })
        })

        remix.addTrigger({
            when: {
                eventType: `event_feedbackScreenEditMode_for_${filter}`,
            },
            then: { actionType: `handler_feedbackScreenEditMode_for_${filter}` },
        })

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
            condition: {
                prop: 'tags',
                clause: 'CONTAINS',
                value: `close_popup`,
            },
        },
        then: { actionType: `closePopup` },
    })
}

export default initPopupManager
