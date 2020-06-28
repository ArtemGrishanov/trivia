import Remix from '../remix.js'
import store from '../../store'
import { addScreen, addComponent, getProp, setProp } from '../__tests__utils/ui-methods.js'
import { getDiv, setSize } from '../__tests__utils/ui-mocks.js'
import { isCentered, isHere } from '../__tests__utils/ui-checks.js'

Remix.setStore(store)

describe('Remix', () => {
    beforeEach(() => {})

    describe('#adaptation', () => {
        it('should adapt one component on less width', () => {
            const container = getDiv()
            Remix.reset()
            Remix.init({
                mode: 'edit',
                container,
            })

            setSize(container, 800, 600)
            const screenId = addScreen()
            const componentId = addComponent(screenId)
            setProp(screenId, componentId, 'left', 100)
            setProp(screenId, componentId, 'width', 600)

            setSize(container, 320, 600)
            const l_320 = getProp(screenId, componentId, 'left')
            const w_320 = getProp(screenId, componentId, 'width')
            expect(l_320 < 100).toEqual(true)
            expect(w_320 < 600).toEqual(true)
            // что компонент не вышел за пределы экрана
            expect(isHere(320, screenId, componentId)).toBeTruthy()
            // также проверим что компонент остался выровненным по центру как и изначально
            expect(isCentered(320, screenId, componentId)).toBeTruthy()
        })

        it('should adapt one component on bigger width', () => {
            const container = getDiv()
            Remix.reset()
            Remix.init({
                mode: 'edit',
                container,
            })

            setSize(container, 800, 600)
            const screenId = addScreen()
            const componentId = addComponent(screenId)
            expect(getProp(screenId, componentId, 'leftStrategy')).toEqual('dynamic')
            expect(getProp(screenId, componentId, 'widthStrategy')).toEqual('fixed')

            setProp(screenId, componentId, 'left', 100)
            setProp(screenId, componentId, 'width', 600)

            setSize(container, 1200, 600)
            const l_1200 = getProp(screenId, componentId, 'left')
            const w_1200 = getProp(screenId, componentId, 'width')

            expect(l_1200 > 100).toBeTruthy()
            expect(w_1200 === 600).toBeTruthy()
            // что компонент не вышел за пределы экрана
            expect(isHere(1200, screenId, componentId)).toBeTruthy()
            // также проверим что компонент остался выровненным по центру как и изначально
            expect(isCentered(1200, screenId, componentId)).toBeTruthy()
        })

        it('should break component rows', () => {
            const container = getDiv()
            Remix.reset()
            Remix.init({
                mode: 'edit',
                container,
            })

            setSize(container, 800, 600)

            // добавим два компонента в ряд
            const screenId = addScreen()
            const componentId = addComponent(screenId, { left: 100, width: 300, top: 30, height: 40 })
            const componentId2 = addComponent(screenId, { left: 500, width: 200, top: 30, height: 40 })

            setSize(container, 320, 600)
            const l_320 = getProp(screenId, componentId, 'left')
            const w_320 = getProp(screenId, componentId, 'width')
            const t_320 = getProp(screenId, componentId, 'top')
            expect(l_320 < 100).toBeTruthy()
            expect(w_320 === 300).toBeTruthy()
            expect(t_320 === 30).toBeTruthy()
            expect(isHere(320, screenId, componentId)).toBeTruthy()
            expect(isCentered(320, screenId, componentId)).toBeTruthy()

            const l2_320 = getProp(screenId, componentId2, 'left')
            const w2_320 = getProp(screenId, componentId2, 'width')
            const t2_320 = getProp(screenId, componentId2, 'top')
            expect(l2_320 < 100).toBeTruthy()
            expect(w2_320 === 200).toBeTruthy()
            expect(t2_320 > 30 + 40).toBeTruthy() // компонент опустился в новый ряд, так как не уместился по одном уровне с первым компонентом
            expect(isHere(320, screenId, componentId)).toBeTruthy()
            expect(isCentered(320, screenId, componentId)).toBeTruthy()
        })

        //TTODO height enlarge test
    })
})
