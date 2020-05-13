import UserActivity from './UserActivity'
import Analytics from './Analytics'
import { sessionInitialize, sessionRefresh, setClientKey } from './api'

/**
 * Created by artyom.grishanov on 17.12.15.
 */
if (window.remix_interacty === undefined) {
    window.remix_interacty = {}
    ;(function (global) {
        /**
         * Все элементы с этим классом будут наализироваться как проекты
         */
        var clazz = 'rmx_interacty'
        /**
         * Локация раcположения всех опубликованных проектов
         * @type {string}
         */
        var publishedProjectsHome = '//p.interacty.me/'
        /**
         * Приложения на странице
         * key - ссылка на контент приложения
         *
         * Example:
         * 'http://52.29.160.34:8888/api/projects/1001/versions/51896/content': {
         *      features:
         *      files:
         *      projectActions:
         *      projectForms:
         *      type:
         *
         * }
         *
         * @type {object}
         */
        var remixApps = {}
        /**
         *
         */
        var initedAttrName = 'data-inited'
        /**
         *
         */
        var gaTrackerName = 'interactyTracker'
        /**
         *
         */
        var gaId = 'UA-88595022-2'
        /**
         *
         */
        var statCategory = 'InteractyLoader'

        const userActivity = new UserActivity()
        const analytics = new Analytics()

        function parseProjectId(url) {
            var parts = url.split('/')

            return parts[parts.indexOf('projects') + 1]
        }

        function getProjectData(url, json) {
            var projectId = parseProjectId(url)

            return {
                projectId,
                projectType: {
                    id: json.type.id,
                },
                title: json.type.name,
                description: json.type.description,
            }
        }

        function createSession(url, json, clientKey) {
            var project = getProjectData(url, json)

            setClientKey(clientKey)
            sessionInitialize({ project })
        }

        /**
         * Найти и проинициализировать все контейнеры с опубликованными приложениями
         * Подходит для многократного перезапуска
         */
        function init() {
            var elems = document.getElementsByClassName(clazz)
            //TODO embed rcnt dynimically
            //TODO later embed minified rcnt.js script right inside l.js file ?
            for (var i = 0; i < elems.length; i++) {
                var e = elems[i]
                var inited = e.getAttribute(initedAttrName)
                if (!inited) {
                    // init each project once
                    e.setAttribute(initedAttrName, 'true')
                    stat(statCategory, 'content_requested')
                    var cLink = e.getAttribute('data-content')
                    var mw = e.getAttribute('data-mw') || undefined
                    var h = e.getAttribute('data-h') || undefined
                    requestContent(cLink, function (json) {
                        const rcnt = (json.rcnt = createRContainer(
                            e,
                            json.features,
                            getFileUrl(json.files, 'text/html'),
                            getFileUrl(json.files, 'text/javascript'),
                            getFileUrl(json.files, 'text/css'),
                            mw,
                            h,
                            function (name, data) {
                                if (data && data.appId) {
                                    userActivity.onFirstActiviy = userActivity.onActivityLongTime = () =>
                                        createSession(cLink, json, data.appId)
                                    userActivity.onActivity = sessionRefresh
                                } else {
                                    console.error('Something is wrong:', data)
                                }
                            },
                        ))

                        analytics.setConversionActionIds(
                            Object.fromEntries(json.projectActions.map(({ actionType, id }) => [actionType, id])),
                        )
                        rcnt.addReceiveMessageListener(
                            data => data.method === 'user-activity' && userActivity.makeActivity(),
                        )
                        rcnt.addReceiveMessageListener(
                            data => data.method.indexOf('analytics') !== -1 && analytics.trigger(data),
                        )

                        remixApps[cLink] = json
                        stat(statCategory, 'container_created')
                    })
                    //TODO initGA(e);
                    //TODO createPoweredLabel
                }
            }
        }

        function showError() {
            //TODO pretty error message
            // regular error
            // blocked
            // deleted
            // tariff expired - ads?
            //
        }

        /**
         * Request project content
         *
         * @param {string} url example, http://52.29.160.34:8888/api/projects/1001/versions/51896/content
         */
        function requestContent(url, clb) {
            var xhr = new XMLHttpRequest()
            xhr.open('GET', url)
            xhr.onload = function () {
                if (xhr.status !== 200) {
                    //TODO error UI
                } else {
                    try {
                        var json = JSON.parse(xhr.responseText)
                        clb(json)
                    } catch (err) {
                        console.error(err.message)
                        showError()
                    }
                }
            }
            xhr.send()
        }

        function getFileUrl(files, mediaType) {
            for (var i = 0; i < files.length; i++) {
                if (files[i].mediaType === mediaType) {
                    return files[i].url
                }
            }
        }

        function createRContainer(container, features, htmlUrl, scriptUrl, cssUrl, minWidth, height, onInited) {
            return new window.RemixContainer({
                mode: 'published',
                width: minWidth,
                height: height,
                url: htmlUrl,
                element: container,
                features,
                scriptUrl: scriptUrl,
                cssUrl: cssUrl,
                onEvent: function (name, data) {
                    if (name === 'embedded') stat(statCategory, 'app_embedded')
                    else if (name === 'inited') {
                        stat(statCategory, 'app_inited')
                        onInited(name, data)
                    }
                },
            })
        }

        /**
         * Инициализировать Google Analytics api
         * @param cnt куда встроить скрипт ga
         */
        function initGA(cnt) {
            if (!window.ga) {
                var gaCode =
                    "<script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');ga('create', '{{ga_id}}', 'auto', {{params}});ga('" +
                    gaTrackerName +
                    ".send', 'pageview');{{init_event}}</script>"
                gaCode = gaCode.replace('{{ga_id}}', gaId)
                gaCode = gaCode.replace('{{params}}', "{'name':'" + gaTrackerName + "'}")
                gaCode = gaCode.replace(
                    '{{init_event}}',
                    "ga('" + gaTrackerName + ".send', 'event', '" + statCategory + "', 'Init_analytics');",
                )
                var d = document.createElement('div')
                d.innerHTML = gaCode
                cnt.appendChild(d.firstChild)
            } else {
                window.ga('create', gaId, 'auto', { name: gaTrackerName })
            }
        }

        /**
         * Отправить событие в систему сбора статистики
         *
         * @param {string} category, например Videos
         * @param {string} action, например Play
         * @param {string} [label], например 'Fall Campaign' название клипа
         * @param {number} [value], например 10 - длительность
         */
        function stat(category, action, label, value) {
            if (window.ga) {
                var statData = {
                    hitType: 'event',
                    eventCategory: category,
                    eventAction: action,
                }
                if (label) {
                    statData.eventLabel = label
                }
                if (value) {
                    statData.eventValue = value
                }
                window.ga(gaTrackerName + '.send', statData)
            }
        }

        /**
         * Вставить метку "TESTIX" со ссылкой на сайт
         *
         * @param cnt контейнер куда вставить
         * @param {string} [labelMod] - возможность установить модификатор для иконки (например, "__small" для панорам)
         */
        function createPoweredLabel(cnt, labelMod) {
            labelMod = labelMod || ''
            var s =
                '<a href="http://testix.me" target="_blank" class="tstx_pwrd ' +
                labelMod +
                '" onclick="testix.onLabelClick()"></a>'
            var div = document.createElement('div')
            div.innerHTML = s
            cnt.appendChild(div.firstChild)
        }

        /**
         * Клик на иконку сервиса в углу проекта.
         * Для сбора статистики
         *
         * @param e
         */
        function onLabelClick(e) {
            stat(statCategory, 'Label_click')
        }

        // public
        global.init = init
        global.getApps = function () {
            return remixApps
        }
        global.onLabelClick = onLabelClick
    })(window.remix_interacty)
}
// можно запускать несколько раз, например, если появятся новые ембеды
// или же теги встроены непоследовательно
window.remix_interacty.init()

