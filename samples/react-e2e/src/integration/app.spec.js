describe('react', () => {
  beforeEach(() => cy.visit('/'));

  it('should show two input nodes', () => {
    cy.get('#node-1').should('exist');
    cy.get('#node-2').should('exist');

    cy.get('#node-1 > .control > input').should('have.value', 2);
    cy.get('#node-2 > .control > input').should('have.value', 3);
  });

  it('should have one add node', () => {
    cy.get('#node-3').should('exist');
    cy.get('#node-3 > .control > input').should('have.value', 5);
  });

  it('should have two connections', () => {
    cy.get('.connection').its('length').should('eq', 2);
  });
});
