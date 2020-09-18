import HashList from '../hashlist'

export function addScreen(components) {
    if (Array.isArray(components) && components.length) {
        components = new HashList(components)
    } else {
        components = void 0
    }

    Remix.addHashlistElement('router.screens', undefined, {
        newElement: { backgroundColor: '#000', tags: 'screen test jest', components },
    })
    return Remix.getState().router.screens.getLast().hashlistId
}

export function addComponent(screenId, props = {}) {
    Remix.addHashlistElement(`router.screens.${screenId}.components`, undefined, {
        newElement: {
            displayName: 'Text',
            fontSize: 24,
            color: '#C7A667',
            tags: 'text test jest',
            width: 70,
            left: 15,
            top: 120,
            text: 'Sample text',
            ...props,
        },
    })
    return Remix.getState().router.screens[screenId].components.getLast().hashlistId
}

export const getTextOption = () => ({
    text: 'Option',
    correctIndicator: 'none',
    blur: false,
    grayscale: false,
    textAlign: 'left',
    align: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d8d8d8',
    dropShadow: false,
    backgroundColor: '#FFFFFF',
    imageSrc: '',
    id: 'none',
    tags: 'question option',
    displayName: 'TextOption',
    width: 193,
    widthStrategy: 'fixed',
    height: 81,
    left: 64,
    leftStrategy: 'dynamic',
    top: 456,
    szLeft: 10,
    szRight: 10,
    szTop: 10,
    szBottom: 10,
    displayType: 'flow',
    data: { nextScreenId: '' },
})

export const addTextOption = (screenId, props = {}) => {
    Remix.addHashlistElement(`router.screens.${screenId}.components`, undefined, {
        newElement: {
            ...getTextOption(),
            ...props,
        },
    })

    return Remix.getState().router.screens[screenId].components.getLast().hashlistId
}

export function getProp(screenId, componentId, propName, masterKey = undefined) {
    if (masterKey === undefined) {
        return Remix.getProperty(`router.screens.${screenId}.components.${componentId}.${propName}`)
    }
    return Remix.getProperty(`router.screens.${screenId}.adaptedui.${masterKey}.props.${componentId}.${propName}`)
}

export function setProp(screenId, componentId, propName, v) {
    Remix.setData({ [`router.screens.${screenId}.components.${componentId}.${propName}`]: v }, false, true)
}