//=====================================================================================================================================================================
//=====================================================================================================================================================================
//=====================================================================================================================================================================
//=====================================================================================================================================================================

// EMBEDDED AND MINIFIED rcnt content below

//=====================================================================================================================================================================
//=====================================================================================================================================================================
//=====================================================================================================================================================================
//=====================================================================================================================================================================

/**
 * some styles for container and editor
 */
//import './css/main.css'

window.Rmx = window.Rmx || {
    getc: function (event) {
        var ssid = event.currentTarget.getAttribute('data-ssid')
        return window.Rmx.Containers[ssid]
    },
    getpp: function (prop) {
        return 'data-prop="' + prop + '"'
    },
    getss: function (sessionId) {
        return 'data-ssid="' + sessionId + '"'
    },
    Containers: {},
    Actions: {
        onEdit: function (e) {
            var c = window.Rmx.getc(e)
            c.selectControlPanelItem(0) // 0 - "Edit" tab index
            c.renderEditor()
        },
        onJson: function (e) {
            var c = window.Rmx.getc(e)
            c.selectControlPanelItem(1)
            c.renderJsonViewer()
        },
        onClose: function (e) {
            var c = window.Rmx.getc(e)
            c.selectControlPanelItem(-1)
        },
        setProperty: function (e) {
            var c = window.Rmx.getc(e)
            var prop = e.currentTarget.getAttribute('data-prop')
            var value = e.currentTarget.value
            c.setData({ [prop]: value })
        },
        onHLAdd: function (e) {
            var c = window.Rmx.getc(e)
            var prop = e.currentTarget.getAttribute('data-prop')
            c.addHashlistElement(prop)
        },
        onHLEDelete: function (e) {
            var c = window.Rmx.getc(e)
            var prop = e.currentTarget.getAttribute('data-prop')
            var elementId = e.currentTarget.getAttribute('data-elementid')
            c.deleteHashlistElement(prop, elementId)
        },
        onHLETop: function (e) {
            var c = window.Rmx.getc(e)
            var prop = e.currentTarget.getAttribute('data-prop')
            var index = e.currentTarget.getAttribute('data-index')
            c.changePositionInHashlist(prop, index, index - 1)
        },
        onHLEDown: function (e) {
            var c = window.Rmx.getc(e)
            var prop = e.currentTarget.getAttribute('data-prop')
            var index = e.currentTarget.getAttribute('data-index')
            c.changePositionInHashlist(prop, index, index + 1)
        },
    },
    Util: {
        getOrigin: function (url) {
            var parser = document.createElement('a')
            parser.href = url
            return parser.origin
        },
        createNodeFromHTML: function (html) {
            var div = document.createElement('div')
            div.innerHTML = html.trim()
            return div.firstChild
        },
        sortFactory: function (prop) {
            return function (a, b) {
                return a[prop].localeCompare(b[prop])
            }
        },
        isHashlist: function (value) {
            return !!(value && value._orderedIds)
        },
        rand: function () {
            return Math.random().toString(36).substr(4)
        },
        getParentPropPath: function (propPath) {
            var pp = propPath.split('.')
            pp.pop()
            return pp.join('.')
        },
    },
}

