/* landmarksHeadings.js */

/* Imports */
import DebugLogging  from './debug.js';

import {
  isNotEmptyString,
  isVisible,
} from './utils.js';


import {
  getAccessibleName
} from './accName.js';


/*Exports */
export {
  getLandmarksAndHeadings,
  queryDOMForSkipToId,
  skipToElement,
  isSkipableElement,
  isSlotElement,
  isCustomElement,
  setItemFocus
};

/* Constants */
const debug = new DebugLogging('landmarksHeadings', false);
debug.flag = false;

const skipableElements = [
  'base',
  'content',
  'frame',
  'iframe',
  'input[type=hidden]',
  'link',
  'meta',
  'noscript',
  'script',
  'style',
  'template',
  'shadow',
  'title',
  'skip-to-content',
  'skip-to-content-bookmarklet',
  'skip-to-content-extension'
];

const allowedLandmarkSelectors = [
'banner',
'complementary',
'contentinfo',
'form',
'main',
'navigation',
'region',
'search'
];

const higherLevelElements = [
'article',
'aside',
'footer',
'header',
'main',
'nav',
'region',
'section'
];

const headingTags = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6'
];

let idIndex = 0;

/*
 *   @function getSkipToIdIndex
 *
 *   @desc  Returns the current skipto index used for generating
 *          id for target elements
 *
 *   @returns  {Number} see @desc
 */ 
function getSkipToIdIndex () {
  return idIndex;
}

/*
 *   @function incSkipToIdIndex
 *
 *   @desc  Adds one to the skipto index
 */ 
function incSkipToIdIndex () {
  idIndex += 1;
}

/*
 *   @function isSkipableElement
 *
 *   @desc Returns true if the element is skipable, otherwise false
 *
 *   @param  {Object}  element  - DOM element node
 *
 *   @returns {Boolean}  see @desc
 */ 
function isSkipableElement(element) {
    const tagName = element.tagName.toLowerCase();
    const type    = element.hasAttribute('type') ? element.getAttribute('type') : '';
    const elemSelector = (tagName === 'input') && type.length ? 
                            `${tagName}[type=${type}]` :
                            tagName;
    return skipableElements.includes(elemSelector);
}

/*
 *   @function isCustomElement
 *
 *   @desc  Reuturns true if the element is a custom element, otherwise
 *          false
 *
 *   @param  {Object}  element  - DOM element node
 *
 *   @returns {Boolean}  see @desc
 */ 
function isCustomElement(element) {
  return element.tagName.indexOf('-') >= 0;
}

/*
 *   @function sSlotElement
 *
 *   @desc  Reuturns true if the element is a slot element, otherwise
 *          false
 *
 *   @param  {Object}  element  - DOM element node
 *
 *   @returns {Boolean}  see @desc
 */ 
function isSlotElement(node) {
  return (node instanceof HTMLSlotElement);
}

/**
*   @function isTopLevel
*
*   @desc Tests the node to see if it is in the content of any other
*         elements with default landmark roles or is the descendant
*         of an element with a defined landmark role
*
*   @param  {Object}  node  - Element node from a berowser DOM
* 
*   @reutrn {Boolean} Returns true if top level landmark, otherwise false
*/

function isTopLevel (node) {
  node = node && node.parentNode;
  while (node && (node.nodeType === Node.ELEMENT_NODE)) {
    const tagName = node.tagName.toLowerCase();
    let role = node.getAttribute('role');
    if (role) {
      role = role.toLowerCase();
    }

    if (higherLevelElements.includes(tagName) ||
        allowedLandmarkSelectors.includes(role)) {
      return false;
    }
    node = node.parentNode;
  }
  return true;
}  

/*
 *   @function checkForLandmarkRole
 *
 *   @desc  Returns the type of landmark region,
 *          otherwise an empty string
 *
 *   @param  {Object}  element  - DOM element node
 *
 *   @returns {String}  see @desc
 */ 
function checkForLandmarkRole (element) {
  if (element.hasAttribute('role')) {
    const role = element.getAttribute('role').toLowerCase();
    if (allowedLandmarkSelectors.indexOf(role) >= 0) {
      return role;
    }
  } else {
    const tagName = element.tagName.toLowerCase();

    switch (tagName) {
      case 'aside':
        return 'complementary';

      case 'main':
        return 'main';

      case 'nav':
        return 'navigation';

      case 'header':
        if (isTopLevel(element)) {
          return 'banner';
        }
        break;

      case 'footer':
        if (isTopLevel(element)) {
          return 'contentinfo';
        }
        break;

      case 'section':
        // Sections need an accessible name for be considered a "region" landmark
        if (element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby')) {
          return 'region';
        }
        break;

      default:
        break;  
    }
  }
  return '';
}


