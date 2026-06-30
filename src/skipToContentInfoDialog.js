/* shortcutInfoDialog.js */

/* Imports */
import DebugLogging  from './debug.js';

import {
  SHORTCUTS_DIALOG_ID,
  ABOUT_DIALOG_ID,
  MORE_ABOUT_INFO_URL,
  MORE_SHORTCUT_INFO_URL,
  VERSION
} from './constants.js';

/* Constants */
const debug = new DebugLogging('[shortcutsInfoDialog]', false);
debug.flag = false;

/*
 * @function createElem
 *
 * @desc Helper function in create dialog box content
 */

function createElem(tag, textContent='', className='', id='') {
  const elem = document.createElement(tag);
  elem.textContent = textContent;
  if (className) {
    elem.className = className;
  }
  if (id) {
    elem.id = id;
  }
  return elem;
}

/*
 * @function getInfoDialogElems
 *
 * @desc Returns common elements needed in a dialog box
 */

function getInfoDialogElems (id) {

  const dialogElem = createElem('dialog', '', '', id);

  const divContainerElem = createElem('div');
  dialogElem.appendChild(divContainerElem);

  // Dialog Header

  const divHeaderElem = createElem('div', '', 'header');
  divContainerElem.appendChild(divHeaderElem);

  const divH2Elem = createElem('h2', '', 'title');
  divHeaderElem.appendChild(divH2Elem);

  const divClose1ButtonElem = createElem('button', '×');
  divClose1ButtonElem.ariaLabel = 'Close';
  divHeaderElem.appendChild(divClose1ButtonElem);

  // Dialog content container

  const divContentElem = createElem('div', '', 'content');
  divContainerElem.appendChild(divContentElem);

  // Dialog buttons

  const divButtonsElem = createElem('div', '', 'buttons');
  divContainerElem.appendChild(divButtonsElem);

  const divButtonMoreElem = createElem('button', 'More Information', 'more');
  divButtonsElem.appendChild(divButtonMoreElem);

  const divButton2CloseElem = createElem('button', 'Close', 'close');
  divButtonsElem.appendChild(divButton2CloseElem);

  return dialogElem;
}

/*
 * @function addShortcutsContentElems
 *
 * @desc Add shortcut information to content element
 *
 * @param  {Object}  contentElem  - DOM node to add content
 */

function addShortcutsContentElems (contentElem) {

  const buttonShortcuts = [
    {shortcut: 'Alt+0', desc: 'Open Menu', kbdClass: 'os-shortcut'},
  ];

  const landmarkShortcuts = [
    {shortcut: 'r', desc: 'Next region'},
    {shortcut: 'R', desc: 'Previous region'},
    {shortcut: 'm', desc: 'Main regions'},
    {shortcut: 'n', desc: 'Navigation regions'},
    {shortcut: 'c', desc: 'Complementary regions'},
  ];

  const headingShortcuts = [
    {shortcut: 'h', desc: 'Next heading'},
    {shortcut: 'H', desc: 'Previous heading'},
    {shortcut: '1', desc: 'Level 1 headings'},
    {shortcut: '2', desc: 'Level 2 headings'},
    {shortcut: '3', desc: 'Level 3 headings'},
    {shortcut: '4', desc: 'Level 4 headings'},
    {shortcut: '5', desc: 'Level 5 headings'},
    {shortcut: '6', desc: 'Level 6 headings'},
  ];

  function getShortcutTable(caption, shortcuts) {

    let trElem, thElem, tdElem, kbdElem;

    const tableElem = createElem('table');

    const captionElem = createElem('caption', caption);
    tableElem.appendChild(captionElem);

    const theadElem = createElem('thead');
    tableElem.appendChild(theadElem);

    trElem = createElem('tr');
    theadElem.appendChild(trElem);

    thElem = createElem('th', 'key', 'shortcut');
    trElem.appendChild(thElem);

    thElem = createElem('th', 'Description', 'desc');
    trElem.appendChild(thElem);

    const tbodyElem = createElem('tbody');
    tableElem.appendChild(tbodyElem);

    shortcuts.forEach( (item) => {
      trElem = createElem('tr');
      tbodyElem.appendChild(trElem);

      tdElem = createElem('td', '', 'shortcut');
      trElem.appendChild(tdElem);

      kbdElem = createElem('kbd', item.shortcut);
      tdElem.appendChild(kbdElem);

      if (item.kbdClass) {
        kbdElem.className = item.kbdClass;
      }

      tdElem = createElem('td', item.desc, 'desc');
      trElem.appendChild(tdElem);
    });

    return tableElem;
  }

  contentElem.appendChild(getShortcutTable('Button', buttonShortcuts));
  contentElem.appendChild(getShortcutTable('Landmark Regions', landmarkShortcuts));
  contentElem.appendChild(getShortcutTable('Headings', headingShortcuts));

}

/*
 * @function addAboutContentElems
 *
 * @desc Add about information to content element
 *
 * @param  {Object}  contentElem  - DOM node to add content
 */

