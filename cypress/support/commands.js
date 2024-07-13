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
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('getNameOfFirstPromotionItem', () => {
    cy.get('.product-items .product-item', { timeout: 15000 }).first().within(() => {
        cy.get('.product-item-click')
            .invoke('attr', 'title')
            .then((title) => {
                const firstPromoItem = title.split('/').pop();
                cy.log('Name of first promotion item:', firstPromoItem);
                cy.wrap(firstPromoItem).as('firstPromoItem');
            });
    });
    return cy.get('@firstPromoItem');
});