/**
 * Constructor function 'RemixContainer' for container creation
 */
window.RemixContainer = function RemixContainer({
    url = null,
    scriptUrl = null,
    cssUrl = null,
    element = null,
    features = [],
    defaults = null,
    width = 800,
    height = 600,
    marginTop = undefined,
    containerLog = false,
    remixLog = false,
    mode = 'none',
    onEvent = null,
    forceRestart = false,
}) {
    if (typeof url !== 'string') {
        throw Error('url must be a string')
    }
    if (typeof scriptUrl !== 'string') {
        throw Error('scriptUrl must be a string')
    }
    if (typeof cssUrl !== 'string') {
        throw Error('cssUrl must be a string')
    }
    if (!element) {
        throw Error('element is not specified')
    }

    // create unique session for this container
    this.sessionId = window.Rmx.Util.rand()
    element.setAttribute('data-ssid', this.sessionId)
    window.window.Rmx.Containers[this.sessionId] = this

    this.appOrigin = window.Rmx.Util.getOrigin(url) // like 'http://localhost:3000/';
    this.schema = null
    this.mode = mode
    this.containerLog = containerLog
    this.remixLog = remixLog
    if (defaults !== null && typeof defaults !== 'string') {
        throw new Error('"defaults" - json string expected to set default app state')
    }
    this.defaults = defaults
    this.screens = []
    this.controlViews = []
    this.properties = []
    this.serializedProperties = {}
    this.selectedControlPanelIndex = -1
    this.onEvent = onEvent
    this.operationsCount = 0
    this.width = width
    this.height = height
    this.marginTop = marginTop
    this.element = element
    this.features = features
    this.iframe = null
    this.preloader = this.createPreloader()
    this.receiveMessageListeners = []

    if (element.innerHTML.indexOf('<iframe') < 0 || forceRestart) {
        element.innerHTML = ''
        element.className = 'remix_cnt'
        element.style.position = 'relative'
        element.style.margin = '0 auto'
        element.style.overflow = 'hidden'
        if (this.mode == 'edit') {
            element.style.width = '100%'
            element.style.height = '100%'
        } else {
            // нужна дополнительная область при редактировании для операций
            element.style.maxWidth = width + 'px'
            element.style.height = height + 'px'
        }
        window.addEventListener('message', this.receiveMessage.bind(this), false)
        this.element.appendChild(this.preloader.render())
        if (Array.isArray(this.features) && !this.features.includes('NO_LOGO') && this.mode === 'published') {
            this.element.appendChild(this.createPoweredLabel())
        }
        this.iframe = this.createIframe(url, element, width, height, scriptUrl, cssUrl)
    }
}