/**
 * @function queryDOMForSkipToId
 *
 * @desc Returns DOM node associated with the id, if id not found returns null
 *
 * @param {String}  targetId  - dom node element to attach button and menu
 * 
 * @returns (Object) @desc
 */
function queryDOMForSkipToId (targetId) {
  function transverseDOMForSkipToId(startingNode) {
    var targetNode = null;
    for (let node = startingNode.firstChild; node !== null; node = node.nextSibling ) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.getAttribute('data-skip-to-id') === targetId) {
          return node;
        }
        if (!isSkipableElement(node)) {
          // check for slotted content
          if (isSlotElement(node)) {
              // if no slotted elements, check for default slotted content
            const assignedNodes = node.assignedNodes().length ?
                                  node.assignedNodes() :
                                  node.assignedNodes({ flatten: true });
            for (let i = 0; i < assignedNodes.length; i += 1) {
              const assignedNode = assignedNodes[i];
              if (assignedNode.nodeType === Node.ELEMENT_NODE) {
                if (assignedNode.getAttribute('data-skip-to-id') === targetId) {
                  return assignedNode;
                }
                targetNode = transverseDOMForSkipToId(assignedNode);                    
                if (targetNode) {
                  return targetNode;
                }
              }
            }
          } else {
            // check for custom elements
            if (isCustomElement(node)) {
              if (node.shadowRoot) {
                targetNode = transverseDOMForSkipToId(node.shadowRoot);
                if (targetNode) {
                  return targetNode;
                }
              }
              else {
                targetNode = transverseDOMForSkipToId(node);
                if (targetNode) {
                  return targetNode;
                }
              }
            } else {
              targetNode = transverseDOMForSkipToId(node);
              if (targetNode) {
                return targetNode;
              }
            }
          }
        }
      } // end if
    } // end for
    return false;
  } // end function
  return transverseDOMForSkipToId(document.body);
}

/**
 * @function findVisibleElement
 *
 * @desc Returns the first visible descendant DOM node that matches a set of element tag names
 * 
 * @param {node}   startingNode  - dom node to start search for element
 * @param {Array}  tagNames      - Array of tag names
 * 
 * @returns (node} Returns first descendant element, if not found returns false
 */
function findVisibleElement (startingNode, tagNames) {

  function transverseDOMForVisibleElement(startingNode, targetTagName) {
    var targetNode = null;
    for (let node = startingNode.firstChild; node !== null; node = node.nextSibling ) {
      if (node.nodeType === Node.ELEMENT_NODE) {

        if (!isSkipableElement(node)) {
          // check for slotted content
          if (isSlotElement(node)) {
              // if no slotted elements, check for default slotted content
            const assignedNodes = node.assignedNodes().length ?
                                  node.assignedNodes() :
                                  node.assignedNodes({ flatten: true });
            for (let i = 0; i < assignedNodes.length; i += 1) {
              const assignedNode = assignedNodes[i];
              if (assignedNode.nodeType === Node.ELEMENT_NODE) {
                const tagName = assignedNode.tagName.toLowerCase();
                if (tagName === targetTagName){
                  if (isVisible(assignedNode)) {
                    return assignedNode;
                  }
                }
                targetNode = transverseDOMForVisibleElement(assignedNode, targetTagName);  
                if (targetNode) {
                  return targetNode;
                }
              }
            }
          } else {
            // check for custom elements
            if (isCustomElement(node)) {
              if (node.shadowRoot) {
                targetNode = transverseDOMForVisibleElement(node.shadowRoot, targetTagName);
                if (targetNode) {
                  return targetNode;
                }
              }
              else {
                targetNode = transverseDOMForVisibleElement(node, targetTagName);
                if (targetNode) {
                  return targetNode;
                }
              }
            } else {
              const tagName = node.tagName.toLowerCase();
              if (tagName === targetTagName){
                if (isVisible(node)) {
                  return node;
                }
              }
              targetNode = transverseDOMForVisibleElement(node, targetTagName);
              if (targetNode) {
                return targetNode;
              }
            }
          }
        }
      } // end if
    } // end for
    return false;
  } // end function
  let targetNode = false;

  // Go through the tag names one at a time
  for (let i = 0; i < tagNames.length; i += 1) {
    targetNode = transverseDOMForVisibleElement(startingNode, tagNames[i]);
    if (targetNode) {
      break;
    }
  }
  return targetNode ? targetNode : startingNode;
}

