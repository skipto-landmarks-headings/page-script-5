/* skiptoMenuButton.js */

/* Imports */
import DebugLogging  from './debug.js';

import {
  isNotEmptyString
} from './utils.js';

import {
  getLandmarksAndHeadings,
  skipToElement,
  queryDOMForSkipToId
} from './landmarksHeadings.js';

import {
  highlightElement,
  removeHighlight
} from './highlightElement.js';

import {
  navigateContent
} from './pageNavigation.js';

import {
  elementTakesText,
  inContentEditable,
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
      this.skiptoId   = skipToContentElem.skipToId;

      // check for 'nav' element, if not use 'div' element
      const ce = this.config.containerElement.toLowerCase().trim() === 'nav' ? 'nav' : 'div';

      this.containerNode = document.createElement(ce);
      skipToContentElem.shadowRoot.appendChild(this.containerNode);

      this.containerNode.id = this.skiptoId;
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
      this.buttonNode.setAttribute('aria-controls', 'id-skip-to-menu');
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
      this.menuNode.setAttribute('id', 'id-skip-to-menu');
      this.menuNode.setAttribute('role', 'menu');
      this.menuNode.setAttribute('aria-label', this.config.menuLabel);
      this.containerNode.appendChild(this.menuNode);

      this.landmarkGroupLabelNode = document.createElement('div');
      this.landmarkGroupLabelNode.setAttribute('id', 'id-skip-to-menu-landmark-group-label');
      this.landmarkGroupLabelNode.setAttribute('role', 'separator');
      this.landmarkGroupLabelNode.textContent = this.config.landmarkGroupLabel;
      this.menuNode.appendChild(this.landmarkGroupLabelNode);

      this.landmarkGroupNode = document.createElement('div');
      this.landmarkGroupNode.setAttribute('id', 'id-skip-to-menu-landmark-group');
      this.landmarkGroupNode.setAttribute('role', 'group');
      this.landmarkGroupNode.setAttribute('aria-labelledby', 'id-skip-to-menu-landmark-group-label');
      this.menuNode.appendChild(this.landmarkGroupNode);

      this.headingGroupLabelNode = document.createElement('div');
      this.headingGroupLabelNode.setAttribute('id', 'id-skip-to-menu-heading-group-label');
      this.headingGroupLabelNode.setAttribute('role', 'separator');
      this.headingGroupLabelNode.textContent = this.config.headingGroupLabel;
      this.menuNode.appendChild(this.headingGroupLabelNode);

      this.headingGroupNode = document.createElement('div');
      this.headingGroupNode.setAttribute('id', 'id-skip-to-menu-heading-group');
      this.headingGroupNode.setAttribute('role', 'group');
      this.headingGroupNode.setAttribute('aria-labelledby', 'id-skip-to-menu-heading-group-label');
      this.menuNode.appendChild(this.headingGroupNode);

      this.containerNode.addEventListener('focusin', this.handleFocusin.bind(this));
      this.containerNode.addEventListener('focusout', this.handleFocusout.bind(this));
      this.containerNode.addEventListener('pointerdown', this.handleContinerPointerdown.bind(this), true);
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
      this.landmarkGroupLabelNode.textContent = config.landmarkGroupLabel;
      this.headingGroupLabelNode.textContent = config.headingGroupLabel;
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
     *        used for menu navigation commands
     */
    updateMenuitems () {
      let menuitemNodes = this.menuNode.querySelectorAll('[role=menuitem');

      this.menuitemNodes = [];
      for(let i = 0; i < menuitemNodes.length; i += 1) {
        this.menuitemNodes.push(menuitemNodes[i]);
      }

      this.firstMenuitem = this.menuitemNodes[0];
      this.lastMenuitem = this.menuitemNodes[this.menuitemNodes.length-1];
      this.lastMenuitem.classList.add('last');
      this.updateKeyboardShortCuts();
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

      // add event handlers
      menuitemNode.addEventListener('keydown', this.handleMenuitemKeydown.bind(this));
      menuitemNode.addEventListener('click', this.handleMenuitemClick.bind(this));
      menuitemNode.addEventListener('pointerenter', this.handleMenuitemPointerenter.bind(this));
      menuitemNode.addEventListener('pointerleave', this.handleMenuitemPointerleave.bind(this));
      menuitemNode.addEventListener('pointerover', this.handleMenuitemPointerover.bind(this));
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

      // Update list of menuitems
      this.updateMenuitems();
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
        const elem = queryDOMForSkipToId(menuitem.getAttribute('data-id'));
        highlightElement(elem, this.highlightTarget);
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
      const h = (80 * window.innerHeight) / 100;
      this.menuNode.style.maxHeight = h + 'px';
      this.renderMenu(this.config, this.skipToId);
      this.menuNode.style.display = 'block';
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
        removeHighlight();
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

      let flag = false;
      if (!inContentEditable(event.target) &&
          !elementTakesText(event.target)) {

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

        debug.flag && debug.log(`[   pageNavigation]: ${this.config.pageNavigation}`);
        debug.flag && debug.log(`[ onlyShiftPressed]: ${onlyShiftPressed(event)}`);
        debug.flag && debug.log(`[noModifierPressed]: ${noModifierPressed(event)}`);

        if ((this.config.pageNavigation === 'enabled') &&
            (onlyShiftPressed(event) || noModifierPressed(event))) {

          switch (event.key) {
            // ignore and space characters
            case ' ':
            case '':
              break;

            case this.config.pageRegionNext:
              navigateContent('landmark', 'next');
              flag = true;
              break;

            case this.config.pageRegionPrevious:
              navigateContent('landmark', 'previous');
              flag = true;
              break;

            case this.config.pageRegionMain:
              navigateContent('main', 'next', true);
              flag = true;
              break;

            case this.config.pageRegionNavigation:
              navigateContent('navigation', 'next', true);
              flag = true;
              break;

            case this.config.pageHeadingNext:
              navigateContent('heading', 'next');
              flag = true;
              break;

            case this.config.pageHeadingPrevious:
              navigateContent('heading', 'previous');
              flag = true;
              break;

            case this.config.pageHeadingH1:
              navigateContent('h1', 'next', true);
              flag = true;
              break;

            case this.config.pageHeadingH2:
              navigateContent('h2', 'next', true);
              flag = true;
              break;

            case this.config.pageHeadingH3:
              navigateContent('h3', 'next', true);
              flag = true;
              break;

            case this.config.pageHeadingH4:
              navigateContent('h4', 'next', true);
              flag = true;
              break;

            case this.config.pageHeadingH5:
              navigateContent('h5', 'next', true);
              flag = true;
              break;

            case this.config.pageHeadingH6:
              navigateContent('h6', 'next', true);
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
          case 'Up':
          case 'ArrowUp':
            this.setFocusToPreviousMenuitem(tgt);
            flag = true;
            break;
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
      const elem = queryDOMForSkipToId(tgt.getAttribute('data-id'));
      highlightElement(elem, this.highlightTarget);
      event.stopPropagation();
      event.preventDefault();
    }

   handleMenuitemPointerover(event) {
      debug.flag && debug.log(`[over]`);
      let tgt = event.currentTarget;
      const elem = queryDOMForSkipToId(tgt.getAttribute('data-id'));
      highlightElement(elem, this.highlightTarget);
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

    handleContinerPointerdown(event) {
      debug.flag && debug.log(`[down]: target: ${event.pointerId}`);

      if (this.isOverButton(event.clientX, event.clientY)) {
        this.containerNode.releasePointerCapture(event.pointerId);
      }
      else {
        this.containerNode.setPointerCapture(event.pointerId);
        this.containerNode.addEventListener('pointermove', this.handleContinerPointermove.bind(this));
        this.containerNode.addEventListener('pointerup', this.handleContinerPointerup.bind(this));

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

    handleContinerPointermove(event) {
      const mi = this.getMenuitem(event.clientX, event.clientY);
      if (mi) {
        this.removeHoverClass(mi);
        mi.classList.add('hover');
        const elem = queryDOMForSkipToId(mi.getAttribute('data-id'));
        highlightElement(elem, this.highlightTarget);
      }

      event.stopPropagation();
      event.preventDefault();
    }

    handleContinerPointerup(event) {

      this.containerNode.releasePointerCapture(event.pointerId);
      this.containerNode.removeEventListener('pointermove', this.handleContinerPointermove);
      this.containerNode.removeEventListener('pointerup', this.handleContinerPointerup);

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
