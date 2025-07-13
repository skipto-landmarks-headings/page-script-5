/* skiptoMenuButton.js */

/* Imports */
import DebugLogging  from './debug.js';

import {
  isNotEmptyString
} from './utils.js';

import SkipToContentInfoDialog  from './skipToContentInfoDialog.js';
import HighlightElement         from './highlightElement.js';
import ShortcutsMessage         from './shortcutsMessage.js';

import {
  SKIP_TO_ID,
  MENU_ID,
  MENU_LANDMARK_GROUP_ID,
  MENU_LANDMARK_GROUP_LABEL_ID,
  MENU_HEADINGS_GROUP_ID,
  MENU_HEADINGS_GROUP_LABEL_ID,
  MENU_SHORTCUTS_GROUP_ID,
  MENU_SHORTCUTS_GROUP_LABEL_ID,
  INFO_DIALOG_ELEMENT_NAME,
  HIGHLIGHT_ELEMENT_NAME,
  MESSAGE_ELEMENT_NAME
} from './constants.js';

import {
  getLandmarksAndHeadings,
  skipToElement,
  queryDOMForSkipToId
} from './landmarksHeadings.js';

import {
  getFocusElement,
  navigateContent
} from './shortcuts.js';

import {
  elementTakesText,
  onlyShiftPressed,
  noModifierPressed,
  onlyAltPressed,
  onlyOptionPressed
} from './keyboardHelpers.js';

/* Constants */
const debug = new DebugLogging('SkipToButton', false);
debug.flag = false;

/**
 * @class SkiptoMenuButton
 *
 * @desc Constructor for creating a button to open a menu of headings and landmarks on 
 *       a web page
 *
 * @param {Object}  skipToContentElem  -  The skip-to-content objecy
 * 
 * @returns {Object}  DOM element node that is the container for the button and the menu
 */
export default class SkiptoMenuButton {

    constructor (skipToContentElem) {
      this.skipToContentElem = skipToContentElem;
      this.config     = skipToContentElem.config;

      // check for 'nav' element, if not use 'div' element
      const ce = this.config.containerElement.toLowerCase().trim() === 'nav' ? 'nav' : 'div';

      this.containerNode = document.createElement(ce);
      skipToContentElem.shadowRoot.appendChild(this.containerNode);

      this.containerNode.id = SKIP_TO_ID;
      if (ce === 'nav') {
        this.containerNode.setAttribute('aria-label', this.config.buttonLabel);
      }
      if (isNotEmptyString(this.config.customClass)) {
        this.containerNode.classList.add(this.config.customClass);
      }

      this.setDisplayOption(this.config.displayOption);

      // Create button

      const [buttonVisibleLabel, buttonAriaLabel] = this.getBrowserSpecificShortcut(this.config);

      this.buttonNode = document.createElement('button');
      this.buttonNode.setAttribute('aria-haspopup', 'menu');
      this.buttonNode.setAttribute('aria-expanded', 'false');
      this.buttonNode.setAttribute('aria-label', buttonAriaLabel);
      this.buttonNode.setAttribute('aria-controls', MENU_ID);
      this.buttonNode.addEventListener('keydown', this.handleButtonKeydown.bind(this));
      this.buttonNode.addEventListener('click', this.handleButtonClick.bind(this));
      this.containerNode.appendChild(this.buttonNode);

      this.textButtonNode = document.createElement('span');
      this.buttonNode.appendChild(this.textButtonNode);
      this.textButtonNode.classList.add('skipto-text');
      this.textButtonNode.textContent = buttonVisibleLabel;

      this.smallButtonNode = document.createElement('span');
      this.buttonNode.appendChild(this.smallButtonNode);
      this.smallButtonNode.classList.add('skipto-small');
      this.smallButtonNode.textContent = this.config.smallButtonLabel;

      this.mediumButtonNode = document.createElement('span');
      this.buttonNode.appendChild(this.mediumButtonNode);
      this.mediumButtonNode.classList.add('skipto-medium');
      this.mediumButtonNode.textContent = this.config.buttonLabel;

      // Create menu container
      this.menuitemNodes = [];

      this.menuNode   = document.createElement('div');
      this.menuNode.setAttribute('id', MENU_ID);
      this.menuNode.setAttribute('role', 'menu');
      this.menuNode.setAttribute('aria-label', this.config.menuLabel);
      this.containerNode.appendChild(this.menuNode);

      this.landmarkGroupLabelNode = document.createElement('div');
      this.landmarkGroupLabelNode.id = MENU_LANDMARK_GROUP_LABEL_ID;
      this.landmarkGroupLabelNode.setAttribute('role', 'separator');
      this.landmarkGroupLabelNode.textContent = this.addNumberToGroupLabel(this.config.landmarkGroupLabel);
      this.menuNode.appendChild(this.landmarkGroupLabelNode);

      this.landmarkGroupNode = document.createElement('div');
      this.landmarkGroupNode.id = MENU_LANDMARK_GROUP_ID;
      this.landmarkGroupNode.setAttribute('role', 'group');
      this.landmarkGroupNode.className = 'overflow';
      this.landmarkGroupNode.setAttribute('aria-labelledby', MENU_LANDMARK_GROUP_LABEL_ID);
      this.menuNode.appendChild(this.landmarkGroupNode);

      this.headingGroupLabelNode = document.createElement('div');
      this.headingGroupLabelNode.id = MENU_HEADINGS_GROUP_LABEL_ID;
      this.headingGroupLabelNode.setAttribute('role', 'separator');
      this.headingGroupLabelNode.textContent = this.addNumberToGroupLabel(this.config.headingGroupLabel);
      this.menuNode.appendChild(this.headingGroupLabelNode);

      this.headingGroupNode = document.createElement('div');
      this.headingGroupNode.id = MENU_HEADINGS_GROUP_ID;
      this.headingGroupNode.setAttribute('role', 'group');
      this.headingGroupNode.className = 'overflow';
      this.headingGroupNode.setAttribute('aria-labelledby', MENU_HEADINGS_GROUP_LABEL_ID);
      this.menuNode.appendChild(this.headingGroupNode);

      this.shortcutsGroupLabelNode = document.createElement('div');
      this.shortcutsGroupLabelNode.setAttribute('id', MENU_SHORTCUTS_GROUP_LABEL_ID);
      this.shortcutsGroupLabelNode.setAttribute('role', 'separator');
      if (this.config.shortcuts === 'enabled') {
        this.shortcutsGroupLabelNode.textContent = this.config.shortcutsGroupEnabledLabel;
      }
      else {
        this.shortcutsGroupLabelNode.textContent = this.config.shortcutsGroupDisabledLabel;
      }
      this.menuNode.appendChild(this.shortcutsGroupLabelNode);

      this.shortcutsGroupNode = document.createElement('div');
      this.shortcutsGroupNode.setAttribute('id', MENU_SHORTCUTS_GROUP_ID);
      this.shortcutsGroupNode.setAttribute('role', 'group');
      this.shortcutsGroupNode.setAttribute('aria-labelledby', MENU_SHORTCUTS_GROUP_LABEL_ID);
      this.menuNode.appendChild(this.shortcutsGroupNode);

      if (this.config.aboutSupported === 'true') {
        this.renderAboutToMenu(this.menuNode, this.config);
      }

      // Information dialog

      this.infoDialog = document.querySelector(INFO_DIALOG_ELEMENT_NAME);

      if (!this.infoDialog) {
        window.customElements.define(INFO_DIALOG_ELEMENT_NAME, SkipToContentInfoDialog);
        this.infoDialog = document.createElement(INFO_DIALOG_ELEMENT_NAME);
        this.infoDialog.configureStyle(this.config);
        document.body.appendChild(this.infoDialog);
      }

      // Highlight element

      this.highlightElem = document.querySelector(HIGHLIGHT_ELEMENT_NAME);

      if (!this.highlightElem) {
        window.customElements.define(HIGHLIGHT_ELEMENT_NAME, HighlightElement);
        this.highlightElem = document.createElement(HIGHLIGHT_ELEMENT_NAME);
        this.highlightElem.configureStyle(this.config);
        document.body.appendChild(this.highlightElem);
      }

      // Shortcut messages

      this.shortcutsMessage = document.querySelector(MESSAGE_ELEMENT_NAME);

      if (!this.shortcutsMessage) {
        window.customElements.define(MESSAGE_ELEMENT_NAME, ShortcutsMessage);
        this.shortcutsMessage = document.createElement(MESSAGE_ELEMENT_NAME);
        this.shortcutsMessage.configureStyle(this.config);
        document.body.appendChild(this.shortcutsMessage);
      }

      this.containerNode.addEventListener('focusin', this.handleFocusin.bind(this));
      this.containerNode.addEventListener('focusout', this.handleFocusout.bind(this));
      this.containerNode.addEventListener('pointerdown', this.handleContainerPointerdown.bind(this), true);
      document.documentElement.addEventListener('pointerdown', this.handleBodyPointerdown.bind(this), true);

      if (this.usesAltKey || this.usesOptionKey) {
        document.addEventListener(
          'keydown',
          this.handleDocumentKeydown.bind(this)
        );
      }

      skipToContentElem.shadowRoot.appendChild(this.containerNode);

      this.focusMenuitem = null;
    }

