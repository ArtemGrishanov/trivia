import Remix from '../remix.js'
import store from '../../store'
import { addScreen, addComponent, getProp, setProp } from '../__tests__utils/ui-methods.js'
import { getDiv, setSize } from '../__tests__utils/ui-mocks.js'
import { isCentered, isHere } from '../__tests__utils/ui-checks.js'

Remix.setStore(store)

describe('Remix', () => {
    beforeEach(() => {})

    describe('#height', () => {
        it('should adapt dynamically', done => {
            const container = getDiv()
            Remix.reset()
            Remix.init({
                mode: 'edit',
                container,
                onPostMessage: event => {
                    if (event.method === 'requestSetSize') {
                        setSize(container, event.data.size.width, event.data.size.height)
                    }
                },
            })

            setSize(container, 800, 600)

            expect(Remix.getProperty('app.sessionsize.width')).toEqual(800)
            expect(Remix.getProperty('app.sessionsize.height')).toEqual(600)

            const h = 100
            const screenId = addScreen()
            const componentId = addComponent(screenId, {
                left: 10,
                width: 200,
                top: 50,
                height: h,
            })

            expect(Remix.getProperty('app.sessionsize.width')).toEqual(800)
            expect(Remix.getProperty('app.sessionsize.height')).toEqual(600)

            const newTop = 600
            // сдвигаем компонент в низ экрана и высота приложения должна увеличиться
            setProp(screenId, componentId, 'top', newTop)

            // высота меняется не сразу а асинхронно после вычисления в diff.js
            setTimeout(() => {
                expect(Remix.getProperty('app.sessionsize.width')).toEqual(800)
                expect(Remix.getProperty('app.sessionsize.height')).toEqual(
                    newTop + h + getProp(screenId, componentId, 'szBottom'),
                )

                setProp(screenId, componentId, 'szBottom', 0)
                setTimeout(() => {
                    expect(Remix.getProperty('app.sessionsize.height')).toEqual(newTop + h + 0)
                    done()
                }, 700)
            }, 700)
        })

        it('should switch web/mob', done => {
            const container = getDiv()
            Remix.reset()
            Remix.init({
                mode: 'edit',
                container,
                onPostMessage: event => {
                    if (event.method === 'requestSetSize') {
                        setSize(container, event.data.size.width, event.data.size.height)
                    }
                },
            })

            setSize(container, 800, 600)

            expect(Remix.getProperty('app.sessionsize.width')).toEqual(800)
            expect(Remix.getProperty('app.sessionsize.height')).toEqual(600)

            const h = 100
            const screenId = addScreen()
            const componentId = addComponent(screenId, {
                left: 10,
                width: 200,
                top: 50,
                height: h,
            })

            expect(Remix.getProperty('app.sessionsize.width')).toEqual(800)
            expect(Remix.getProperty('app.sessionsize.height')).toEqual(600)

            setSize(container, 320, 600)
            const newTop = 1000
            // сдвигаем компонент в низ экрана и высота приложения должна увеличиться
            setProp(screenId, componentId, 'top', newTop)

            // высота должна измениться только на мобе
            setTimeout(() => {
                expect(Remix.getProperty('app.sessionsize.width')).toEqual(320)
                expect(Remix.getProperty('app.sessionsize.height')).toEqual(
                    newTop + h + getProp(screenId, componentId, 'szBottom'),
                )

                setSize(container, 800, 600)
                expect(Remix.getProperty('app.sessionsize.width')).toEqual(800)
                expect(Remix.getProperty('app.sessionsize.height')).toEqual(600)

                done()
            }, 700)
        })
    })
})
