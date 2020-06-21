import Remix from '../remix.js'
import store from '../../store'
import { addScreen, addComponent } from '../__tests__utils/ui-methods.js'
import { getDiv, setSize } from '../__tests__utils/ui-mocks.js'

Remix.setStore(store)

describe('Remix', () => {
    beforeEach(() => {})

    describe('#conditional_properties', () => {
        it('should set and save conditional property', () => {
            Remix.init({
                mode: 'edit',
                container: getDiv(),
            })

            expect(Remix.getMode()).toEqual('edit')
            expect(Remix.getState().router.screens.toArray()).toHaveLength(0)
            expect(
                !!Remix.getSchema().getDescription('router.screens.dfr324.adaptedui.800.props.73ws92.top'),
            ).toBeTruthy()

            const screenId = addScreen()
            expect(typeof screenId === 'string').toBeTruthy()
            expect(Remix.getState().router.screens.toArray()).toHaveLength(1)

            const componentId = addComponent(screenId)
            expect(typeof componentId === 'string').toBeTruthy()

            Remix.setData({ [`app.sessionsize.width`]: 800 }, false, true)
            Remix.setData({ [`router.screens.${screenId}.components.${componentId}.left`]: 200 }, false, true)

            expect(Remix.getProperty(`router.screens.${screenId}.components.${componentId}.left`)).toEqual(200)
            expect(Remix.getProperty(`router.screens.${screenId}.adaptedui.800.props.${componentId}.left`)).toEqual(200)
        })

        it('should launch auto adaptation for master property first time', () => {
            const container = getDiv()
            Remix.init({
                mode: 'edit',
                container,
            })

            // прямое изменение app.sessionsize.width не вызовет расчета адаптации (Remix.setData({ [`app.sessionsize.width`]: 800 }, false, true))
            setSize(container, 800, 600)
            expect(Remix.getProperty(`app.sessionsize.width`)).toEqual(800)

            const screenId = addScreen()
            const componentId = addComponent(screenId)
            expect(Remix.getState().router.screens.toArray()).toHaveLength(1)

            Remix.setData({ [`router.screens.${screenId}.components.${componentId}.left`]: 100 }, false, true)
            expect(Remix.getProperty(`router.screens.${screenId}.adaptedui.800.props.${componentId}.left`)).toEqual(100)

            setSize(container, 320, 600) // запустится адаптация
            expect(Remix.getProperty(`app.sessionsize.width`)).toEqual(320)
            // при сохранении нового значения мастер свойства должна запуститься адаптация для геометрических свойств интерфейса
            const actualLeft = Remix.getProperty(`router.screens.${screenId}.components.${componentId}.left`)
            const adaptedLeft = Remix.getProperty(`router.screens.${screenId}.adaptedui.320.props.${componentId}.left`)

            expect(typeof adaptedLeft === 'number').toBeTruthy()
            expect(actualLeft).toEqual(actualLeft)
            // left должно сдвинуться слево так как ширина приложения уменьшилась
            expect(0 < adaptedLeft && adaptedLeft < 100).toBeTruthy()

            // пользователь редактирует условное свойство впервые, устанавливает свои кастомные значения
            Remix.setData({ [`router.screens.${screenId}.components.${componentId}.left`]: 99 }, false, true)
            expect(Remix.getProperty(`router.screens.${screenId}.components.${componentId}.left`)).toEqual(99)
            expect(Remix.getProperty(`router.screens.${screenId}.adaptedui.320.props.${componentId}.left`)).toEqual(99)
            expect(Remix.getProperty(`router.screens.${screenId}.adaptedui.800.props.${componentId}.left`)).toEqual(100)

            // переключить обратно на 800 и посмотреть значения
            debugger
            setSize(container, 800, 600)
            expect(Remix.getProperty(`router.screens.${screenId}.components.${componentId}.left`)).toEqual(100)
            expect(Remix.getProperty(`router.screens.${screenId}.adaptedui.320.props.${componentId}.left`)).toEqual(99)
            expect(Remix.getProperty(`router.screens.${screenId}.adaptedui.800.props.${componentId}.left`)).toEqual(100)

            // переключить обратно на 320 и посмотреть 99: не было запущено адаптации
            setSize(container, 320, 600)
            expect(Remix.getProperty(`router.screens.${screenId}.components.${componentId}.left`)).toEqual(99)
            expect(Remix.getProperty(`router.screens.${screenId}.adaptedui.320.props.${componentId}.left`)).toEqual(99)
            expect(Remix.getProperty(`router.screens.${screenId}.adaptedui.800.props.${componentId}.left`)).toEqual(100)
        })

        it('', () => {
            // условные свойства без адаптации и других сложностей
            // safeZone
        })

        // переключать по адаптациям и посмотреть какой выбран был ключ
    })
})
