/* skiptoMenuButton.js */

/* Imports */
import DebugLogging  from './debug.js';

import {
  isNotEmptyString
} from './utils.js';

import {
  getLandmarksAndHeadings,
  skipToElement
} from './landmarksHeadings.js';

/* Constants */
const debug = new DebugLogging('SkipToButton', false);
debug.flag = false;

/**
 * @class SkiptoMenuButton
 *
 * @desc Constructor for creating a button to open a menu of headings and landmarks on 
 *       a web page
 *
 * @param {Object}  attachNode  - DOM eleemnt node to attach button and menu container element
 * 
 * @returns {Object}  DOM element node that is the contatiner for the button and the menu
 */
export default class SkiptoMenuButton {

    constructor (attachNode, config, id) {
      this.config = config;
      this.skiptoId = id;

      this.containerNode = document.createElement(config.containerElement);
      if (config.containerElement === 'nav') {
        this.containerNode.setAttribute('aria-label', config.buttonLabel);
      }

      this.containerNode.id = id;

      if (isNotEmptyString(config.customClass)) {
        this.containerNode.classList.add(config.customClass);
      }

      let displayOption = config.displayOption;
      if (typeof displayOption === 'string') {
        displayOption = displayOption.trim().toLowerCase();
        if (displayOption.length) {
          switch (config.displayOption) {
            case 'fixed':
              this.containerNode.classList.add('fixed');
              break;
            case 'onfocus':  // Legacy option
            case 'popup':
              this.containerNode.classList.add('popup');
              break;
            default:
              break;
          }
        }
      }

      // Create button

      const [buttonVisibleLabel, buttonAriaLabel] = this.getBrowserSpecificShortcut(config);

      this.buttonNode = document.createElement('button');
      this.buttonNode.setAttribute('aria-label', buttonAriaLabel);
      this.buttonNode.addEventListener('keydown', this.handleButtonKeydown.bind(this));
      this.buttonNode.addEventListener('click', this.handleButtonClick.bind(this));
      this.containerNode.appendChild(this.buttonNode);

      this.buttonTextNode = document.createElement('span');
      this.buttonTextNode.classList.add('skipto-text');
      this.buttonTextNode.textContent = buttonVisibleLabel;
      this.buttonNode.appendChild(this.buttonTextNode);

      const smallButtonNode = document.createElement('span');
      smallButtonNode.classList.add('skipto-small');
      smallButtonNode.textContent = config.smallButtonLabel;
      this.buttonNode.appendChild(smallButtonNode);

      const mediumButtonNode = document.createElement('span');
      mediumButtonNode.classList.add('skipto-medium');
      mediumButtonNode.textContent = config.buttonLabel;
      this.buttonNode.appendChild(mediumButtonNode);

      // Create menu container

      this.menuNode   = document.createElement('div');
      this.menuNode.id = 'id-skip-to-menu';
      this.menuNode.setAttribute('role', 'menu');
      this.menuNode.setAttribute('aria-label', config.menuLabel);
      this.menuNode.setAttribute('aria-busy', 'true');
      this.containerNode.appendChild(this.menuNode);

      const landmarkGroupLabelNode = document.createElement('div');
      landmarkGroupLabelNode.id = 'id-skip-to-menu-landmark-group-label';
      landmarkGroupLabelNode.setAttribute('role', 'separator');
      landmarkGroupLabelNode.textContent = this.config.landmarkGroupLabel;
      this.menuNode.appendChild(landmarkGroupLabelNode);

      this.landmarkGroupNode = document.createElement('div');
      this.landmarkGroupNode.setAttribute('role', 'group');
      this.landmarkGroupNode.setAttribute('aria-labelledby', landmarkGroupLabelNode.id);
      this.landmarkGroupNode.id = '#id-skip-to-menu-landmark-group';
      this.menuNode.appendChild(this.landmarkGroupNode);

      const headingGroupLabelNode = document.createElement('div');
      headingGroupLabelNode.id = 'id-skip-to-menu-heading-group-label';
      headingGroupLabelNode.setAttribute('role', 'separator');
      headingGroupLabelNode.textContent = this.config.headingGroupLabel;
      this.menuNode.appendChild(headingGroupLabelNode);

      this.headingGroupNode = document.createElement('div');
      this.headingGroupNode.setAttribute('role', 'group');
      this.headingGroupNode.setAttribute('aria-labelledby', headingGroupLabelNode.id);
      this.headingGroupNode.id = '#id-skip-to-menu-heading-group';
      this.menuNode.appendChild(this.headingGroupNode);

      this.containerNode.addEventListener('focusin', this.handleFocusin.bind(this));
      this.containerNode.addEventListener('focusout', this.handleFocusout.bind(this));
      window.addEventListener('pointerdown', this.handleBackgroundPointerdown.bind(this), true);

      if (this.usesAltKey || this.usesOptionKey) {
        document.addEventListener(
          'keydown',
          this.handleDocumentKeydown.bind(this)
        );
      }

      attachNode.insertBefore(this.containerNode, attachNode.firstElementChild);

      return this.containerNode;

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
          ariaLabel = config.altButtonAriaLabel.replace('$key', config.altShortcut);
        }

