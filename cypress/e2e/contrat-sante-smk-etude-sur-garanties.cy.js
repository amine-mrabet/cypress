const b012cag = require('./profile/b012cag.json');
const b300nqa = require('./profile/b300nqa.json');
const b011jpz = require('./profile/b011jpz.json');
const b011juc = require('./profile/b011juc.json');
const ETABLISSEMENT = require('./data-json/Etablissement.json');
const Apporteur = require('./data-json/Apporteur-interlocuteur-inspecteur.json')
const DESCPROJECT = require('./data-json/project-description.json')
const DEMOGRAPHY = require('./data-json/demography.json')
const FILE = require('./data-json/file.json')
const CONTEXTPROJET = require('./data-json/context-projet.json')
const CONTRACTACUELSTATISTIQUES = require('./data-json/contrat-actuel-et-statistiques-sante.json')
const ETUDEDIALOG = require('./data-json/etude-dialog.json');
const PERIMETREETUDE = require('./data-json/perimetre-de-etude.json');
const nommer_redacteur_technico_commercial = require('./data-json/nommer-redacteur-technico-commercial.json');
// Generate a random 14-digit number
const randomNumber14 = Math.floor(10000000000000 + Math.random() * 90000000000000);
var NUM_PROJET = "2024AJ74"
describe('My Web Application Tests', () => {
  it('create Saisie', () => {
    cy.visit('/');
    Login(b012cag.username, b012cag.password)
    Cypress.on('uncaught:exception', (err, runnable) => {
      Cypress.runner.stop() // Stop the test run
    });
    Cypress.on('fail', (error, runnable) => {
      Cypress.runner.stop() // Stop the test run
    });
    const isLoginSuccessful = checkLogin(b012cag.username, b012cag.password, b012cag);
    if (isLoginSuccessful) {
      cy.visit('/');
      cy.get('.create-request button').should('exist').click({ waitForAnimations: false });
      addEtablisement();
      cy.get('#scrollTopBtn').should('exist').click();
      cy.get('.checkmark-container input[type=checkbox]').first().should('exist').click({ force: true });
      cy.get('.broker-inspector-info a').should('exist').click();
      addApporteur()
      cy.get('.project-description a').should('exist').click();
      cy.wait(3000)
      projectDescription()
      cy.get('.Synthese-saisie a').should('exist').click();
      cy.get('app-validation-sasie .style-save button').should('exist').click({ waitForAnimations: false });
      cy.get('.validation-saisie a').should('exist').click({ waitForAnimations: false });
      cy.get(".request-reason").should('exist').click({ waitForAnimations: false });
      cy.get(".p-dropdown-filter").should('exist').type("Conquête")
      cy.get('p-dropdownitem').contains("Conquête").should('exist').click();
      cy.get('app-synthese-saisie .create-project button').should('exist').click({ waitForAnimations: false });
      cy.get(".open-project").should('exist').click({ waitForAnimations: false });
      cy.wait(7000)
      cy.url().then(url => {
        const uri = url.split('/').slice(3).join('/');
        NUM_PROJET = uri.split('#/project?numProject=').join('')
  });
    } else {
      console.log('Login failed');
    }
  });
  it('create Project', () => {
    cy.wait(1000);
    cy.visit('/');
    cy.wait(500)
    cy.reload(true);
    Login(b300nqa.username, b300nqa.password)
    Cypress.on('uncaught:exception', (err, runnable) => {
      Cypress.runner.stop() // Stop the test run
    });
    Cypress.on('fail', (error, runnable) => {
      Cypress.runner.stop() // Stop the test run
    });

    const isLoginSuccessful = checkLogin(b300nqa.username, b300nqa.password, b300nqa);
    if (isLoginSuccessful) {
      cy.visit('/');
      cy.reload(true);
      cy.get('.search-tabs ul li').eq(1).click();
      cy.get("#numproject").should('exist').type(NUM_PROJET)
      cy.get('app-project-project-search-input .search  button').should('exist').click();  
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
      cy.get('#scrollTopBtn').should('exist').click({ waitForAnimations: false });
      cy.get('.suivant-action button').should('exist').click({ waitForAnimations: false });
      cy.contains('li span', 'Démographie').click();
      cy.wait(2000);
      addDynamiqueData(DEMOGRAPHY)
      cy.get('#scrollTopBtn').should('exist').click({ waitForAnimations: false });
      cy.get('.valider-demographie').should('exist').click({ waitForAnimations: false });
      cy.wait(2000);
      cy.contains('li span', 'Contrat actuel et statistiques santé').click();
      cy.wait(2000);
      addDynamiqueData(CONTRACTACUELSTATISTIQUES)
      cy.get('.valider-info-contrat').should('exist').click({ waitForAnimations: false });
      cy.wait(5000);
      cy.document().then((doc) => {
        cy.get('.create-etude').scrollIntoView();
        //doc.documentElement.scrollTop += 70;
      });
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
      cy.get('.valider-source-tarification').should('exist').click({ waitForAnimations: false });
      cy.wait(13000);
      cy.contains('li span', 'Tarif').click();
      cy.get('.tarifer').should('exist').click({ waitForAnimations: false });
      cy.wait(4000);
      cy.get('.save-etude').should('exist').click({ waitForAnimations: false });
      cy.wait(4000);
      cy.get('.figer-etude').should('exist').click({ waitForAnimations: false });
      cy.wait(4000);
      cy.visit('/');
      cy.get('.search-tabs ul li').eq(1).click();
      cy.get("#numproject").should('exist').type(NUM_PROJET)
      cy.get('app-project-project-search-input .search  button').should('exist').click();
      cy.get('.project-0 .button-expandable-project button').should('exist').click();
      cy.get('.row-expanded .Process_Projet .vp-col-actions .plm-grouped-button button').should('exist').click();
      cy.get('.ouvrir-action button').should('exist').click({ waitForAnimations: false });
      cy.contains('li span', 'Vue multi-étude').click();
      cy.get('.add-synthesis').should('exist').click({ waitForAnimations: false });
      cy.get('.simulation-etude-0 .pi-chevron-right').should('exist').click()
      cy.get('.simulation-0 p-checkbox').should('exist').click()
      cy.get('.add-cotation').should('exist').click({ waitForAnimations: false })
      cy.get('.reponse-tarifaire').should('exist').click({ waitForAnimations: false });
      cy.contains('li span', "Tableau d'émission").click({ waitForAnimations: false });

    } else {
      console.log('Login failed');
    }
  });
  it('validation Accord Client', () => {
    cy.wait(1000);
    cy.visit('/');
    cy.wait(500)
    cy.reload(true);
    Login(b011jpz.username, b011jpz.password)
    Cypress.on('uncaught:exception', (err, runnable) => {
      Cypress.runner.stop() // Stop the test run
    });
    Cypress.on('fail', (error, runnable) => {
      Cypress.runner.stop() // Stop the test run
    });
    const isLoginSuccessful = checkLogin(b011jpz.username, b011jpz.password, b011jpz);
    if (isLoginSuccessful) {
      cy.visit('/');
      cy.reload(true);
      cy.get('.search-tabs ul li').eq(1).click();
      cy.get("#numproject").should('exist').type(NUM_PROJET)
      cy.get('app-project-project-search-input .search  button').should('exist').click();
      cy.get('.project-0 .button-expandable-project button').should('exist').click();
      cy.get('.row-expanded .vp-col-actions .plm-grouped-button button').should('exist').click();
      cy.get('.assigner-action button').should('exist').click();
      cy.wait(3000);
      cy.get('.row-expanded .vp-col-actions .plm-grouped-button button').should('exist').click();
      cy.get(' .ouvrir-action button').should('exist').click({ waitForAnimations: false });
      cy.wait(3000);
      cy.get('.actions-cell .actions .p-splitbutton-menubutton').should('exist').click();
      cy.get('#validationAccordClient').should('exist').click();
      cy.wait(3000);

      cy.get('.actions-cell .actions .p-splitbutton-menubutton').should('exist').click();
      cy.get('#confirmAccordClient').should('exist').click();
      cy.wait(3000);
    } else {
      console.log('Login failed');
    }
  });
  it('demander Emission', () => {
    cy.wait(1000);
    cy.visit('/');
    cy.wait(500);
    cy.reload(true);
    Login(b300nqa.username, b300nqa.password)
    Cypress.on('uncaught:exception', (err, runnable) => {
      Cypress.runner.stop() // Stop the test run
    });
    Cypress.on('fail', (error, runnable) => {
      Cypress.runner.stop() // Stop the test run
    });

    const isLoginSuccessful = checkLogin(b300nqa.username, b300nqa.password, b300nqa);
    if (isLoginSuccessful) {
      cy.visit('/');
      cy.reload(true);
      cy.get('.search-tabs ul li').eq(1).click();
      cy.get("#numproject").should('exist').type(NUM_PROJET)
      cy.get('app-project-project-search-input .search  button').should('exist').click();
      cy.get('.project-0 .button-expandable-project button').should('exist').click();
      cy.get('.row-expanded .Process_Cotation .vp-col-actions .plm-grouped-button button').should('exist').click();
      cy.get('.assigner-action button').should('exist').click();
      cy.wait(3000);
      cy.get('.row-expanded .Process_Cotation .vp-col-actions .plm-grouped-button button').should('exist').click();
      cy.get(' .ouvrir-action button').should('exist').click({ waitForAnimations: false });
      cy.wait(3000);
      cy.get('.actions-cell .actions .p-splitbutton-menubutton').should('exist').click();
      cy.get('#validerAccordClient').should('exist').click();
      cy.wait(3000);
      cy.get('.actions-cell .actions .p-splitbutton-menubutton').should('exist').click();
      cy.get('#demanderEmission').should('exist').click();
      cy.wait(1000);
      cy.get('.accept').should('exist').click();
      cy.wait(12000);

    } else {
      console.log('Login failed');
    }
  });
  it('structuration', () => {
    cy.wait(1000);
    cy.visit('/');
    cy.wait(500);
    cy.reload(true);
    Login(b011jpz.username, b011jpz.password)
    Cypress.on('uncaught:exception', (err, runnable) => {
      Cypress.runner.stop() // Stop the test run
    });
    Cypress.on('fail', (error, runnable) => {
      Cypress.runner.stop() // Stop the test run
    });

    const isLoginSuccessful = checkLogin(b011jpz.username, b011jpz.password, b011jpz);
    if (isLoginSuccessful) {
      cy.visit('/');
      cy.reload(true);
      cy.get('.search-tabs ul li').eq(1).click();
      cy.get("#numproject").should('exist').type(NUM_PROJET)
      cy.get('app-project-project-search-input .search  button').should('exist').click();
      cy.get('.project-0 .button-expandable-project button').should('exist').click();
      cy.get('.row-expanded .vp-col-actions .plm-grouped-button button').should('exist').click();
      cy.get('.assigner-action button').should('exist').click();
      cy.wait(3000);
      cy.get('.row-expanded .vp-col-actions .plm-grouped-button button').should('exist').click();
      cy.get(' .ouvrir-action button').should('exist').click({ waitForAnimations: false });
      cy.get('.actions-cell a').should('exist').click();
      cy.get('app-etude-table .p-panel-icons-end button').should('exist').click();
      cy.get('.tarif-0 .contrats-link').should('exist').click();
      cy.wait(2000);
      cy.get('.check-all p-inputswitch').should('exist').click();

      cy.get('.structurer-btn').should('exist').click();
      cy.wait(1000);
      cy.get('#contractType-0').click({ force: true });
      cy.wait(500);
      cy.get('.contract-ref-0').should('exist').click();
      cy.get('.structurer-save').should('exist').click();
      cy.wait(2000);
      cy.get('.check-all p-inputswitch').should('exist').click();
      cy.get('.numeroter-btn').should('exist').click();
      cy.wait(1000);
      cy.get('.reserver-num-contrat').should('exist').click();
      cy.wait(2000);
      cy.get('.actions-cell .actions .p-splitbutton-menubutton').should('exist').click();
      cy.get('#demanderRedaction').should('exist').click();
      cy.wait(3000);
    } else {
      console.log('Login failed');
    }
  });
   it('En Rédaction vers Projet de PC à envoyer', () => {
    cy.wait(1000);
    cy.visit('/');
    cy.wait(1000);
    cy.reload(true);
    Login(b011juc.username, b011juc.password)
    Cypress.on('fail', (error, runnable) => {
      Cypress.runner.stop() // Stop the test run
    });

    const isLoginSuccessful = checkLogin(b011juc.username, b011juc.password, b011juc);
    if (isLoginSuccessful) {
      cy.visit('/');
      cy.get('.search-tabs ul li').eq(1).click();
      cy.get("#numproject").should('exist').type(NUM_PROJET)
      cy.get('app-project-project-search-input .search  button').should('exist').click();
      cy.get('.project-0 .button-expandable-project button').should('exist').click();
      cy.get('.row-expanded .Process_Cotation .vp-col-actions .plm-grouped-button button').should('exist').click();
      cy.get('.assigner-action button').should('exist').click();
      cy.wait(3000);
      cy.get('.row-expanded .Process_Cotation .vp-col-actions .plm-grouped-button button').should('exist').click();
      cy.get(' .ouvrir-action button').should('exist').click({ waitForAnimations: false });
      cy.wait(500);
      cy.get('.actions-cell .actions .p-splitbutton-menubutton').should('exist').click();
      cy.get('#validerDemandeRedaction').should('exist').click();
      cy.wait(3000);
      Object.entries(nommer_redacteur_technico_commercial).forEach(([key, value]) => {
        if (nommer_redacteur_technico_commercial[key].type == 'dropDown') {
          cy.wait(500).then(() => {
            cy.get(nommer_redacteur_technico_commercial[key].selectorAttr).should('exist').click();
            cy.get(".p-dropdown-filter").should('exist').type(nommer_redacteur_technico_commercial[key].labelFilter)
            cy.get('p-dropdownitem').contains(nommer_redacteur_technico_commercial[key].labelFilter).should('exist').click();
          })
        }
      })
      cy.get('.valider').should('exist').click();
      cy.wait(6000);
      cy.get('.actions-cell a').should('exist').click({ waitForAnimations: false });
      cy.get('app-etude-table .p-panel-icons-end button').should('exist').click({ waitForAnimations: false });
      cy.get('.tarif-0 .contrats-link').should('exist').click({ waitForAnimations: false });
      cy.wait(500);
      cy.get('.check-all p-inputswitch').should('exist').click({ waitForAnimations: false });
      cy.wait(2000);
      retryFunctionGenerateDoc(() => {
        cy.wait(3000);
        cy.get('.telecharger-btn button').invoke('attr', 'disabled').then((disabledAttr) => {
          if (disabledAttr) {
            cy.get('.generer-documents-btn').should('exist').click({ waitForAnimations: false });
            cy.wait(40000);
            cy.get('.contracts-title button').should('exist').click();
            cy.get('.check-all p-inputswitch').should('exist').click({ waitForAnimations: false });
            cy.get('.check-all p-inputswitch').should('exist').click({ waitForAnimations: false });
          }
        });
      }, 3);
      //generateDoc()
      cy.get(".contractStatusDropDown .p-dropdown-trigger").should('exist').click();
      cy.get('p-dropdownitem ').contains("Projet PC").should('exist').click();
      cy.wait(2000);
      cy.get('.changer-status-btn button').should('exist').click({ force: true });
      cy.wait(2000);
      cy.get('.check-all p-inputswitch').should('exist').click({ waitForAnimations: false });
      cy.wait(1000);
      cy.get('.transmettre-pc-btn button').should('exist').click({ waitForAnimations: false });
      cy.get('.check-all p-inputswitch').should('exist').click({ waitForAnimations: false });

    } else {
      console.log('Login failed');
    }
  });
  it('Projet de PC à envoyer vers Demande de retouche', () => {
    cy.wait(1000);
    cy.visit('/');
    cy.wait(500);
    cy.reload(true);
    Login(b011jpz.username, b011jpz.password)
    Cypress.on('uncaught:exception', (err, runnable) => {
      Cypress.runner.stop() // Stop the test run
    });
    Cypress.on('fail', (error, runnable) => {
      Cypress.runner.stop() // Stop the test run
    });
    const isLoginSuccessful = checkLogin(b011jpz.username, b011jpz.password, b011jpz);
    if (isLoginSuccessful) {
      cy.visit('/');
      cy.reload(true);
      cy.get('.search-tabs ul li').eq(1).click();
      cy.get("#numproject").should('exist').type(NUM_PROJET)
      cy.get('app-project-project-search-input .search  button').should('exist').click();
      cy.get('.project-0 .button-expandable-project button').should('exist').click();
      cy.get('.row-expanded tr:first-child .vp-col-actions .plm-grouped-button button').should('exist').click();
      cy.get(' .ouvrir-action button').should('exist').click({ waitForAnimations: false });
      cy.get('.actions-cell a').should('exist').click();
      cy.get('app-etude-table .p-panel-icons-end button').should('exist').click();
      cy.get('.tarif-0 .contrats-link').should('exist').click();
      cy.wait(1000);
      cy.get('.check-all p-inputswitch').should('exist').click();
      cy.wait(1000);
      cy.get('.demande-de-retouche-btn button').should('exist').click();
      cy.get('.check-all p-inputswitch').should('exist').click({ waitForAnimations: false });
    } else {
      console.log('Login failed');
    }
  });
  it('Demande de retouche vers Projet de PC à envoyer', () => {
    cy.wait(1000);
    cy.visit('/');
    cy.wait(500);
    cy.reload(true);
    Login(b011juc.username, b011juc.password)
    Cypress.on('uncaught:exception', (err, runnable) => {
      Cypress.runner.stop() // Stop the test run
    });
    Cypress.on('fail', (error, runnable) => {
      Cypress.runner.stop() // Stop the test run
    });

    const isLoginSuccessful = checkLogin(b011juc.username, b011juc.password, b011juc);
    if (isLoginSuccessful) {
      cy.visit('/');
      cy.reload(true);
      cy.get('.search-tabs ul li').eq(1).click();
      cy.get("#numproject").should('exist').type(NUM_PROJET)
      cy.get('app-project-project-search-input .search  button').should('exist').click();
      cy.get('.project-0 .button-expandable-project button').should('exist').click();
      cy.get('.row-expanded .Process_Cotation .vp-col-actions .plm-grouped-button button').should('exist').click();
      cy.get(' .ouvrir-action button').should('exist').click({ waitForAnimations: false });
      cy.wait(500);
      cy.get('.actions-cell a').should('exist').click({ waitForAnimations: false });
      cy.get('app-etude-table .p-panel-icons-end button').should('exist').click({ waitForAnimations: false });
      cy.get('.tarif-0 .contrats-link').should('exist').click({ waitForAnimations: false });
      cy.wait(500);
      cy.get('.check-all p-inputswitch').should('exist').click({ waitForAnimations: false });
      cy.wait(1000);
      cy.get(".contractStatusDropDown .p-dropdown-trigger").should('exist').click();
      cy.get('p-dropdownitem').contains("Projet PC").should('exist').click();
      cy.wait(1000);
      cy.get('.changer-status-btn button').should('exist').click({ force: true });
      cy.get('.check-all p-inputswitch').should('exist').click({ waitForAnimations: false });
      cy.wait(500);
      cy.get('.transmettre-pc-btn button').should('exist').click({ waitForAnimations: false });
      cy.get('.check-all p-inputswitch').should('exist').click({ waitForAnimations: false });

    } else {
      console.log('Login failed');
    }
  });
  it('Projet de PC à envoyer vers Projet de PC Validé', () => {
    cy.wait(1000);
    cy.visit('/');
    cy.wait(500);
    cy.reload(true);
    Login(b011jpz.username, b011jpz.password)
    Cypress.on('uncaught:exception', (err, runnable) => {
      Cypress.runner.stop() // Stop the test run
    });
    Cypress.on('fail', (error, runnable) => {
      Cypress.runner.stop() // Stop the test run
    });
    const isLoginSuccessful = checkLogin(b011jpz.username, b011jpz.password, b011jpz);
    if (isLoginSuccessful) {
      cy.visit('/');
      cy.reload(true);
      cy.get('.search-tabs ul li').eq(1).click();
      cy.get("#numproject").should('exist').type(NUM_PROJET)
      cy.get('app-project-project-search-input .search  button').should('exist').click();
      cy.get('.project-0 .button-expandable-project button').should('exist').click();
      cy.get('.row-expanded tr:first-child .vp-col-actions .plm-grouped-button button').should('exist').click();
      cy.get(' .ouvrir-action button').should('exist').click({ waitForAnimations: false });
      cy.get('.actions-cell a').should('exist').click();
      cy.get('app-etude-table .p-panel-icons-end button').should('exist').click();
      cy.get('.tarif-0 .contrats-link').should('exist').click();
      cy.wait(1000);
      cy.get('.check-all p-inputswitch').should('exist').click();
      cy.wait(1000);
      cy.get('.envoyer-btn button').should('exist').click();
      cy.get('.confirmer-btn button').should('exist').click();
      cy.get('.check-all p-inputswitch').should('exist').click();
      cy.wait(1000);
      cy.get('.valider-btn button').should('exist').click();
      cy.get('.check-all p-inputswitch').should('exist').click({ waitForAnimations: false });
    } else {
      console.log('Login failed');
    }
  }); 
  it('Projet de PC Validé vers PC à envoyer', () => {
    cy.wait(1000);
    cy.visit('/');
    cy.wait(500);
    cy.reload(true);
    Login(b011juc.username, b011juc.password)
    Cypress.on('uncaught:exception', (err, runnable) => {
      Cypress.runner.stop() // Stop the test run
    });
    Cypress.on('fail', (error, runnable) => {
      Cypress.runner.stop() // Stop the test run
    });

    const isLoginSuccessful = checkLogin(b011juc.username, b011juc.password, b011juc);
    if (isLoginSuccessful) {
      cy.visit('/');
      cy.reload(true);
      cy.get('.search-tabs ul li').eq(1).click();
      cy.get("#numproject").should('exist').type(NUM_PROJET)
      cy.get('app-project-project-search-input .search  button').should('exist').click();
      cy.get('.project-0 .button-expandable-project button').should('exist').click();
      cy.get('.row-expanded .Process_Cotation .vp-col-actions .plm-grouped-button button').should('exist').click();
      cy.get(' .ouvrir-action button').should('exist').click({ waitForAnimations: false });
      cy.wait(1000);
      cy.get('.actions-cell a').should('exist').click({ waitForAnimations: false });
      cy.get('app-etude-table .p-panel-icons-end button').should('exist').click({ waitForAnimations: false });
      cy.get('.tarif-0 .contrats-link').should('exist').click({ waitForAnimations: false });
      cy.wait(1000);
      cy.get('.check-all p-inputswitch').should('exist').click({ waitForAnimations: false });
      cy.wait(1000);
      cy.get(".contractStatusDropDown .p-dropdown-trigger").should('exist').click();
      cy.get('p-dropdownitem').contains("PC définitives").should('exist').click();
      cy.wait(1000);
      cy.get('.changer-status-btn button').should('exist').click({ force: true });
      cy.get('.check-all p-inputswitch').should('exist').click({ waitForAnimations: false });
      cy.wait(1000);
      cy.get('.meg-btn button').should('exist').click({ waitForAnimations: false });
      cy.get('.check-all p-inputswitch').should('exist').click({ waitForAnimations: false });
      cy.wait(1000);
      cy.get(".contractStatusDropDown .p-dropdown-trigger").should('exist').click();
      cy.get('p-dropdownitem').contains("PC à envoyer").should('exist').click();
      cy.wait(1000);
      cy.get('.changer-status-btn button').should('exist').click({ force: true });
    } else {
      console.log('Login failed');
    }
  });
  it('PC à envoyer vers Finalisé', () => {
    cy.wait(1000);
    cy.visit('/');
    cy.wait(500);
    cy.reload(true);
    Login(b011jpz.username, b011jpz.password)
    Cypress.on('uncaught:exception', (err, runnable) => {
      Cypress.runner.stop() // Stop the test run
    });
    Cypress.on('fail', (error, runnable) => {
      Cypress.runner.stop() // Stop the test run
    });
    const isLoginSuccessful = checkLogin(b011jpz.username, b011jpz.password, b011jpz);
    if (isLoginSuccessful) {
      cy.visit('/');
      cy.reload(true);
      cy.get('.search-tabs ul li').eq(1).click();
      cy.get("#numproject").should('exist').type(NUM_PROJET)
      cy.get('app-project-project-search-input .search  button').should('exist').click();
      cy.get('.project-0 .vp-col-actions app-view-row-navigator button').should('exist').click();
      cy.contains('li span', "Tableau d'émission").click({ waitForAnimations: false });
      cy.wait(1000);
      cy.get('.actions-cell a').should('exist').click();
      cy.get('app-etude-table .p-panel-icons-end button').should('exist').click();
      cy.get('.tarif-0 .contrats-link').should('exist').click();
      cy.wait(1000);
      cy.get('.check-all p-inputswitch').should('exist').click();
      cy.wait(1000);
      cy.get('.envoyer-btn button').should('exist').click();
      cy.get('.confirmer-btn button').should('exist').click({ force: true });

      cy.wait(5000);
      cy.get('.check-all p-inputswitch').should('exist').click();
      cy.get(".contractStatusDropDown .p-dropdown-trigger").should('exist').click();
      cy.get('p-dropdownitem').contains("PC signées").should('exist').click();
      cy.wait(1000);
      cy.get('.changer-status-btn button').should('exist').click({ force: true });

      cy.get('.check-all p-inputswitch').should('exist').click();
      cy.get(".contractStatusDropDown .p-dropdown-trigger").should('exist').click();
      cy.get('p-dropdownitem').contains("Mis en gestion").should('exist').click();
      cy.wait(1000);
      cy.get('.changer-status-btn button').should('exist').click({ force: true });
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
/* function generateDoc() {
  // Check if the button does not have the 'disabled' attribute
  cy.get('.check-all p-inputswitch').should('exist').click({ waitForAnimations: false });
  cy.get('.check-all p-inputswitch').should('exist').click({ waitForAnimations: false });

  cy.get('.telecharger-btn button').invoke('attr', 'disabled').then((disabledAttr) => {
    if (disabledAttr) {
      cy.get('.generer-documents-btn').should('exist').click({ waitForAnimations: false });
      cy.wait(30000);
      cy.get('.contracts-title button').should('exist').click();
      cy.wait(2000);
      generateDoc()
    }
  });
} */
function retryFunctionGenerateDoc(func, attemptsLeft) {
  if (attemptsLeft === 0) {
      //throw new Error('Toutes les tentatives ont échoué');
      Cypress.runner.stop()
  }

  try {
      func();
  } catch (error) {
      // En cas d'échec, réessayer en décrémentant le nombre de tentatives restantes
      console.log(`La tentative a échoué. Tentatives restantes : ${attemptsLeft}`);
      retryFunction(func, attemptsLeft - 1);
  }
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
  cy.wait(3000)
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


