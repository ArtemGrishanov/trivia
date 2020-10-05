import Remix from '../remix.js'
import store from '../../store'

import initPopupManager from '../../lib/plugins/popup-manager'

import { addScreen, addTextOption, getTextOption } from '../__tests__utils/ui-methods.js'
import { getDiv } from '../__tests__utils/ui-mocks.js'

Remix.setStore(store)

const waitT = ms => new Promise(resolve => setTimeout(resolve, ms))
const wait = () => waitT(600)
const getPopupIdFromComponentData = (screenId, componentId) => {
    return Remix.getProperty(`router.screens.${screenId}.components.${componentId}.data.popupId`)
}

describe('Remix', () => {
    beforeEach(() => {})

    describe('#popups', () => {
        it('should enable popups', async () => {
            Remix.reset()
            Remix.init({
                mode: 'edit',
                container: getDiv(),
            })

            expect(Remix.getMode()).toEqual('edit')

            initPopupManager({ remix: Remix, settings: { enablePopupsByDefault: false } })

            let popupsIsEnbale = Remix.getProperty('app.popups.enable')
            expect(popupsIsEnbale).toBeFalsy()

            Remix.setData({ 'app.popups.enable': true })
            await wait()

            popupsIsEnbale = Remix.getProperty('app.popups.enable')
            expect(popupsIsEnbale).toBeTruthy()
        })

        it('should init popups', async () => {
            Remix.reset()
            Remix.init({
                mode: 'edit',
                container: getDiv(),
            })

            expect(Remix.getMode()).toEqual('edit')
            expect(Remix.getState().router.screens.toArray()).toHaveLength(0)
            expect(
                !!Remix.getSchema().getDescription('router.screens.dfr324.adaptedui.800.props.73ws92.top'),
            ).toBeTruthy()

            initPopupManager({ remix: Remix, settings: { enablePopupsByDefault: false } })

            const screenId = addScreen()
            expect(typeof screenId === 'string').toBeTruthy()
            expect(Remix.getState().router.screens.toArray()).toHaveLength(1)
            const componentId = addTextOption(screenId)
            expect(typeof componentId === 'string').toBeTruthy()

            await wait()

            let popups = Remix.getProperty(`router.screens.${screenId}.popups`)
            expect(typeof popups === 'object').toBeTruthy()

            expect(popups.toArray()).toHaveLength(0)

            addTextOption(screenId)
            addTextOption(screenId)

            await wait()

            popups = Remix.getProperty(`router.screens.${screenId}.popups`)
            expect(popups.toArray()).toHaveLength(0)

            Remix.setData({ 'app.popups.enable': true })

            await wait()

            popups = Remix.getProperty(`router.screens.${screenId}.popups`)
            expect(popups.toArray()).toHaveLength(3)
        })

        it('should add component with popup', async () => {
            Remix.reset()
            Remix.init({
                mode: 'edit',
                container: getDiv(),
            })

            initPopupManager({ remix: Remix })
            Remix.setData({ 'app.popups.enable': true }, false, false)

            await wait()

            const popupsIsEnbale = Remix.getProperty('app.popups.enable')
            expect(popupsIsEnbale).toBeTruthy()

            const screenId = addScreen()
            expect(typeof screenId === 'string').toBeTruthy()
            expect(Remix.getState().router.screens.toArray()).toHaveLength(1)
            const componentId = addTextOption(screenId)
            expect(typeof componentId === 'string').toBeTruthy()

            await wait()

            let popups = Remix.getProperty(`router.screens.${screenId}.popups`)
            expect(typeof popups === 'object').toBeTruthy()

            expect(popups.toArray()).toHaveLength(1)

            const componentId2 = addTextOption(screenId)
            const componentId3 = addTextOption(screenId)

            await wait()

            popups = Remix.getProperty(`router.screens.${screenId}.popups`)
            expect(popups.toArray()).toHaveLength(3)

            expect(popups[getPopupIdFromComponentData(screenId, componentId)].displayName).toBe('Popup')
            expect(popups[getPopupIdFromComponentData(screenId, componentId2)].displayName).toBe('Popup')
            expect(popups[getPopupIdFromComponentData(screenId, componentId3)].displayName).toBe('Popup')
        })

        it('should add screen and create popups for its', async () => {
            Remix.reset()
            Remix.init({
                mode: 'edit',
                container: getDiv(),
            })

            initPopupManager({ remix: Remix })
            Remix.setData({ 'app.popups.enable': true }, false, false)

            await wait()

            const screenId = addScreen([getTextOption(), getTextOption(), getTextOption(), getTextOption()])
            await wait()
            const components = Remix.getProperty(`router.screens.${screenId}.components`)
            expect(components.toArray()).toHaveLength(4)
            let popups = Remix.getProperty(`router.screens.${screenId}.popups`)
            expect(popups.toArray()).toHaveLength(4)

            components.toArray().forEach(({ hashlistId }) => {
                expect(popups[getPopupIdFromComponentData(screenId, hashlistId)].displayName).toBe('Popup')
            })
        })

        it('should clone screen with popups', async () => {
            Remix.reset()
            Remix.init({
                mode: 'edit',
                container: getDiv(),
            })

            initPopupManager({ remix: Remix })
            Remix.setData({ 'app.popups.enable': true }, false, false)

            await wait()
            const screenId = addScreen([getTextOption(), getTextOption(), getTextOption(), getTextOption()])

            Remix.cloneHashlistElement('router.screens', screenId)

            await wait()

            const cloneScreenId = Remix.getProperty('router.screens').getLast().hashlistId
            expect(typeof cloneScreenId === 'string').toBeTruthy()

            const components = Remix.getProperty(`router.screens.${cloneScreenId}.components`)
            expect(components.toArray()).toHaveLength(4)
            let popups = Remix.getProperty(`router.screens.${cloneScreenId}.popups`)
            expect(popups.toArray()).toHaveLength(4)

            components.toArray().forEach(({ hashlistId }) => {
                expect(popups[getPopupIdFromComponentData(cloneScreenId, hashlistId)].displayName).toBe('Popup')
            })
        })

        it('should delete component with popup', async () => {
            Remix.reset()
            Remix.init({
                mode: 'edit',
                container: getDiv(),
            })

            initPopupManager({ remix: Remix, settings: { enablePopupsByDefault: true } })
            Remix.setData({ 'app.popups.enable': true }, false, false)

            await wait()

            const screenId = addScreen([getTextOption(), getTextOption(), getTextOption(), getTextOption()])

            await wait()

            let popups = Remix.getProperty(`router.screens.${screenId}.popups`)
            expect(popups.toArray()).toHaveLength(4)

            const components = Remix.getProperty(`router.screens.${screenId}.components`).toArray()

            for (const [{ hashlistId }, i] of components.map((obj, i) => [obj, i])) {
                Remix.deleteHashlistElement(`router.screens.${screenId}.components`, { elementId: hashlistId })

                await wait()

                popups = Remix.getProperty(`router.screens.${screenId}.popups`)
                expect(popups.toArray()).toHaveLength(components.length - i)
            }
        })
    })
})

jest.setTimeout(1000 * 60 * 2)