    /*
     * @get highlightTarget
     *
     * @desc Returns normalized value for the highlightTarget option
     */
    get highlightTarget () {
      let value = this.config.highlightTarget.trim().toLowerCase();

      if ('enabled smooth'.includes(value)) {
        return 'smooth';
      }

      if (value === 'instant') {
        return 'instant';
      }

      return '';
    }

    /*
     * @method focusButton
     *
     * @desc Sets keyboard focus on the menu button
     */
    focusButton() {
      this.buttonNode.focus();
      this.skipToContentElem.setAttribute('focus', 'button');
    }

    /*
     * @method addNumberToGroupLabel
     *
     * @desc Updates group label with the number of items in group,
     *       The '#' character in the string is replaced with the number
     *       if number is not provided, just remove number
     *
     * @param  {String}  label  -  Label to include number,
     * @param  {Number}  num    -  Number to add to label
     *
     * @return {String}  see @desc
     */
    addNumberToGroupLabel(label, num=0) {
      if (num > 0) {
        return `${label} (${num})`;
      }
      return label;
    }

    /*
     * @method updateLabels
     *
     * @desc Updates labels, important for configuration changes in browser
     *       add-ons and extensions
     */
    updateLabels(config) {
      if (this.containerNode.hasAttribute('aria-label')) {
        this.containerNode.setAttribute('aria-label', config.buttonLabel);
      }

      const [buttonVisibleLabel, buttonAriaLabel] = this.getBrowserSpecificShortcut(config);
      this.buttonNode.setAttribute('aria-label', buttonAriaLabel);

      this.textButtonNode.textContent = buttonVisibleLabel;
      this.smallButtonNode.textContent = config.smallButtonLabel;
      this.mediumButtonNode.textContent = config.buttonLabel;

      this.menuNode.setAttribute('aria-label', config.menuLabel);
      this.landmarkGroupLabelNode.textContent = this.addNumberToGroupLabel(config.landmarkGroupLabel);
      this.headingGroupLabelNode.textContent = this.addNumberToGroupLabel(config.headingGroupLabel);
    }

