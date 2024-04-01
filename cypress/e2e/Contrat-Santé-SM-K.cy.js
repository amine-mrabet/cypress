const b012cag = require('./profile/b012cag.json');
const b300nqa = require('./profile/b300nqa.json');
const ETABLISSEMENT = require('./data-json/Etablissement.json');
const Apporteur = require('./data-json/Apporteur-interlocuteur-inspecteur.json')
const DESCPROJECT = require('./data-json/project-description.json')
const DEMOGRAPHY = require('./data-json/demography.json')
const FILE = require('./data-json/file.json')
const CONTEXTPROJET = require('./data-json/context-projet.json')
const CONTRACTACUELstatistiques = require('./data-json/contrat-actuel-et-statistiques-sante.json')
const ETUDEDIALOG = require('./data-json/etude-dialog.json');
const PERIMETREETUDE = require('./data-json/perimetre-de-etude.json');
// Generate a random 14-digit number
const randomNumber14 = Math.floor(10000000000000 + Math.random() * 90000000000000);
describe('My Web Application Tests', () => {
    it('create Saisie', () => {
      cy.visit('/');
      Login(b012cag.username, b012cag.password)
      Cypress.on('fail', (error, runnable) => {
        Cypress.runner.stop() // Stop the test run
      });
      //
      const isLoginSuccessful = checkLogin(b012cag.username, b012cag.password, b012cag);
      if (isLoginSuccessful) {
        cy.visit('/');
        cy.get('.create-request button').should('exist').click();
        addEtablisement();
        cy.get('#scrollTopBtn').should('exist').click();
        cy.get('.checkmark-container input[type=checkbox]').first().should('exist').click({ force: true });
        cy.get('.broker-inspector-info a').should('exist').click();
        addApporteur()
        cy.get('.project-description a').should('exist').click();
        cy.wait(2000)
        projectDescription()
        cy.get('.Synthese-saisie a').should('exist').click();
        cy.get('app-validation-sasie .style-save button').should('exist').click();
        cy.log("test");
        cy.get('.validation-saisie a').should('exist').click(); 
        cy.log();
        cy.get(".request-reason").should('exist').click();
        cy.get(".p-dropdown-filter").should('exist').type("Conquête")
        cy.get('p-dropdownitem').contains("Conquête").should('exist').click();
        cy.get('app-synthese-saisie .create-project button').should('exist').click();
        cy.wait(10000)
      } else {
        console.log('Login failed');
      }
    });

  it('create Project', () => {
    cy.wait(1000);
    cy.visit('/');
    cy.reload(true);
    Login(b300nqa.username, b300nqa.password)
    Cypress.on('uncaught:exception', (err, runnable) => {
      cy.log('err->>>>>>>>>>>>>>>', err)
      cy.log('runnable->>>>>>>>>>>>>>>', runnable)
      return true;
    });
    
    const isLoginSuccessful = checkLogin(b300nqa.username, b300nqa.password, b300nqa);
    if (isLoginSuccessful) {
      cy.visit('/');
      cy.get('.search-tabs ul li').eq(1).click();
      cy.get('.project-0 .button-expandable-project button').should('exist').click();
      cy.get('.row-expanded .vp-col-actions .plm-grouped-button button').should('exist').click();
      cy.get('.assigner-action button').should('exist').click();
      cy.wait(3000);
      cy.get('.row-expanded .vp-col-actions .plm-grouped-button button').should('exist').click();
      cy.get(' .ouvrir-action button').should('exist').click({ waitForAnimations: false });
      cy.contains('li span', 'Contexte du projet').click({ waitForAnimations: false });
      cy.get('.risk-sante button').should('exist').click();
      cy.contains('.p-datepicker-buttonbar button span', "Aujourd'hui").click({ waitForAnimations: false });
      cy.wait(2000);
      addDynamiqueData(CONTEXTPROJET)
      cy.get('#scrollTopBtn').should('exist').click();
      cy.get('.suivant-action button').should('exist').click({ waitForAnimations: false });
      cy.contains('li span', 'Démographie').click();
      cy.wait(2000);
      addDynamiqueData(DEMOGRAPHY)
      cy.get('#scrollTopBtn').should('exist').click();
      cy.get('.valider-demographie').should('exist').click({ waitForAnimations: false });
      cy.wait(2000);
      cy.contains('li span', 'Contrat actuel et statistiques santé').click();
      cy.wait(2000);
      addDynamiqueData(CONTRACTACUELstatistiques)
      cy.get('.valider-info-contrat').should('exist').click();
      cy.wait(4000);
      cy.get('.create-etude').should('exist').click({ waitForAnimations: false });
      cy.wait(1000);
      addDynamiqueData(ETUDEDIALOG)

      cy.document().then((doc) => {
        let numProjet = doc.querySelector('.numProject > input[type="text"]').id
        let risqueUrl = doc.querySelector('.risque > input[type="text"]').id
        let tarificationTypeUrl = doc.querySelector('.type-de-tarification > p-dropdown span').textContent == 'Tarification sur garanties' ? "garantie" : "statistique";
        let commercialProduct = doc.querySelectorAll('.commercial-product > p-dropdown span span')[1].id;
        cy.visit(`/etudes/${tarificationTypeUrl}/${risqueUrl}?numProject=${numProjet}&commercialProduct=${commercialProduct}`);
      });
      addDynamiqueData(PERIMETREETUDE)
      cy.contains('li span', 'Source de tarification').click();
      cy.get("#enterpriseByDemograhpy-0 input[type=checkbox]").click({ force: true });
      cy.get('.valider-source-tarification').should('exist').click();
      cy.wait(13000);
      cy.contains('li span', 'Tarif').click();
      cy.get('.tarifer').should('exist').click();
      cy.wait(4000);
      cy.get('.save-etude').should('exist').click();
      cy.wait(4000);
      cy.get('.figer-etude').should('exist').click();
      cy.wait(4000);
      cy.visit('/');
      cy.get('.search-tabs ul li').eq(1).click();
      cy.get('.project-0 .button-expandable-project button').should('exist').click();
      cy.get('.row-expanded .vp-col-actions .plm-grouped-button button').should('exist').click();
      cy.get('.ouvrir-action button').should('exist').click({ waitForAnimations: false });
      cy.contains('li span', 'Vue multi-étude').click();
      cy.get('.add-synthesis button').should('exist').click({ waitForAnimations: false });


    } else {
      console.log('Login failed');
    }
  });

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
        if (item[key].random) {
          cy.get(item[key].selectorAttr).should('exist').type(randomNumber14.toString(), { force: true });
        } else {
          cy.get(item[key].selectorAttr).should('exist').type(item[key].value, { force: true });
        }

      }

      if (item[key].type == 'dropDown') {
        cy.wait(500).then(() => {
          cy.get(item[key].selectorAttr).should('exist').click();
          cy.get(".p-dropdown-filter").should('exist').type(item[key].labelFilter)
          cy.get('p-dropdownitem').contains(item[key].labelFilter).should('exist').click();
        })
      }
    })
    cy.get('.add-entreprise button').should('exist').click();
  })

}
/**
 * 
 */
