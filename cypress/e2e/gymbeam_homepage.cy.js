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

  it('Test of: Position of last visited product', () => {

    cy.intercept({
      method: 'GET',
      url: '/rest/gymbeamsk/V1/promotion-products*',
    }).as('getPromotionProducts');

    cy.intercept({
      method: 'GET',
      url: '/deliverydate',
    }).as('deliverydate');

    cy.intercept({
      method: 'GET',
      url: '/fitness-oblecenie',
    }).as('fitnessClothes');

    cy.visit('/');

    cy.wait('@getPromotionProducts', { timeout: 10000 }).then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });

    // Handle Cookie modal window
    cy.get('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll', { timeout: 20000 })
      .should('be.visible')
      .click()
      .then((cookieButton) => {
        cy.get(cookieButton, { timeout: 10000 }).should('not.be.visible');
      });

    cy.scrollTo(0, 500);

    // Save name of initial promotion item
    cy.getNameOfFirstPromotionItem().then((firstPromoItem) => {
      initialPromoItem = firstPromoItem;
    });

    // Open sport clothes 
    cy.get('a[href="https://gymbeam.sk/fitness-oblecenie"]')
      .first()
      .click();

    cy.wait('@fitnessClothes').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });

    // Open detail of first displayed fitness product and save its name
    cy.get('.product-item-click').eq(0).as('firstFitnessItem')
      .invoke('attr', 'title')
      .then((title) => {
        fitnessItem = title.split('/').pop();
        cy.log('Name of fitness clothe:', fitnessItem);
        cy.get('@firstFitnessItem').click();
      });

    cy.wait('@deliverydate', { timeout: 20000 }).then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });

    cy.visit('/');

    cy.wait('@getPromotionProducts', { timeout: 10000 }).then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });

    cy.scrollTo(0, 500);

    // Save name of new promotion item
    cy.getNameOfFirstPromotionItem().then((firstPromoItem) => {
      newPromoItem = firstPromoItem;
    });

    // Test that new item is displayed on homepage as first
    cy.get('@firstFitnessItem').then(() => {
      expect(fitnessItem).not.to.equal(initialPromoItem, 'First promotion item was changed');
      expect(fitnessItem).to.equal(newPromoItem);
    });
  });
});