        if (this.usesOptionKey) {
          buttonShortcut = buttonShortcut.replace(
            '$modifier',
            config.optionLabel
          );
          label = label + buttonShortcut;
          ariaLabel = config.optionButtonAriaLabel.replace('$key', config.altShortcut);
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
      groupNode.innerHTML = '';
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
    renderMenu() {
      // remove landmark menu items
      while (this.landmarkGroupNode.lastElementChild) {
        this.landmarkGroupNode.removeChild(this.landmarkGroupNode.lastElementChild);
      }
      // remove heading menu items
      while (this.headingGroupNode.lastElementChild) {
        this.headingGroupNode.removeChild(this.headingGroupNode.lastElementChild);
      }

      // Create landmarks group
      const [landmarkElements, headingElements] = getLandmarksAndHeadings(this.config, this.skiptoId);

      this.renderMenuitemsToGroup(this.landmarkGroupNode, landmarkElements, this.config.msgNoLandmarksFound);
      this.renderMenuitemsToGroup(this.headingGroupNode,  headingElements, this.config.msgNoHeadingsFound);

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
        this.removeHoverClass();
        menuitem.classList.add('hover');
        menuitem.focus();
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
     * @desc Opens the memu of landmark regions and headings
     */
    openPopup() {
      this.menuNode.setAttribute('aria-busy', 'true');
      const h = (80 * window.innerHeight) / 100;
      this.menuNode.style.maxHeight = h + 'px';
      this.renderMenu();
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
    }

    /*
     * @method closePopup
     *
     * @desc Closes the memu of landmark regions and headings
     */
    closePopup() {
      if (this.isOpen()) {
        this.buttonNode.setAttribute('aria-expanded', 'false');
        this.menuNode.style.display = 'none';
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
    removeHoverClass() {
      this.menuitemNodes.forEach( node => {
        node.classList.remove('hover');
      });
    }
    
    // Menu event handlers
    
    handleFocusin() {
      this.containerNode.classList.add('focus');
    }
    
    handleFocusout() {
      this.containerNode.classList.remove('focus');
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
      if (this.isOpen()) {
        this.closePopup();
        this.buttonNode.focus();
      } else {
        this.openPopup();
        this.setFocusToFirstMenuitem();
      }
      event.stopPropagation();
      event.preventDefault();
    }

    handleDocumentKeydown (event) {

      const enabledInputTypes = [
        'button',
        'checkbox',
        'color',
        'file',
        'image',
        'radio',
        'range',
        'reset',
        'submit'
      ];

      const target = event.target;
      const tagName = target.tagName ? target.tagName.toLowerCase() : '';
      const type = tagName === 'input' ? target.type.toLowerCase() : '';

      if ((tagName !== 'textarea') &&
          ((tagName !== 'input') ||
           ((tagName === 'input') && enabledInputTypes.includes(type))
          )) {

        const altPressed =
          this.usesAltKey &&
          event.altKey &&
          !event.ctrlKey &&
          !event.shiftKey &&
          !event.metaKey;

        const optionPressed =
          this.usesOptionKey &&
          event.altKey &&
          !event.ctrlKey &&
          !event.shiftKey &&
          !event.metaKey;

        if ((optionPressed && this.config.optionShortcut === event.key) ||
            (altPressed && this.config.altShortcut === event.key) ||
            ((optionPressed || altPressed) && (48 === event.keyCode))
        ) {
          this.openPopup();
          this.setFocusToFirstMenuitem();
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
          this.buttonNode.focus();
          this.closePopup();
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
      let tgt = event.currentTarget;
      this.removeHoverClass();
      tgt.classList.add('hover');
    }

    handleBackgroundPointerdown(event) {
      if (!this.containerNode.contains(event.target)) {
        if (this.isOpen()) {
          this.closePopup();
          this.buttonNode.focus();
        }
      }
    }
}