    /*
     * @method getBrowserSpecificShortcut
     *
     * @desc Identifies the operating system and updates labels for 
     *       shortcut key to use either the "alt" or the "option"
     *       label  
     *
     * @param {Object}  - SkipTp configure object
     *
     * @return {Array}  - An array of two strings used for the button label
     */
    getBrowserSpecificShortcut (config) {
      const platform =  navigator.platform.toLowerCase();
      const userAgent = navigator.userAgent.toLowerCase();

      const hasWin    = platform.indexOf('win') >= 0;
      const hasMac    = platform.indexOf('mac') >= 0;
      const hasLinux  = platform.indexOf('linux') >= 0 || platform.indexOf('bsd') >= 0;
      const hasAndroid = userAgent.indexOf('android') >= 0;

      this.usesAltKey = hasWin || (hasLinux && !hasAndroid);
      this.usesOptionKey = hasMac;

      let label = config.buttonLabel;
      let ariaLabel = config.buttonLabel;
      let buttonShortcut;

      // Check to make sure a shortcut key is defined
      if (config.altShortcut && config.optionShortcut) {
        if (this.usesAltKey || this.usesOptionKey) {
          buttonShortcut = config.buttonShortcut.replace(
            '$key',
            config.altShortcut
          );
        }
        if (this.usesAltKey) {
          buttonShortcut = buttonShortcut.replace(
            '$modifier',
            config.altLabel
          );
          label = label + buttonShortcut;
          ariaLabel = config.buttonAriaLabel.replace('$key', config.altShortcut);
          ariaLabel = ariaLabel.replace('$buttonLabel', config.buttonLabel);
          ariaLabel = ariaLabel.replace('$modifierLabel', config.altLabel);
          ariaLabel = ariaLabel.replace('$shortcutLabel', config.shortcutLabel);
        }

        if (this.usesOptionKey) {
          buttonShortcut = buttonShortcut.replace(
            '$modifier',
            config.optionLabel
          );
          label = label + buttonShortcut;
          ariaLabel = config.buttonAriaLabel.replace('$key', config.altShortcut);
          ariaLabel = ariaLabel.replace('$buttonLabel', config.buttonLabel);
          ariaLabel = ariaLabel.replace('$modifierLabel', config.optionLabel);
          ariaLabel = ariaLabel.replace('$shortcutLabel', config.shortcutLabel);
        }
      }
      return [label, ariaLabel];
    }

    /*
     * @method getFirstChar
     *
     * @desc Gets the first character in a menuitem to use as a shortcut key
     * 
     * @param  {Object}  menuitem  - DOM element node
     *
     * @returns {String} see @desc
     */
    getFirstChar(menuitem) {
      const label = menuitem.querySelector('.label');
      if (label && isNotEmptyString(label.textContent)) {
        return label.textContent.trim()[0].toLowerCase();
      }
      return '';
    }

    /*
     * @method getHeadingLevelFromAttribute
     *
     * @desc Returns the the heading level of the menu item
     * 
     * @param  {Object}  menuitem  - DOM element node
     *
     * @returns {String} see @desc
     */
    getHeadingLevelFromAttribute(menuitem) {
      if (menuitem.hasAttribute('data-level')) {
        return menuitem.getAttribute('data-level');
      }
      return '';
    }

    /*
     * @method updateKeyboardShortCuts
     *
     * @desc Updates the keyboard short cuts for the curent menu items
     */
    updateKeyboardShortCuts () {
      let mi;
      this.firstChars = [];
      this.headingLevels = [];

      for(let i = 0; i < this.menuitemNodes.length; i += 1) {
        mi = this.menuitemNodes[i];
        this.firstChars.push(this.getFirstChar(mi));
        this.headingLevels.push(this.getHeadingLevelFromAttribute(mi));
      }
    }

    /*
     * @method updateMenuitems
     *
     * @desc  Updates the menu information with the current menu items
     *        used for menu navigation commands and adds event handlers
     */
    updateMenuitems () {
      let menuitemNodes = this.menuNode.querySelectorAll('[role=menuitem');

      this.menuitemNodes = [];
      for(let i = 0; i < menuitemNodes.length; i += 1) {
        const menuitemNode = menuitemNodes[i];
        menuitemNode.addEventListener('keydown', this.handleMenuitemKeydown.bind(this));
        menuitemNode.addEventListener('click', this.handleMenuitemClick.bind(this));
        menuitemNode.addEventListener('pointerenter', this.handleMenuitemPointerenter.bind(this));
        menuitemNode.addEventListener('pointerleave', this.handleMenuitemPointerleave.bind(this));
        menuitemNode.addEventListener('pointerover', this.handleMenuitemPointerover.bind(this));
        this.menuitemNodes.push(menuitemNode);
      }

      this.firstMenuitem = this.menuitemNodes[0];
      this.lastMenuitem = this.menuitemNodes[this.menuitemNodes.length-1];
      this.lastMenuitem.classList.add('last');
      this.updateKeyboardShortCuts();
    }

    /*
     * @method renderAboutToMenu
     *
     * @desc Render the about menuitem
     *
     * @param  {Object}  menuNode   -  DOM element node for the menu
     */
    renderAboutToMenu (menuNode, config) {

      const separatorNode = document.createElement('div');
      separatorNode.setAttribute('role', 'separator');

      const menuitemNode = document.createElement('div');
      menuitemNode.setAttribute('role', 'menuitem');
      menuitemNode.setAttribute('data-about-info', '');
      menuitemNode.className = 'skip-to-nav skip-to-nesting-level-0';
      menuitemNode.tabIndex = -1;

      const labelNode = document.createElement('span');
      labelNode.classList.add('label');
      labelNode.textContent = config.aboutInfoLabel;
      menuitemNode.appendChild(labelNode);

      menuNode.appendChild(separatorNode);
      menuNode.appendChild(menuitemNode);
    }

