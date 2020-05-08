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
    constructor(id, imgSrc) {
        this.id = id
        this.imgSrc = imgSrc
    }
}

class MemoryPlayground extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            cardWidth: 100,
            cardHeight: 100,
            cardIndent: 5,
            prevSelectedCardId: null,
            cardsData: [],
        }
        this.recalculateSizes = debounce(this.recalculateSizes.bind(this), DEBOUNCE_THRESHOLD)
        this.onCardClick = this.onCardClick.bind(this)
    }

    componentDidMount() {
        let cardsData = []
        const { cardsCount } = this.props
        if (cardsCount % 2 !== 0) {
            return <div> Wrong number of cards was provided! </div>
        }
        for (let i = 0; i < cardsCount; i++) {
            cardsData.push(new CardData(i, CARD_BACK_IMG_URL))
        }
        this.setState({
            cardsData,
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.recalculateSizes(this.props)
    }

    recalculateSizes({ width, height }) {
        const { cardWidth, cardHeight } = this.state
        const { cardsCount } = this.props
        const playgroundArea = width * height
        const fitCount = this.calcFigures({ width, height }, { width: cardWidth, height: cardHeight })

        if (fitCount > cardsCount * 2) {
            const cardArea = Math.floor(Math.sqrt(Math.floor(playgroundArea / cardsCount)))
            this.setState(prevState => ({
                cardWidth: cardArea,
                cardHeight: cardArea,
            }))
        } else if (fitCount < cardsCount) {
            this.setState(prevState => ({
                cardWidth: prevState.cardWidth - 20,
                cardHeight: prevState.cardHeight - 20,
            }))
        }
    }

    calcFigures(figureA, figureB) {
        function calcTotalOne() {
            let figures_per_row = Math.floor(figureA.width / figureB.width),
                figures_per_col = Math.floor(figureA.height / figureB.height),
                invers_figures_per_row = 0,
                invers_figures_per_col = 0

            if (figureA.width - figures_per_row * figureB.width >= figureB.height) {
                invers_figures_per_row = Math.floor((figureA.width - figures_per_row * figureB.width) / figureB.height)
                invers_figures_per_col = Math.floor(figureA.height / figureB.width)
            }

            return figures_per_row * figures_per_col + invers_figures_per_row * invers_figures_per_col
        }

        function calcTotalTwo() {
            let figures_per_row = Math.floor(figureA.width / figureB.height),
                figures_per_col = Math.floor(figureA.height / figureB.width),
                invers_figures_per_row = 0,
                invers_figures_per_col = 0

            if (figureA.width - figures_per_row * figureB.height >= figureB.width) {
                invers_figures_per_row = Math.floor((figureA.width - figures_per_row * figureB.height) / figureB.width)
                invers_figures_per_col = Math.floor(figureA.height / figureB.height)
            }

            return figures_per_row * figures_per_col + invers_figures_per_row * invers_figures_per_col
        }

        return Math.max(calcTotalOne(), calcTotalTwo())
    }

    onCardClick(card) {
        console.log(card)
        const updatedCardsData = [...this.state.cardsData]
        const index = updatedCardsData.findIndex(_card => _card.id === card.id)
        updatedCardsData[index] = new CardData(card.id, 'http://p.testix.me/temp/cat1500x1000.jpg')
        this.setState({
            prevSelectedCardId: card.id,
            cardsData: updatedCardsData,
        })
    }

    render() {
        const { cardsData, cardWidth, cardHeight, cardIndent } = this.state
        //.sort(() => Math.random() - 0.5)
        return (
            <div className={`${mainStyleClass}-playground`}>
                {cardsData.map((card, i) => (
                    <MemoryCard
                        id={card.id}
                        key={card.id}
                        width={cardWidth}
                        height={cardHeight}
                        margin={cardIndent}
                        src={card.imgSrc}
                        clickHandler={this.onCardClick}
                    />
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
    cardsCount: {
        type: 'number',
        min: 4,
        max: 32,
        enum: [4, 8, 16, 32],
        default: 4,
    },
})

export default RemixWrapper(MemoryPlayground, Schema, 'MemoryPlayground')
