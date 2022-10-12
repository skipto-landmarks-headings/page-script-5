/* landmarksHeadings.js */

/* Imports */
import DebugLogging  from './debug.js';

import {
  getTextContent,
  isNotEmptyString,
  isVisible,
  getAccessibleName
} from './utils.js';


/*Exports */
export {
  getHeadings,
  getLandmarks,
  queryDOMForSkipToId,
  skipToElement
};

/* Constants */
const debug = new DebugLogging('landmarksHeadings', false);

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
  'title'
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


let idIndex = 0;

function getSkipToIdIndex () {
  return idIndex;
}

function incSkipToIdIndex () {
  idIndex += 1;
}

// Tests if a tag name can be skipped
function isSkipableElement(tagName, type) {
    const elemSelector = ((tagName === 'input') && (typeof type === 'string')) ? 
                            `${tagName}[type=${type}]` :
                            tagName;
    return skipableElements.includes(elemSelector);
}

// Tests if a tag name is a custom element
function isCustomElement(tagName) {
  return tagName.indexOf('-') >= 0;
}

// Tests if a node is a slot element
function isSlotElement(node) {
  return (node instanceof HTMLSlotElement);
}

/**
* @function isTopLevel
*
* @desc Tests the node to see if it is in the content of any other
*       elements with default landmark roles or is the descendant
*       of an element with a defined landmark role
*
* @param  {Object}  node        - Element node from a berowser DOM
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

// checks if an element node is a landmark
function checkForLandmark (node) {
  if (node.hasAttribute('role')) {
    const role = node.getAttribute('role').toLowerCase();
    if (allowedLandmarkSelectors.indexOf(role) >= 0) {
      return role;
    }
  } else {
    const tagName = node.tagName.toLowerCase();

    switch (tagName) {
      case 'aside':
        return 'complementary';

      case 'main':
        return 'main';

      case 'nav':
        return 'navigation';

      case 'header':
        if (isTopLevel(node)) {
          return 'banner';
        }
        break;

      case 'footer':
        if (isTopLevel(node)) {
          return 'contentinfo';
        }
        break;

      case 'section':
        // Sections need an accessible name for be considered a "region" landmark
        if (node.hasAttribute('aria-label') || node.hasAttribute('aria-labelledby')) {
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
 * @desc Returns DOM node associated with the id, if not found returns null
 *
 * @param {String}  targetId  - dom node element to attach button and menu
 * 
 * @returns (Object) @desc
 */
