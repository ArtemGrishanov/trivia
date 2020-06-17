import Remix from '../remix.js'
import store from '../../store'
import { addScreen, addComponent } from '../__tests__utils/ui-methods.js'
import { getDiv } from '../__tests__utils/ui-mocks.js'

Remix.setStore(store)

describe('Remix', () => {
    beforeEach(() => {})
    describe('#conditional_properties', () => {
        it('should set and save conditional property', () => {
            Remix.init({
                mode: 'edit',
                container: getDiv(),
            })

            expect(Remix.getState().router.screens.toArray()).toHaveLength(0)

            const screenId = addScreen()
            expect(typeof screenId === 'string').toBeTruthy()

            const componentId = addComponent(screenId)
            expect(typeof componentId === 'string').toBeTruthy()

            Remix.setData({ [`session.size.width`]: 800 }, false, true)

            Remix.setData({ [`router.screens.${screenId}.components.${componentId}.left`]: 200 }, false, true)

            expect(`router.screens.${screenId}.components.${componentId}.left`).toEqual(200)
            expect(`router.screens.${screenId}.__c.800.${componentId}.left`).toEqual(200)
        })
    })
})