/*
 *   @function skipToElement
 *
 *   @desc Moves focus to the element identified by the memu item
 *
 *   @param {Object}  menutim  -  DOM element in the menu identifying the target element.
 */ 
function skipToElement(menuitem) {

  let elem;

  const isLandmark = menuitem.classList.contains('landmark');
  const isSearch = menuitem.classList.contains('skip-to-search');
  const isNav = menuitem.classList.contains('skip-to-nav');

  elem = queryDOMForSkipToId(menuitem.getAttribute('data-id'));

  setItemFocus(elem, isLandmark, isSearch, isNav);

}

/*
 *   @function setItemFocus
 *
 *   @desc  Sets focus on the appropriate element
 *
 *   @param {Object}   elem        -  A target element
 *   @param {Boolean}  isLandmark  -  True if item is a landmark, otherwise false
 *   @param {Boolean}  isSearch    -  True if item is a search landmark, otherwise false
 *   @param {Boolean}  isNav       -  True if item is a navigation landmark, otherwise false
 */
function setItemFocus(elem, isLandmark, isSearch, isNav) {

  let focusNode = false;
  let scrollNode = false;

  const searchSelectors = ['input', 'button', 'a'];
  const navigationSelectors = ['a', 'input', 'button'];
  const landmarkSelectors = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'section', 'article', 'p', 'li', 'a'];

  if (elem) {
    if (isSearch) {
      focusNode = findVisibleElement(elem, searchSelectors);
    }
    if (isNav) {
      focusNode = findVisibleElement(elem, navigationSelectors);
    }
    if (focusNode && isVisible(focusNode)) {
      if (focusNode.tabIndex >= 0) {
        focusNode.focus();
      } else {
        focusNode.tabIndex = 0;
        focusNode.focus();
        focusNode.tabIndex = -1;
      }
      focusNode.scrollIntoView({block: 'center'});
    }
    else {
      if (isLandmark) {
        scrollNode = findVisibleElement(elem, landmarkSelectors);
        if (scrollNode) {
          elem = scrollNode;
        }
      }
      if (elem.tabIndex >= 0) {
        elem.focus();
      } else {
        elem.tabIndex = 0;
        elem.focus();
        elem.tabIndex = -1;
      }
      elem.scrollIntoView({block: 'center'});
    }
  }


}

/*
 *   @function getHeadingTargets
 *
 *   @desc  Returns an array of heading tag names to include in menu
 *          NOTE: It uses "includes" method to maximimze compatibility with
 *          previous versions of SkipTo which used CSS selectors for 
 *          identifying targets.
 *
 *   @param {String}  targets  -  A space with the heading tags to inclucde
 *
 *   @returns {Array}  Array of heading element tag names to include in menu
 */ 
function getHeadingTargets(targets) {
  let targetHeadings = [];
  ['h1','h2','h3','h4','h5','h6'].forEach( h => {
    if (targets.includes(h)) {
      targetHeadings.push(h);
    }
  });
  return targetHeadings;
}

/*
 *   @function isMain
 *
 *   @desc  Returns true if the element is a main landamrk
 *
 *   @param  {Object}  element  -  DOM element node
 *
 *   @returns {Boolean}  see @desc
 */ 
function isMain (element) {
  const tagName = element.tagName.toLowerCase();
  const role = element.hasAttribute('role') ? element.getAttribute('role').toLowerCase() : '';
  if ((role === 'presentation') || (role === 'none')) {
    return false;
  }
  return (tagName === 'main') || (role === 'main');
}

/*
 *   @function queryDOMForLandmarksAndHeadings
 *
 *   @desc  Recursive function to return two arrays, one an array of the DOM element nodes for 
 *          landmarks and the other an array of DOM element ndoes for headings  
 *
 *   @param  {Array}   landamrkTargets  -  An array of strings representing landmark regions
 *   @param  {Array}   headingTargets  -  An array of strings representing headings
 *   @param  {String}  skiptoId        -  An array of strings representing headings
 *
 *   @returns {Array}  @see @desc
 */ 