    /*
     * @method renderMenuitemToGroup
     *
     * @desc Renders a menuitem using an information object about the menuitem
     *
     * @param  {Object}  groupNode  -  DOM element node for the menu group
     * @param  {Object}  mi         - object with menuitem information
     */
    renderMenuitemToGroup (groupNode, mi) {
      let tagNode, tagNodeChild, labelNode, nestingNode;

      let menuitemNode = document.createElement('div');
      menuitemNode.setAttribute('role', 'menuitem');
      menuitemNode.classList.add(mi.class);
      if (isNotEmptyString(mi.tagName)) {
        menuitemNode.classList.add('skip-to-' + mi.tagName.toLowerCase());
      }
      menuitemNode.setAttribute('data-id', mi.dataId);
      menuitemNode.tabIndex = -1;
      if (isNotEmptyString(mi.ariaLabel)) {
        menuitemNode.setAttribute('aria-label', mi.ariaLabel);
      }

      // add to group
      groupNode.appendChild(menuitemNode);

      // add heading level and label
      if (mi.class.includes('heading')) {
        if (this.config.enableHeadingLevelShortcuts) {
          tagNode = document.createElement('span');
          tagNodeChild = document.createElement('span');
          tagNodeChild.appendChild(document.createTextNode(mi.level));
          tagNode.append(tagNodeChild);
          tagNode.appendChild(document.createTextNode(')'));
          tagNode.classList.add('level');
          menuitemNode.append(tagNode);
        } else {
          menuitemNode.classList.add('no-level');
        }
        menuitemNode.setAttribute('data-level', mi.level);
        if (isNotEmptyString(mi.tagName)) {
          menuitemNode.classList.add('skip-to-' + mi.tagName);
        }
      }

      // add nesting level for landmarks
      if (mi.class.includes('landmark')) {
        menuitemNode.setAttribute('data-nesting', mi.nestingLevel);
        menuitemNode.classList.add('skip-to-nesting-level-' + mi.nestingLevel);

        if (mi.nestingLevel > 0 && (mi.nestingLevel > this.lastNestingLevel)) {
          nestingNode = document.createElement('span');
          nestingNode.classList.add('nesting');
          menuitemNode.append(nestingNode);
        }
        this.lastNestingLevel = mi.nestingLevel;
      }

      labelNode = document.createElement('span');
      labelNode.appendChild(document.createTextNode(mi.name));
      labelNode.classList.add('label');
      menuitemNode.append(labelNode);

      return menuitemNode;
    }

    /*
     * @method renderMenuitemsToGroup
     *
     * @desc Renders either the landmark region or headings menu group
     * 
     * @param  {Object}  groupNode       -  DOM element node for the menu group
     * @param  {Array}   menuitems       -  Array of objects with menu item information
     * @param  {String}  msgNoItesmFound -  Message to render if there are no menu items
     */
    renderMenuitemsToGroup(groupNode, menuitems, msgNoItemsFound) {
      // remove all child nodes
      while (groupNode.firstChild) {
        groupNode.removeChild(groupNode.firstChild);
      }

      this.lastNestingLevel = 0;

      if (menuitems.length === 0) {
        const item = {};
        item.name = msgNoItemsFound;
        item.tagName = '';
        item.class = 'no-items';
        item.dataId = '';
        this.renderMenuitemToGroup(groupNode, item);
      }
      else {
        for (let i = 0; i < menuitems.length; i += 1) {
            this.renderMenuitemToGroup(groupNode, menuitems[i]);
        }
      }
    }

    /*
     * @method renderMenu
     *
     * @desc 
     */
    renderMenu(config, skipToId) {
      // remove landmark menu items
      while (this.landmarkGroupNode.lastElementChild) {
        this.landmarkGroupNode.removeChild(this.landmarkGroupNode.lastElementChild);
      }
      // remove heading menu items
      while (this.headingGroupNode.lastElementChild) {
        this.headingGroupNode.removeChild(this.headingGroupNode.lastElementChild);
      }

      // Create landmarks group
      const [landmarkElements, headingElements] = getLandmarksAndHeadings(config, skipToId);

      this.renderMenuitemsToGroup(this.landmarkGroupNode, landmarkElements, config.msgNoLandmarksFound);
      this.renderMenuitemsToGroup(this.headingGroupNode,  headingElements, config.msgNoHeadingsFound);
      debug.flag && debug.log(`[shortcutsSupported]: ${config.shortcutsSupported}`);
      this.renderMenuitemsToShortcutsGroup(this.shortcutsGroupLabelNode, this.shortcutsGroupNode);

      // Update list of menuitems
      this.updateMenuitems();

      this.landmarkGroupLabelNode.textContent = this.addNumberToGroupLabel(config.landmarkGroupLabel, landmarkElements.length);
      if (landmarkElements.length === 1) {
        this.landmarkGroupLabelNode.setAttribute('aria-label', config.landmarkOneGroupLabel);
      }
      else {
       this.landmarkGroupLabelNode.setAttribute('aria-label', `${landmarkElements.length} ${config.landmarkGroupLabel}`);
      }

      if (config.headings.includes('main')) {
        this.headingGroupLabelNode.textContent = this.addNumberToGroupLabel(config.headingMainGroupLabel, headingElements.length);
        if (headingElements.length === 1) {
          this.headingGroupLabelNode.setAttribute('aria-label', config.headingOneMainGroupLabel);
        }
        else {
         this.headingGroupLabelNode.setAttribute('aria-label', `${headingElements.length} ${config.headingMainGroupLabel}`);
        }
      }
      else {
        this.headingGroupLabelNode.textContent = this.addNumberToGroupLabel(config.headingGroupLabel, headingElements.length);
        if (headingElements.length === 1) {
          this.headingGroupLabelNode.setAttribute('aria-label', config.headingOneGroupLabel);
        }
        else {
         this.headingGroupLabelNode.setAttribute('aria-label', `${headingElements.length} ${config.headingGroupLabel}`);
        }
      }
    }