/**
 * @param {(options: {method: string}) => void} callbackfn
 */
RemixContainer.prototype.addReceiveMessageListener = function (callbackfn) {
    this.receiveMessageListeners.push(callbackfn)
}

/**
 * Create iframe for Remix application
 *
 * @param {string} url iframe src url
 * @param {HTMLElement} parentNode
 * @param {number} width
 * @param {number} height
 * @param {string} scriptUrl - additional script to add into app
 * @param {string} cssUrl - additional css file to add on app page
 *
 * @returns {HTMLElement}
 */
window.RemixContainer.prototype.createIframe = function (url, parentNode, width, height, scriptUrl, cssUrl) {
    //TODO const panelElems = createRecommendationPanel(parentNode, width);
    var iframe = document.createElement('iframe')
    iframe.setAttribute('allowFullScreen', '')
    iframe.style.border = 0
    iframe.style.width = '100%'
    iframe.style.height = '100%'
    iframe.style.overflow = 'hidden'
    var self = this
    iframe.onload = function (event) {
        // self.log('embed message sent');
        self.parentNode = parentNode
        self.iframe = iframe
        self.iframe.contentWindow.postMessage(
            {
                method: 'embed',
                script: scriptUrl,
                css: cssUrl,
            },
            self.appOrigin,
        )
    }
    iframe.src = url
    parentNode.appendChild(iframe)
    return iframe
}

window.RemixContainer.prototype.sendEvent = function (name, data) {
    if (this.onEvent) {
        this.onEvent(name, data)
    }
}

window.RemixContainer.prototype.setCurrentScreen = function (screenId) {
    // this.log('setcurrentscreen message sent');
    this.iframe.contentWindow.postMessage(
        {
            method: 'setcurrentscreen',
            screenId: screenId,
        },
        this.appOrigin,
    )
}

window.RemixContainer.prototype.selectComponents = function (componentIds) {
    // this.log('select message sent');
    this.iframe.contentWindow.postMessage(
        {
            method: 'select',
            componentIds: componentIds,
        },
        this.appOrigin,
    )
}

window.RemixContainer.prototype.receiveMessage = function ({ origin = null, data = {}, source = null }) {
    // In current "window" we may have many window.RemixContainers with many "receiveMessage" handlers, but window is the same!
    // Must check iframe source
    if (!this.iframe || this.iframe.contentWindow !== source || origin !== this.appOrigin) {
        return
    }
    // this.log(data.method + ' message received. ', data);
    if (data.method === 'embedded') {
        this.sendEvent('embedded')
        var initData = {
            method: 'init',
            mode: this.mode,
            log: this.remixLog,
            defaults: this.defaults ? this.defaults : '',
        }
        if (this.mode === 'edit') {
            initData.marginTop = this.marginTop
            initData.fixedRootWidth = this.width
            initData.fixedRootHeight = this.height
        }
        this.iframe.contentWindow.postMessage(initData, this.appOrigin)
    } else if (data.method === 'inited') {
        this.preloader.hideAndDestroy()
        this.sendEvent('inited', data)
        this.schema = data.schema
        if (this.mode === 'edit') {
            this.renderEditor()
            this.renderJsonViewer()
        }
    } else if (data.method === 'properties_updated') {
        if (this.mode === 'edit') {
            this.sendEvent('properties_updated', data)
        }
        //this.serializedProperties = JSON.parse(data.state);
        if (this.selectedControlPanelIndex === 0) {
            // editor selected - update editor
            this.renderEditor()
        }
        this.operationsCount++
    } else if (data.method === 'serialized') {
        this.serializedProperties = JSON.parse(data.state)
        if (this.serializeClb) {
            this.serializeClb(this.serializedProperties)
        }
    } else if (data.method === 'app_bounding_client_rect') {
        if (this.boundingClientRectClb) {
            this.boundingClientRectClb(data.rect)
        }
    } else if (data.method === 'share_entities') {
        if (this.getShareEntitiesClb) {
            this.getShareEntitiesClb(data.share)
        }
    } else if (data.method === 'screens_updated') {
        //data.added, data.changed, data.deleted
        //TODO screens: basic sync algorythm
        if (this.mode === 'edit') {
            // this.screens = this.syncScreens(this.screens, data.added, data.changed, data.deleted);
            // this.renderScreenViewer(this.screens);
            this.sendEvent('screens_updated', data)
        }
    }
    // if (event.data.method === 'showRecommendations') {
    //     showRecommendation(event.source);
    // }
    // if (event.data.method === 'hideRecommendations') {
    //     hideRecommendation(event.source);
    // }
    else if (data.method === 'shareDialog') {
        //stat('TestixLoader','Share_Dialog_Open', event.data.provider);
    } else if (data.method === 'requestSetSize') {
        this.setSize(data.size.width, data.size.height)
    } else if (data.method === 'selected') {
        this.sendEvent('selected', data)
    }

    for (const listener of this.receiveMessageListeners) listener(data)
}

