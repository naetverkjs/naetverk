describe('Arrange Plugin', () => {
  beforeEach(() => cy.visit('/'));
  it('should rearrange the nodes', () => {
    cy.get('#node-1').then((n1) => {
      const node1 = n1[0].getBoundingClientRect();
      cy.get('#arrange').click();
      cy.wait(2000);
      cy.get('#node-1').then((n2) => {
        const node2 = n2[0].getBoundingClientRect();
        console.log(node1, node2);
        expect(node2).to.not.equal(node1);
      });
    });
  });
});
