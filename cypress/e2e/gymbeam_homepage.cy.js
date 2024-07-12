Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes('tp is not defined')) {
    return false;
  }
  return true;
});

describe('GymBeam homepage', () => {
  let fitnessItem;
  let initialPromoItem;
  let newPromoItem;

  it('Position of last visited product', () => {

    cy.intercept({
      method: 'GET',
      url: '/rest/gymbeamsk/V1/promotion-products*',
    }).as('getPromotionProducts');

    cy.intercept('/deliverydate').as('deliverydate');

    cy.intercept('/fitness-oblecenie').as('fitnessClothes');

    cy.visit('/');

    cy.wait('@getPromotionProducts', { timeout: 10000 }).then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });

    cy.get('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll', { timeout: 20000 })
      .should('be.visible')
      .click()
      .then((cookieButton) => {
        cy.get(cookieButton, { timeout: 10000 }).should('not.be.visible');
      });

    cy.scrollTo(0, 500);

    // Save name of first displayed promotion
    cy.get('.product-items .product-item', { timeout: 15000 }).first().within(() => {
      cy.get('.product-item-click')
        .invoke('attr', 'title')
        .then((title) => {
          initialPromoItem = title.split('/').pop();
          cy.log('Name of first product:', initialPromoItem);
        });
    });

    // Open sport clothes 
    cy.get('a[href="https://gymbeam.sk/fitness-oblecenie"]')
      .first()
      .click();

    cy.wait('@fitnessClothes').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });

    // Open detail of first displayed fitness product
    cy.get('.product-item-click').eq(0).as('firstItem')
      .invoke('attr', 'title')
      .then((title) => {
        fitnessItem = title.split('/').pop();
        cy.log('Name of fitness clothe:', fitnessItem);
        cy.get('@firstItem').click()
      });

    cy.wait('@deliverydate', { timeout: 20000 }).then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });

    cy.visit('/');

    cy.wait('@getPromotionProducts', { timeout: 10000 }).then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });

    cy.scrollTo(0, 500);

    // Save name of first displayed promotion
    cy.get('.product-items .product-item', { timeout: 15000 }).first().within(() => {
      cy.get('.product-item-click')
        .invoke('attr', 'title')
        .then((title) => {
          newPromoItem = title.split('/').pop();
          cy.log('Name of first product:', newPromoItem);
        });
    });

    // Test that new item is displayed on dashboard as first
    cy.get('@firstItem').then(() => {
      expect(fitnessItem).not.to.equal(initialPromoItem);
      expect(fitnessItem).to.equal(newPromoItem);
    });
  });
});