/**
 * This container change its size. Remix app subscribed on window resize.
 */
window.RemixContainer.prototype.setSize = function (width, height) {
    if (this.mode === 'edit') {
        // в режиме редактирования когда iframe превращен в широкий артборд, размер приложения надо менять непосредственно у контейнера ремикс
        this.iframe.contentWindow.postMessage(
            {
                method: 'set_remix_container_size',
                size: { width, height },
            },
            this.appOrigin,
        )
    } else {
        // в нормальном режиме (нередактирование) ремикс определит свои размеры от window
        this.element.style.maxWidth = width + 'px'
        this.element.style.height = height + 'px'
    }
}

/**
 * Sync local screens with application
 * Application sent screen modifications: "added", "changed", "deleted" arrays
 */
window.RemixContainer.prototype.syncScreens = function (screens, added, changed, deleted) {
    if (added.length === 0 && changed.length === 0 && deleted.length === 0) {
        throw Error('No screen modifications')
    }
    var result = screens.splice(0)
    if (deleted.length > 0) {
        for (var i = 0; i < deleted.length; i++) {
            var s = this.getScreen(deleted[i].screenId, screens)
            if (s) {
                result.splice(i, 1)
            }
        }
    }
    if (added.length > 0) {
        //throw already exist
    }
    if (changed.length > 0) {
    }
    return result
}

window.RemixContainer.prototype.getScreen = function (id, screens) {
    return screens && screens.length > 0 ? screens.find(s => s.screenId === id) : null
}

/**
 * Sends the message with new data to app
 */
window.RemixContainer.prototype.setData = function (data) {
    this.log('setdata message sent')
    this.iframe.contentWindow.postMessage(
        {
            method: 'setdata',
            data: data,
            //TODO зачем force? delete?
            forceFeedback: true,
        },
        this.appOrigin,
    )
}

window.RemixContainer.prototype.addHashlistElement = function (propertyPath, index, newElement) {
    this.log('addhashlistelement message sent')
    this.iframe.contentWindow.postMessage(
        {
            method: 'addhashlistelement',
            propertyPath,
            index,
            newElement,
        },
        this.appOrigin,
    )
}

window.RemixContainer.prototype.cloneHashlistElement = function (propertyPath, elementId) {
    this.log('clonehashlistelement message sent')
    this.iframe.contentWindow.postMessage(
        {
            method: 'clonehashlistelement',
            propertyPath,
            elementId,
        },
        this.appOrigin,
    )
}

/**
 * Указать элемент который перемещаем можно двумя способами: elementId | elementIndex
 * Указать новую позицию можно тоже двумя способами: newElementIndex | delta
 */
window.RemixContainer.prototype.changePositionInHashlist = function (
    propertyPath,
    { elementId, elementIndex, newElementIndex, delta },
) {
    this.log('changepositioninhashlist message sent')
    this.iframe.contentWindow.postMessage(
        {
            method: 'changepositioninhashlist',
            propertyPath,
            elementId,
            elementIndex,
            newElementIndex,
            delta,
        },
        this.appOrigin,
    )
}

window.RemixContainer.prototype.deleteHashlistElement = function (propertyPath, elementId) {
    this.log('deletehashlistelement message sent')
    this.iframe.contentWindow.postMessage(
        {
            method: 'deletehashlistelement',
            propertyPath,
            elementId,
        },
        this.appOrigin,
    )
}

window.RemixContainer.prototype.serialize = function (clb) {
    this.serializeClb = clb
    this.log('serialize message sent')
    this.iframe.contentWindow.postMessage(
        {
            method: 'serialize',
        },
        this.appOrigin,
    )
}