    /*
     * @method renderMenuitemsToShortcutsGroup
     *
     * @desc Updates separator and menuitems related to page navigation
     *
     * @param  {Object}  groupLabelNode  -  DOM element node for the label for page navigation group
     * @param  {Object}  groupLabelNode  -  DOM element node for the page navigation group
     */
    renderMenuitemsToShortcutsGroup (groupLabelNode, groupNode) {

      // remove page navigation menu items
      while (groupNode.lastElementChild) {
        groupNode.removeChild(groupNode.lastElementChild);
      }

      if (this.config.shortcutsSupported === 'true') {
        groupNode.classList.remove('shortcuts-disabled');
        groupLabelNode.classList.remove('shortcuts-disabled');

        const shortcutsToggleNode = document.createElement('div');
        shortcutsToggleNode.setAttribute('role', 'menuitem');
        shortcutsToggleNode.className = 'shortcuts skip-to-nav skip-to-nesting-level-0';
        shortcutsToggleNode.setAttribute('tabindex', '-1');
        groupNode.appendChild(shortcutsToggleNode);

        const shortcutsToggleLabelNode = document.createElement('span');
        shortcutsToggleLabelNode.className = 'label';
        shortcutsToggleNode.appendChild(shortcutsToggleLabelNode);

        if (this.config.shortcuts === 'enabled') {
          groupLabelNode.textContent    = this.config.shortcutsGroupEnabledLabel;
          shortcutsToggleNode.setAttribute('data-shortcuts-toggle', 'disable');
          shortcutsToggleLabelNode.textContent = this.config.shortcutsToggleDisableLabel;
        }
        else {
          groupLabelNode.textContent = this.config.shortcutsGroupDisabledLabel;
          shortcutsToggleNode.setAttribute('data-shortcuts-toggle', 'enable');
          shortcutsToggleLabelNode.textContent = this.config.shortcutsToggleEnableLabel;
        }
        groupNode.appendChild(shortcutsToggleNode);


        const shortcutsInfoNode = document.createElement('div');
        shortcutsInfoNode.setAttribute('role', 'menuitem');
        shortcutsInfoNode.className = 'shortcuts skip-to-nav skip-to-nesting-level-0';
        shortcutsInfoNode.setAttribute('tabindex', '-1');
        shortcutsInfoNode.setAttribute('data-shortcuts-info', '');
        groupNode.appendChild(shortcutsInfoNode);

        const shortcutsInfoLabelNode = document.createElement('span');
        shortcutsInfoLabelNode.className = 'label';
        shortcutsInfoLabelNode.textContent = this.config.shortcutsInfoLabel;
        shortcutsInfoNode.appendChild(shortcutsInfoLabelNode);


      }
      else {
        groupNode.classList.add('shortcuts-disabled');
        groupLabelNode.classList.add('shortcuts-disabled');
      }



    }

//
// Menu scripting helper functions and event handlers
//

    /*
     * @method setFocusToMenuitem
     *
     * @desc Moves focus to menu item
     *
     * @param {Object}  menuItem  - DOM element node used as a menu item
     */
    setFocusToMenuitem(menuitem) {
      if (menuitem) {
        this.removeHoverClass(menuitem);
        menuitem.classList.add('hover');
        menuitem.focus();
        this.skipToContentElem.setAttribute('focus', 'menu');
        this.focusMenuitem = menuitem;
        if (menuitem.hasAttribute('data-id')) {
          const elem = queryDOMForSkipToId(menuitem.getAttribute('data-id'));
          this.highlightElem.highlight(elem, this.highlightTarget);
        }
        else {
          this.highlightElem.removeHighlight();
        }
      }
    }

    /*
     * @method setFocusToFirstMenuitem
     *
     * @desc Moves focus to first menu item
     */
    setFocusToFirstMenuitem() {
      this.setFocusToMenuitem(this.firstMenuitem);
    }

    /*
     * @method setFocusToLastMenuitem
     *
     * @desc Moves focus to last menu item
     */
    setFocusToLastMenuitem() {
      this.setFocusToMenuitem(this.lastMenuitem);
    }

    /*
     * @method setFocusToPreviousMenuitem
     *
     * @desc Moves focus to previous menu item
     *
     * @param {Object}  menuItem  - DOM element node 
     */
    setFocusToPreviousMenuitem(menuitem) {
      let newMenuitem, index;
      if (menuitem === this.firstMenuitem) {
        newMenuitem = this.lastMenuitem;
      } else {
        index = this.menuitemNodes.indexOf(menuitem);
        newMenuitem = this.menuitemNodes[index - 1];
      }
      this.setFocusToMenuitem(newMenuitem);
      return newMenuitem;
    }

    /*
     * @method setFocusToNextMenuitem
     *
     * @desc Moves focus to next menu item
     *
     * @param {Object}  menuItem  - DOM element node 
     */
    setFocusToNextMenuitem(menuitem) {
      let newMenuitem, index;
      if (menuitem === this.lastMenuitem) {
        newMenuitem = this.firstMenuitem;
      } else {
        index = this.menuitemNodes.indexOf(menuitem);
        newMenuitem = this.menuitemNodes[index + 1];
      }
      this.setFocusToMenuitem(newMenuitem);
      return newMenuitem;
    }

    /*
     * @method setFocusByFirstCharacter
     *
     * @desc Moves focus to next menu item based on shortcut key
     *
     * @param {Object}  menuItem  - Starting DOM element node 
     * @param {String}  char      - Shortcut key to identify the
     *                              next menu item  
     */
    setFocusByFirstCharacter(menuitem, char) {
      let start, index;
      if (char.length > 1) {
        return;
      }
      char = char.toLowerCase();

      // Get start index for search based on position of currentItem
      start = this.menuitemNodes.indexOf(menuitem) + 1;
      if (start >= this.menuitemNodes.length) {
        start = 0;
      }

      // Check remaining items in the menu
      index = this.firstChars.indexOf(char, start);

      // If not found in remaining items, check headings
      if (index === -1) {
        index = this.headingLevels.indexOf(char, start);
      }

      // If not found in remaining items, check from beginning
      if (index === -1) {
        index = this.firstChars.indexOf(char, 0);
      }

      // If not found in remaining items, check headings from beginning
      if (index === -1) {
        index = this.headingLevels.indexOf(char, 0);
      }

      // If match was found...
      if (index > -1) {
        this.setFocusToMenuitem(this.menuitemNodes[index]);
      }
    }

    /*
     * @method getIndexFirstChars
     *
     * @desc  
     *
     * @returns {Number} 
     */
    getIndexFirstChars(startIndex, char) {
      for (let i = startIndex; i < this.firstChars.length; i += 1) {
        if (char === this.firstChars[i]) {
          return i;
        }
      }
      return -1;
    }

