const b012cag = require('./profile/b012cag.json');
const b300nqa = require('./profile/b300nqa.json');
const ETABLISSEMENT = require('./data-json/Etablissement.json');
const Apporteur = require('./data-json/Apporteur-interlocuteur-inspecteur.json')
const DESCPROJECT = require('./data-json/project-description.json')
const FILE = require('./data-json/file.json')
// Generate a random 14-digit number
const randomNumber14 = Math.floor(10000000000000 + Math.random() * 90000000000000);
describe('My Web Application Tests', () => {
  it('create Saisie', () => {
    cy.visit('/');
    Login(b012cag.username, b012cag.password)
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });
    //
    const isLoginSuccessful = checkLogin(b012cag.username, b012cag.password, b012cag);
    if (isLoginSuccessful) {
      cy.visit('/');
      cy.wait(3000);
      cy.get('.create-request button').should('exist').click();
      addEtablisement();
      cy.get('#scrollTopBtn').should('exist').click();
      cy.get('.checkmark-container input[type=checkbox]').first().should('exist').click({ force: true });
      cy.get('.broker-inspector-info a').should('exist').click();
      cy.wait(1000);
      addApporteur()
      cy.get('.project-description a').should('exist').click();
      cy.wait(1000);
      projectDescription()
      cy.get('.Synthese-saisie a').should('exist').click();
      cy.wait(1000);
      cy.get('app-validation-sasie .style-save button').should('exist').click();
      cy.wait(8000).then(() => {
        cy.get('.validation-saisie a').should('exist').click();
      })
      cy.get(".request-reason").should('exist').click();
      cy.get(".p-dropdown-filter").should('exist').type("Conquête")
      cy.get('p-dropdownitem').contains("Conquête").should('exist').click();

 

    } else {
      console.log('Login failed');
    }
  });

  /*     it('create Project', () => {
        //login
        cy.visit('/');
        cy.wait(2000);
        Login(b300nqa.username,b300nqa.password)
        cy.wait(1000);
        Cypress.on('uncaught:exception', (err, runnable) => {
          return false;
        });
        //
        const isLoginSuccessful = checkLogin(b300nqa.username, b300nqa.password,b300nqa);
        if (isLoginSuccessful) {
          cy.visit('/');
          } else {
          console.log('Login failed');
        }
      }); */

});
/**
 * 
 * @param {*} username 
 * @param {*} password 
 * @param {*} login 
 * @returns 
 */
function checkLogin(username, password, login) {
  if (username === login.username && password === login.password) {
    return true; // Successful login
  } else {
    return false; // Failed login
  }
}
/**
 * 
 * @param {*} username 
 * @param {*} password 
 */
function Login(username, password) {
  cy.get('input').first().should('exist').type(username);
  cy.get('input[type=password]').should('exist').type(password);
  cy.get('#kc-form-login input[type=submit]').should('exist').click();
}
/**
 * 
 */
function addEtablisement() {
  ETABLISSEMENT.forEach((item) => {
    Object.entries(item).forEach(([key, value]) => {
      if (item[key].type == 'checkbox') {
        cy.get(item.checkbox.selectorAttr).click({ force: true });
      }
      if (item[key].type == 'input-text') {
        cy.get(item[key].selectorAttr).should('exist').clear({ force: true });
        if(item[key].random){
          cy.get(item[key].selectorAttr).should('exist').type(randomNumber14.toString(), { force: true });
        }else{
          cy.get(item[key].selectorAttr).should('exist').type(item[key].value, { force: true });
        }
        
      }
      if (item[key].type == 'dropDown') {
        cy.get(item[key].selectorAttr).should('exist').click();
        cy.get(".p-dropdown-filter").should('exist').type(item[key].labelFilter)
        cy.get('p-dropdownitem').contains(item[key].labelFilter).should('exist').click();
      }
    })
    cy.wait(1000);
    cy.get('.add-entreprise button').should('exist').click();
  })

}
/**
 * 
 */
function addApporteur() {

  cy.get(Apporteur.brokerCode.selectorAttr).should('exist').clear({ force: true });
  cy.get(Apporteur.brokerCode.selectorAttr).should('exist').type(Apporteur.brokerCode.value, { force: true });
  cy.wait(1000);
  cy.get('app-apporteur-inspecteur .broker-code .search-broker-code').should('exist').click();
  cy.wait(1000);
  cy.get(Apporteur.brokerContactCode.selectorAttr).should('exist').click();
  cy.get(".p-dropdown-filter").should('exist').type(Apporteur.brokerContactCode.labelFilter)
  cy.get('p-dropdownitem').contains(Apporteur.brokerContactCode.labelFilter).should('exist').click();
  cy.get('app-apporteur-inspecteur .siret-preconised input').invoke('val').then(value => {
    cy.get('app-apporteur-inspecteur .siren-dropdown input').should('exist').clear({ force: true });
    cy.get('app-apporteur-inspecteur .siren-dropdown input').should('exist').type(value, { force: true });
    cy.get('app-apporteur-inspecteur .search-siren button').should('exist').click();
  });
  cy.get('p-treetable tbody > tr').should('exist').click();


  ;

}
/**
 * 
 */
function projectDescription() {
  //cy.get('[formControlName="ensemblePersonnel"] input').check().should('be.checked');
  Object.entries(DESCPROJECT).forEach(([key, value]) => {
    if (DESCPROJECT[key].type == 'checkbox') {
      cy.get(DESCPROJECT[key].selectorAttr).click({ force: true });
    }
    if (DESCPROJECT[key].type == 'input-text') {
      cy.get(DESCPROJECT[key].selectorAttr).should('exist').clear({ force: true });
      cy.get(DESCPROJECT[key].selectorAttr).should('exist').type(DESCPROJECT[key].value, { force: true });
    }
    if (DESCPROJECT[key].type == 'dropDown') {
      cy.get(DESCPROJECT[key].selectorAttr).should('exist').click();
      cy.get(".p-dropdown-filter").should('exist').type(DESCPROJECT[key].labelFilter)
      cy.get('p-dropdownitem').contains(DESCPROJECT[key].labelFilter).should('exist').click();
    }
  })
  uploadFile("#fileDropRef", FILE.filecontent, "exemple.xls")


}
/**
 * 
 * @param {*} input 
 * @param {*} fileContent 
 * @param {*} fileName 
 */
function uploadFile(input, fileContent, fileName) {
  cy.get(input).then(($input) => {
    const blob = Cypress.Blob.base64StringToBlob(fileContent);
    const testFile = new File([blob], fileName, {
      type: 'application/vnd.ms-excel',
    });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(testFile);
    $input[0].files = dataTransfer.files;
    cy.wrap($input[0]).trigger('change', { force: true });
  });
}


