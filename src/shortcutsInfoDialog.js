/* shortcutInfoDialog.js */

/* Imports */
import DebugLogging  from './debug.js';

/* Constants */
const debug = new DebugLogging('[shortcutsInfoDialog]', false);
debug.flag = false;

const MORE_INFO_URL='https://skipto-landmarks-headings.github.io/page-script-5/';

const styleTemplate = document.createElement('template');
styleTemplate.textContent = `
/* infoDialog.css */

button#open-button {
  display: inline;
  background: transparent;
  border: none;
}

dialog#info-dialog {
  max-width: 70%;
  padding: 0;
  background-color: white;
  border: 2px solid #aaa;
  border-radius: 5px;
  color: black;
}

dialog#info-dialog .header {
  margin-bottom: 0.5em;
  padding: 4px;
  padding-left: 1em;
  border-bottom: 1px solid #aaa;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  font-weight:  bold;
  background-color: #eee;
  position: relative;
  font-size: 1em;
}

dialog#info-dialog .header h2 {
  margin: 0;
  padding: 0;
  font-size: 1em;
}


dialog#info-dialog .header button {
  position: absolute;
  top: -0.25em;
  right: 0;
  border: none;
  background: transparent;
  font-weight: bold;
  color: black;
}

dialog#info-dialog .content {
  margin: 2em 2.5em 1em 2.5em;
}

dialog#info-dialog .content fieldset {
  margin: 0;
  padding: 0;
  border: none;
}

dialog#info-dialog .content legend {
  margin: 0;
  padding: 0;
  font-size: 1em;
  font-weight: bold;
}

dialog#info-dialog .content ul {
  margin: 0;
  padding: 0;
  margin-bottom: 1em;
  list-style: none;
}

dialog#info-dialog .content li {
  margin: 0;
  padding: 0;
  margin-left:
}


dialog#info-dialog .content span.shortcut {
  display: inline-block;
  width: 1.35em;
}


dialog#info-dialog .buttons {
  float: right;
  margin-right: 0.5em;
  margin-bottom: 0.5em;
}

dialog#info-dialog button {
  margin: 6px;
}

dialog#info-dialog .buttons button {
  min-width: 5em;
}

button:focus {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

button:hover {
  cursor: pointer;
}
`;

export default class ShortcutsInfoDialog extends HTMLElement {
  constructor () {

    super();
    this.attachShadow({ mode: 'open' });

    const styleNode = document.createElement('style');
    styleNode.textContent = styleTemplate.textContent;
    this.shadowRoot.appendChild(styleNode);

    // Get references

    this.infoDialog  = document.createElement('dialog');
    this.infoDialog.id = 'info-dialog';
    this.shadowRoot.appendChild(this.infoDialog);

    const headerElem  = document.createElement('div');
    headerElem.className = 'header';
    this.infoDialog.appendChild(headerElem);

    const h2Elem  = document.createElement('h2');
    h2Elem.textContent = 'Keyboard Shortcuts';
    headerElem.appendChild(h2Elem);

    this.closeButton1  = document.createElement('button');
    this.closeButton1.textContent = '✕';
    headerElem.appendChild(this.closeButton1);
    this.closeButton1.addEventListener('click', this.onCloseButtonClick.bind(this));
    this.closeButton1.addEventListener('keydown', this.onKeyDown.bind(this));

    this.contentElem  = document.createElement('div');
    this.contentElem.className = 'content';
    this.infoDialog.appendChild(this.contentElem);

    const buttonsElem  = document.createElement('div');
    buttonsElem.className = 'buttons';
    this.infoDialog.appendChild(buttonsElem);

    this.moreInfoButton  = document.createElement('button');
    this.moreInfoButton.textContent = 'More Information';
    buttonsElem.appendChild(this.moreInfoButton);
    this.moreInfoButton.addEventListener('click', this.onMoreInfoClick.bind(this));

    this.closeButton2  = document.createElement('button');
    this.closeButton2.textContent  = 'Close';
    buttonsElem.appendChild(this.closeButton2);
    this.closeButton2.addEventListener('click', this.onCloseButtonClick.bind(this));
    this.closeButton2.addEventListener('keydown', this.onKeyDown.bind(this));

  }

  onCloseButtonClick () {
    this.infoDialog.close();
  }

  openDialog () {
    this.infoDialog.showModal();
    this.closeButton2.focus();
  }

  onMoreInfoClick () {
    window.open(MORE_INFO_URL, '_blank').focus();
  }

  updateContent (config) {

    function addItem(listElem, shortcut, desc) {

      const liElem    = document.createElement('li');
      listElem.appendChild(liElem);
      const spanElem1 = document.createElement('span');
      spanElem1.className = 'shortcut';
      liElem.appendChild(spanElem1);
      spanElem1.textContent = shortcut + `: `;
      const spanElem2 = document.createElement('span');
      spanElem2.className = 'desc';
      spanElem2.textContent = desc;
      liElem.appendChild(spanElem2);
    }

    while (this.contentElem.lastElementChild) {
      this.contentElem.removeChild(this.contentElem.lastElementChild);
    }

    const fieldsetElem1 = document.createElement('fieldset');
    this.contentElem.appendChild(fieldsetElem1);

    const legendElem1 = document.createElement('legend');
    legendElem1.textContent = config.landmarkGroupLabel;
    fieldsetElem1.appendChild(legendElem1);

    const ulElem1 = document.createElement('ul');
    fieldsetElem1.appendChild(ulElem1);

    addItem(ulElem1, config.shortcutRegionNext,          `${config.msgNextRegion}`);
    addItem(ulElem1, config.shortcutRegionPrevious,      `${config.msgPreviousRegion}`);
    addItem(ulElem1, config.shortcutRegionMain,          `${config.msgMainRegions}`);
    addItem(ulElem1, config.shortcutRegionNavigation,    `${config.msgNavigationRegions}`);
    addItem(ulElem1, config.shortcutRegionComplementary, `${config.msgComplementaryRegions}`);

    const fieldsetElem2 = document.createElement('fieldset');
    this.contentElem.appendChild(fieldsetElem2);

    const legendElem2 = document.createElement('legend');
    legendElem2.textContent = config.headingGroupLabel;
    fieldsetElem2.appendChild(legendElem2);

    const ulElem2 = document.createElement('ul');
    fieldsetElem2.appendChild(ulElem2);

    addItem(ulElem2, config.shortcutHeadingNext, `${config.msgNextHeading}`);
    addItem(ulElem2, config.shortcutHeadingPrevious, `${config.msgPreviousHeading}`);

    addItem(ulElem2, config.shortcutHeadingH1, `${config.msgH1Headings}`);
    addItem(ulElem2, config.shortcutHeadingH2, `${config.msgH2Headings}`);
    addItem(ulElem2, config.shortcutHeadingH3, `${config.msgH3Headings}`);
    addItem(ulElem2, config.shortcutHeadingH4, `${config.msgH4Headings}`);
    addItem(ulElem2, config.shortcutHeadingH5, `${config.msgH5Headings}`);
    addItem(ulElem2, config.shortcutHeadingH6, `${config.msgH6Headings}`);

  }

  onKeyDown (event) {

    if ((event.key === "Tab") &&
        !event.altKey &&
        !event.ctlKey &&
        !event.metaKey) {

      if (event.shiftKey &&
          (event.currentTarget === this.closeButton1)) {
        this.closeButton2.focus();
        event.preventDefault();
        event.stopPropagation();
      }

      if (!event.shiftKey &&
          (event.currentTarget === this.closeButton2)) {
        this.closeButton1.focus();
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }
}


