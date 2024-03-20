const cag012 = require('./profile/cag012.json');
const b300nqa = require('./profile/b300nqa.json');
const ETABLISSEMENT = require('./data-json/Etablissement.json');
const Apporteur = require('./data-json/Apporteur-interlocuteur-inspecteur.json')
describe('My Web Application Tests', () => {
  it('create Saisie', () => {
    cy.visit('/');
    cy.get('input').first().should('exist').type(cag012.username);
    cy.get('input[type=password]').should('exist').type(cag012.password);
    cy.get('#kc-form-login input[type=submit]').should('exist').click();
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });
    //
    const isLoginSuccessful = Login(cag012.username, cag012.password, cag012);
    if (isLoginSuccessful) {
      cy.visit('/');
      cy.wait(3000);
      cy.get('.create-request button').should('exist').click();
           ETABLISSEMENT.forEach((item) => {
          cy.wait(1000);
          addEtablisement(item);
        })
        cy.get('#scrollTopBtn').should('exist').click();
        cy.get('.checkmark-container input[type=checkbox]').first().should('exist').click({ force: true });
        cy.get('.broker-inspector-info a').should('exist').click();
        cy.wait(1000);
        addApporteur()
    } else {
      console.log('Login failed');
    }
  });

/*     it('create Project', () => {
      //login
      cy.visit('/');
      cy.wait(2000);
      cy.get('input').first().should('exist').type(b300nqa.username);
      cy.get('input[type=password]').should('exist').type(b300nqa.password);
      cy.get('#kc-form-login input[type=submit]').should('exist').click();
      cy.wait(1000);
      Cypress.on('uncaught:exception', (err, runnable) => {
        return false;
      });
      //
      const isLoginSuccessful = Login(b300nqa.username, b300nqa.password,b300nqa);
      if (isLoginSuccessful) {
        cy.visit('/');
        } else {
        console.log('Login failed');
      }
    }); */
    
});
function Login(username, password, login) {
  if (username === login.username && password === login.password) {
    return true; // Successful login
  } else {
    return false; // Failed login
  }
}
function addEtablisement(Etablissement) {
  Object.keys(Etablissement).forEach((field) => {
    if(Etablissement[field] == "checkbox"){
      cy.get(Etablissement.checkbox.selectorAttr).click({ force: true });
    }
    if(Etablissement[field].type == "input-text"){
      cy.get(Etablissement[field].selectorAttr).should('exist').clear({ force: true });
      cy.get(Etablissement[field].selectorAttr).should('exist').type(Etablissement[field].value, { force: true });
    }
    if(Etablissement[field].type == "dropDown"){
      cy.get(Etablissement[field].selectorAttr).should('exist').click();
      cy.get(".p-dropdown-filter").should('exist').type(Etablissement[field].labelFilter)
      cy.get('p-dropdownitem').contains(Etablissement[field].labelFilter).should('exist').click();
    
    }
  })
  cy.get('.add-entreprise button').should('exist').click();
/*   cy.get(Etablissement.checkbox.selectorAttr).click({ force: true });

  cy.get(Etablissement.socialReason.selectorAttr).should('exist').clear({ force: true });
  cy.get(Etablissement.socialReason.selectorAttr).should('exist').type(Etablissement.socialReason.value, { force: true });

  cy.get(Etablissement.manager.selectorAttr).should('exist').clear({ force: true });
  cy.get(Etablissement.manager.selectorAttr).should('exist').type(Etablissement.manager.value, { force: true });

  cy.get(Etablissement.codeNaf.selectorAttr).should('exist').clear({ force: true });
  cy.get(Etablissement.codeNaf.selectorAttr).should('exist').type(Etablissement.codeNaf.value, { force: true });

  cy.get(Etablissement.legalForm.selectorAttr).should('exist').click();
  cy.get(".p-dropdown-filter").should('exist').type(Etablissement.legalForm.labelFilter)
  cy.get('p-dropdownitem').contains(Etablissement.legalForm.labelFilter).should('exist').click();

  cy.get(Etablissement.country.selectorAttr).should('exist').click();
  cy.get(".p-dropdown-filter").should('exist').type(Etablissement.country.labelFilter)
  cy.get('p-dropdownitem').contains(Etablissement.country.labelFilter).should('exist').click();

  cy.get(Etablissement.postalCode.selectorAttr).should('exist').clear({ force: true });
  cy.get(Etablissement.postalCode.selectorAttr).should('exist').type(Etablissement.postalCode.value, { force: true });

  cy.get(Etablissement.streetName.selectorAttr).should('exist').clear({ force: true });
  cy.get(Etablissement.streetName.selectorAttr).should('exist').type(Etablissement.streetName.value, { force: true });

  cy.get(Etablissement.siret.selectorAttr).should('exist').clear({ force: true });
  cy.get(Etablissement.siret.selectorAttr).should('exist').type(Etablissement.siret.value, { force: true });
  cy.get('.add-entreprise button').should('exist').click(); */
  
}

function addApporteur(){
  
  cy.get(Apporteur.brokerCode.selectorAttr).should('exist').clear({ force: true });
  cy.get(Apporteur.brokerCode.selectorAttr).should('exist').type(Apporteur.brokerCode.value, { force: true });
  cy.wait(1000);
  cy.get('app-apporteur-inspecteur .broker-code .search-broker-code').should('exist').click();
  cy.wait(1000);
  cy.get(Apporteur.brokerContactCode.selectorAttr).should('exist').click();
  cy.get(".p-dropdown-filter").should('exist').type(Apporteur.brokerContactCode.labelFilter)
  cy.get('p-dropdownitem').contains(Apporteur.brokerContactCode.labelFilter).should('exist').click();

  //cy.get('app-apporteur-inspecteur .siren-dropdown').should('exist').clear({ force: true });
  /* cy.get('app-apporteur-inspecteur .siren-dropdown').should('exist').click();
  cy.get(".p-dropdown-filter").should('exist').type("32060735100071")
  cy.get('p-dropdownitem').contains("32060735100071").should('exist').click(); */
  /*    */
  console.log(cy.get('.siret-preconised input').should('exist').value)
  cy.get('app-apporteur-inspecteur .siren-dropdown input').should('exist').clear({ force: true });
  cy.get('app-apporteur-inspecteur .siren-dropdown input').should('exist').type("32060735100071", { force: true });
  cy.get('app-apporteur-inspecteur .search-siren button').should('exist').click();


  ;
  
}