    /*
     * @method openPopup
     *
     * @desc Opens the menu of landmark regions and headings
     */
    openPopup() {
      debug.flag && debug.log(`[openPopup]`);
      this.menuNode.setAttribute('aria-busy', 'true');
      // Compute height of menu to not exceed about 80% of screen height
      const h = (30 * window.innerHeight) / 100;
      this.landmarkGroupNode.style.maxHeight = h + 'px';
      this.headingGroupNode.style.maxHeight = h + 'px';
      this.renderMenu(this.config, this.skipToId);
      this.menuNode.style.display = 'block';

      // make sure menu is on screen and not clipped in the right edge of the window
      const buttonRect = this.buttonNode.getBoundingClientRect();
      const menuRect = this.menuNode.getBoundingClientRect();
      const diff = window.innerWidth - buttonRect.left - menuRect.width - 8;
      if (diff < 0) {
        if (buttonRect.left + diff < 0) {
          this.menuNode.style.left = (8 - buttonRect.left) + 'px';
        } else {
          this.menuNode.style.left = diff + 'px';
        }
      }

      this.menuNode.removeAttribute('aria-busy');
      this.buttonNode.setAttribute('aria-expanded', 'true');
      // use custom element attribute to set focus to the menu
      this.skipToContentElem.setAttribute('focus', 'menu');
    }

    /*
     * @method closePopup
     *
     * @desc Closes the memu of landmark regions and headings
     */
    closePopup() {
      debug.flag && debug.log(`[closePopup]`);
      if (this.isOpen()) {
        this.buttonNode.setAttribute('aria-expanded', 'false');
        this.menuNode.style.display = 'none';
        this.highlightElem.removeHighlight();
      }
    }

    /*
     * @method isOpen
     *
     * @desc Returns true if menu is open, otherwise false
     *
     * @returns {Boolean}  see @desc
     */
    isOpen() {
      return this.buttonNode.getAttribute('aria-expanded') === 'true';
    }

    /*
     * @method removeHoverClass
     *
     * @desc Removes hover class for menuitems
     */
    removeHoverClass(target=null) {
      this.menuitemNodes.forEach( node => {
        if (node !== target) {
          node.classList.remove('hover');
        }
      });
    }

    /*
     * @method getMenuitem
     *
     * @desc Returns menuitem dom node if pointer is over it
     *
     * @param {Number}   x: client x coordinator of pointer
     * @param {Number}   y: client y coordinator of pointer
     *
     * @return {object}  see @desc
     */
    getMenuitem(x, y) {
      for (let i = 0; i < this.menuitemNodes.length; i += 1) {
        const node = this.menuitemNodes[i];
        const rect = node.getBoundingClientRect();

        if ((rect.left <= x) &&
            (rect.right >= x) &&
            (rect.top <= y) &&
            (rect.bottom >= y)) {
              return node;
            }
      }
      return false;
    }

    /*
     * @method isOverButton
     *
     * @desc Returns true if pointer over button
     *
     * @param {Number}   x: client x coordinator of pointer
     * @param {Number}   y: client y coordinator of pointer
     *
     * @return {object}  see @desc
     */
    isOverButton(x, y) {
      const node = this.buttonNode;
      const rect = node.getBoundingClientRect();

      return (rect.left <= x) &&
             (rect.right >= x) &&
             (rect.top <= y) &&
             (rect.bottom >= y);
    }

    /*
     * @method isOverMenu
     *
     * @desc Returns true if pointer over the menu
     *
     * @param {Number}   x: client x coordinator of pointer
     * @param {Number}   y: client y coordinator of pointer
     *
     * @return {object}  see @desc
     */
    isOverMenu(x, y) {
      const node = this.menuNode;
      const rect = node.getBoundingClientRect();

      return (rect.left <= x) &&
             (rect.right >= x) &&
             (rect.top <= y) &&
             (rect.bottom >= y);
    }    

    /*
     * @method setDisplayOption
     *
     * @desc Set display option for button visibility wehn it does not
     *       have focus
     *
     * @param  {String}  value - String with configuration information
     */
    setDisplayOption(value) {

      if (typeof value === 'string') {
        value = value.trim().toLowerCase();
        if (value.length && this.containerNode) {

          this.containerNode.classList.remove('static');
          this.containerNode.classList.remove('popup');
          this.containerNode.classList.remove('show-border');

          switch (value) {
            case 'static':
              this.containerNode.classList.add('static');
              break;
            case 'onfocus':  // Legacy option
            case 'popup':
              this.containerNode.classList.add('popup');
              break;
            case 'popup-border':
              this.containerNode.classList.add('popup');
              this.containerNode.classList.add('show-border');
              break;
            default:
              break;
          }
        }
      }
    }

    // Menu event handlers
    
    handleFocusin() {
      this.containerNode.classList.add('focus');
      this.skipToContentElem.setAttribute('focus', 'button');
    }
    
    handleFocusout() {
      this.containerNode.classList.remove('focus');
      this.skipToContentElem.setAttribute('focus', 'none');
    }
    
    handleButtonKeydown(event) {
      let key = event.key,
        flag = false;
      switch (key) {
        case ' ':
        case 'Enter':
        case 'ArrowDown':
        case 'Down':
          this.openPopup();
          this.setFocusToFirstMenuitem();
          flag = true;
          break;
        case 'Esc':
        case 'Escape':
          this.closePopup();
          this.buttonNode.focus();
          this.skipToContentElem.setAttribute('focus', 'button');
          flag = true;
          break;
        case 'Up':
        case 'ArrowUp':
          this.openPopup();
          this.setFocusToLastMenuitem();
          flag = true;
          break;
        default:
          break;
      }
      if (flag) {
        event.stopPropagation();
        event.preventDefault();
      }
    }

    handleButtonClick(event) {
      debug.flag && debug.log(`[handleButtonClick]`);
      if (this.isOpen()) {
        this.closePopup();
        this.buttonNode.focus();
        this.skipToContentElem.setAttribute('focus', 'button');
      } else {
        this.openPopup();
        this.setFocusToFirstMenuitem();
      }
      event.stopPropagation();
      event.preventDefault();
    }

