const { Builder, By, until, WebDriverWait } = require('selenium-webdriver');
const assert = require('assert');

describe('attributes', () => {
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('firefox').build();
  });

  after(async () => {
    await driver.quit();
  });

  beforeEach(async () => {
    driver.manage().deleteAllCookies();
    await driver.get('http://localhost:9990/admin');
    // await driver.get('http://150.165.75.99:9990/admin');
    await driver.findElement(By.id('_username')).sendKeys('sylius');
    await driver.findElement(By.id('_password')).sendKeys('sylius');
    await driver.findElement(By.css('.primary')).click();
    // await driver.sleep(1000);
  });

  async function createAttribute(codeAtt, nameAtt, posAtt) {
    const att = await driver.findElement(By.css('a[href="/admin/product-attributes/"]'));
    await att.click();

    const create = await driver.findElement(By.css('*[class^="ui labeled icon top right floating dropdown button primary link"]'));
    await create.click();

    const text = await driver.findElement(By.css('a[href="/admin/product-attributes/text/new"]'));
    await text.click();

    if (codeAtt) {
      const code = await driver.findElement(By.id('sylius_product_attribute_code'));
      await code.sendKeys(codeAtt);
    }

    if (posAtt){
    const pos = await driver.findElement(By.id('sylius_product_attribute_position'));
    await pos.sendKeys(posAtt);
    }

    if (nameAtt) {
      const name = await driver.findElement(By.id('sylius_product_attribute_translations_en_US_name'));
      await name.sendKeys(nameAtt);
    }

    const button = await driver.findElement(By.css('*[class^="ui labeled icon primary button"]'));
    await button.click();
  }

  // Remove .only and implement others test cases!
  it('testing edit attribute position', async () => {
    // Click in attributes in side menu
    await driver.findElement(By.linkText('Attributes')).click();

    // Type in value input to search for specify attribute
    await driver.findElement(By.id('criteria_code_value')).sendKeys('dress_collection');

    // Click in filter blue button
    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();

    // Click in edit of the remain attribute
    const buttons = await driver.findElements(By.css('*[class^="ui labeled icon button "]'));
    await buttons[0].click();

    // Edit attribute position
    const inputName = await driver.findElement(By.id('sylius_product_attribute_position'));
    inputName.click();
    inputName.clear();
    inputName.sendKeys('10');

    // Click on Save changes button
    await driver.findElement(By.id('sylius_save_changes_button')).click();

    // Assert that attribute has been updated
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Product attribute has been successfully updated.'));
  });

  //!OK
  it('Criar atributo novo', async () => { //!OK

    await createAttribute('silk-fabric-type-new', 'silk fabric type new', '2');

    const body = await driver.findElement(By.tagName('body'));
    const result = await body.getText();

    assert((result).includes('Product attribute has been successfully created.'));
  });

  //!OK
  it('Criar atributo novo com código de atributo já existente: erro', async () => {
    
    // CRIANDO O ATRIBUTO PELA PRIMEIRA VEZ
    await createAttribute('silk-fabric-type-dupped', 'silk fabric type dupped', '3');


    // CRIANDO O ATRIBUTO PELA SEGUNDA VEZ
    await createAttribute('silk-fabric-type-dupped', 'silk fabric type dupped', '3');

    const body = await driver.findElement(By.tagName('body'));
    const result = await body.getText();

    assert(result.includes('This form contains errors.'));
    assert(result.includes('This code is already in use.'));
  });

  //!OK
  it('Filtrar atributo que existe', async () => {

    await createAttribute('silk-fabric-type-filter', 'silk fabric type filter', '4');

    const att = await driver.findElement(By.css('a[href="/admin/product-attributes/"]')); 
    await att.click();

    const crit = await driver.findElement(By.id('criteria_code_value'));
    await crit.sendKeys('silk-fabric-type-filter');

    const button = await driver.findElement(By.css('*[class^="ui blue labeled icon button"]'));
    await button.click();

    const body = await driver.findElement(By.tagName('body'));
    const result = await body.getText();

    assert(result.includes('silk-fabric-type-filter'));
  });

  //!OK
  it('Filtrar atributo que não existe', async () => {
    const att = await driver.findElement(By.css('a[href="/admin/product-attributes/"]')); 
    await att.click();

    const crit = await driver.findElement(By.id('criteria_code_value'));
    await crit.sendKeys('silk-fabric-type-filter-non-existent');

    const button = await driver.findElement(By.css('*[class^="ui blue labeled icon button"]'));
    await button.click();

    const body = await driver.findElement(By.tagName('body'));
    const result = await body.getText();

    assert(result.includes('There are no results to display'));
  });

  it('Excluir atributo existente', async () => {
    await createAttribute('silk-fabric-type-delete', 'silk fabric type delete', '5');

    const att = await driver.findElement(By.css('a[href="/admin/product-attributes/"]')); 
    await att.click();

    const button = await driver.findElement(By.css('*[class^="ui red labeled icon button"]'));
    await button.click();  

    const confirm = await driver.findElement(By.css('*[class^="ui green ok inverted button"]'));
    await confirm.click();
  
    const body = await driver.findElement(By.tagName('body'));
    const result = await body.getText();

    assert(result.includes('Product attribute has been successfully deleted.'));
  }); 

  it('Tentar criar atributo sem nome: erro', async () => {
    await createAttribute('silk-fabric-type-no-name', null, '6');

    const body = await driver.findElement(By.tagName('body'));
    const result = await body.getText();

    assert(result.includes('This form contains errors.'));
  });

  it('Tentar criar atributo sem código: erro', async () => {
    await createAttribute(null, 'silk fabric type no code', '7');

    const body = await driver.findElement(By.tagName('body'));
    const result = await body.getText();

    assert(result.includes('This form contains errors.'));
  });

  it('Tentar criar atributo sem posição: sucesso, pos automática', async () => {
    await createAttribute('silk-fabric-type-no-pos', 'silk fabric type no pos', null);

    const body = await driver.findElement(By.tagName('body'));
    const result = await body.getText();

    assert(result.includes('Product attribute has been successfully created.'));
  });

  it('Tentar criar atributo passando posição negativa', async () => {
    await createAttribute('silk-fabric-type-neg-pos', 'silk fabric type neg pos', '-1');

    const body = await driver.findElement(By.tagName('body'));
    const result = await body.getText();

    assert(result.includes('Product attribute has been successfully created.'));
  });

});
