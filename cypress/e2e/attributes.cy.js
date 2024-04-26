describe('attributes', () => {
  beforeEach(() => {
    cy.visit('/admin');
    cy.get('[id="_username"]').type('sylius');
    cy.get('[id="_password"]').type('sylius');
    cy.get('.primary').click();
  });

  function createAttribute(codeAtt, nameAtt, posAtt) {
    cy.clickInFirst('a[href="/admin/product-attributes/"]');
    cy.get('*[class^="ui labeled icon top right floating dropdown button primary link"]').click();
    cy.clickInFirst('a[href="/admin/product-attributes/text/new"]');

    if (codeAtt != '') {
      cy.get('*[id="sylius_product_attribute_code"]').type(codeAtt);
    }

    if (posAtt != '') {
      cy.get('*[id="sylius_product_attribute_position"]').type(posAtt);
    }

    if (nameAtt != '') {
      cy.get('*[id="sylius_product_attribute_translations_en_US_name"]').type(nameAtt);
    }

    cy.get('*[class^="ui labeled icon primary button"]').click();

  }

  it('testing edit attribute position', () => {
    // Click in products in side menu
    cy.clickInFirst('a[href="/admin/product-attributes/"]');
    // Type in value input to search for specify attribute
    cy.get('[id="criteria_code_value"]').type('dress_collection');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the remain attribute
    cy.clickInFirst('*[class^="ui labeled icon button "]');
    // Edit attribute position
    cy.get('[id="sylius_product_attribute_position"]').clear().type('10');
    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    // Assert that attribute has been updated
    cy.get('body').should('contain', 'Product attribute has been successfully updated.');
  });

  it('Criar atributo novo', () => {
    createAttribute('silk-fabric-type-new', 'silk fabric type new', '2');
    cy.get('body').should('contain', 'Product attribute has been successfully created.');
  });

  it('Criar atributo novo com código de atributo já existente: erro', () => {

    createAttribute('silk-fabric-type-dupped', 'silk fabric type dupped', '3');
    createAttribute('silk-fabric-type-dupped', 'silk fabric type dupped', '3');

    cy.get('body').should('contain', 'This form contains errors.');
    cy.get('body').should('contain', 'This code is already in use.');
  });

  it('Filtrar atributo que existe', () => {
    createAttribute('silk-fabric-type-filter', 'silk fabric type filter', '4');

    cy.clickInFirst('a[href="/admin/product-attributes/"]');
    cy.get('*[id="criteria_code_value"]').type('silk-fabric-type-filter');
    cy.get('*[class^="ui blue labeled icon button"]').click();

    cy.get('body').should('contain', 'silk-fabric-type-filter');

  });

  it('Filtrar atributo que não existe', () => {
    cy.clickInFirst('a[href="/admin/product-attributes/"]');
    cy.get('*[id="criteria_code_value"]').type('silk-fabric-type-filter-non-existent');
    cy.get('*[class^="ui blue labeled icon button"]').click();

    cy.get('body').should('contain', 'There are no results to display');

  });

  it('Excluir atributo existente', () => {

    createAttribute('silk-fabric-type-delete', 'silk fabric type delete', '5');

    cy.clickInFirst('a[href="/admin/product-attributes/"]');
    cy.get('*[class^="ui red labeled icon button"]').eq(5).click();
    cy.get('*[class^="ui green ok inverted button"]').click();

    cy.get('body').should('contain', 'Product attribute has been successfully deleted.');
  });


  it('Tentar criar atributo sem nome: erro', () => {

    createAttribute('silk-fabric-type-no-name', '', '6');
    cy.get('body').should('contain', 'This form contains errors.');

  });

  it('Tentar criar atributo sem código: erro', () => {

    createAttribute('', 'silk fabric type no code', '7');
    cy.get('body').should('contain', 'This form contains errors.');

  });

  it('Tentar criar atributo sem posição: sucesso, pos automática', () => {

    createAttribute('silk-fabric-type-no-pos', 'silk fabric type no pos', '');
    cy.get('body').should('contain', 'Product attribute has been successfully created.');

  });

  it('Tentar criar atributo passando posição negativa', () => {

    createAttribute('silk-fabric-type-neg-pos', 'silk fabric type neg pos', '-1');
    cy.get('body').should('contain', 'Product attribute has been successfully created.');

  });
});