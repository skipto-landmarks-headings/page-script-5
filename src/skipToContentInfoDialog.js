/* shortcutInfoDialog.js */

/* Imports */
import DebugLogging  from './debug.js';

import {
  SHORTCUTS_DIALOG_ID,
  ABOUT_DIALOG_ID,
  MORE_ABOUT_INFO_URL,
  MORE_SHORTCUT_INFO_URL
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

function getInfoDialogElems (id, title, config) {

  const dialogElem = createElem('dialog', '', '', id);
  dialogElem.tabIndex = -1;

  const divContainerElem = createElem('div');
  dialogElem.appendChild(divContainerElem);

  // Dialog Header

  const divHeaderElem = createElem('div', '', 'header');
  divContainerElem.appendChild(divHeaderElem);

  const divTitleElem = createElem('h2', title, 'title');
  divHeaderElem.appendChild(divTitleElem);

  // Dialog content container

  const divContentElem = createElem('div', '', 'content');
  divContainerElem.appendChild(divContentElem);

  // Dialog buttons

  const divButtonsElem = createElem('div', '', 'buttons');
  divContainerElem.appendChild(divButtonsElem);

  const divButtonMoreElem = createElem('button', config.moreInfoLabel, 'more');
  divButtonsElem.appendChild(divButtonMoreElem);

  const divButton2CloseElem = createElem('button', config.closeLabel, 'close');
  divButtonsElem.appendChild(divButton2CloseElem);

  return dialogElem;
}

/*
 * @function addShortcutsContentElems
 *
 * @desc Add shortcut information to content element
 *
 * @param  {Object}  config  - SkipTo.js configuration object used for i18n
 */

function addShortcutsContentElems (contentElem, config) {

  const buttonShortcuts = [
    {shortcut: config.osShortcut, desc: config.aboutShortcut},
  ];

  const landmarkShortcuts = [
    {shortcut: config.shortcutRegionNext,          desc: config.msgNextRegion},
    {shortcut: config.shortcutRegionPrevious,      desc: config.msgPreviousRegion},
    {shortcut: config.shortcutRegionMain,          desc: config.msgMainRegions},
    {shortcut: config.shortcutRegionNavigation,    desc: config.msgNavigationRegions},
    {shortcut: config.shortcutRegionComplementary, desc: config.msgComplementaryRegions},
  ];

  const headingShortcuts = [
    {shortcut: config.shortcutHeadingNext,     desc: config.msgNextHeading},
    {shortcut: config.shortcutHeadingPrevious, desc: config.msgPreviousHeading},
    {shortcut: config.shortcutHeadingH1,       desc: config.msgH1Headings},
    {shortcut: config.shortcutHeadingH2,       desc: config.msgH2Headings},
    {shortcut: config.shortcutHeadingH3,       desc: config.msgH3Headings},
    {shortcut: config.shortcutHeadingH4,       desc: config.msgH4Headings},
    {shortcut: config.shortcutHeadingH5,       desc: config.msgH5Headings},
    {shortcut: config.shortcutHeadingH6,       desc: config.msgH6Headings},
  ];

  function getShortcutTable(caption, shortcuts) {

    let trElem, thElem, tdElem, kbdElem;

    const tableElem = createElem('table');
    tableElem.id = 'focus';

    const captionElem = createElem('caption', caption);
    tableElem.appendChild(captionElem);

    const theadElem = createElem('thead');
    tableElem.appendChild(theadElem);

    trElem = createElem('tr');
    theadElem.appendChild(trElem);

    thElem = createElem('th', config.msgKey, 'shortcut');
    trElem.appendChild(thElem);

    thElem = createElem('th', config.msgDescription, 'desc');
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

  contentElem.appendChild(getShortcutTable(config.landmarkGroupLabel, landmarkShortcuts));
  contentElem.appendChild(getShortcutTable(config.headingGroupLabel, headingShortcuts));
  contentElem.appendChild(getShortcutTable(config.menuButtonLabel, buttonShortcuts));

}

/*
 * @function addAboutContentElems
 *
 * @desc Add about information to content element
 *
 * @param  {Object}  config  - SkipTo.js configuration object used for i18n
 */

function addAboutContentElems (contentElem, config) {

  const divDescLabelElem = createElem('div', config.aboutDescLabel, 'privacy-label');
  contentElem.appendChild(divDescLabelElem);

  const divDescElem = createElem('div', config.aboutDesc, 'desc');
  divDescElem.id = 'focus';
  contentElem.appendChild(divDescElem);

  // Button menu shortcut key

  const divShortcutLabelElem = createElem('div', config.aboutShortcutLabel, 'shortcut-label');
  contentElem.appendChild(divShortcutLabelElem);

  const divShortcutElem = createElem('div', '', 'shortcut');
  contentElem.appendChild(divShortcutElem);
  const kbdElem = createElem('kbd', config.osShortcut);
  divShortcutElem.appendChild(kbdElem);
  divShortcutElem.appendChild(document.createTextNode(': '));
  divShortcutElem.appendChild(document.createTextNode(config.aboutShortcut));

  const divPrivacyLabelElem = createElem('div', config.aboutPrivacyLabel, 'privacy-label');
  contentElem.appendChild(divPrivacyLabelElem);

  const divPrivacyElem = createElem('div', config.aboutPrivacy, 'privacy');
  contentElem.appendChild(divPrivacyElem);

  const divHappyElem = createElem('div', config.happySkipping, 'happy');
  contentElem.appendChild(divHappyElem);

  const divVersionElem = createElem('div', config.aboutVersion, 'version');
  contentElem.appendChild(divVersionElem);

  const divCopyrightElem = createElem('div', config.aboutCopyright, 'copyright');
  contentElem.appendChild(divCopyrightElem);

}

/*


 * @class InfoDialog
 *
 * @desc Base class for SkipTo.js dialogs
 */

class InfoDialog {
  constructor (buttonElem, attachElem, id, title, config) {

    // Get references

    this.buttonElem = buttonElem;

    this.dialogElem = getInfoDialogElems(id, title, config);
    attachElem.appendChild(this.dialogElem);
    this.dialogElem.addEventListener('keydown', this.onKeyDown.bind(this));

    this.closeButtonElem  = attachElem.querySelector(`#${id} .buttons button.close`);
    this.closeButtonElem.addEventListener('click', this.onCloseButtonClick.bind(this));
    this.closeButtonElem.addEventListener('keydown', this.onKeyDown.bind(this));

    this.moreInfoButtonElem = attachElem.querySelector(`#${id} .buttons button.more`);
    this.moreInfoButtonElem.addEventListener('click', this.onMoreInfoClick.bind(this));

    this.titleElem = this.dialogElem.querySelector('.header h2');

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
    this.buttonElem.parentNode.classList.add('focus');
    this.buttonElem.focus();
  }

  openDialog () {
    this.dialogElem.showModal();

    const focusElem = this.dialogElem.querySelector('#focus');

    if (focusElem) {
      focusElem.tabIndex = -1;
      focusElem.focus();
    }
    else {
      this.titleElem.tabIndex = -1;
      this.titleElem.focus();
    }
  }

  onKeyDown (event) {

    if ((event.key === "Tab") &&
        !event.altKey &&
        !event.ctlKey &&
        !event.metaKey) {

      if (event.shiftKey &&
          (event.target === this.moreInfoButtonElem)) {
        this.closeButtonElem.focus();
        event.preventDefault();
        event.stopPropagation();
      }

      if (!event.shiftKey &&
          (event.target === this.closeButtonElem)) {
        this.moreInfoButtonElem.focus();
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

  constructor (buttonElem, attachElem, config) {

    super(buttonElem, attachElem, SHORTCUTS_DIALOG_ID, config.shortcutsInfoLabel, config);

    const contentElem = attachElem.querySelector(`#${SHORTCUTS_DIALOG_ID} .content`);
    addShortcutsContentElems(contentElem, config);

    return this;
  }

}

export class AboutDialog extends InfoDialog {

  constructor (buttonElem, attachElem, config) {

    super(buttonElem, attachElem, ABOUT_DIALOG_ID, config.aboutInfoLabel, config);

    const contentElem = attachElem.querySelector(`#${ABOUT_DIALOG_ID} .content`);
    addAboutContentElems(contentElem, config);

    return this;
  }
}


