import React from 'react'
import RemixWrapper from './RemixWrapper'
import DataSchema from '../schema'
import HashList from '../hashlist'
import Screen from './Screen'

const refs = {}

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
        this.timeoutId = null
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.mode === 'edit') {
            // no any transition effect in 'edit' mode
            if (prevProps.currentScreenId && this.props.currentScreenId !== prevProps.currentScreenId) {
                this.setState({ prevScreenId: prevProps.currentScreenId })
            }
            this.renderStaticMarkup()
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

    renderStaticMarkup() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId)
        }
        this.timeoutId = setTimeout(() => {
            this.timeoutId = null
            const markupData = {}
            Object.keys(refs).forEach(screenId => {
                if (refs[screenId].current) {
                    const sm = refs[screenId].current.innerHTML
                    if (this.props.screens[screenId].staticMarkup != sm) {
                        markupData[`router.screens.${screenId}.staticMarkup`] = sm
                    }
                }
            })
            if (Object.keys(markupData).length > 0) {
                this.props.setData(markupData)
            }
        }, 3000) // don't render too often. User can perform many microoperations: dragging, resizing, changing colors etc...
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
            this.props.screens.toArray().forEach(s => {
                if (!refs[s.hashlistId]) refs[s.hashlistId] = React.createRef()
            })
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
})

export default RemixWrapper(Router, Schema, 'Router')
