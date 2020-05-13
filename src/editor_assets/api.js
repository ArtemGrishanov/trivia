const userData = {
    session: null,
    clientKey: null,
}
export const setClientKey = clientKey => (userData.clientKey = clientKey)

const defaultApiServer = process.env.REACT_APP_BACKEND_URL

export const server = ({ url, method, body = void 0, headers = void 0, async = true }, onFulfilled, onRejected) => {
    const xhr = new XMLHttpRequest()

    xhr.addEventListener('readystatechange', event => {
        if (xhr.readyState === 4) {
            if (xhr.status.toString()[0] === '2') onFulfilled && xhr.response && onFulfilled(xhr.response)
            else onRejected && onRejected(xhr.statusText)
        }
    })

    xhr.open(method.toUpperCase(), `${defaultApiServer}/api/${url}`, async)

    xhr.setRequestHeader('Access', '*')
    xhr.setRequestHeader('Client-Key', userData.clientKey)
    for (var header in headers) {
        xhr.setRequestHeader(header, headers[header])
    }

    try {
        xhr.send(body)
    } catch (err) {
        console.error(err)
    }
}

const waitingSessionCallbacks = []

const waitingSession = callback => (...args) => {
    if (userData.session && userData.session.id) {
        callback(...args)
    } else {
        waitingSessionCallbacks.push(() => callback(...args))
    }
}

const executeWaitingSessionCallbacks = () => {
    if (userData.session === void 0) console.error('session is undefined')

    for (let i = 0; i < waitingSessionCallbacks.length; i++) {
        waitingSessionCallbacks[i]()
    }
}

export const sessionInitialize = ({ project }, onFulfilled) => {
    const reqest = {
        method: 'post',
        url: 'sessions',
        body: JSON.stringify({
            id: null,
            project,
            // todo
            sourceReference: null,
            utmCampaign: null,
            utmSource: null,
            utmMedium: null,
            utmContent: null,
            referenceTail: null,
        }),
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
    }

    server(reqest, response => {
        onFulfilled && onFulfilled(response)

        userData.session = JSON.parse(response)

        executeWaitingSessionCallbacks()
    })
}

export const sessionRefresh = waitingSession(() => {
    const request = {
        method: 'patch',
        url: `sessions/${userData.session.id}/refresh`,
    }

    server(request)
})

export const createAction = waitingSession(action => {
    const method = 'POST'
    const body = JSON.stringify({
        sessionId: userData.session.id,
        ...action,
    })
    const headers = {
        'Content-Type': 'application/json;charset=UTF-8',
    }

    if (window.fetch) {
        window
            .fetch(`${defaultApiServer}/api/actions`, {
                method,
                body,
                headers,
                keepalive: true,
            })
            .catch(err => console.error(err))
    } else {
        const request = {
            method,
            url: 'actions',
            body,
            headers,
            async: false,
        }

        server(request)
    }
})
