/* optionsMenu.js */

const debug = false;

// Define browser specific APIs for Opera, Firefox and Chrome

const i18n = typeof browser === 'object' ?
            browser.i18n :
            chrome.i18n;

const i18nLabels = [
  { id: 'head-title',        label: 'extension_name'},
  { id: 'banner-title',      label: 'extension_name'},
  { id: 'h1-title',          label: 'options_h1_title'},
  { id: 'tablist-tab-menu',  label: 'options_tab_menu'},
  { id: 'tablist-tab-style', label: 'options_tab_style'}
];

window.addEventListener("load", (event) => {
  i18nLabels.forEach( item => {
    const node = document.getElementById(item.id);
    const label = i18n.getMessage(item.label);
    if (node && label) {
      node.textContent = label + (debug ? ' (i18n)' : '');
    }
    else {
      node && console.error(`node not found for ${item.id}`);
      label && console.error(`message not found for ${item.label}`);
    }
  });
});

