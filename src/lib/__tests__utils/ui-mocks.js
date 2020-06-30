export function getDiv() {
    return {
        _rect: {
            left: 0,
            top: 0,
            width: 800,
            height: 600,
        },
        setWidth: function (w) {
            this._rect.width = w
        },
        setHeight: function (h) {
            this._rect.height = h
        },
        getBoundingClientRect: function () {
            return this._rect
        },
        style: {},
    }
}

export function setSize(container, width = 800, height = 600) {
    if (width) container.setWidth(width)
    if (height) container.setHeight(height)
    Remix._receiveMessage({
        data: {
            method: 'set_remix_container_size',
            size: { width, height },
        },
    })
}
