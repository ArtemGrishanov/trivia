import React from 'react'
import RemixWrapper from './RemixWrapper'
import DataSchema from '../schema'
import HashList from '../hashlist'
import Screen from './Screen'
import Popup from './Popup'
import { removeUnnecessaryItemsFromScreen, debounce } from '../remix/util/util'

let refs = {}
let popupRefs = {}
let popupIdToScreenId = {}

/**
 *
 */
class Router extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            prevScreenId: null,
            showPrevScreen: false,
            transition: false,
            scrLeft: 0,
            opacityScr: 1,
            opacityScrPrev: 0,
            visibilityScr: 'visible',
            visibilityScrPrev: 'hidden',
        }
        this.prevMarkUpList = {}
        this.prevPopupMarkUpList = {}
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.mode === 'edit') {
            // no any transition effect in 'edit' mode
            if (prevProps.currentScreenId && this.props.currentScreenId !== prevProps.currentScreenId) {
                this.setState({ prevScreenId: prevProps.currentScreenId })
            }
            this.renderStaticMarkup()
            this.renderStaticPopupMarkup()
        } else {
            if (prevProps.currentScreenId && this.props.currentScreenId !== prevProps.currentScreenId) {
                if (this.props.switchEffect === 'moveleft') {
                    this.setState({
                        prevScreenId: prevProps.currentScreenId,
                        scrLeft: 999,
                        transition: false,
                        showPrevScreen: true,
                    })
                    setTimeout(() => {
                        this.setState({
                            scrLeft: 0,
                            transition: true,
                        })
                    }, 0)
                    setTimeout(() => {
                        this.setState({
                            showPrevScreen: false,
                        })
                    }, 501) // .rmx-scr_container_item.__transition delay
                }
                if (this.props.switchEffect === 'fadein') {
                    console.log('toggle fade in!')
                    this.setState({
                        prevScreenId: prevProps.currentScreenId,
                        showPrevScreen: true,
                        transition: false,
                        opacityScr: 0,
                        visibilityScr: 'hidden',
                        opacityScrPrev: 1,
                        visibilityScrPrev: 'visible',
                    })
                    setTimeout(() => {
                        this.setState({
                            transition: true,
                            opacityScr: 1,
                            visibilityScr: 'visible',
                            opacityScrPrev: 0,
                            visibilityScrPrev: 'hidden',
                        })
                    }, 0)
                    setTimeout(() => {
                        this.setState({
                            showPrevScreen: false,
                        })
                    }, 651)
                }
            }
        }
    }

    resetPrevMarkUpList() {
        const refKeys = Object.keys(refs)
        const prevMarkUpListKeys = Object.keys(this.prevMarkUpList)
        if (prevMarkUpListKeys.length > refKeys.length) {
            const prevMarkUpListTmp = {}
            refKeys.forEach(k => (prevMarkUpListTmp[k] = this.prevMarkUpList[k]))
            this.prevMarkUpList = prevMarkUpListTmp
        }
    }

    renderStaticMarkup = debounce(() => {
        this.resetPrevMarkUpList()
        const markupData = {}
        Object.keys(refs).forEach(screenId => {
            if (refs[screenId].current) {
                if (!this.prevMarkUpList[screenId]) {
                    this.prevMarkUpList[screenId] = ''
                }
                const sm = removeUnnecessaryItemsFromScreen(refs[screenId].current).innerHTML

                if (this.prevMarkUpList[screenId] !== sm) {
                    this.prevMarkUpList[screenId] = sm
                    markupData[`router.screens.${screenId}.staticMarkup`] = sm
                }
            }
        })
        if (Object.keys(markupData).length > 0) {
            this.props.setData(markupData)
        }
    }, 1500)

    updateRefs() {
        const screens = this.props.screens.toArray()

        if (screens.length === Object.keys(refs).length) {
            return
        }

        const refsTmp = {}
        screens.forEach(s => {
            if (refs[s.hashlistId]) {
                refsTmp[s.hashlistId] = refs[s.hashlistId]
            } else {
                refsTmp[s.hashlistId] = React.createRef()
            }
        })
        refs = refsTmp
    }

    resetPrevPopupMarkUpList() {
        const refKeys = Object.keys(popupRefs)
        const prevMarkUpListKeys = Object.keys(this.prevPopupMarkUpList)
        if (prevMarkUpListKeys.length > refKeys.length) {
            const prevMarkUpListTmp = {}
            refKeys.forEach(k => (prevMarkUpListTmp[k] = this.prevPopupMarkUpList[k]))
            this.prevPopupMarkUpList = prevMarkUpListTmp
        }
    }

    renderStaticPopupMarkup = debounce(() => {
        this.resetPrevPopupMarkUpList()
        const markupData = {}
        Object.keys(popupRefs).forEach(popupId => {
            if (popupRefs[popupId].current) {
                if (!this.prevPopupMarkUpList[popupId]) {
                    this.prevPopupMarkUpList[popupId] = ''
                }
                const sm = removeUnnecessaryItemsFromScreen(popupRefs[popupId].current).innerHTML

                if (this.prevPopupMarkUpList[popupId] !== sm) {
                    this.prevPopupMarkUpList[popupId] = sm
                    markupData[`router.screens.${popupIdToScreenId[popupId]}.popups.${popupId}.staticMarkup`] = sm
                }
            }
        })
        if (Object.keys(markupData).length > 0) {
            this.props.setData(markupData)
        }
    }, 1500)

    updatePopupRefs() {
        const popups = this.props.screens
            .toArray()
            .filter(screen => screen.popups && screen.popups.length)
            .map(screen => {
                const screenId = screen.hashlistId
                const popups = screen.popups.toArray()

                popups.forEach(popup => (popupIdToScreenId[popup.hashlistId] = screenId))

                return popups
            })
            .reduce((acc, popups) => {
                acc.push(...popups)

                return acc
            }, [])

        if (popups.length === Object.keys(popupRefs).length) return

        const refsTmp = {}
        popups.forEach(popup => {
            if (refs[popup.hashlistId]) {
                refsTmp[popup.hashlistId] = refs[popup.hashlistId]
            } else {
                refsTmp[popup.hashlistId] = React.createRef()
            }
        })

        popupRefs = refsTmp
    }

    render() {
        const isFadeAnimation = this.props.switchEffect === 'fadein'

        const st = {
            backgroundColor: this.props.backgroundColor,
        }
        const scr = this.props.currentScreenId ? this.props.screens[this.props.currentScreenId] : null,
            prevScr = this.state.prevScreenId ? this.props.screens[this.state.prevScreenId] : null,
            editable = this.props.mode === 'edit'

        if (editable) {
            this.updateRefs()
            this.updatePopupRefs()
        }

        if (this.props.showPopup && editable) {
            return (
                <div className="rmx-scr_container" style={st}>
                    <div className="rmx-scr_container_item" ref={popupRefs[this.props.activePopupId]}>
                        <Popup
                            screenId={this.props.currentScreenId}
                            id={this.props.activePopupId}
                            editable={editable}
                        />
                    </div>
                </div>
            )
        }

        const switchEffectStyle = {
            none: {},
            moveleft: { transform: 'translateX(' + this.state.scrLeft + 'px)' },
            //TODO[DM]: Slide both screens logic
            slide: {},
            fadein: {
                visibility: this.state.visibilityScr,
                opacity: this.state.opacityScr,
            },
        }
        const switchEffectStylePrevScreen = {
            none: {},
            fadein: {
                visibility: this.state.visibilityScrPrev,
                opacity: this.state.opacityScrPrev,
            },
        }

        return (
            <div className="rmx-scr_container" style={st}>
                {this.props.screens.length === 0 && <p>no screens</p>}

                {/* Render all screens first time in 'edit' */}
                {editable &&
                    this.props.screens.toArray().map(s => {
                        if (s.hashlistId === this.props.currentScreenId) return
                        return (
                            <div key={s.hashlistId} ref={refs[s.hashlistId]} className="rmx-scr_container_item">
                                <Screen {...scr} id={s.hashlistId} overflowHidden={true}></Screen>
                            </div>
                        )
                    })}
                {editable &&
                    this.props.screens.toArray().map(s => {
                        return (
                            s.popups &&
                            s.popups.toArray().map(popup => {
                                return (
                                    <div
                                        className="rmx-scr_container_item"
                                        ref={popupRefs[popup.hashlistId]}
                                        style={{ visibility: 'hidden' }}
                                        key={popup.hashlistId}
                                    >
                                        <Popup
                                            {...popup}
                                            screenId={s.hashlistId}
                                            id={popup.hashlistId}
                                            editable={false}
                                            overflowHidden={true}
                                        />
                                    </div>
                                )
                            })
                        )
                    })}

                {/* Render previous screen */}
                {!editable && this.state.showPrevScreen && prevScr && (
                    <div
                        className={
                            'rmx-scr_container_item ' +
                            (this.state.transition
                                ? isFadeAnimation
                                    ? '__transition-opacity-out'
                                    : '__transition'
                                : '')
                        }
                        style={switchEffectStylePrevScreen[this.props.switchEffect]}
                    >
                        <Screen {...prevScr} id={this.state.prevScreenId}></Screen>
                        {this.props.showPopup ? (
                            <Popup
                                screenId={this.props.currentScreenId}
                                id={this.props.activePopupId}
                                editable={editable}
                            />
                        ) : null}
                    </div>
                )}

                {/* Render current screen */}
                {scr && (
                    <div
                        ref={refs[this.props.currentScreenId]}
                        className={
                            'rmx-scr_container_item ' +
                            (this.state.transition
                                ? isFadeAnimation
                                    ? '__transition-opacity-in'
                                    : '__transition'
                                : '')
                        }
                        style={switchEffectStyle[this.props.switchEffect]}
                    >
                        <Screen {...scr} id={this.props.currentScreenId} editable={editable}></Screen>
                        {this.props.showPopup ? (
                            <Popup
                                screenId={this.props.currentScreenId}
                                id={this.props.activePopupId}
                                editable={editable}
                            />
                        ) : null}
                    </div>
                )}
            </div>
        )
    }
}

/**
 * Props schema
 * Which props could be edited and how (types, range and other rules)
 */
export const Schema = new DataSchema({
    backgroundColor: {
        type: 'string',
        default: '',
    },
    displayMode: {
        type: 'string',
        enum: ['oneScreen', 'verticalAll'],
        default: 'oneScreen',
    },
    switchEffect: {
        type: 'string',
        enum: ['none', 'moveleft', 'fadein', 'slide'],
        default: 'fadein',
    },
    screens: {
        type: 'hashlist',
        default: new HashList([
            //no screens in app by default
            //{ displayName: 'Screen', backgroundColor: 'yellow' }
        ]),
        minLength: 0,
        maxLength: 32,
        prototypes: [{ id: 'default_prototype', data: { displayName: 'Screen', backgroundColor: 'green' } }],
    },
    currentScreenId: {
        type: 'string',
        default: null,
        serialize: false,
    },
    showPopup: {
        type: 'boolean',
        default: false,
        serialize: false,
    },
    activePopupId: {
        type: 'string',
        default: null,
        serialize: false,
    },
})

export default RemixWrapper(Router, Schema, 'Router')