    handleDocumentKeydown (event) {

      this.shortcutsMessage.close();

      let flag = false;
      let elem;
      const focusElem = getFocusElement();
      debug.flag && debug.log(`[handleDocumentKeydown][elementTakesText][${event.target.tagName}]: ${elementTakesText(focusElem)}`);
      if (!elementTakesText(focusElem)) {

        const altPressed = this.usesAltKey && onlyAltPressed(event);
        const optionPressed = this.usesOptionKey && onlyOptionPressed(event);

        if ((optionPressed && this.config.optionShortcut === event.key) ||
            (altPressed && this.config.altShortcut === event.key) ||
            ((optionPressed || altPressed) && (48 === event.keyCode))
        ) {
          this.openPopup();
          this.setFocusToFirstMenuitem();
          flag = true;
        }

        // Check for navigation keys
        if ((this.config.shortcuts === 'enabled') &&
            (onlyShiftPressed(event) || noModifierPressed(event))) {

          switch (event.key) {
            // ignore and space characters
            case ' ':
            case '':
              break;

            case this.config.shortcutRegionNext:
              elem = navigateContent('landmark', 'next', this.config.msgHeadingLevel);
              if (!elem) {
                this.shortcutsMessage.open(this.config.msgNoMoreRegions);
              }
              flag = true;
              break;

            case this.config.shortcutRegionPrevious:
              elem = navigateContent('landmark', 'previous', this.config.msgHeadingLevel);
              if (!elem) {
                this.shortcutsMessage.open(this.config.msgNoMoreRegions);
              }
              flag = true;
              break;

            case this.config.shortcutRegionComplementary:
              elem = navigateContent('complementary', 'next', this.config.msgHeadingLevel, true);
              if (!elem) {
                this.shortcutsMessage.open(this.config.msgNoMoreRegions.replace('%r', 'complementary'));
              }
              flag = true;
              break;

            case this.config.shortcutRegionMain:
              elem = navigateContent('main', 'next', this.config.msgHeadingLevel, true);
              if (!elem) {
                this.shortcutsMessage.open(this.config.msgNoMoreRegions.replace('%r', 'main'));
              }
              flag = true;
              break;

            case this.config.shortcutRegionNavigation:
              elem = navigateContent('navigation', 'next', this.config.msgHeadingLevel, true);
              if (!elem) {
                this.shortcutsMessage.open(this.config.msgNoMoreRegions.replace('%r', 'navigation'));
              }
              flag = true;
              break;

            case this.config.shortcutHeadingNext:
              elem = navigateContent('heading', 'next', this.config.msgHeadingLevel, false, true);
              if (!elem) {
                this.shortcutsMessage.open(this.config.msgNoMoreHeadings);
              }
              flag = true;
              break;

            case this.config.shortcutHeadingPrevious:
              elem = navigateContent('heading', 'previous', this.config.msgHeadingLevel, false, true);
              if (!elem) {
                this.shortcutsMessage.open(this.config.msgNoMoreHeadings);
              }
              flag = true;
              break;

            case this.config.shortcutHeadingH1:
              elem = navigateContent('h1', 'next', this.config.msgHeadingLevel, true, true);
              if (!elem) {
                this.shortcutsMessage.open(this.config.msgNoHeadingsLevelFound.replace('%h', '1'));
              }
              flag = true;
              break;

            case this.config.shortcutHeadingH2:
              elem = navigateContent('h2', 'next', this.config.msgHeadingLevel, true, true);
              if (!elem) {
                this.shortcutsMessage.open(this.config.msgNoHeadingsLevelFound.replace('%h', '2'));
              }
              flag = true;
              break;

            case this.config.shortcutHeadingH3:
              elem = navigateContent('h3', 'next', this.config.msgHeadingLevel, true, true);
              if (!elem) {
                this.shortcutsMessage.open(this.config.msgNoHeadingsLevelFound.replace('%h', '3'));
              }
              flag = true;
              break;

            case this.config.shortcutHeadingH4:
              elem = navigateContent('h4', 'next', this.config.msgHeadingLevel, true, true);
              if (!elem) {
                this.shortcutsMessage.open(this.config.msgNoHeadingsLevelFound.replace('%h', '4'));
              }
              flag = true;
              break;

            case this.config.shortcutHeadingH5:
              elem = navigateContent('h5', 'next', this.config.msgHeadingLevel, true, true);
              if (!elem) {
                this.shortcutsMessage.open(this.config.msgNoHeadingsLevelFound.replace('%h', '5'));
              }
              flag = true;
              break;

            case this.config.shortcutHeadingH6:
              elem = navigateContent('h6', 'next', this.config.msgHeadingLevel, true, true);
              if (!elem) {
                this.shortcutsMessage.open(this.config.msgNoHeadingsLevelFound.replace('%h', '6'));
              }
              flag = true;
              break;

            default:
              break;
          }
        }

        if (flag) {
          event.stopPropagation();
          event.preventDefault();
        }
      }
    }    

    handleMenuitemAction(tgt) {
      if (tgt.hasAttribute('data-id')) {
        switch (tgt.getAttribute('data-id')) {
          case '':
            // this means there were no headings or landmarks in the list
            break;

          default:
            this.closePopup();
            skipToElement(tgt);
            break;
        }
      }

      if (tgt.hasAttribute('data-shortcuts-toggle')) {
        if (tgt.getAttribute('data-shortcuts-toggle') === 'enable') {
          this.skipToContentElem.setAttribute('shortcuts', 'enable');
        }
        else {
          this.skipToContentElem.setAttribute('shortcuts', 'disable');
        }
        this.closePopup();
      }

      if (tgt.hasAttribute('data-shortcuts-info')) {
        this.infoDialog.updateShortcutContent(this.skipToContentElem.config);
        this.infoDialog.openDialog();
        this.closePopup();
      }

      if (tgt.hasAttribute('data-about-info')) {
        this.infoDialog.updateAboutContent(this.skipToContentElem.config);
        this.infoDialog.openDialog();
        this.closePopup();
      }

    }