/**
 * Запросить у приложения позицию контейнера приложения "remix-app-root"
 * Полезно в режиме редактирования, так как область редактирования расширена, а "remix-app-root" находится где-то в центре
 */
window.RemixContainer.prototype.getAppBoundingClientRect = function (clb) {
    this.boundingClientRectClb = clb
    this.iframe.contentWindow.postMessage(
        {
            method: 'getappboundingclientrect',
        },
        this.appOrigin,
    )
}

/**
 * Запросить всю информацию по шарингам
 * Просто возвращается целиком state.app.share
 */
window.RemixContainer.prototype.getShareEntities = function (clb) {
    this.getShareEntitiesClb = clb
    this.iframe.contentWindow.postMessage(
        {
            method: 'getshareentities',
        },
        this.appOrigin,
    )
}

/**
 * Установить свойства шаринга
 * Переданные свойства перепишут те, что есть в приложении. Если какие-то не передать ничего не произойдет
 * То есть удалить шаринги нельзя, если не передать какой-то sharing_id.
 *
 * Формат такой же какой возвращает getShareEntities()
 * @param {object} data {
 *      entities: {
 *          'as3wre': {
 *              ...
 *          }
 *      },
 *      defaultTitle: 'new title',
 *      defaultDescription: 'new descr',
 *          ...
 * }
 */
window.RemixContainer.prototype.setShareEntities = function (data) {
    this.iframe.contentWindow.postMessage(
        {
            method: 'setshareentities',
            data,
        },
        this.appOrigin,
    )
}

window.RemixContainer.prototype.deserialize = function (json) {}

window.RemixContainer.prototype.getOperationsCount = function () {
    return this.operationsCount
}

window.RemixContainer.prototype.undo = function () {
    this.iframe.contentWindow.postMessage(
        {
            method: 'undo',
        },
        this.appOrigin,
    )
}

window.RemixContainer.prototype.redo = function () {
    this.iframe.contentWindow.postMessage(
        {
            method: 'redo',
        },
        this.appOrigin,
    )
}

// =========================================================================================================
// =========================================================================================================
// UI Methods below
// =========================================================================================================
// =========================================================================================================

/**
 * Creates control tab with some buttons
 */
window.RemixContainer.prototype.createControlPanel = function (parent) {
    var pane = document.createElement('div')
    pane.className = 'remix_ctrl_pane'
    pane.innerHTML =
        '<span class="remix_pane_btn" data-ssid="' +
        this.sessionId +
        '" onclick="window.Rmx.Actions.onEdit(event)">Edit</span><span class="remix_pane_btn" data-ssid="' +
        this.sessionId +
        '" onclick="window.Rmx.Actions.onJson(event)">Json</span><span class="remix_pane_btn js-viewScreens">Screens</span><span class="remix_pane_btn"  data-ssid="' +
        this.sessionId +
        '" onclick="window.Rmx.Actions.onClose(event)">[X]</span>'
    parent.appendChild(pane)
}

window.RemixContainer.prototype.selectControlPanelItem = function (itemIndex) {
    this.selectedControlPanelIndex = itemIndex
    for (var i = 0; i < this.controlViews.length; i++) {
        if (i === itemIndex) {
            this.controlViews[i].style.display = 'block'
        } else {
            this.controlViews[i].style.display = 'none'
        }
    }
}

window.RemixContainer.prototype.renderLine = function (
    name,
    value,
    depth,
    isHashlist,
    isHashlistElement,
    propPath,
    hlElementIndex,
) {
    depth = depth || 0
    var html = '',
        htControls = ''
    if (isHashlist) {
        htControls +=
            '<span onclick="window.Rmx.Actions.onHLAdd(event)" data-prop="' +
            propPath +
            '" data-ssid="' +
            this.sessionId +
            '"">[+]</span>'
    }
    if (isHashlistElement) {
        var p = window.Rmx.getpp(window.Rmx.Util.getParentPropPath(propPath))
        var s = window.Rmx.getss(this.sessionId)
        htControls +=
            '<span onclick="window.Rmx.Actions.onHLEDelete(event)" ' +
            p +
            ' ' +
            s +
            ' data-elementid="' +
            name +
            '">[-]</span>'
        htControls +=
            '<span onclick="window.Rmx.Actions.onHLETop(event)" class="arr __top" data-index="' +
            hlElementIndex +
            '" ' +
            p +
            ' ' +
            s +
            '></span>' +
            '<span onclick="window.Rmx.Actions.onHLEDown(event)" class="arr __down" data-index="' +
            hlElementIndex +
            '" ' +
            p +
            ' ' +
            s +
            '></span>'
    }
    html += '<tr><td><span style="padding-left:' + depth * 10 + 'px"></span>' + name + ' ' + htControls + '</td><td>'
    if (value !== undefined) {
        html +=
            '<input value="' +
            value +
            '"/ onfocusout="window.Rmx.Actions.setProperty(event)" data-prop="' +
            propPath +
            '" data-ssid="' +
            this.sessionId +
            '"></td></tr>'
    }
    return html
}

