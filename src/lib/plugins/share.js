import { getPropertiesBySelector } from '../object-path'
import HashList from '../hashlist'
import { getScreenIdFromPath, debounce, flattenProperties } from '../remix/util/util'

/**
 * Плагин отслеживает все шаринг кнопки и создает сущности для шаринга в свойства app.share.entities
 *
 * Общий шаринг для проекта отдельно - для этого создаются 'app.share.defaultTitle', 'app.share.defaultDescription', 'app.share.defaultImage'
 *
 *
 * @param {array} options.displayTypes
 */
export default function initShare(options = {}) {
    let fbApiEmbedded = false

    const displayTypes = options.displayTypes,
        getMainPreviewHTML = options.getMainPreviewHTML,
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
            displayTypes.forEach(type => {
                sharingButtons = sharingButtons.concat(
                    getPropertiesBySelector(
                        state,
                        `router.[screens HashList]./^[0-9a-z]+$/.components.[/^[0-9a-z]+$/ displayName=${type}]`,
                    ),
                )
            })
            sharingButtons.forEach(button => {
                const screenId = getScreenIdFromPath(button.path),
                    componentId = button.propName,
                    ne = {
                        screen: {
                            id: screenId,
                            tags: state.router.screens[screenId].tags,
                        },
                        componentId,
                        title: '',
                        description: '',
                        imageId: '',
                        imageUrl: '',
                        href: '',
                        customImage: false,
                        ...Object.values(oldEntities).find(e => e.componentId === componentId),
                    }
                if (!ne.title) {
                    ne.title = 'Project title'
                }
                if (!ne.description) {
                    ne.description = 'Project description'
                }
                newEntities.push(ne)
            })
            remix.setData({ 'app.share.entities': new HashList(newEntities) })

            if (!fbApiEmbedded && newEntities.length > 0) {
                embedFbCode()
                fbApiEmbedded = true
            }
        },
        updatePreviews = function () {
            const state = remix.getState()

            if (getMainPreviewHTML) {
                remix.setData({ 'app.share.previewHtml': getMainPreviewHTML(remix) })
            }

            if (getShareEntityPreviewHTML && state.app.share && state.app.share.entities) {
                const previews = {}
                state.app.share.entities.toArray().forEach(share => {
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
        updateShare()
        updatePreviews()
        const share = JSON.parse(JSON.stringify(Remix.getState().app.share))
        if (share.entities) {
            delete share.entities._orderedIds
        }
        return {
            message: 'share_entities',
            data: { share },
        }
    })
}
