import Remix from '../remix.js'
import store from '../../store'
import { addScreen, addComponent, getProp } from '../__tests__utils/ui-methods.js'
import { getDiv, setSize } from '../__tests__utils/ui-mocks.js'

Remix.setStore(store)

describe('Remix', () => {
    beforeEach(() => {})

    describe('#conditional_properties', () => {
        it('should set and save conditional property', () => {
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
            Remix.reset()
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

        it('should select nearest key for safe zone properties', () => {
            const container = getDiv()
            Remix.reset()
            Remix.init({
                mode: 'edit',
                container,
            })

            const screenId = addScreen()
            const componentId = addComponent(screenId)

            // не ставит размер так как уже ровняется ширина 800
            setSize(container, 800, 600)
            expect(Remix.getProperty(`router.screens.${screenId}.components.${componentId}.szLeft`)).toEqual(10)
            // при добавлении нового компонента свойство сохраняется в условные сразу же при текущем мастер свойстве
            expect(Remix.getProperty(`router.screens.${screenId}.adaptedui.800.props.${componentId}.szLeft`)).toEqual(
                10,
            )

            Remix.setData({ [`router.screens.${screenId}.components.${componentId}.szLeft`]: 1 }, false, true)
            expect(Remix.getProperty(`router.screens.${screenId}.components.${componentId}.szLeft`)).toEqual(1)
            expect(Remix.getProperty(`router.screens.${screenId}.adaptedui.800.props.${componentId}.szLeft`)).toEqual(1)

            setSize(container, 320, 600)
            Remix.setData({ [`router.screens.${screenId}.components.${componentId}.szLeft`]: 2 }, false, true)
            expect(Remix.getProperty(`router.screens.${screenId}.components.${componentId}.szLeft`)).toEqual(2)
            expect(Remix.getProperty(`router.screens.${screenId}.adaptedui.320.props.${componentId}.szLeft`)).toEqual(2)
            expect(Remix.getProperty(`router.screens.${screenId}.adaptedui.800.props.${componentId}.szLeft`)).toEqual(1)

            setSize(container, 500, 600)
            // был выбран ключ 320
            expect(Remix.getProperty(`router.screens.${screenId}.components.${componentId}.szLeft`)).toEqual(2)
            expect(Remix.getProperty(`router.screens.${screenId}.adaptedui.320.props.${componentId}.szLeft`)).toEqual(2)
            expect(Remix.getProperty(`router.screens.${screenId}.adaptedui.500.props.${componentId}.szLeft`)).toEqual(
                undefined,
            )
            expect(Remix.getProperty(`router.screens.${screenId}.adaptedui.800.props.${componentId}.szLeft`)).toEqual(1)

            setSize(container, 700, 600)
            // был выбран ключ 320
            expect(Remix.getProperty(`router.screens.${screenId}.components.${componentId}.szLeft`)).toEqual(2)
            expect(Remix.getProperty(`router.screens.${screenId}.adaptedui.320.props.${componentId}.szLeft`)).toEqual(2)
            expect(Remix.getProperty(`router.screens.${screenId}.adaptedui.700.props.${componentId}.szLeft`)).toEqual(
                undefined,
            )
            expect(Remix.getProperty(`router.screens.${screenId}.adaptedui.800.props.${componentId}.szLeft`)).toEqual(1)

            setSize(container, 790, 600)
            // был выбран ключ 800
            expect(Remix.getProperty(`router.screens.${screenId}.components.${componentId}.szLeft`)).toEqual(1)
            expect(Remix.getProperty(`router.screens.${screenId}.adaptedui.320.props.${componentId}.szLeft`)).toEqual(2)
            expect(Remix.getProperty(`router.screens.${screenId}.adaptedui.790.props.${componentId}.szLeft`)).toEqual(
                undefined,
            )
            expect(Remix.getProperty(`router.screens.${screenId}.adaptedui.800.props.${componentId}.szLeft`)).toEqual(1)
        })

        it('serialization', () => {
            const container = getDiv()
            Remix.reset()
            Remix.init({
                mode: 'edit',
                container,
            })

            // прямое изменение app.sessionsize.width не вызовет расчета адаптации (Remix.setData({ [`app.sessionsize.width`]: 800 }, false, true))
            setSize(container, 800, 600)
            expect(Remix.getProperty(`app.sessionsize.width`)).toEqual(800)

            const screenId = addScreen()
            const componentId = addComponent(screenId)

            setSize(container, 800, 600)
            expect(Remix.getProperty(`router.screens.${screenId}.components.${componentId}.szLeft`)).toEqual(10)
            expect(Remix.getProperty(`router.screens.${screenId}.adaptedui.800.props.${componentId}.szLeft`)).toEqual(
                10,
            )

            setSize(container, 320, 600)
            Remix.setData({ [`router.screens.${screenId}.components.${componentId}.szLeft`]: 1 }, false, true)
            expect(Remix.getProperty(`router.screens.${screenId}.components.${componentId}.szLeft`)).toEqual(1)
            expect(Remix.getProperty(`router.screens.${screenId}.adaptedui.320.props.${componentId}.szLeft`)).toEqual(1)

            const serData = Remix.serialize2()

            Remix.reset()
            expect(Remix.getState().router.screens.toArray()).toHaveLength(0)
            Remix.init({
                mode: 'edit',
                container,
                defaultProperties: serData,
            })
            // размеры контейнера 320 были установлены последний раз
            expect(Remix.getProperty(`app.sessionsize.width`)).toEqual(320)
            expect(Remix.getProperty(`router.screens.${screenId}.components.${componentId}.szLeft`)).toEqual(1)
            expect(Remix.getProperty(`router.screens.${screenId}.adaptedui.800.props.${componentId}.szLeft`)).toEqual(
                10,
            )
            expect(Remix.getProperty(`router.screens.${screenId}.adaptedui.320.props.${componentId}.szLeft`)).toEqual(1)

            setSize(container, 800, 600)
            expect(Remix.getProperty(`router.screens.${screenId}.components.${componentId}.szLeft`)).toEqual(10)
            expect(Remix.getProperty(`router.screens.${screenId}.adaptedui.800.props.${componentId}.szLeft`)).toEqual(
                10,
            )
            expect(Remix.getProperty(`router.screens.${screenId}.adaptedui.320.props.${componentId}.szLeft`)).toEqual(1)

            setSize(container, 500, 600)
            Remix.reset()
            Remix.init({
                mode: 'edit',
                container,
                defaultProperties: serData,
            })
            expect(Remix.getProperty(`app.sessionsize.width`)).toEqual(500)
            expect(Remix.getProperty(`router.screens.${screenId}.components.${componentId}.szLeft`)).toEqual(1)
            expect(Remix.getProperty(`router.screens.${screenId}.adaptedui.800.props.${componentId}.szLeft`)).toEqual(
                10,
            )
            expect(Remix.getProperty(`router.screens.${screenId}.adaptedui.320.props.${componentId}.szLeft`)).toEqual(1)

            // 7)
            // // to other test case
            // set `router.screens.${screenId}.components.${componentId}.top` = 1000
            // // check if app height updated
            // 8)
            // add new component later
        })

        it('add components under custom width', () => {
            const container = getDiv()
            Remix.reset()
            Remix.init({
                mode: 'edit',
                container,
            })

            setSize(container, 800, 600)
            const screenId = addScreen()
            const componentId = addComponent(screenId)
            Remix.setData({ [`router.screens.${screenId}.components.${componentId}.left`]: 55 }, false, true)

            expect(getProp(screenId, componentId, 'left')).toEqual(55)
            expect(getProp(screenId, componentId, 'left', 800)).toEqual(55)
            expect(getProp(screenId, componentId, 'szLeft')).toEqual(10)
            expect(getProp(screenId, componentId, 'szLeft', 800)).toEqual(10)

            debugger
            setSize(container, 320, 600)
            expect(getProp(screenId, componentId, 'left') < 55).toEqual(true) // произошла адаптация и left сместился
            const component_adapted_left = Remix.getProperty(
                `router.screens.${screenId}.components.${componentId}.left`,
            )
            expect(getProp(screenId, componentId, 'left', 800)).toEqual(55)
            expect(getProp(screenId, componentId, 'left', 320)).toEqual(component_adapted_left)
            expect(getProp(screenId, componentId, 'szLeft')).toEqual(10) // это не адаптируется, просто условное свойство
            expect(getProp(screenId, componentId, 'szLeft', 800)).toEqual(10)
            expect(getProp(screenId, componentId, 'szLeft', 320)).toEqual(undefined) // адаптации не было, и намеренно не ставили свойство это. Значит пока undefined

            const screenId2 = addScreen()
            const componentId2 = addComponent(screenId2)
            Remix.setData({ [`router.screens.${screenId2}.components.${componentId2}.left`]: 44 }, false, true)

            expect(getProp(screenId2, componentId2, 'left')).toEqual(44)
            expect(getProp(screenId2, componentId2, 'left', 320)).toEqual(44)
            expect(getProp(screenId2, componentId2, 'szLeft')).toEqual(10)
            expect(getProp(screenId2, componentId2, 'szLeft', 320)).toEqual(10)

            setSize(container, 800, 600)
            // первый компонент - все как и раньше ничего не меняли
            expect(getProp(screenId, componentId, 'left')).toEqual(55)
            expect(getProp(screenId, componentId, 'left', 800)).toEqual(55)
            expect(getProp(screenId, componentId, 'left', 320)).toEqual(component_adapted_left)
            expect(getProp(screenId, componentId, 'szLeft')).toEqual(10)
            expect(getProp(screenId, componentId, 'szLeft', 800)).toEqual(10)
            expect(getProp(screenId, componentId, 'szLeft', 320)).toEqual(undefined)
            // второй компонент
            expect(getProp(screenId2, componentId2, 'left')).toEqual(44)
            expect(getProp(screenId2, componentId2, 'left', 320)).toEqual(44)
            expect(getProp(screenId2, componentId2, 'left', 800)).toEqual(undefined) // никогда не ставили на этой ширине экрана
            expect(getProp(screenId2, componentId2, 'szLeft')).toEqual(10)
            expect(getProp(screenId2, componentId2, 'szLeft', 320)).toEqual(10)
            expect(getProp(screenId2, componentId2, 'szLeft', 800)).toEqual(undefined)
        })
    })
})