function addAboutContentElems (contentElem) {

  const divDescLabelElem = createElem('div', 'Purpose', 'privacy-label');
  contentElem.appendChild(divDescLabelElem);

  const divDescElem = createElem('div', 'SkipTo.js is a free and open source utility to support the WCAG 2.4.1 Bypass Block requirement.', 'desc');
  contentElem.appendChild(divDescElem);

  // Button menu shortcut key

  const divShortcutLabelElem = createElem('div', 'Shortcut', 'shortcut-label');
  contentElem.appendChild(divShortcutLabelElem);

  const divShortcutElem = createElem('div', '', 'shortcut');
  contentElem.appendChild(divShortcutElem);
  divShortcutElem.appendChild(document.createTextNode('Use the '));
  const kbdElem = createElem('kbd', 'Alt+0', 'os-shortcut');
  divShortcutElem.appendChild(kbdElem);
  divShortcutElem.appendChild(document.createTextNode(' keyboard shortcut to open the "Skip To Content" menu.'));

  const divPrivacyLabelElem = createElem('div', 'Privacy', 'privacy-label');
  contentElem.appendChild(divPrivacyLabelElem);

  const divPrivacyElem = createElem('div', 'SkipTo.js does not collect or store any information about users or work with any other parties to collect or share user browsing information.', 'privacy');
  contentElem.appendChild(divPrivacyElem);

  const divHappyElem = createElem('div', 'Happy Skipping!', 'happy');
  contentElem.appendChild(divHappyElem);

  const divVersionElem = createElem('div', `Version ${VERSION}`, 'version');
  contentElem.appendChild(divVersionElem);

  const divCopyrightElem = createElem('div', 'BSD License, Copyright 2021-2026', 'copyright');
  contentElem.appendChild(divCopyrightElem);

}

/*
 * @class InfoDialog
 *
 * @desc Base class for SkipTo.js dialogs
 */

class InfoDialog {
  constructor (attachElem, id, title) {

    // Get references

    console.log(`[InfoDialog][id]: ${id}`);

    this.dialogElem = getInfoDialogElems(id);
    attachElem.appendChild(this.dialogElem);

    this.closeButtonElem1  = attachElem.querySelector(`#${id} .header button`);
    this.closeButtonElem1.addEventListener('click', this.onCloseButtonClick.bind(this));
    this.closeButtonElem1.addEventListener('keydown', this.onKeyDown.bind(this));

    this.closeButtonElem2  = attachElem.querySelector(`#${id} .buttons button.close`);
    this.closeButtonElem2.addEventListener('click', this.onCloseButtonClick.bind(this));
    this.closeButtonElem2.addEventListener('keydown', this.onKeyDown.bind(this));

    const titleElem           = attachElem.querySelector(`#${id} .title`);
    titleElem.textContent = title;

    const moreInfoButtonElem = attachElem.querySelector(`#${id} .buttons button.more`);
    moreInfoButtonElem.addEventListener('click', this.onMoreInfoClick.bind(this));

    return this;
  }

  onMoreInfoClick () {
    const url = this.content === 'shortcuts' ?
                                  MORE_SHORTCUT_INFO_URL :
                                  MORE_ABOUT_INFO_URL;
    if (url) {
      window.open(url, '_blank').focus();
    }
  }

  onCloseButtonClick () {
    this.dialogElem.close();
  }

  openDialog () {
    this.dialogElem.showModal();
    this.closeButtonElem2.focus();
  }

  onKeyDown (event) {

    if ((event.key === "Tab") &&
        !event.altKey &&
        !event.ctlKey &&
        !event.metaKey) {

      debug.log(`shift: ${event.shiftKey} ${event.currentTarget === this.closeButtonElem1} ${event.currentTarget === this.closeButtonElem2}`);

      if (event.shiftKey &&
          (event.currentTarget === this.closeButtonElem1)) {
        this.closeButtonElem2.focus();
        event.preventDefault();
        event.stopPropagation();
      }

      if (!event.shiftKey &&
          (event.currentTarget === this.closeButtonElem2)) {
        this.closeButtonElem1.focus();
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }
}

/*
 * @class ShortcutsDialog
 *
 * @desc Class for SkipTo.js shortcuts dialogs
 */

export class ShortcutsDialog extends InfoDialog {

  constructor (attachElem, title, osShortcut) {

    super(attachElem, SHORTCUTS_DIALOG_ID, title);

    const contentElem = attachElem.querySelector(`#${SHORTCUTS_DIALOG_ID} .content`);
    addShortcutsContentElems(contentElem);

    const osShortcutElem  = attachElem.querySelector(`#${SHORTCUTS_DIALOG_ID} .os-shortcut`);
    if (osShortcutElem) {
      osShortcutElem.textContent = osShortcut;
    }

    return this;
  }

}

export class AboutDialog extends InfoDialog {

  constructor (attachElem, title, osShortcut) {

    super(attachElem, ABOUT_DIALOG_ID, title);

    const contentElem = attachElem.querySelector(`#${ABOUT_DIALOG_ID} .content`);
    addAboutContentElems(contentElem);

    const osShortcutElem  = attachElem.querySelector(`#${ABOUT_DIALOG_ID} .os-shortcut`);
    if (osShortcutElem) {
      osShortcutElem.textContent = osShortcut;
    }

    return this;
  }
}


