import React, { useState, useEffect } from 'react'

import DataSchema from '../schema'
import { setComponentProps, _componentIdToScreenId, getScreenIdByComponentId, postMessage } from '../remix'
import RemixWrapper from './RemixWrapper'

import { getTranslation } from './translations'

import Like from './Like'
import './style/rmx-rank-battle.css'

const VoteIcon = ({ className = '', color = '#1877F2', onClick }) => (
    <svg
        className={`${className}`}
        onClick={onClick}
        width="84"
        height="84"
        viewBox="0 0 84 84"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g filter="url(#filter0_d)">
            <path
                d="M78 38C78 57.8822 61.8822 74 42 74C22.1177 74 6 57.8822 6 38C6 18.1177 22.1177 2 42 2C61.8822 2 78 18.1177 78 38Z"
                fill={color}
            />
            <mask id="mask0" masktype="alpha" maskUnits="userSpaceOnUse" x="6" y="2" width="72" height="72">
                <path
                    d="M78 38C78 57.8822 61.8822 74 42 74C22.1177 74 6 57.8822 6 38C6 18.1177 22.1177 2 42 2C61.8822 2 78 18.1177 78 38Z"
                    fill="#E7E7E7"
                />
            </mask>
            <g mask="url(#mask0)">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M32.298 25.663C31.9027 30.4761 29.9449 34.3326 28.5426 37.0948L28.5031 37.1726L24.984 40.8815L34.3242 54.3385L37.4851 53.6917C38.7412 53.3611 40.2095 53.2605 41.8194 53.1503C45.0052 52.9321 48.7456 52.676 52.4941 50.524C52.5063 50.5171 52.5184 50.5102 52.5306 50.5032L61.3663 45.4019C63.1556 44.3688 63.7686 42.0809 62.7356 40.2916C62.2062 39.3747 61.3474 38.7667 60.3949 38.5308C61.362 37.261 61.5308 35.4843 60.6828 34.0155C60.0954 32.9981 59.1361 32.3293 58.0758 32.0817C59.1273 30.8056 59.3354 28.9611 58.46 27.4449C57.8914 26.46 56.9743 25.8018 55.9544 25.5361C57.0047 24.3642 57.2367 22.6057 56.4071 21.1687C55.374 19.3794 53.0861 18.7664 51.2968 19.7994L42.4611 24.9007C41.8191 25.2714 41.3285 25.8036 41.0111 26.4164C40.7114 25.2018 39.7663 22.2742 38.1763 19.5203C36.1358 15.986 32.4526 13.0074 30.4365 14.9568C29.4211 15.9386 30.0122 17.2876 30.793 19.0696C31.5626 20.8259 32.5165 23.0028 32.298 25.663Z"
                    fill="white"
                />
                <path
                    d="M-0.690705 53.0551C-2.06189 50.6801 -1.24817 47.6432 1.1268 46.272L20.2414 35.2362C22.6164 33.865 25.6532 34.6788 27.0244 37.0537L37.4292 55.0754C38.8004 57.4503 37.9867 60.4872 35.6117 61.8584L16.4971 72.8942C14.1222 74.2654 11.0853 73.4517 9.7141 71.0767L-0.690705 53.0551Z"
                    fill="white"
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M21.4828 37.3864L2.36818 48.4222C1.18069 49.1078 0.773833 50.6262 1.45943 51.8137L11.8642 69.8353C12.5498 71.0228 14.0683 71.4297 15.2557 70.7441L34.3703 59.7083C35.5578 59.0227 35.9647 57.5042 35.2791 56.3168L24.8743 38.2951C24.1887 37.1076 22.6703 36.7008 21.4828 37.3864ZM1.1268 46.272C-1.24817 47.6432 -2.06189 50.6801 -0.690705 53.0551L9.7141 71.0767C11.0853 73.4517 14.1222 74.2654 16.4971 72.8942L35.6117 61.8584C37.9867 60.4872 38.8004 57.4503 37.4292 55.0754L27.0244 37.0537C25.6532 34.6788 22.6164 33.865 20.2414 35.2362L1.1268 46.272Z"
                    fill={color}
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M16.2419 38.7426C16.8357 38.3998 17.5949 38.6033 17.9377 39.197L21.2107 44.866C21.5535 45.4598 21.3501 46.219 20.7563 46.5618C20.1626 46.9046 19.4034 46.7011 19.0606 46.1074L15.7876 40.4384C15.4448 39.8447 15.6482 39.0854 16.2419 38.7426Z"
                    fill={color}
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M22.4242 49.451C23.0179 49.1082 23.7771 49.3116 24.1199 49.9054L31.0296 61.8733C31.3724 62.467 31.169 63.2262 30.5752 63.569C29.9815 63.9118 29.2223 63.7084 28.8795 63.1146L21.9698 51.1467C21.627 50.553 21.8304 49.7938 22.4242 49.451Z"
                    fill={color}
                />
            </g>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M42 71.5172C60.5111 71.5172 75.5172 56.5111 75.5172 38C75.5172 19.4889 60.5111 4.48276 42 4.48276C23.4889 4.48276 8.48276 19.4889 8.48276 38C8.48276 56.5111 23.4889 71.5172 42 71.5172ZM42 74C61.8822 74 78 57.8822 78 38C78 18.1177 61.8822 2 42 2C22.1177 2 6 18.1177 6 38C6 57.8822 22.1177 74 42 74Z"
                fill="white"
            />
        </g>
        <defs>
            <filter
                id="filter0_d"
                x="0"
                y="0"
                width="84"
                height="84"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
            >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="3" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
        </defs>
    </svg>
)