function queryDOMForLandmarksAndHeadings (landmarkTargets, headingTargets, skiptoId) {

  let headingInfo = [];
  let landmarkInfo = [];
  let targetLandmarks = getLandmarkTargets(landmarkTargets.toLowerCase());
  let targetHeadings  = getHeadingTargets(headingTargets.toLowerCase());
  let onlyInMain = headingTargets.includes('main') || headingTargets.includes('main-only');

  function transverseDOM(startingNode, doc, parentDoc=null, inMain = false) {

    function checkForLandmark(doc, node) {
      const landmark = checkForLandmarkRole(node);
      if (landmark && (node.id !== skiptoId)) {
        const accName = getAccessibleName(doc, node);
        node.setAttribute('data-skip-to-info', `landmark ${landmark}`);
        node.setAttribute('data-skip-to-acc-name', accName);

        if ((targetLandmarks.indexOf(landmark) >= 0) ) {
          landmarkInfo.push({
            node: node,
            name: accName
          });
        }
      }
    }

    function checkForHeading(doc, node, inMain) {
      const isHeadingRole = node.role ? node.role.toLowerCase() === 'heading' : false;
      const hasAriaLevel = parseInt(node.ariaLevel) > 0;
      const tagName = (isHeadingRole && hasAriaLevel) ?
                      `h${node.ariaLevel}` :
                      node.tagName.toLowerCase();
      const level = (isHeadingRole && hasAriaLevel) ?
                    node.ariaLevel :
                    headingTags.includes(tagName) ?
                    tagName.substring(1) :
                    '';
      if (headingTags.includes(tagName) ||
         (isHeadingRole && hasAriaLevel)) {
        const accName = getAccessibleName(doc, node, true);
        node.setAttribute('data-skip-to-info', `heading ${tagName}`);
        node.setAttribute('data-skip-to-acc-name', accName);
        if (targetHeadings.indexOf(tagName) >= 0) {
          if (!onlyInMain || inMain) {
            headingInfo.push({
              node: node,
              tagName: tagName,
              level: level,
              name: accName,
              inMain: inMain
            });
          }
        }
      }
    }

    for (let node = startingNode.firstChild; node !== null; node = node.nextSibling ) {
      if (node.nodeType === Node.ELEMENT_NODE) {

        debug.flag && debug.log(`[transverseDOM][node]: ${node.tagName} isSlot:${isSlotElement(node)} isCustom:${isCustomElement(node)}`);

        checkForLandmark(doc, node);
        checkForHeading(doc, node, inMain);
        inMain = isMain(node) || inMain;

        if (!isSkipableElement(node)) {
          // check for slotted content
          if (isSlotElement(node)) {
              // if no slotted elements, check for default slotted content
            const slotContent   = node.assignedNodes().length > 0;
            const assignedNodes = slotContent ?
                                  node.assignedNodes() :
                                  node.assignedNodes({ flatten: true });
            const nameDoc = slotContent ?
                            parentDoc :
                            doc;
            for (let i = 0; i < assignedNodes.length; i += 1) {
              const assignedNode = assignedNodes[i];
              if (assignedNode.nodeType === Node.ELEMENT_NODE) {
                checkForLandmark(nameDoc, assignedNode);
                checkForHeading(nameDoc, assignedNode, inMain);
                if (slotContent) {
                  transverseDOM(assignedNode, parentDoc, null, inMain);
                } else {
                  transverseDOM(assignedNode, doc, parentDoc, inMain);                  
                }
              }
            }
          } else {
            // check for custom elements
            if (isCustomElement(node)) {
              if (node.shadowRoot) {
                transverseDOM(node.shadowRoot, node.shadowRoot, doc, inMain);
              }
              else {
                transverseDOM(node, doc, parentDoc, inMain);
              }
            } else {
              transverseDOM(node, doc, parentDoc, inMain);
            }
          }
        }
      } // end if
    } // end for
  } // end function

  transverseDOM(document.body, document);

  // If no elements found when onlyInMain is set, try 
  // to find any headings
  if ((headingInfo.length === 0) && onlyInMain) {
    onlyInMain = false;
    landmarkInfo = [];
    transverseDOM(document.body, document);
    if (headingInfo.length === 0) {
       console.warn(`[skipTo.js]: no headings found on page`);
    }
    else {
      console.warn(`[skipTo.js]: no headings found in main landmark, but ${headingInfo.length} found in page.`);
    }
  }

  if (landmarkInfo.length === 0) {
     console.warn(`[skipTo.js]: no landmarks found on page`);
  }

  return [landmarkInfo, headingInfo];
}