window.RemixContainer.prototype.renderBlock = function (properties, blockName, depth, propPath, isHashlistElement) {
    if (!properties) return
    var html = ''
    blockName = blockName || ''
    propPath = propPath ? propPath + '.' : ''
    if (properties._orderedIds) {
        // hashlist
        for (var i = 0; i < properties._orderedIds.length; i++) {
            var id = properties._orderedIds[i]
            //properties[id]
            var isHashlist = window.Rmx.Util.isHashlist(properties[id])
            html += this.renderLine(id, undefined, depth, isHashlist === true, true, propPath + id, i)
            html += this.renderBlock(properties[id], '', depth + 1, propPath + id, false)
        }
    } else {
        for (var key in properties) {
            //if (key === '_orderedIds') continue;
            if (properties.hasOwnProperty(key)) {
                if (typeof properties[key] === 'object') {
                    var isHashlist = window.Rmx.Util.isHashlist(properties[key])
                    html += this.renderLine(
                        key,
                        undefined,
                        depth,
                        isHashlist === true,
                        false /*isHashlistElement*/,
                        propPath + key,
                    )
                    html += this.renderBlock(properties[key], '', depth + 1, propPath + key, false)
                } else
                    html += this.renderLine(
                        key,
                        properties[key],
                        depth + 1,
                        false,
                        false /*isHashlistElement*/,
                        propPath + key,
                    )
            }
        }
    }
    return html
}

/**
 * Creates simple mini editor
 */
window.RemixContainer.prototype.renderEditor = function () {
    var editorHtml = this.renderBlock(this.serializedProperties, '', 0, '', false)
    editorHtml =
        '<table><thead><tr><th>Property</th><th>Value</th></tr></thead><tbody>' + editorHtml + '</tbody></table>'
    if (!this.editorNode) {
        this.editorNode = window.Rmx.Util.createNodeFromHTML(
            '<div class="remix_micro_editor" style="display:none"></div>',
        )
        this.parentNode.appendChild(this.editorNode)
        this.controlViews.push(this.editorNode)
    }
    this.editorNode.innerHTML = editorHtml
}

window.RemixContainer.prototype.renderJsonViewer = function () {
    if (!this.jsonViewerNode) {
        this.jsonViewerNode = window.Rmx.Util.createNodeFromHTML(
            '<div class="remix_micro_editor" style="display:none;white-space:inherit"></div>',
        )
        this.parentNode.appendChild(this.jsonViewerNode)
        this.controlViews.push(this.jsonViewerNode)
    }
    this.jsonViewerNode.innerHTML = JSON.stringify(this.serializedProperties)
}

/**
 * Renders application screen previews
 */