function addApporteur() {

  cy.get(Apporteur.brokerCode.selectorAttr).should('exist').clear({ force: true });
  cy.get(Apporteur.brokerCode.selectorAttr).should('exist').type(Apporteur.brokerCode.value, { force: true });
  cy.get('app-apporteur-inspecteur .broker-code .search-broker-code').should('exist').click();
  cy.get(Apporteur.brokerContactCode.selectorAttr).should('exist').click();
  cy.get(".p-dropdown-filter").should('exist').type(Apporteur.brokerContactCode.labelFilter)
  cy.get('p-dropdownitem').contains(Apporteur.brokerContactCode.labelFilter).should('exist').click();
  cy.get('app-apporteur-inspecteur .siret-preconised input').invoke('val').then(value => {
    cy.get('app-apporteur-inspecteur .siren-dropdown input').should('exist').clear({ force: true });
    cy.get('app-apporteur-inspecteur .siren-dropdown input').should('exist').type(value, { force: true });
    cy.get('app-apporteur-inspecteur .search-siren button').should('exist').click();
  });
  cy.get('p-treetable tbody > tr').should('exist').click();

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
      cy.wait(500).then(() => {
        cy.get(DESCPROJECT[key].selectorAttr).should('exist').click();
        cy.get(".p-dropdown-filter").should('exist').type(DESCPROJECT[key].labelFilter)
        cy.get('p-dropdownitem').contains(DESCPROJECT[key].labelFilter).should('exist').click();   
      })

    }
  })
  uploadFile("#fileDropRef", FILE.filecontent, "exemple.xls")


}
/**
 * 
 * @param {*} data 
 */
function addDynamiqueData(data) {
  Object.entries(data).forEach(([key, value]) => {
    if (data[key].type == 'checkbox') {
      cy.get(data[key].selectorAttr).click({ force: true });
    }
    if (data[key].type == 'input-text') {
      cy.get(data[key].selectorAttr).should('exist').clear({ force: true });
      if (data[key].random) {
        cy.get(data[key].selectorAttr).should('exist').type(randomNumber14.toString(), { force: true });
      } else {
        cy.get(data[key].selectorAttr).should('exist').type(data[key].value, { force: true });
      }
    }
    if (data[key].type == 'dropDown') {
      cy.wait(500).then(() => {
        cy.get(data[key].selectorAttr).should('exist').click();
        cy.get(".p-dropdown-filter").should('exist').type(data[key].labelFilter)
        cy.get('p-dropdownitem').contains(data[key].labelFilter).should('exist').click();
      })

    }
    if (data[key].type == 'dropDownNoFilter') {
      cy.get(data[key].selectorAttr).should('exist').click();
      cy.get('p-dropdownitem').contains(data[key].labelFilter).should('exist').click();
    }
  })
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


