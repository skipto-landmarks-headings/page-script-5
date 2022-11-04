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

const menuButtonTemplate = document.createElement('template');
menuButtonTemplate.innerHTML = `
  <nav id="id-skip-to" arial0label-"Skip To Content">
    <button
      aria-label="Skip to content, shortcut alt plus zero"
      aria-haspopup="true"
      aria-expanded="false"
      aria-controls="id-skip-to-menu">
      <span class="text">Skip To Content (ALT+0)</span>
      <img src="data:image/png;base64,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" alt=""/>
    </button> 
    <div id="id-skip-to-menu" 
      role="menu"
      aria-label="Landmarks and Headings"
      aria-busy="false">
      
      <div id="id-skip-to-menu-landmark-group-label" 
        role="separator">
        Landmarks
      </div>
      
      <div id="id-skip-to-menu-landmark-group"
         role="group"
         aria-labelledby="id-skip-to-menu-landmark-group-label">
      </div>
      
      <div id="id-skip-to-menu-heading-group-label" 
        role="separator">
        Headings
      </div>
      
      <div id="id-skip-to-menu-heading-group"
         role="group"
         aria-labelledby="id-skip-to-menu-heading-label">
      </div>
    </div>
  </nav>
`;

/**
 * @class SkiptoMenuButton
 *
 * @desc Constructor for creating a button to open a menu of headings and landmarks on 
 *       a web page
 *
 * @param {node}  attachNode  - dom node element to attach button and menu
 */
export default class SkiptoMenuButton {

    constructor (attachNode, config) {
      this.config = config;
      const template = menuButtonTemplate.content.cloneNode(true);
      attachNode.appendChild(template);

      this.containerNode = attachNode.querySelector('nav');
      this.containerNode.setAttribute('aria-label', config.buttonLabel);

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

      this.buttonNode = this.containerNode.querySelector('button');
      this.buttonTextNode = this.buttonNode.querySelector('.text');
      this.buttonTextNode.textContent = buttonVisibleLabel;
      this.buttonNode.setAttribute('aria-label', buttonAriaLabel);
      this.buttonNode.addEventListener('keydown', this.handleButtonKeydown.bind(this));
      this.buttonNode.addEventListener('click', this.handleButtonClick.bind(this));


      // Create menu container

      this.menuNode   = this.containerNode.querySelector('[role=menu]');
      this.menuNode.setAttribute('aria-label', config.menuLabel);
      this.menuNode.setAttribute('aria-busy', 'true');

      this.menuNode.querySelector('#id-skip-to-menu-landmark-group-label').textContent = this.config.landmarkGroupLabel;
      this.menuNode.querySelector('#id-skip-to-menu-heading-group-label').textContent = this.config.headingGroupLabel;

      this.landmarkGroupNode = this.menuNode.querySelector('#id-skip-to-menu-landmark-group');
      this.headingGroupNode = this.menuNode.querySelector('#id-skip-to-menu-heading-group');

      this.containerNode.addEventListener('focusin', this.handleFocusin.bind(this));
      this.containerNode.addEventListener('focusout', this.handleFocusout.bind(this));
      window.addEventListener('pointerdown', this.handleBackgroundPointerdown.bind(this), true);

      if (this.usesAltKey || this.usesOptionKey) {
        document.addEventListener(
          'keydown',
          this.handleDocumentKeydown.bind(this)
        );
      }

      attachNode.appendChild(this.containerNode);

      return this.containerNode;

    }
      
    /*
     * @method getBrowserSpecificShortcut
     *
     * @desc Identifies the operating system and updates labels for 
     *       shortcut key to use either the "alt" or the "option"
     *       label  
     *
     * @param {Object}  -  SkipTp configure object
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
     * @desc 
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
     * @desc 
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
     * @desc  
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
     * @desc 
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
     * @desc 
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
      const [landmarkElements, headingElements] = getLandmarksAndHeadings(this.config);
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
     * @desc 
     *
     * @param {Object}  menuItem  - DOM node used as a menu item
     */
    setFocusToMenuitem(menuitem) {
      if (menuitem) {
        menuitem.focus();
      }
    }

    setFocusToFirstMenuitem() {
      this.setFocusToMenuitem(this.firstMenuitem);
    }

    setFocusToLastMenuitem() {
      this.setFocusToMenuitem(this.lastMenuitem);
    }

    /*
     * @method setFocusToPreviousMenuitem
     *
     * @desc 
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
     * @desc 
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
     * @desc 
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
     * @method openPopup
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
     * @desc 
     */
    openPopup() {
      this.menuNode.setAttribute('aria-busy', 'true');
      const h = (80 * window.innerHeight) / 100;
      this.menuNode.style.maxHeight = h + 'px';
      this.renderMenu();
      this.menuNode.style.display = 'block';
      this.menuNode.removeAttribute('aria-busy');
      this.buttonNode.setAttribute('aria-expanded', 'true');
    }

    /*
     * @method closePopup
     *
     * @desc 
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
     * @desc 
     */
    isOpen() {
      return this.buttonNode.getAttribute('aria-expanded') === 'true';
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
      let key = event.key,
        flag = false;

      let altPressed =
        this.usesAltKey &&
        event.altKey &&
        !event.ctrlKey &&
        !event.shiftKey &&
        !event.metaKey;

      let optionPressed =
        this.usesOptionKey &&
        event.altKey &&
        !event.ctrlKey &&
        !event.shiftKey &&
        !event.metaKey;

      if (
        (optionPressed && this.config.optionShortcut === key) ||
        (altPressed && this.config.altShortcut === key)
      ) {
        this.openPopup();
        this.setFocusToFirstMenuitem();
        flag = true;
      }
      if (flag) {
        event.stopPropagation();
        event.preventDefault();
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
      tgt.focus();
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
