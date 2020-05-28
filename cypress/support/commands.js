// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

export function getIframeBody() {
    cy.log('getIframeBody')
    return cy
        .get('iframe', { log: false })
        .its('0.contentDocument.body', { log: false })
        .should('not.be.empty')
        .then($body => cy.wrap($body, { log: false }))
}

export function getIframeWindow() {
    return cy
        .get('iframe', { log: false })
        .its('0.contentWindow', { log: false })
        .should('not.be.empty')
        .then($window => cy.wrap($window), { log: false })
}

export function getRemix() {
    return cy
        .get('iframe', { log: false })
        .its('0.contentWindow.Remix', { log: false })
        .should('not.be.undefined')
        .then(remix => cy.wrap(remix), { log: false })
}
