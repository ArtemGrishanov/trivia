const ENGAGEMENT_SCREENS = 'ENGAGEMENT_SCREENS'
const ENGAGEMENT_START_SCREEN = 'ENGAGEMENT_START_SCREEN'
const TEST_STARTED = 'TEST_STARTED'
const TEST_ENDED = 'TEST_ENDED'
const TEST_QUESTION_STARTED = 'TEST_QUESTION_STARTED'
const TEST_QUESTION_ANSWERED = 'TEST_QUESTION_ANSWERED'
const TEST_RESULT_SHARED = 'TEST_RESULT_SHARED'
const SOCIAL_SHARE = 'SOCIAL_SHARE'
const TEST_RESULT_DOWNLOAD = 'TEST_RESULT_DOWNLOAD'
const PASS_TEST_AGAIN_CLICKED = 'PASS_TEST_AGAIN_CLICKED'
const LOGO_CLICK = 'LOGO_CLICK'
const SHARED_BY = 'SHARED_BY'

const initQuizAnalytics = ({
    remix,
    startScreenTag = 'start',
    startBtnTag = 'coverStartBtn',
    resultScreenTag = 'result',
    questionScreenTag = 'question',
    answerBtnTag = 'question option',
    restartBtnTag = 'restart',
    shareBtnTag = 'share',
    socialShareBtnTag = 'socialShare',
    logoImgTag = 'logo',
}) => {
    if (!remix) {
        console.error(`remix is: ${remix}`)
    }

    let startTime = 0
    let startQustionTime = 0
    let rightQuestionCount = 0

    const secPassed = ms => Math.round((Date.now() - ms) / 1000)

    remix.registerTriggerAction(LOGO_CLICK, event => {
        event.remix.postMessage('analytics', {
            type: 'conversion',
            actionType: 'logo_click',
        })
    })

    remix.registerTriggerAction(ENGAGEMENT_START_SCREEN, event => {
        const state = event.remix.getState()
        const { currentScreenId, screens } = state.router

        if (screens[currentScreenId] === void 0 || screens[currentScreenId].tags.indexOf(startScreenTag) === -1) return

        event.remix.postMessage('analytics', {
            type: 'engagement',
            actionType: 'screens',
            engagement: 0,
        })
    })

    remix.registerTriggerAction(TEST_STARTED, event => {
        startTime = Date.now()

        event.remix.postMessage('analytics', {
            type: 'standard',
            actionType: 'test_started',
        })
        event.remix.postMessage('analytics', {
            type: 'conversion',
            actionType: 'test_started',
        })
    })

    remix.registerTriggerAction(ENGAGEMENT_SCREENS, event => {
        const state = event.remix.getState()
        const { screens, currentScreenId } = state.router
        const taggedScreens = screens.filter(({ tags }) => tags.indexOf(questionScreenTag) !== -1)

        const current = taggedScreens.getIndex(currentScreenId) + 1
        if (!current) return
        const total = taggedScreens.length

        event.remix.postMessage('analytics', {
            type: 'engagement',
            actionType: 'screens',
            engagement: current / (total + 1),
        })

        const questionId = currentScreenId
        startQustionTime = Date.now()

        event.remix.postMessage('analytics', {
            type: 'test_question_started',
            actionType: 'test_question_started',
            questionId,
        })
        event.remix.postMessage('analytics', {
            type: 'conversion',
            actionType: 'test_question_started',
        })
    })

    remix.registerTriggerAction(TEST_QUESTION_ANSWERED, event => {
        const questionId = event.remix.getState().router.currentScreenId
        const answerId = event.eventData.hashlistId || event.eventData.id
        const isRightAnswer = !!event.eventData.data.points
        const timePassing = secPassed(startQustionTime)

        if (isRightAnswer) ++rightQuestionCount

        event.remix.postMessage('analytics', {
            type: 'test_question_answered',
            actionType: 'test_question_answered',
            questionId,
            answerId,
            isRightAnswer,
            timePassing,
        })
        event.remix.postMessage('analytics', {
            type: 'conversion',
            actionType: 'test_question_answered',
        })
    })

    remix.registerTriggerAction(TEST_ENDED, event => {
        const resultId = event.remix.getState().router.currentScreenId
        const timePassing = secPassed(startTime)

        event.remix.postMessage('analytics', {
            type: 'engagement',
            actionType: 'screens',
            engagement: 1,
        })
        event.remix.postMessage('analytics', {
            type: 'test_ended',
            actionType: 'test_ended',
            // resultId, todo
            timePassing,
            rightQuestionCount,
        })
        rightQuestionCount = 0
        event.remix.postMessage('analytics', {
            type: 'conversion',
            actionType: 'test_ended',
        })
    })

    remix.registerTriggerAction(PASS_TEST_AGAIN_CLICKED, event => {
        event.remix.postMessage('analytics', {
            type: 'conversion',
            actionType: 'pass_test_again_clicked',
        })
        event.remix.postMessage('analytics', {
            type: 'standard',
            actionType: 'pass_test_again_clicked',
        })
    })

    remix.registerTriggerAction(TEST_RESULT_SHARED, event => {
        event.remix.postMessage('analytics', {
            type: 'standard',
            actionType: 'test_result_shared',
        })
        event.remix.postMessage('analytics', {
            type: 'conversion',
            actionType: 'test_result_shared',
        })
    })

    remix.registerTriggerAction(SOCIAL_SHARE, event => {
        event.remix.postMessage('analytics', {
            type: 'conversion',
            actionType: 'social_share',
        })
    })

    remix.registerTriggerAction(SHARED_BY, event => {
        event.remix.postMessage('analytics', {
            type: 'standard',
            actionType: `shared_by_${event.eventData.socialName}`,
        })
    })

    remix.addTrigger({
        when: {
            eventType: 'property_updated',
            condition: { prop: 'path', clause: 'EQUALS', value: 'router.currentScreenId' },
        },
        then: { actionType: ENGAGEMENT_START_SCREEN },
    })

    remix.addTrigger({
        when: {
            eventType: 'onclick',
            condition: { prop: 'tags', clause: 'CONTAINS', value: startBtnTag },
        },
        then: { actionType: TEST_STARTED },
    })

    remix.addTrigger({
        when: {
            eventType: 'remix-routing:next_screen',
            condition: { prop: 'tags', clause: 'CONTAINS', value: questionScreenTag },
        },
        then: { actionType: ENGAGEMENT_SCREENS },
    })

    remix.addTrigger({
        when: {
            eventType: 'onclick',
            condition: { prop: 'tags', clause: 'CONTAINS', value: answerBtnTag },
        },
        then: { actionType: TEST_QUESTION_ANSWERED },
    })

    remix.addTrigger({
        when: {
            eventType: 'remix-routing:next_screen',
            condition: { prop: 'tags', clause: 'CONTAINS', value: resultScreenTag },
        },
        then: { actionType: TEST_ENDED },
    })

    remix.addTrigger({
        when: {
            eventType: 'onclick',
            condition: { prop: 'tags', clause: 'CONTAINS', value: restartBtnTag },
        },
        then: { actionType: PASS_TEST_AGAIN_CLICKED },
    })

    remix.addTrigger({
        when: {
            eventType: 'onclick',
            condition: { prop: 'tags', clause: 'CONTAINS', value: shareBtnTag },
        },
        then: { actionType: TEST_RESULT_SHARED },
    })

    remix.addTrigger({
        when: {
            eventType: 'onclick',
            condition: { prop: 'tags', clause: 'CONTAINS', value: socialShareBtnTag },
        },
        then: { actionType: SOCIAL_SHARE },
    })

    remix.addTrigger({
        when: {
            eventType: 'onclick',
            condition: { prop: 'socialName', clause: 'EXISTS' },
        },
        then: { actionType: SHARED_BY },
    })
}

export default initQuizAnalytics
