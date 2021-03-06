/*IFTRUE_isMemory*/
import React from 'react'
import DataSchema from '../../schema'
import RemixWrapper from '../RemixWrapper'
import MemoryCard, { backCoverImgBase64 } from './MemoryCard'

import '../style/rmx-memory.css'

const mainStyleClass = 'rmx-memory'

class MemoryPlayground extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isUserSelectionBlocked: false,
            prevSelectedCard: null,
            renderSet: [],
        }
        this.onCardClick = this.onCardClick.bind(this)
    }

    componentDidMount() {
        this.updateCardsDataSet()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.cardRowOption !== this.props.cardRowOption) {
            this.updateCardsDataSet()
        }
    }

    updateCardsDataSet() {
        let renderSet = []
        const { cardRowOption, dataSet } = this.props
        const [cardRowsCount, cardsInRowCount] = cardRowOption.split('x').map(x => Number(x))
        const isValidProp = x => typeof x === 'number' && x > 0

        if (!isValidProp(cardRowsCount) && !isValidProp(cardsInRowCount)) {
            return console.warn('[Memory]: Bad props from cardRowsCount!')
        }

        let arr = []

        let dataSetArray = dataSet.toArray()

        const shouldBeCardsCount = (cardRowsCount * cardsInRowCount) / 2

        if (dataSet && dataSetArray.length) {
            // Add or remove cards
            if (dataSetArray.length < shouldBeCardsCount) {
                let maxId = dataSetArray.sort(x => x.id)[dataSetArray.length - 1].id
                while (dataSet.length < shouldBeCardsCount) {
                    dataSet.addElement({ id: ++maxId, gameKey: null, src: null })
                }
                dataSetArray = dataSet.toArray()
            } else if (dataSetArray.length > shouldBeCardsCount) {
                dataSetArray = dataSet.toArray().splice(0, shouldBeCardsCount)
            }
        }

        // Format to render specific view
        if (dataSet && dataSetArray.length) {
            arr = [...dataSetArray, ...dataSetArray]
                .map((item, i) => ({ ...item, id: i }))
                .sort(() => Math.random() - 0.5)
            for (let i = 0; i < cardRowsCount; i++) {
                const row = arr.splice(0, cardsInRowCount).sort(() => Math.random() - 0.5)
                renderSet.push(row)
            }
        } else {
            arr = [...new Array(cardsInRowCount)]
            for (let i = 0; i < cardRowsCount; i++) {
                renderSet.push(arr.map((x, i) => ({ id: i, gameKey: null, src: null })))
            }
        }

        this.setState({
            renderSet,
        })
    }

    updateActive(card, isActive) {
        const dataSet = [...this.state.renderSet]
        const [row] = dataSet.filter(x => x.some(y => y.id === card.id))
        const [_card] = row.filter(x => x.id === card.id)
        _card.isActive = isActive
        this.setState({
            renderSet: dataSet,
        })
    }

    onCardClick(card) {
        const show = x => this.updateActive(x, true)
        const hide = x => this.updateActive(x, false)
        const { isUserSelectionBlocked, prevSelectedCard } = this.state

        if (isUserSelectionBlocked) {
            return
        }

        // (1)First step: Store first selected card in 'prevSelectedCard' and show it.
        if (!prevSelectedCard) {
            if (card.isActive) {
                return
            }
            show(card)
            this.setState({
                prevSelectedCard: card,
            })
            return
        }

        // (2)Second step: Do nothing if selected previously selected card.
        if (prevSelectedCard && prevSelectedCard.id === card.id) {
            return
        }

        const isPair = prevSelectedCard.gameKey === card.gameKey

        // React only on non active cards
        if (!card.isActive) {
            // (3)Third step: show card if pair or hide both selected and previous selected cards.
            if (isPair) {
                show(card)
            } else {
                show(card)
                show(prevSelectedCard)
                this.setState({
                    isUserSelectionBlocked: true,
                })
                setTimeout(() => {
                    hide(card)
                    hide(prevSelectedCard)
                    this.setState({
                        isUserSelectionBlocked: false,
                    })
                }, 1000)
            }

            // (4)Fourth step: clean previous selection
            this.setState({
                prevSelectedCard: null,
            })
        }

        // (5)Last step: Game over
        if (this.state.renderSet.every(row => row.every(card => card.isActive))) {
            this.finalScreen()
        }
    }

    finalScreen() {
        Remix.fireEvent('request_next_screen')
    }

    render() {
        const { renderSet } = this.state
        const { cardRowOption, indent, cardBackImgSrc } = this.props
        const [cardRowsCount, cardsInRowCount] = cardRowOption.split('x').map(x => Number(x))
        const height = `${100 / cardRowsCount}%`
        const cardWidth = `${100 / cardsInRowCount}%`
        const rowStyle = {
            height: height,
        }
        return (
            <div className={`${mainStyleClass}-playground`}>
                {renderSet.map((row, i) => (
                    <div style={rowStyle} className={`${mainStyleClass}-row`} key={i}>
                        {row.map(card => (
                            <MemoryCard
                                id={card.id}
                                key={`${card.id}key`}
                                padding={indent}
                                height={height}
                                width={cardWidth}
                                backCoverSrc={cardBackImgSrc}
                                src={card.src}
                                gameKey={card.gameKey}
                                isActive={card.isActive}
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
        enum: ['4x2', '4x3', '4x4', '5x2', '5x4', '3x6', '6x4', '6x6'],
        default: '4x4',
    },
    cardBackImgSrc: {
        type: 'string',
        default: backCoverImgBase64,
    },
})

export default RemixWrapper(MemoryPlayground, Schema, 'MemoryPlayground')
/*FITRUE_isMemory */
