describe('Arrange Plugin', () => {
  beforeEach(() => cy.visit('/'));
  it('should enable the history functionality', () => {
    cy.get('#node-1').then((n1) => {
      const node1 = n1[0].getBoundingClientRect();
      cy.get('#arrange').click();
      cy.wait(200);
      cy.get('#node-1').then((n2) => {
        const node2 = n2[0].getBoundingClientRect();
        expect(node2).to.not.equal(node1);

        cy.get('#undo').click();
        cy.get('#undo').click();
        cy.get('#undo').click();
        cy.get('#node-1').then((n3) => {
          const node3 = n3[0].getBoundingClientRect();
          expect(node3.x).to.equal(node1.x);
        });
      });
    });
  });
});