const LeaderIcon = () => (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M0.203731 3.25567L2.21254 11.6926C2.25544 11.8728 2.41643 12 2.60166 12H13.3983C13.5836 12 13.7446 11.8728 13.7875 11.6926L15.7963 3.25567C15.8758 2.92165 15.5252 2.64926 15.2212 2.80886L11.4286 4.8L8.32549 0.455691C8.16597 0.232351 7.83404 0.232351 7.67451 0.45569L4.57143 4.8L0.778787 2.80886C0.474782 2.64926 0.124203 2.92165 0.203731 3.25567Z"
            fill="white"
        />
    </svg>
)

const LeaderIcon2 = () => (
    <svg width="48" height="35" viewBox="0 0 48 35" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M1.01865 10.4783L6.49125 33.4632C6.70576 34.3642 7.51074 35 8.43686 35H39.5631C40.4893 35 41.2942 34.3642 41.5088 33.4632L46.9813 10.4784C47.379 8.80827 45.6261 7.4463 44.1061 8.24432L35.8294 12.5895C34.9448 13.054 33.8531 12.7943 33.2723 11.9812L25.6275 1.27845C24.8298 0.161755 23.1702 0.161756 22.3725 1.27845L14.7277 11.9812C14.1469 12.7943 13.0552 13.054 12.1706 12.5895L3.89394 8.24432C2.37391 7.4463 0.621015 8.80826 1.01865 10.4783Z"
            fill="white"
        />
    </svg>
)

const delay30fps = 1000 / 30
const requestAnimationFrame30 = callback => {
    const startTime = Date.now()

    let requestId = 0
    const loop = () => {
        const now = Date.now()

        if (now - startTime >= delay30fps) {
            callback()
        } else {
            requestId = requestAnimationFrame(loop)
        }
    }

    requestId = requestAnimationFrame(loop)

    return () => cancelAnimationFrame(requestId)
}

const useLikeAnimation = (animate = false) => {
    const [animating, setAnimating] = useState(animate ? 1 : 0)
    const [style, setStyle] = useState({})

    useEffect(() => {
        let i = 0
        let cancelRequest = () => void 0

        const animateFn = () => {
            if (i < 36) {
                setStyle({ transform: `translate(-${i * 100}px)` })

                i++

                cancelRequest = requestAnimationFrame30(animateFn)
            } else {
                i = 0
                setAnimating(0)
            }
        }

        if (animating && i === 0) {
            // cancelRequest()

            animateFn()
        }

        return () => {
            cancelRequest()
            setStyle({ transform: `translate(0px)` })
            i = 0
        }
    }, [animating])

    return [
        ({ className = '', color }) => <Like className={className} color={color} style={style} />,
        animating,
        () => setAnimating(animating + 1),
    ]
}

const useWaveAnimation = ({ color }) => {
    const [count, setCount] = useState(0)

    const range = new Array(count).fill(0)

    const render = (
        <div className="like-wave__container">
            {range.map((el, i) => (
                <div className="like-wave__element" key={i} style={{ backgroundColor: color }}></div>
            ))}
        </div>
    )

    return [render, () => setCount(count + 1)]
}

const RankBattleCard = ({ className = '', imageUrl, value, leading, highlightColor, color, onClick }) => {
    const [LikeAnimation, isAnimate, animateLike] = useLikeAnimation(false)
    const [waveAnimation, addWave] = useWaveAnimation({ color: highlightColor })

    const style = leading
        ? {
              backgroundColor: highlightColor,
              color: '#FFFFFF',
          }
        : {
              backgroundColor: color,
              color: '#404040',
          }

    return (
        <div
            className={`rank-battle-card ${className}`}
            onMouseUp={(...args) => {
                if (!isAnimate) animateLike()
                addWave()

                onClick(...args)
            }}
        >
            {leading ? (
                <div className="rank-battle-card__leader_desktop" style={{ backgroundColor: highlightColor }}>
                    <LeaderIcon />
                    <span>{getTranslation('leading')}</span>
                </div>
            ) : null}
            <div className="rank-battle-card__img-wrapper">
                <div className="rank-battle-card_active" style={{ backgroundColor: highlightColor }}></div>
                <div className="rank-battle-card__img-wrapper2">
                    <div className="rank-battle-card__img" style={{ backgroundImage: `url(${imageUrl})` }} />
                </div>
            </div>
            <div className="rank-battle-card__votes" style={style}>
                {leading ? (
                    <div className="rank-battle-card__leader_mobile">
                        <LeaderIcon2 />
                        <span>{getTranslation('leading')}</span>
                    </div>
                ) : null}
                {waveAnimation}
                <div className="rank-battle-card__vote-icon-wrapper">
                    <LikeAnimation className="rank-battle-card__vote-icon" color={highlightColor} />
                </div>
                <div style={{ zIndex: '10' }}>
                    <span className="rank-battle-card__votes-text">{getTranslation('votes')}: </span>
                    <span className="rank-battle-card__votes-count">{value}</span>
                </div>
            </div>
        </div>
    )
}

