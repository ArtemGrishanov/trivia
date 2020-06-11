import { getPropertiesBySelector } from '../object-path'
import HashList from '../hashlist'
import { getScreenIdFromPath, debounce, flattenProperties } from '../remix/util/util'
import { getComponents } from '../remix'

/**
 * Плагин отслеживает все шаринг кнопки и создает сущности для шаринга в свойства app.share.entities
 *
 * Общий шаринг для проекта отдельно - для этого создаются 'app.share.defaultTitle', 'app.share.defaultDescription', 'app.share.defaultImage'
 *
 */
export default function initShare(options = {}) {
    const SHARE_BTN_TAG = 'share'
    let fbApiEmbedded = false

    const getMainPreviewHTML = options.getMainPreviewHTML,
        getShareEntityPreviewHTML = options.getShareEntityPreviewHTML,
        remix = options.remix,
        updateShare = function () {
            const state = remix.getState(),
                // try to request existing share entities
                entProps = getPropertiesBySelector(state, 'app.share.entities')

            let oldEntities = {},
                newEntities = [],
                sharingButtons = []

            if (entProps && entProps.length > 0) {
                oldEntities = entProps[0].value
            }

            // fetch all sharing buttons from the app
            sharingButtons = getComponents({ tag: SHARE_BTN_TAG })

            sharingButtons.forEach(button => {
                const componentId = button.hashlistId,
                    ne = {
                        screen: {
                            id: button.screen.hashlistId,
                            tags: button.screen.tags,
                        },
                        componentId,
                        title: 'Interacty – engaging content',
                        description: 'Try it yourself!',
                        imageId: '',
                        imageUrl: '',
                        href: '',
                        customImage: false,
                        ...Object.values(oldEntities).find(e => e.componentId === componentId),
                    }
                newEntities.push(ne)
            })

            const result = new HashList(newEntities)
            remix.setData({ 'app.share.entities': result })

            if (!fbApiEmbedded && newEntities.length > 0) {
                embedFbCode()
                fbApiEmbedded = true
            }
            return result
        },
        updatePreviews = function (entities) {
            if (getMainPreviewHTML) {
                remix.setData({ 'app.share.previewHtml': getMainPreviewHTML(remix) })
            }

            if (getShareEntityPreviewHTML && entities && entities.length > 0) {
                const previews = {}
                entities.toArray().forEach(share => {
                    previews[`app.share.entities.${share.hashlistId}.previewHtml`] = getShareEntityPreviewHTML(
                        remix,
                        share,
                    )
                })
                remix.setData(previews)
            }
        }

    function embedFbCode() {
        window.fbAsyncInit = function () {
            FB.init({
                appId: '213320349753425', // Interacty.me facebook app
                autoLogAppEvents: true,
                xfbml: true,
                version: 'v6.0',
            })
        }
        const script = document.createElement('script')
        script.src = 'https://connect.facebook.net/en_US/sdk.js'
        script.async = true
        script.defer = true
        document.body.appendChild(script)
    }

    /**
     * Add new properties to app schema for additional plugin functionality
     * These properties will be added to the app state and normalized
     */
    remix.extendSchema({
        'app.share.entities': {
            type: 'hashlist',
            minLength: 0,
            maxLength: 128,
            default: new HashList([]),
        },
        'app.share.[entities HashList]./^[0-9a-z]+$/.componentId': {
            type: 'string',
            default: '',
        },
        'app.share.[entities HashList]./^[0-9a-z]+$/.title': {
            type: 'string',
            default: '',
        },
        'app.share.[entities HashList]./^[0-9a-z]+$/.description': {
            type: 'string',
            default: '',
        },
        'app.share.[entities HashList]./^[0-9a-z]+$/.imageId': {
            type: 'string',
            default: '',
        },
        'app.share.[entities HashList]./^[0-9a-z]+$/.imageUrl': {
            type: 'string',
            default: '',
        },
        'app.share.[entities HashList]./^[0-9a-z]+$/.customImage': {
            type: 'boolean',
            default: false,
        },
        'app.share.[entities HashList]./^[0-9a-z]+$/.href': {
            type: 'string',
            default: '',
        },
        'app.share.[entities HashList]./^[0-9a-z]+$/.previewHtml': {
            type: 'string',
            default: '',
        },
        'app.share.[entities HashList]./^[0-9a-z]+$/.screen.id': {
            type: 'string',
            default: '',
        },
        'app.share.[entities HashList]./^[0-9a-z]+$/.screen.tags': {
            type: 'string',
            default: '',
        },
        'app.share.defaultImage': {
            type: 'string',
            default: '',
        },
        'app.share.defaultTitle': {
            type: 'string',
            default: '',
        },
        'app.share.defaultDescription': {
            type: 'string',
            default: '',
        },
        'app.share.previewHtml': {
            type: 'string',
            default: '',
        },
    })

    Remix.addMessageListener('setshareentities', data => {
        const share = Remix.getState().app.share
        if (share) {
            Remix.setData({ ...flattenProperties(data.data, 'app.share') })
        }
    })

    Remix.addMessageListener('getshareentities', data => {
        const entities = updateShare()
        updatePreviews(entities)
        const share = JSON.parse(JSON.stringify(Remix.getState().app.share))
        if (share.entities) {
            delete share.entities._orderedIds
        }
        return {
            message: 'share_entities',
            data: { share },
        }
    })
    Remix.registerTriggerAction('share:update_share_entities', event => {
        // синхронизировать 'app.share.entities' с существующими шаринг кнопками в приложении
        const entities = updateShare()
        updatePreviews(entities)
    })

    //TODO 09.06.2020 Artem: зачем этот экшн? не нашел в коде вызовов его или ссылок на него
    // Remix.registerTriggerAction('share:update_share_previews', event => {
    //     updatePreviews()
    // })

    remix.addTrigger({
        when: { eventType: 'remix_inited' },
        then: { actionType: 'share:update_share_entities' },
    })

    // мы должны знать обо всех добавлениях и удалениях sharing кнопок в приложении
    remix.addTrigger({
        when: {
            eventType: 'property_updated',
            condition: { prop: 'path', clause: 'MATCH', value: 'router.[screens HashList]./^[0-9a-z]+$/.components' },
        },
        then: { actionType: 'share:update_share_entities' },
    })
}
