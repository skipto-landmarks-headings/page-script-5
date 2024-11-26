/* optionsMenu.js */

const debug = false;

// Define browser specific APIs for Opera, Firefox and Chrome

const browserI18n = typeof browser === 'object' ?
            browser.i18n :
            chrome.i18n;

const i18nLabels = [
  { id: 'tablist-tab-shortcuts', label: 'options_tab_shortcuts'},
  { id: 'tablist-tab-button',    label: 'options_tab_button'},
  { id: 'tablist-tab-menu',      label: 'options_tab_menu'},
  { id: 'tablist-tab-style',     label: 'options_tab_style'},
  { id: 'tablist-tab-i18n',      label: 'options_tab_i18n'}
];

window.addEventListener("load", (event) => {
  i18nLabels.forEach( item => {
    const node = document.getElementById(item.id);
    const label = browserI18n.getMessage(item.label);
    if (node && label) {
      node.textContent = label + (debug ? ' (i18n)' : '');
    }
    else {
      node && console.error(`node not found for ${item.id}`);
      label && console.error(`message not found for ${item.label}`);
    }
  });
});

