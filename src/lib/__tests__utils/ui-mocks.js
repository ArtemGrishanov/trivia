export function getDiv() {
    return {
        getBoundingClientRect: () => {
            return { left: 0, top: 0, width: 800, height: 600 }
        },
        style: {},
    }
}
