/// <reference types="cypress" />

const getIframeDocument = () => {
    return (
        cy
            .get('iframe')
            // Cypress yields jQuery element, which has the real
            // DOM element under property "0".
            // From the real DOM iframe element we can get
            // the "document" element, it is stored in "contentDocument" property
            // Cypress "its" command can access deep properties using dot notation
            // https://on.cypress.io/its
            .its('0.contentDocument')
            .should('exist')
    )
}

const getIframeBody = () => {
    // get the document
    return (
        getIframeDocument()
            // automatically retries until body is loaded
            .its('body')
            .should('not.be.undefined')
            // wraps "body" DOM element to allow
            // chaining more Cypress commands, like ".find(...)"
            .then(cy.wrap)
    )
}

it('gets the post', () => {
    cy.visit('https://dev.interacty.me/projects/dacfcd6f05c1e470')
        .log('runInEditor')
        .get(`iframe`)
        .should(iframe => expect(iframe.contents().find('.rmx-component.rmx-button')).to.exist)
        .then(iframe => cy.wrap(iframe.contents().find('.rmx-component.rmx-button')))
        .click()

    const styleMap = {}
    cy.get(`iframe`)
        .should(iframe => expect(iframe.contents().find('.rmx-memory-card')).to.exist)
        .then(iframe => cy.wrap(iframe.contents().find('.rmx-memory-card')))
        .each(($element1, index1, $list) => {
            const $element1Style = $element1.find('.flip-card-back').attr('style')
            if (!styleMap[$element1Style]) {
                cy.wrap($list).each(($element2, index2) => {
                    const $element2Style = $element2.find('.flip-card-back').attr('style')
                    if ($element1Style === $element2Style && index1 !== index2) {
                        styleMap[$element1Style] = `${index1}_${index2}`
                        cy.wrap($element1).click()
                        cy.wrap($element2).click()
                    }
                    console.log(styleMap)
                })
            }
        })
    // .click({ multiple: true, force: true, timeout: 10000 })
})
