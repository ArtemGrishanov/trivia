/// <reference types="cypress" />

import { getIframeBody, getRemix } from '../../support/commands'

function clickStartButton() {
    getIframeBody().find('button').contains('Start quiz').click()
}

function finishGameCorrectly() {
    getIframeBody().find('.rmx-component.rmx-pointer').contains('ROME').click()
    getIframeBody().find('strong').contains('CONGRATS!').should('exist').and('not.be.empty')
    getIframeBody().find('strong').contains('YOU ARE A GEOGRAPHY TEACHER!').should('exist').and('not.be.empty')
}

function finishGameIncorrectly() {
    getIframeBody().find('.rmx-component.rmx-pointer').contains('MILAN').click()
    getIframeBody()
        .find('strong')
        .contains('SOUNDS LIKE YOU SHOULD LEARN GEOGRAPHY!')
        .should('exist')
        .and('not.be.empty')
}

function clickTryAgainButton() {
    getIframeBody().find('button').contains('Try again').should('exist').click()
}

function clickShareButton() {
    getIframeBody().find('button').contains('Share').should('exist').click()
}

context('Geography project', () => {
    beforeEach(() => {
        cy.visit('https://dev.interacty.me/projects/1ca6e32053ceaad7')
    })
    it('it should finish the game correctly and click share button', () => {
        clickStartButton()
        finishGameCorrectly()
        clickShareButton()
    })

    it('it should finish the game correctly and click try again button', () => {
        clickStartButton()
        finishGameCorrectly()
        clickTryAgainButton()
    })

    it('it should finish the game incorrectly and click share button', () => {
        clickStartButton()
        finishGameIncorrectly()
        clickShareButton()
    })

    it('it should finish the game incorrectly and click try again button', () => {
        clickStartButton()
        finishGameIncorrectly()
        clickTryAgainButton()
    })

    it('Get Remix and switch the mode for editing and vice verse', () => {
        clickStartButton()
        getRemix().then(remix => {
            remix.setMode('edit')
            expect(remix.getMode()).equal('edit')
            remix.setMode('none')
            expect(remix.getMode()).equal('none')
        })
    })
})