/*
 * @function getLandmarksAndHeadings
 *
 * @desc Returns two arrays of of DOM node elements with, one for landmark regions 
 *       the other for headings with additional information needed to create
 *       menuitems
 *
 * @param {Object} config  - Object with configuration information
 *
 * @return see @desc
 */

function getLandmarksAndHeadings (config, skiptoId) {

  let landmarkTargets = config.landmarks;
  if (typeof landmarkTargets !== 'string') {
    console.warn(`[skipto.js]: Error in landmark configuration`);
    landmarkTargets = 'main search navigation';
  }

  let headingTargets = config.headings;
  // If targets undefined, use default settings
  if (typeof headingTargets !== 'string') {
    console.warn(`[skipto.js]: Error in heading configuration`);
    headingTargets = 'main-only h1 h2';
  }

  const [landmarks, headings] = queryDOMForLandmarksAndHeadings(landmarkTargets, headingTargets, skiptoId);

  return [getLandmarks(config, landmarks), getHeadings(config, headings)];
}

/*
 * @function getHeadings
 *
 * @desc Returns an array of heading menu elements
 *
 * @param {Object} config  - Object with configuration information
 * @param {Object} headings - Array of dome node elements that are headings
 *
 * @returns see @desc
 */
function getHeadings (config, headings) {
  let dataId;
  let headingElementsArr = [];

  for (let i = 0, len = headings.length; i < len; i += 1) {
    let heading = headings[i];

    let role = heading.node.getAttribute('role');
    if ((typeof role === 'string') &&
        ((role === 'presentation') || role === 'none')
       ) continue;
    if (isVisible(heading.node) && isNotEmptyString(heading.node.textContent)) {
      if (heading.node.hasAttribute('data-skip-to-id')) {
        dataId = heading.node.getAttribute('data-skip-to-id');
      } else {
        dataId = getSkipToIdIndex();
        heading.node.setAttribute('data-skip-to-id', dataId);
      }
      const headingItem = {};
      headingItem.dataId = dataId.toString();
      headingItem.class = 'heading';
      headingItem.name = heading.name;
      headingItem.ariaLabel = headingItem.name + ', ';
      headingItem.ariaLabel += config.headingLevelLabel + ' ' + heading.level;
      headingItem.tagName = heading.tagName;
      headingItem.role = 'heading';
      headingItem.level = heading.level;
      headingItem.inMain = heading.inMain;
      headingElementsArr.push(headingItem);
      incSkipToIdIndex();
    }
  }
  return headingElementsArr;
}

/*
 * @function getLocalizedLandmarkName
 *
 * @desc Localizes a landmark name and adds accessible name if defined
 *
 * @param {Object} config  - Object with configuration information
 * @param {String} tagName - String with landamrk and/or tag names
 * @param {String} AccName - Accessible name for therlandmark, maybe an empty string
 *
 * @returns {String}  A localized string for a landmark name
 */
function getLocalizedLandmarkName (config, tagName, accName) {
  let n;
  switch (tagName) {
    case 'aside':
      n = config.asideLabel;
      break;
    case 'footer':
      n = config.footerLabel;
      break;
    case 'form':
      n = config.formLabel;
      break;
    case 'header':
      n = config.headerLabel;
      break;
    case 'main':
      n = config.mainLabel;
      break;
    case 'nav':
      n = config.navLabel;
      break;
    case 'section':
    case 'region':
      n = config.regionLabel;
      break;
    case 'search':
      n = config.searchLabel;
      break;
      // When an ID is used as a selector, assume for main content
    default:
      n = tagName;
      break;
  }
  if (isNotEmptyString(accName)) {
    n += ': ' + accName;
  }
  return n;
}

/*
 * @function getLandmarkTargets
 *
 * @desc Analyzes a configuration string for landmark and tag names
 *       NOTE: This function is included to maximize compatibility
 *             with configuration strings that use CSS selectors
 *             in previous versions of SkipTo
 *
 * @param {String} targets - String with landmark and/or tag names
 *
 * @returns {Array}  A normalized array of landmark names based on target configuration
 */