function queryDOMForSkipToId (targetId) {
  debug.log(`[queryDOMForSkipToId]`);
  function transverseDOMForSkipToId(startingNode) {
    var targetNode = null;
    for (let node = startingNode.firstChild; node !== null; node = node.nextSibling ) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();
        if (node.getAttribute('data-skip-to-id') === targetId) {
          return node;
        }
        if (!isSkipableElement(tagName, node.getAttribute('type'))) {
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
              }
            }
          } else {
            // check for custom elements
            if (isCustomElement(tagName)) {
              if (node.shadowRoot) {
                targetNode = transverseDOMForSkipToId(node.shadowRoot);
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

function skipToElement(menuitem) {

  let focusNode = false;
  let scrollNode = false;
  let elem;

  function findVisibleElement(e, selectors) {
    if (e) {
      for (let j = 0; j < selectors.length; j += 1) {
        const elems = e.querySelectorAll(selectors[j]);
        for(let i = 0; i < elems.length; i +=1) {
          if (isVisible(elems[i])) {
            return elems[i];
          }
        }
      }
    }
    return e;
  }

  const searchSelectors = ['input', 'button', 'input[type=button]', 'input[type=submit]', 'a'];
  const navigationSelectors = ['a', 'input', 'button', 'input[type=button]', 'input[type=submit]'];
  const landmarkSelectors = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'section', 'article', 'p', 'li', 'a'];

  const isLandmark = menuitem.classList.contains('landmark');
  const isSearch = menuitem.classList.contains('skip-to-search');
  const isNav = menuitem.classList.contains('skip-to-nav');

  elem = queryDOMForSkipToId(menuitem.getAttribute('data-id'));

  if (elem) {
    if (isSearch) {
      focusNode = findVisibleElement(elem, searchSelectors);
    }
    if (isNav) {
      focusNode = findVisibleElement(elem, navigationSelectors);
    }
    if (focusNode && isVisible(focusNode)) {
      focusNode.focus();
      focusNode.scrollIntoView({block: 'nearest'});
    }
    else {
      if (isLandmark) {
        scrollNode = findVisibleElement(elem, landmarkSelectors);
        if (scrollNode) {
          elem = scrollNode;
        }
      }
      elem.tabIndex = -1;
      elem.focus();
      elem.scrollIntoView({block: 'center'});
    }
  }
}

function getHeadingTargets(targets) {
  let targetHeadings = [];
  ['h1','h2','h3','h4','h5','h6'].forEach( h => {
    if (targets.includes(h)) {
      targetHeadings.push(h);
    }
  });
  return targetHeadings;
}

function queryDOMForHeadings (targets) {
  targets = targets.toLowerCase();
  let headingNodes = [];
  let targetHeadings = getHeadingTargets(targets);
  let onlyInMain = targets.includes('main');

  function transverseDOMForHeadings(startingNode, inMain = false) {
    for (let node = startingNode.firstChild; node !== null; node = node.nextSibling ) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();
        if (targetHeadings.indexOf(tagName) >= 0) {
          if (!onlyInMain || inMain) {
            headingNodes.push(node);
          }
        }
        if ((tagName === 'main') || 
            (node.hasAttribute('role') && node.getAttribute('role').toLowerCase === 'role')) {
          inMain = true;
        }
        if (!isSkipableElement(tagName, node.getAttribute('type'))) {
          // check for slotted content
          if (isSlotElement(node)) {
              // if no slotted elements, check for default slotted content
            const assignedNodes = node.assignedNodes().length ?
                                  node.assignedNodes() :
                                  node.assignedNodes({ flatten: true });
            for (let i = 0; i < assignedNodes.length; i += 1) {
              const assignedNode = assignedNodes[i];
              if (assignedNode.nodeType === Node.ELEMENT_NODE) {
                const tagName = assignedNodes[i].tagName.toLowerCase();
                if (targetHeadings.indexOf(tagName) >= 0) {
                  if (!onlyInMain || inMain) {
                    headingNodes.push(assignedNode);
                  }
                }
              }
            }
          } else {
            // check for custom elements
            if (isCustomElement(tagName)) {
              if (node.shadowRoot) {
                transverseDOMForHeadings(node.shadowRoot, inMain);
              }
            } else {
              transverseDOMForHeadings(node, inMain);
            }
          }
        }
      } // end if
    } // end for
  } // end function

  transverseDOMForHeadings(document.body);

  // If no elements found when onlyInMain is set, try 
  // to find any headings
  if (headingNodes.length === 0 && onlyInMain) {
    onlyInMain = false;
    transverseDOMForHeadings(document.body);
  }

  return headingNodes;
}

