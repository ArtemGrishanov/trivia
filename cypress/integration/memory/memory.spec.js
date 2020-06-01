/// <reference types="cypress" />

import { getIframeBody } from './../../support/commands'

function clickStartButton() {
    getIframeBody().find('button').contains('Start').should('exist').click()
}

function finishGame() {
    const styles = []
    getIframeBody()
        .find('.rmx-memory-card')
        .each(($memoryCard, i, $memoryCardList) => {
            const $firstPressedCard = $memoryCard.find('.flip-card-back')
            const firstPressedCardStyle = $firstPressedCard.attr('style')
            if (!styles.includes(firstPressedCardStyle)) {
                for (let j = i + 1; j < $memoryCardList.length; j++) {
                    const secondPressedCard = $memoryCardList[j].querySelector('.flip-card-back')
                    const secondPressedCardStyle = secondPressedCard.getAttribute('style')
                    if (firstPressedCardStyle === secondPressedCardStyle) {
                        styles.push(firstPressedCardStyle)
                        $memoryCardList[i].click()
                        $memoryCardList[j].click()
                        break
                    }
                }
            }
        })
}

function clickTryAgainButton() {
    getIframeBody().find('button').contains('Try again').should('exist').click()
}

function clickShareButton() {
    getIframeBody().find('button').contains('Share').should('exist').click()
}

context('Memory project', () => {
    beforeEach(() => {
        cy.visit('https://dev.interacty.me/projects/a1f826f56dfa2ddc')
    })
    it('it should finish the game and click try again', () => {
        clickStartButton()
        finishGame()
        clickTryAgainButton()
    })

    it('it should finish the game and click share button', () => {
        clickStartButton()
        finishGame()
        clickShareButton()
    })
})