function getLandmarkTargets (targets) {
  let targetLandmarks = [];
  targets = targets.toLowerCase();
  if (targets.includes('main')) {
    targetLandmarks.push('main');
  }
  if (targets.includes('search')) {
    targetLandmarks.push('search');
  }
  if (targets.includes('nav') ||
      targets.includes('navigation')) {
    targetLandmarks.push('navigation');
  }
  if (targets.includes('complementary') || 
      targets.includes('aside')) {
    targetLandmarks.push('complementary');
  }
  if (targets.includes('banner') || 
      targets.includes('header')) {
    targetLandmarks.push('banner');
  }
  if (targets.includes('contentinfo') || 
      targets.includes('footer')) {
    targetLandmarks.push('contentinfo');
  }
  if (targets.includes('region') || 
      targets.includes('section')) {
    targetLandmarks.push('region');
  }
  return targetLandmarks;
}


/*
 * @function getLandmarks
 *
 * @desc Returns an array of objects with information to build the 
 *       the landmarks menu, ordering in the array by the type of landmark
 *       region 
 *
 * @param {Object} config     - Object with configuration information
 * @param {Array}  landmarks  - Array of objects containing the DOM node and 
 *                              accessible name for landmarks
 *
 * @returns {Array}  see @desc
 */
function getLandmarks(config, landmarks) {
  let allElements = [];
  let mainElements = [];
  let searchElements = [];
  let navElements = [];
  let asideElements = [];
  let footerElements = [];
  let regionElements = [];
  let otherElements = [];
  let dataId = '';
  for (let i = 0, len = landmarks.length; i < len; i += 1) {
    let landmark = landmarks[i];
    if (landmark.node.id === 'id-skip-to') {
       continue;
    }
    let role = landmark.node.getAttribute('role');
    let tagName = landmark.node.tagName.toLowerCase();
    if ((typeof role === 'string') &&
        ((role === 'presentation') || (role === 'none'))
       ) continue;
    if (isVisible(landmark.node)) {
      if (!role) role = tagName;
      // normalize tagNames
      switch (role) {
        case 'banner':
          tagName = 'header';
          break;
        case 'complementary':
          tagName = 'aside';
          break;
        case 'contentinfo':
          tagName = 'footer';
          break;
        case 'form':
          tagName = 'form';
          break;
        case 'main':
          tagName = 'main';
          break;
        case 'navigation':
          tagName = 'nav';
          break;
        case 'region':
          tagName = 'section';
          break;
        case 'search':
          tagName = 'search';
          break;
        default:
          break;
      }
      if (landmark.node.hasAttribute('aria-roledescription')) {
        tagName = landmark.node.getAttribute('aria-roledescription').trim().replace(' ', '-');
      }
      if (landmark.node.hasAttribute('data-skip-to-id')) {
        dataId = landmark.node.getAttribute('data-skip-to-id');
      } else {
        dataId =  getSkipToIdIndex();
        landmark.node.setAttribute('data-skip-to-id', dataId);
      }
      const landmarkItem = {};
      landmarkItem.dataId = dataId.toString();
      landmarkItem.class = 'landmark';
      landmarkItem.hasName = landmark.name.length > 0;
      landmarkItem.name = getLocalizedLandmarkName(config, tagName, landmark.name);
      landmarkItem.tagName = tagName;
      landmarkItem.nestingLevel = 0;
      incSkipToIdIndex();

      allElements.push(landmarkItem);

      // For sorting landmarks into groups
      switch (tagName) {
        case 'main':
          mainElements.push(landmarkItem);
          break;
        case 'search':
          searchElements.push(landmarkItem);
          break;
        case 'nav':
          navElements.push(landmarkItem);
          break;
        case 'aside':
          asideElements.push(landmarkItem);
          break;
        case 'footer':
          footerElements.push(landmarkItem);
          break;
        case 'section':
          // Regions must have accessible name to be included
          if (landmarkItem.hasName) {
            regionElements.push(landmarkItem);
          }
          break;
        default:
          otherElements.push(landmarkItem);
          break;
      }
    }
  }
  if (config.landmarks.includes('doc-order')) {
    return allElements;
  }
  return [].concat(mainElements, searchElements, navElements, asideElements, regionElements, footerElements, otherElements);
}

