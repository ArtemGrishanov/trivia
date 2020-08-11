import React, { createRef, useEffect, useState } from 'react'

import DataSchema from '../schema'
import { postMessage } from '../remix'

import RemixWrapper from './RemixWrapper'

import './style/rmx-before-after.css'

const ClipRect = ({ children, left = 0, top = 0 }) => {
    const container = createRef()

    const [rect, setRect] = useState({ width: 0, height: 0 })

    useEffect(() => {
        if (container.current) {
            const currentRect = container.current.getBoundingClientRect()
            if (JSON.stringify(rect) !== JSON.stringify(currentRect)) setRect(currentRect)
        }
    })

    return (
        <div ref={container} style={{ position: 'relative', width: 'inherit', height: 'inherit' }}>
            <div
                className="overflow-hidden"
                style={{
                    position: 'absolute',
                    width: 'inherit',
                    height: 'inherit',
                    left,
                    top,
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        width: 'inherit',
                        height: 'inherit',
                        left: `-${left}`,
                        top: `-${top}`,
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    )
}

class BeforeAfter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            position: 50,
            componentWidth: undefined,
        }
        this.wrapperElement = createRef()
    }

    engagement = 0

    setPosition = p => {
        if (p < 0) p = 0
        else if (p > 100) p = 100
        this.setState({
            position: p,
        })
    }

    touchMoveEventHandler = e => {
        const cx = e.touches ? e.touches[0].clientX : e.clientX
        const diff = ((cx - this.startClientX) / this.wrapperElement.current.clientWidth) * 100

        this.setPosition(this.startPosition + diff)

        if (this.engagement === 0) {
            this.engagement++

            postMessage('analytics', {
                type: 'engagement',
                actionType: 'screens',
                engagement: this.engagement,
            })
        }
    }

    mouseMoveEventHandler = ev => {
        if (this.draggable) this.touchMoveEventHandler(ev)
    }

    touchStartEventHandler = ev => {
        this.startClientX = ev.touches ? ev.touches[0].clientX : ev.clientX
        this.startPosition = this.state.position
    }

    mouseDownEventHandler = ev => {
        this.startClientX = ev.touches ? ev.touches[0].clientX : ev.clientX
        this.startPosition = this.state.position
        this.draggable = true
    }

    mouseUpEventHandler = () => {
        this.draggable = false
    }

    componentWillMount() {
        window.addEventListener('touchmove', this.touchMoveEventHandler)
        window.addEventListener('mousemove', this.mouseMoveEventHandler)
        window.addEventListener('mouseup', this.mouseUpEventHandler)
    }

    componentWillUnmount() {
        window.removeEventListener('touchmove', this.touchMoveEventHandler)
        window.removeEventListener('mousemove', this.mouseMoveEventHandler)
        window.removeEventListener('mouseup', this.mouseUpEventHandler)
    }

    render() {
        const { leftImage, rightImage, dividerColor } = this.props
        const { position } = this.state

        const childStyle = {
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundSize: 'cover',
        }

        return (
            <div
                ref={this.wrapperElement}
                className="tstx_jaxtapose_wr"
                onTouchStart={this.touchStartEventHandler}
                onMouseDown={this.mouseDownEventHandler}
            >
                <div style={{ backgroundImage: `url(${leftImage})`, ...childStyle }} />
                <ClipRect left={`${position}%`}>
                    <div style={{ backgroundImage: `url(${rightImage})`, ...childStyle }} />
                </ClipRect>
                <div
                    className="tstx-jaxtapose_delimeter"
                    style={{ left: this.state.position + '%', backgroundColor: dividerColor }}
                >
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="24" cy="24" r="24" fill="black" fillOpacity="0.4" />
                        <path d="M42 24L34.5 15.3397L34.5 32.6603L42 24Z" fill={dividerColor} />
                        <rect x="20" y="6" width="8" height="36" rx="1" fill={dividerColor} />
                        <path d="M6 24L13.5 15.3397L13.5 32.6603L6 24Z" fill={dividerColor} />
                    </svg>
                </div>
            </div>
        )
    }
}

export const Schema = new DataSchema({
    leftImage: {
        type: 'string',
        default: 'https://p.testix.me/images/products/common/i/Placeholder.png',
    },
    rightImage: {
        type: 'string',
        default: 'https://p.testix.me/images/products/common/i/Placeholder.png',
    },
    dividerColor: {
        type: 'string',
        default: '#FFFFFF',
    },
})

export default RemixWrapper(BeforeAfter, Schema, 'BeforeAfter')