    handleMenuitemKeydown(event) {
      let tgt = event.currentTarget,
        key = event.key,
        flag = false;

      function isPrintableCharacter(str) {
        return str.length === 1 && str.match(/\S/);
      }
      if (event.ctrlKey || event.altKey || event.metaKey) {
        return;
      }
      if (event.shiftKey) {
        if (isPrintableCharacter(key)) {
          this.setFocusByFirstCharacter(tgt, key);
          flag = true;
        }
        if (event.key === 'Tab') {
          this.closePopup();
          this.buttonNode.focus();
          this.skipToContentElem.setAttribute('focus', 'button');
          flag = true;
        }
      } else {
        switch (key) {
          case 'Enter':
          case ' ':
            this.handleMenuitemAction(tgt);
            flag = true;
            break;
          case 'Esc':
          case 'Escape':
            this.closePopup();
            this.buttonNode.focus();
            this.skipToContentElem.setAttribute('focus', 'button');
            flag = true;
            break;
          case 'Left':
          case 'ArrowLeft':
          case 'Up':
          case 'ArrowUp':
            this.setFocusToPreviousMenuitem(tgt);
            flag = true;
            break;
          case 'ArrowRight':
          case 'Right':
          case 'ArrowDown':
          case 'Down':
            this.setFocusToNextMenuitem(tgt);
            flag = true;
            break;
          case 'Home':
          case 'PageUp':
            this.setFocusToFirstMenuitem();
            flag = true;
            break;
          case 'End':
          case 'PageDown':
            this.setFocusToLastMenuitem();
            flag = true;
            break;
          case 'Tab':
            this.closePopup();
            break;
          default:
            if (isPrintableCharacter(key)) {
              this.setFocusByFirstCharacter(tgt, key);
              flag = true;
            }
            break;
        }
      }
      if (flag) {
        event.stopPropagation();
        event.preventDefault();
      }
    }

    handleMenuitemClick(event) {
      this.handleMenuitemAction(event.currentTarget);
      event.stopPropagation();
      event.preventDefault();
    }

    handleMenuitemPointerenter(event) {
      debug.flag && debug.log(`[enter]`);
      let tgt = event.currentTarget;
      tgt.classList.add('hover');
      if (tgt.hasAttribute('data-id')) {
        const elem = queryDOMForSkipToId(tgt.getAttribute('data-id'));
        this.highlightElem.highlight(elem, this.highlightTarget);
      }
      else {
        this.highlightElem.removeHighlight();
      }
      event.stopPropagation();
      event.preventDefault();
    }

   handleMenuitemPointerover(event) {
      debug.flag && debug.log(`[over]`);
      let tgt = event.currentTarget;
      if (tgt.hasAttribute('data-id')) {
        const elem = queryDOMForSkipToId(tgt.getAttribute('data-id'));
        this.highlightElem.highlight(elem, this.highlightTarget);
      }
      else {
        this.highlightElem.removeHighlight();
      }
      event.stopPropagation();
      event.preventDefault();
    }

    handleMenuitemPointerleave(event) {
      debug.flag && debug.log(`[leave]`);
      let tgt = event.currentTarget;
      tgt.classList.remove('hover');
      event.stopPropagation();
      event.preventDefault();
    }

    handleContainerPointerdown(event) {
      debug.flag && debug.log(`[down]: target: ${event.pointerId}`);

      if (this.isOverButton(event.clientX, event.clientY)) {
        this.containerNode.releasePointerCapture(event.pointerId);
      }
      else {
        this.containerNode.setPointerCapture(event.pointerId);
        this.containerNode.addEventListener('pointermove', this.handleContainerPointermove.bind(this));
        this.containerNode.addEventListener('pointerup', this.handleContainerPointerup.bind(this));

        if (this.containerNode.contains(event.target)) {
          if (this.isOpen()) {
            if (!this.isOverMenu(event.clientX, event.clientY)) {
              debug.flag && debug.log(`[down][close]`);
              this.closePopup();
              this.buttonNode.focus();
              this.skipToContentElem.setAttribute('focus', 'button');
            }
          }
          else {
            debug.flag && debug.log(`[down][open]`);
            this.openPopup();          
            this.setFocusToFirstMenuitem();
          }

        }
      }

      event.stopPropagation();
      event.preventDefault();
    }

    handleContainerPointermove(event) {
      const mi = this.getMenuitem(event.clientX, event.clientY);
      if (mi) {
        this.removeHoverClass(mi);
        mi.classList.add('hover');
        if (mi.hasAttribute('data-id')) {
          const elem = queryDOMForSkipToId(mi.getAttribute('data-id'));
          this.highlightElem.highlight(elem, this.highlightTarget);
        }
        else {
          this.highlightElem.removeHighlight();
        }
      }

      event.stopPropagation();
      event.preventDefault();
    }

    handleContainerPointerup(event) {

      this.containerNode.releasePointerCapture(event.pointerId);
      this.containerNode.removeEventListener('pointermove', this.handleContainerPointermove);
      this.containerNode.removeEventListener('pointerup', this.handleContainerPointerup);

      const mi = this.getMenuitem(event.clientX, event.clientY);
      const omb = this.isOverButton(event.clientX, event.clientY);
      debug.flag && debug.log(`[up] isOverButton: ${omb} getMenuitem: ${mi} id: ${event.pointerId}`);

      if (mi) {
        this.handleMenuitemAction(mi);          
      }
      else {
        if (!omb) {
          debug.flag && debug.log(`[up] not over button `);
          if (this.isOpen()) {
            debug.flag && debug.log(`[up] close `);
            this.closePopup();
            this.buttonNode.focus();
            this.skipToContentElem.setAttribute('focus', 'button');
          }        
        }
      }

      event.stopPropagation();
      event.preventDefault();
    }

    handleBodyPointerdown(event) {
      debug.flag && debug.log(`[handleBodyPointerdown]: target: ${event.pointerId}`);

      if (!this.isOverButton(event.clientX, event.clientY) &&
          !this.isOverMenu(event.clientX, event.clientY)) {
        this.closePopup();
      }
    }
}
