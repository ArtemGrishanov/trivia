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

class CardData {
    constructor(id, link, src) {
        this.id = id
        this.link = link
        this.src = src
    }
}

class MemoryPlayground extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            cardIndent: 5,
            prevSelectedCardId: null,
            cardsData: [],
        }
        this.onCardClick = this.onCardClick.bind(this)
    }

    componentDidMount() {
        let cardsData = []
        const { rows, cardsPerRow } = this.props
        if (rows % 2 !== 0) {
            return <div> Wrong number of cards was provided! </div>
        }
        let link = 0
        for (let i = 0; i < rows; i++) {
            const cards = []
            for (let j = 0; j < cardsPerRow; j++) {
                cards.push(new CardData(i, link, CARD_BACK_IMG_URL))
            }
            cardsData.push(cards)
        }
        this.setState({
            cardsData,
        })
    }

    onCardClick(card) {
        console.log(card)
        // const updatedCardsData = [...this.state.cardsData]
        // const index = updatedCardsData.findIndex(_card => _card.id === card.id)
        // updatedCardsData[index] = new CardData(card.id, 'http://p.testix.me/temp/cat1500x1000.jpg')
        // this.setState({
        //     prevSelectedCardId: card.id,
        //     cardsData: updatedCardsData,
        // })
    }

    render() {
        const { cardsData, cardIndent } = this.state
        const { rows, cardsPerRow } = this.props
        const height = `${100 / rows}%`
        const cardWidth = `${100 / cardsPerRow}%`
        const indent = '5px'
        const rowStyle = {
            height: height,
        }
        console.log(cardsData, rowStyle)
        return (
            <div className={`${mainStyleClass}-playground`}>
                {cardsData.map((row, i) => (
                    <div style={rowStyle} className={`${mainStyleClass}-row`} key={i}>
                        {row.map(card => (
                            <MemoryCard
                                padding={indent}
                                height={height}
                                width={cardWidth}
                                key={Math.random()}
                                src={card.src}
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
    rows: {
        type: 'number',
        min: 4,
        max: 6,
        default: 4,
    },
    cardsPerRow: {
        type: 'number',
        min: 2,
        max: 6,
        default: 4,
    },
})

export default RemixWrapper(MemoryPlayground, Schema, 'MemoryPlayground')
