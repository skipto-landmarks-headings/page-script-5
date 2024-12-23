/* optionsMenu.js */

const debug = false
// Define browser specific APIs for Opera, Firefox and Chrome

const browserI18n = typeof browser === 'object' ?
            browser.i18n :
            chrome.i18n;


window.addEventListener("load", (event) => {

    const i18nLabels =  Array.from(document.querySelectorAll('[data-i18n]'));

    i18nLabels.forEach( node => {
      const label = browserI18n.getMessage(node.getAttribute('data-i18n'));
      if (label) {
        node.textContent = label + (debug ? ' (i18n)' : '');
      }
      else {
        console.error(`[node]: ${node.getAttribute('data-i18n')}`);
        console.error(`[label]: ${label}`);
      }
    });

});

