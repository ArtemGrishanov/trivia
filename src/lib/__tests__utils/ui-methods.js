export function addScreen() {
    Remix.addHashlistElement('router.screens', undefined, {
        newElement: { backgroundColor: '#000', tags: 'screen test jest' },
    })
    return Remix.getState().router.screens.getLast().hashlistId
}

export function addComponent(screenId) {
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
        },
    })
    return Remix.getState().router.screens[screenId].components.getLast().hashlistId
}