window.RemixContainer.prototype.renderScreenViewer = function (screens) {
    if (!this.screenViewerNode) {
        // build screen preview interface
        this.screenViewerNode = window.Rmx.Util.createNodeFromHTML(
            '<div class="remix_micro_editor" style="display:none"></div>',
        )
        this.screenBtnPanel = window.Rmx.Util.createNodeFromHTML('<div class="remix_scr_pane"></div>')
        this.screenViewerNode.appendChild(this.screenBtnPanel)
        this.screenIframe = window.Rmx.Util.createNodeFromHTML(
            this.getIframeCodeForScreenPreview(this.width, this.height),
        )
        this.screenViewerNode.appendChild(this.screenIframe)
        this.parentNode.appendChild(this.screenViewerNode)
        this.controlViews.push(this.screenViewerNode)
        // iframe loaded, now we can add smthing to document
        this.screenContainer = window.Rmx.Util.createNodeFromHTML('<div id="screen_container"></div>')
        var iframedoc = this.screenIframe.contentDocument || this.screenIframe.contentWindow.document
        iframedoc.body.appendChild(this.screenContainer)
        var style = document.createElement('style')
        //TODO get css string from build/statix/css/main
        style.type = 'text/css'
        style.appendChild(
            document.createTextNode(
                'body{margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}code{font-family:source-code-pro,Menlo,Monaco,Consolas,Courier New,monospace}p{margin:0;padding:0}.eng-app,.eng-screen{background-color:#eee}.eng-screen{min-width:100px;min-height:40px}.rmx-quiz_block{width:100%;border:1px solid #000}',
            ),
        )
        iframedoc.body.appendChild(style)
        var self = this
        document.querySelector('.js-viewScreens').addEventListener('click', function () {
            self.selectControlPanelItem(2) // 2 index - third tab "Screens"
        })
    }
    var html = ''
    // update buttons every time
    for (var i = 0; i < screens.length; i++) {
        html +=
            '<button class="remix_scr_tab js-scr_' +
            screens[i].screenId +
            '" data-scr="' +
            screens[i].screenId +
            '">' +
            screens[i].screenId +
            '</button>'
    }
    this.screenBtnPanel.innerHTML = html
    // attach listener to buttons
    for (var i = 0; i < screens.length; i++) {
        document
            .querySelector('.js-scr_' + screens[i].screenId)
            .addEventListener('click', this.onScrBtnClick.bind(this, screens[i].screenId))
    }
    //TODO clear prev handlers
    if (screens.length > 0) {
        this.showScreen(screens[0].screenId)
    }
}

window.RemixContainer.prototype.onScrBtnClick = function (screenId) {
    this.showScreen(screenId)
}

window.RemixContainer.prototype.showScreen = function (screenId) {
    for (var i = 0; i < this.screens.length; i++) {
        if (screenId === this.screens[i].screenId) {
            // var iframe = this.screenContainer.firstChild;
            // var iframedoc = iframe.contentDocument || iframe.contentWindow.document;
            // iframedoc.body.appendChild = '<div>'+this.screens[i].markup+'</div>';
            this.screenContainer.innerHTML = '<div>' + this.screens[i].markup + '</div>'
            break
        }
    }
}

window.RemixContainer.prototype.getIframeCodeForScreenPreview = function (width, height) {
    return (
        '<iframe width="' +
        width +
        'px" height="' +
        height +
        'px" style="border:0;width:100%;height:100%;max-width:' +
        width +
        'px;max-height:' +
        height +
        'px"></iframe>'
    )
}

// =========================================================================================================
// =========================================================================================================
// Helper Methods below
// =========================================================================================================
// =========================================================================================================

window.RemixContainer.prototype.stat = function () {
    //TODO
}

window.RemixContainer.prototype.log = function (...message) {
    if (this.containerLog) {
        console.log('RContainer:', ...message)
    }
}

/**
 * Create remix preloader instance
 *
 */
window.RemixContainer.prototype.createPreloader = function () {
    const MIN_ANIMATION_DELAY = 2000
    const ANIMATION_DURATION = 500
    const html = `
        <div
            data-remix-preloader
            style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; background-color: #fff; transition: opacity ${ANIMATION_DURATION}ms; opacity: 1;"
        >
            <img src="${
                process.env.REACT_APP_STATIC_URL
            }/static/media/preloader.gif?v=${Math.random()} alt="preloader" style="display: block; width: 100%; max-width: 380px; margin: 130px auto 0;" />
         </div>`
    const element = window.Rmx.Util.createNodeFromHTML(html)
    let animationStart = 0
    let animationEnd = 0

    return {
        render: function () {
            animationStart = Date.now()
            return element
        },
        hideAndDestroy: function () {
            animationEnd = Date.now()
            const diff = animationEnd - animationStart
            const animationDelay = diff > MIN_ANIMATION_DELAY ? 0 : MIN_ANIMATION_DELAY - diff

            window.setTimeout(() => {
                element.style.opacity = 0

                window.setTimeout(() => {
                    const container = element.parentNode
                    if (container && container.contains(element)) {
                        container.removeChild(element)
                    }
                }, ANIMATION_DURATION)
            }, animationDelay)
        },
    }
}

window.RemixContainer.prototype.createPoweredLabel = function () {
    const html = `
        <a href="${process.env.REACT_APP_STATIC_URL}" target="_blank">
            <img src="${process.env.REACT_APP_STATIC_URL}/static/media/powered_by.svg" style="position: absolute; bottom: 0; right: 0;" alt="powered by interacty" />
        </a>
    `
    const element = window.Rmx.Util.createNodeFromHTML(html)
    return element
}