/**
 * @extends React.Component
 */
class RankBattlePlayground extends React.Component {
    state = {
        votes: {},
    }

    firstVote = true
    toVote = cardId => () => {
        const { id, numberOfNewVotes } = this.props

        const cardNewVotes = numberOfNewVotes[cardId] || 0
        setComponentProps(
            {
                id,
                numberOfNewVotes: {
                    ...numberOfNewVotes,
                    [cardId]: cardNewVotes + 1,
                },
            },
            void 0,
            void 0,
            false,
        )

        if (this.firstVote) {
            this.firstVote = false

            postMessage('analytics', {
                type: 'engagement',
                actionType: 'screens',
                engagement: 1,
            })
        } else {
            postMessage('analytics', {
                type: 'standard',
                actionType: 'pass_test_again_clicked',
            })
        }
    }

    updateVotes = () => {
        const { numberOfCards, numberOfVotes, numberOfNewVotes, cardIds } = this.props

        const votes = Object.fromEntries(
            cardIds.map(id => [id, (numberOfVotes[id] || 0) + (numberOfNewVotes[id] || 0)]).slice(0, numberOfCards),
        )

        this.setState({
            votes,
        })
    }

    componentDidMount() {
        this.updateVotes()

        // TODO
        setTimeout(this.message, 0)
        setTimeout(this.message, 100)
        setInterval(this.message, 10000)
    }

    componentDidUpdate(prevProps) {
        if (
            JSON.stringify(prevProps.numberOfVotes) !== JSON.stringify(this.props.numberOfVotes) ||
            JSON.stringify(prevProps.numberOfNewVotes) !== JSON.stringify(this.props.numberOfNewVotes)
        ) {
            this.updateVotes()
        }
    }

    updateNumberOfVotes = () => {
        const { id } = this.props
        const { votes } = this.state

        const updatedNumberOfVotes = { ...votes }
        const updatedNumberOfNewVotes = Object.fromEntries(Object.entries(votes).map(([id]) => [id, 0]))

        setComponentProps(
            {
                id,
                numberOfVotes: updatedNumberOfVotes,
                numberOfNewVotes: updatedNumberOfNewVotes,
            },
            void 0,
            void 0,
            false,
        )
    }

    message = () => {
        const { id, numberOfVotes, numberOfNewVotes } = this.props
        const screenId = getScreenIdByComponentId(id)

        postMessage('rank-battle', { screenId, componentId: id, numberOfNewVotes, numberOfVotes })

        this.updateNumberOfVotes()
    }

    getSortedVotes = () => {
        const { votes } = this.state

        return Object.entries(votes).sort(([ak, av], [bk, bv]) => (av > bv ? -1 : av === bv ? 0 : 1))
    }

    getLeadingValue = sortedValues => {
        const max = sortedValues[0]

        if (sortedValues.every(val => val === max)) {
            return max + 1
        } else {
            return max
        }
    }

    render() {
        const { numberOfCards, baseColor, highlightColor, imageLinks } = this.props
        const { votes } = this.state

        if (Object.entries(votes).length === 0) {
            return null
        }

        const sortedVotes = this.getSortedVotes()
        const leadingValue = this.getLeadingValue(sortedVotes.map(([, v]) => v))

        return (
            <div className={`rank-battle-playground rank-battle-playground_${numberOfCards}`}>
                {Object.entries(votes).map(([cardId, votes]) => {
                    return (
                        <RankBattleCard
                            key={cardId}
                            imageUrl={imageLinks[cardId]}
                            className={`rank-battle-card_${numberOfCards}`}
                            value={votes}
                            leading={votes === leadingValue}
                            highlightColor={highlightColor}
                            color={baseColor}
                            onClick={this.toVote(cardId)}
                        />
                    )
                })}
            </div>
        )
    }
}

export const Schema = new DataSchema({
    numberOfCards: {
        type: 'number',
        min: 1,
        max: 4,
        default: 2,
    },
    numberOfVotes: {
        type: 'object',
        default: {},
    },
    numberOfNewVotes: {
        type: 'object',
        default: {},
    },
    imageLinks: {
        type: 'object',
        default: {},
    },
    cardIds: {
        type: 'array',
        default: ['b5f4d3', '4fb99d', 'd81c1f', '653d9e'],
    },
    baseColor: {
        type: 'string',
        default: '#FFFFFF',
    },
    highlightColor: {
        type: 'string',
        default: '#1877F2',
    },
})

export default RemixWrapper(RankBattlePlayground, Schema, 'RankBattlePlayground')