function getHeadings (config, targets) {
  let dataId, level;
  // If targets undefined, use default settings
  if (typeof targets !== 'string') {
    targets = config.headings;
  }
  let headingElementsArr = [];
  if (typeof targets !== 'string' || targets.length === 0) return;
  const headings = queryDOMForHeadings(targets);
  debug.log(`[getHeadings][headings]: ${headings.length}`);
  for (let i = 0, len = headings.length; i < len; i += 1) {
    let heading = headings[i];
    debug.log(`[getHeadings][${i}]: ${heading.tagName}: ${heading.textContent}`);
    let role = heading.getAttribute('role');
    if ((typeof role === 'string') && (role === 'presentation')) continue;
    if (isVisible(heading) && isNotEmptyString(heading.innerHTML)) {
      if (heading.hasAttribute('data-skip-to-id')) {
        dataId = heading.getAttribute('data-skip-to-id');
      } else {
        heading.setAttribute('data-skip-to-id', getSkipToIdIndex());
        dataId = getSkipToIdIndex();
      }
      level = heading.tagName.substring(1);
      const headingItem = {};
      headingItem.dataId = dataId.toString();
      headingItem.class = 'heading';
      headingItem.name = getTextContent(heading);
      headingItem.ariaLabel = headingItem.name + ', ';
      headingItem.ariaLabel += config.headingLevelLabel + ' ' + level;
      headingItem.tagName = heading.tagName.toLowerCase();
      headingItem.role = 'heading';
      headingItem.level = level;
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
 * @returns A localized string for a landmark name
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
 * @desc Analyzes a configuration string for landamrk and tag names
 *
 * @param {String} targets - String with landamrk and/or tag names
 *
 * @returns A normailized array of landmark names based on target configuration 
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
  if (targets.includes('nav')) {
    targetLandmarks.push('navigation');
  }
  if (targets.includes('complementary') || 
      targets.includes('aside')) {
    targetLandmarks.push('complemntary');
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
 * @function queryDOMForLandmarks
 *
 * @desc Traverses the DOM, including web compnents, for ARIA a set of landmarks
 *
 * @param {String} targets - String with landamrk and/or tag names
 *
 * @returns Array of dom nodes that are identified as landmarks
 */
function queryDOMForLandmarks (targets) {
  let landmarkNodes = [];
  let targetLandmarks = getLandmarkTargets(targets);

  function transverseDOMForLandmarks(startingNode) {
    for (let node = startingNode.firstChild; node !== null; node = node.nextSibling ) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();
        if (targetLandmarks.indexOf(checkForLandmark(node)) >= 0) {
          landmarkNodes.push(node);
        }

        if (!isSkipableElement(tagName, node.getAttribute('type'))) {
          // check for slotted content
          if (isSlotElement(node)) {
              // if no slotted elements, check for default slotted content
            const assignedNodes = node.assignedNodes().length ?
                                  node.assignedNodes() :
                                  node.assignedNodes({ flatten: true });
            for (let i = 0; i < assignedNodes.length; i += 1) {
              const assignedNode = assignedNodes[i];
              if (assignedNode.nodeType === Node.ELEMENT_NODE) {
                if (targetLandmarks.indexOf(checkForLandmark(node)) >= 0) {
                  landmarkNodes.push(assignedNode);
                }
              }
            }
          } else {
            // check for custom elements
            if (isCustomElement(tagName)) {
              if (node.shadowRoot) {
                transverseDOMForLandmarks(node.shadowRoot);
              }
            } else {
              transverseDOMForLandmarks(node);
            }
          }
        }
      } // end if
    } // end for
  } // end function

  transverseDOMForLandmarks(document.body);

  return landmarkNodes;
}

/*
 * @function getLandmarks
 *
 * @desc Traverses the DOM, including web compnents, for ARIA a set of landmarks
 *
 * @param {Object} config  - Object with configuration information
 * @param {String} targets - String with landamrk and/or tag names
 *
 * @returns Array of dom nodes that are identified as landmarks
 */
function getLandmarks(config, targets) {
  if (typeof targets !== 'string') {
    targets = config.landmarks;
  }
  let landmarks = queryDOMForLandmarks(targets);
  let mainElements = [];
  let searchElements = [];
  let navElements = [];
  let asideElements = [];
  let footerElements = [];
  let regionElements = [];
  let otherElements = [];
  let allLandmarks = [];
  let dataId = '';
  for (let i = 0, len = landmarks.length; i < len; i += 1) {
    let landmark = landmarks[i];
    // To do JRG
    // if skipto is a landmark don't include it in the list
//    if (landmark === this.domNode) {
//      continue;
//    }
    let role = landmark.getAttribute('role');
    let tagName = landmark.tagName.toLowerCase();
    if ((typeof role === 'string') && (role === 'presentation')) continue;
    if (isVisible(landmark)) {
      if (!role) role = tagName;
      let name = getAccessibleName(landmark);
      if (typeof name !== 'string') {
        name = '';
      }
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
      // if using ID for selectQuery give tagName as main
      if (['aside', 'footer', 'form', 'header', 'main', 'nav', 'section', 'search'].indexOf(tagName) < 0) {
        tagName = 'main';
      }
      if (landmark.hasAttribute('aria-roledescription')) {
        tagName = landmark.getAttribute('aria-roledescription').trim().replace(' ', '-');
      }
      if (landmark.hasAttribute('data-skip-to-id')) {
        dataId = landmark.getAttribute('data-skip-to-id');
      } else {
        landmark.setAttribute('data-skip-to-id', getSkipToIdIndex());
        dataId =  getSkipToIdIndex();
      }
      const landmarkItem = {};
      landmarkItem.dataId = dataId.toString();
      landmarkItem.class = 'landmark';
      landmarkItem.hasName = name.length > 0;
      landmarkItem.name = getLocalizedLandmarkName(config, tagName, name);
      landmarkItem.tagName = tagName;
      landmarkItem.nestingLevel = 0;
      incSkipToIdIndex();
      allLandmarks.push(landmarkItem);

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
  return [].concat(mainElements, searchElements, navElements, asideElements, regionElements, footerElements, otherElements);
}

