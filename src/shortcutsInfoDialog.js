/* shortcutInfoDialog.js */

/* Imports */
import DebugLogging  from './debug.js';

/* Constants */
const debug = new DebugLogging('[shortcutsInfoDialog]', false);
debug.flag = false;

const MORE_INFO_URL='https://skipto-landmarks-headings.github.io/page-script-5/shortcuts.html';

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
  margin-left: 2em;
  margin-right: 2em;
  margin-top: 0;
  margin-bottom: 2em;
}

dialog#info-dialog .content table {
  width: auto;
}

dialog#info-dialog .content caption {
  margin: 0;
  padding: 0;
  margin-top: 1em;
  text-align: left;
  font-weight: bold;
  font-size: 1.2em;
}

dialog#info-dialog .content th {
  margin: 0;
  padding: 0;
  text-align: left;
  font-weight: bold;
  font-size: 90%;
}

dialog#info-dialog .content th.shortcut {
  width: 2.5em;
}

dialog#info-dialog .content td {
  margin: 0;
  padding: 0;
  text-align: left;
}


dialog#info-dialog .content table tr:nth-child(even) {
  background-color: #f2f2f2;
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

    this.h2Elem  = document.createElement('h2');
    this.h2Elem.textContent = 'Keyboard Shortcuts';
    headerElem.appendChild(this.h2Elem);

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

      this.h2Elem.textContent = config.shortcutsInfoLabel;
      this.closeButton1.setAttribute('aria-label', config.msgClose);
      this.closeButton2.textContent = config.msgClose;
      this.moreInfoButton.textContent = config.msgMoreInfo;

      function addRow(tbodyElem, shortcut, desc) {

        const trElem = document.createElement('tr');
        tbodyElem.appendChild(trElem);

        const tdElem1 = document.createElement('td');
        tdElem1.className = 'shortcut';
        tdElem1.textContent = shortcut;
        trElem.appendChild(tdElem1);

        const tdElem2 = document.createElement('td');
        tdElem2.className = 'desc';
        tdElem2.textContent = desc;
        trElem.appendChild(tdElem2);
      }

      while (this.contentElem.lastElementChild) {
        this.contentElem.removeChild(this.contentElem.lastElementChild);
      }

      const tableElem1 = document.createElement('table');
      this.contentElem.appendChild(tableElem1);

      const captionElem1 = document.createElement('caption');
      captionElem1.textContent = config.landmarkGroupLabel;
      tableElem1.appendChild(captionElem1);

      const theadElem1 = document.createElement('thead');
      tableElem1.appendChild(theadElem1);

      const trElem1 = document.createElement('tr');
      theadElem1.appendChild(trElem1);

      const thElem1 = document.createElement('th');
      thElem1.className = 'shortcut';
      thElem1.textContent = config.msgKey;
      trElem1.appendChild(thElem1);

      const thElem2 = document.createElement('th');
      thElem2.className = 'desc';
      thElem2.textContent = config.msgDescription;
      trElem1.appendChild(thElem2);

      const tbodyElem1 = document.createElement('tbody');
      tableElem1.appendChild(tbodyElem1);

      addRow(tbodyElem1, config.shortcutRegionNext,          config.msgNextRegion);
      addRow(tbodyElem1, config.shortcutRegionPrevious,      config.msgPreviousRegion);
      addRow(tbodyElem1, config.shortcutRegionMain,          config.msgMainRegions);
      addRow(tbodyElem1, config.shortcutRegionNavigation,    config.msgNavigationRegions);
      addRow(tbodyElem1, config.shortcutRegionComplementary, config.msgComplementaryRegions);

      const tableElem2 = document.createElement('table');
      this.contentElem.appendChild(tableElem2);

      const captionElem2 = document.createElement('caption');
      captionElem2.textContent = config.headingGroupLabel;
      tableElem2.appendChild(captionElem2);

      const theadElem2 = document.createElement('thead');
      tableElem2.appendChild(theadElem2);

      const trElem2 = document.createElement('tr');
      theadElem2.appendChild(trElem2);

      const thElem3 = document.createElement('th');
      thElem3.className = 'shortcut';
      thElem3.textContent = config.msgKey;
      trElem2.appendChild(thElem3);

      const thElem4 = document.createElement('th');
      thElem4.className = 'desc';
      thElem4.textContent = config.msgDescription;
      trElem2.appendChild(thElem4);

      const tbodyElem2 = document.createElement('tbody');
      tableElem2.appendChild(tbodyElem2);

      addRow(tbodyElem2, config.shortcutHeadingNext, config.msgNextHeading);
      addRow(tbodyElem2, config.shortcutHeadingPrevious, config.msgPreviousHeading);
      addRow(tbodyElem2, config.shortcutHeadingH1, config.msgH1Headings);
      addRow(tbodyElem2, config.shortcutHeadingH2, config.msgH2Headings);
      addRow(tbodyElem2, config.shortcutHeadingH3, config.msgH3Headings);
      addRow(tbodyElem2, config.shortcutHeadingH4, config.msgH4Headings);
      addRow(tbodyElem2, config.shortcutHeadingH5, config.msgH5Headings);
      addRow(tbodyElem2, config.shortcutHeadingH6, config.msgH6Headings);

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


