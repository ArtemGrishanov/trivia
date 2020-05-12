import React from 'react'
import DataSchema from '../../schema'
import RemixWrapper from '../RemixWrapper'
import { getComponents } from '../../remix'
import ProgressiveImage from './ProgressiveImage'

import '../style/rmx-memory.css'
import { debounce } from '../../remix/util/util'
import MemoryCard from './MemoryCard'

const MEMORY_TAG = 'memoryitem'
const mainStyleClass = 'rmx-memory'
const DEBOUNCE_THRESHOLD = 650
const CARD_BACK_IMG_URL = 'https://www.publicdomainpictures.net/pictures/40000/velka/question-mark.jpg'
let cardId = 0

class CardData {
    constructor(gameLink, src) {
        this.id = this.getId()
        this.gameLink = gameLink
        this.src = src || CARD_BACK_IMG_URL
    }
    getId() {
        return cardId++
    }
}

class MemoryPlayground extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            prevSelectedCardId: null,
            cardRowOption: this.props.cardRowOption,
            cardsData: [],
        }
        this.onCardClick = this.onCardClick.bind(this)
    }

    componentDidMount() {
        this.updateCardsData()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.cardRowOption !== this.props.cardRowOption) {
            console.log(prevProps, prevState, snapshot)
            this.updateCardsData()
        }
    }

    updateCardsData() {
        let cardsData = []
        const { cardRowOption } = this.props
        const [cardRowsCount, cardsInRowCount] = cardRowOption.split('x').map(x => Number(x))
        const isValidProp = x => typeof x === 'number' && x > 0

        if (!isValidProp(cardRowsCount) && !isValidProp(cardsInRowCount)) {
            return console.warn('[Memory]: Bad props from cardRowsCount!')
        }

        for (let i = 0; i < cardRowsCount; i++) {
            cardsData.push([...new Array(cardsInRowCount)].map((x, i) => new CardData(i, null)))
        }

        this.setState({
            cardsData,
        })
    }

    onCardClick(card) {
        console.log(card)
    }

    render() {
        const { cardsData } = this.state
        const { cardRowOption, indent } = this.props
        const [cardRowsCount, cardsInRowCount] = cardRowOption.split('x').map(x => Number(x))
        const height = `${100 / cardRowsCount}%`
        const cardWidth = `${100 / cardsInRowCount}%`
        const rowStyle = {
            height: height,
        }
        return (
            <div className={`${mainStyleClass}-playground`}>
                {cardsData.map((row, i) => (
                    <div style={rowStyle} className={`${mainStyleClass}-row`} key={i}>
                        {row.map(card => (
                            <MemoryCard
                                key={`${card.id}key`}
                                padding={indent}
                                height={height}
                                width={cardWidth}
                                backCoverSrc={CARD_BACK_IMG_URL}
                                src={card.src}
                                gameLink={card.gameLink}
                                clickHandler={this.onCardClick}
                            />
                        ))}
                    </div>
                ))}
            </div>
        )
    }
}

/**
 * Props schema
 * Which props could be edited and how (types, range and other rules)
 */
export const Schema = new DataSchema({
    indent: {
        type: 'number',
        min: 0,
        max: 25,
        default: 5,
    },
    cardRowOption: {
        type: 'string',
        enum: ['4x2', '4x3', '4x4', '5x2', '5x4', '6x3', '6x4', '6x6'],
        default: '4x4',
    },
})

export default RemixWrapper(MemoryPlayground, Schema, 'MemoryPlayground')
