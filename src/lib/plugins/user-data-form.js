import { Selector } from '../object-path'

const UPDATE_USER_FORM_SCREEN = 'UPDATE_USER_FORM_SCREEN'
const UPDATE_USER_FORM_DATA = 'UPDATE_USER_FORM_DATA'
const INTERCEPT_CURRENT_SCREEN_CHANGE = 'INTERCEPT_CURRENT_SCREEN_CHANGE'
const USER_FORM_SCREEN_TAG = 'user_form_screen_tag'

/**
 *
 * @param {*} param0
 */
const initUserForm = ({ remix, screenTag = 'question', resultTag = 'result' }) => {
    const USER_DATA_FORM_SELECTOR = `router.[screens HashList]./^[0-9a-z]+$/.components.[/^[0-9a-z]+$/ displayName=UserDataForm].data`

    remix.extendSchema({
        'app.userForm.enable': {
            type: 'boolean',
            default: false,
        },
    })

    const userDataFormSelector = new Selector(USER_DATA_FORM_SELECTOR)
    remix.registerTriggerAction(UPDATE_USER_FORM_DATA, event => {
        const { remix, eventData } = event
        const state = remix.getState()

        // разобраться почему вызывается этот экшен на экранах без тэга USER_FORM_SCREEN_TAG
        if (!state.router.screens[state.router.currentScreenId].tags.includes(USER_FORM_SCREEN_TAG)) {
            return
        }

        let nextScreenId = void 0
        eventData.diff.changed
            .filter(({ path }) => userDataFormSelector.match(path, state))
            .forEach(({ path, value }) => {
                const [, screenId, componentId] = path.match(
                    /router\.screens\.([0-9a-z]{6})\.components\.([0-9a-z]{6})/,
                )

                const formValues = Object.entries(value)
                    .filter(([_, value]) => value !== '')
                    .map(([fieldType, value]) => ({ fieldType, value }))

                if (formValues.length) {
                    remix.postMessage('user-data', { formId: screenId, formValues })

                    nextScreenId = remix.getProperty(`router.screens.${screenId}.data.nextScreenId`)
                    remix.setData({ [`router.screens.${screenId}.data.nextScreenId`]: '' }, void 0, true)
                    remix.setData({ [`router.screens.${screenId}.components.${componentId}.data`]: {} }, void 0, true)
                }
            })

        if (nextScreenId !== void 0 && nextScreenId !== '') {
            remix.setCurrentScreen(nextScreenId)
        }
    })

    remix.registerTriggerAction(UPDATE_USER_FORM_SCREEN, event => {
        const { remix } = event

        const enable = remix.getProperty('app.userForm.enable')
        const userFormScreen = remix.getScreens({ tag: USER_FORM_SCREEN_TAG, includeDisabled: true })[0]

        if (userFormScreen === void 0) {
            const i = remix.getState().router.screens.length - remix.getScreens({ tag: 'result' }).length

            remix.addHashlistElement('router.screens', i, {
                newElement: {
                    backgroundColor: '#777',
                    tags: `${USER_FORM_SCREEN_TAG}`,
                    disabled: !enable,
                },
            })

            const screen = remix.getScreens({ tag: USER_FORM_SCREEN_TAG, includeDisabled: true })[0]

            remix.addScreenComponent(screen.hashlistId, {
                displayName: 'UserDataForm',
                left: 100,
                top: 30,
                width: 480,
                height: 460,
            })
        } else {
            remix.setData({ [`router.screens.${userFormScreen.hashlistId}.disabled`]: !enable })
        }
    })

    // let resultIntercepted = false
    // remix.registerTriggerAction(INTERCEPT_CURRENT_SCREEN_CHANGE, event => {
    //     console.log(INTERCEPT_CURRENT_SCREEN_CHANGE)
    //     const { remix } = event
    //     const { currentScreenId } = remix.getState().router
    //     const resultScreenIds = remix.getScreens({ tag: resultTag }).map(({ hashlistId }) => hashlistId)

    //     if (resultScreenIds.includes(currentScreenId)) {
    //         if (resultIntercepted) {
    //             resultIntercepted = false
    //         } else {
    //             const userFormScreen = remix.getScreens({ tag: USER_FORM_SCREEN_TAG, includeDisabled: true })[0]

    //             if (userFormScreen) {
    //                 resultIntercepted = true
    //                 remix.setData({ 'router.currentScreenId': userFormScreen.hashlistId })
    //             }
    //         }
    //     }
    // })

    remix.addTrigger({
        when: {
            eventType: 'property_updated',
            condition: {
                prop: 'path',
                clause: 'MATCH',
                value: `router.[screens HashList].[/^[0-9a-z]+$/ tags=~${USER_FORM_SCREEN_TAG}].components.[/^[0-9a-z]+$/ displayName=UserDataForm].data`,
            },
        },
        then: { actionType: UPDATE_USER_FORM_DATA },
    })

    remix.addTrigger({
        when: {
            eventType: 'property_updated',
            condition: { prop: 'path', clause: 'EQUALS', value: 'app.userForm.enable' },
        },
        then: { actionType: UPDATE_USER_FORM_SCREEN },
    })

    // remix.addTrigger({
    //     when: {
    //         eventType: 'property_updated',
    //         condition: { prop: 'path', clause: 'EQUALS', value: 'router.currentScreenId' },
    //     },
    //     then: { actionType: INTERCEPT_CURRENT_SCREEN_CHANGE },
    // })
}

export default initUserForm
