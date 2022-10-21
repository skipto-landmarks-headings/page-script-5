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
  skipToElement
};

/* Constants */
const debug = new DebugLogging('landmarksHeadings', false);
debug.flag = true;

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

/**
 * @function findVisibleElement
 *
 * @desc Returns the first DOM node that matches a set of element tag names
 * 
 * @param {node}   startingNode  - dom node to start search for element
 * @param {Array}  tagNames      - Array of tag names
 * 
 * @returns (node} Returns first element found ot elem if none found 
 */
function findVisibleElement (startingNode, tagNames) {

  function transverseDOMForVisibleElement(startingNode, targetTagName) {
    var targetNode = null;
    for (let node = startingNode.firstChild; node !== null; node = node.nextSibling ) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();
        if ((tagName === targetTagName) && isVisible(node)) {
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
                if ((assignedNode.tagName.toLowerCase() === targetTagName) && 
                    isVisible(assignedNode)) {
                  return assignedNode;
                }                    
              }
            }
          } else {
            // check for custom elements
            if (isCustomElement(tagName)) {
              if (node.shadowRoot) {
                targetNode = transverseDOMForVisibleElement(node.shadowRoot, targetTagName);
                if (targetNode) {
                  return targetNode;
                }
              }
            } else {
              targetNode = transverseDOMForVisibleElement(node, targetTagName);
              if (targetNode) {
                return targetNode;
              }
            }
          }
        }
      } // end if
    } // end for
    return startingNode;
  } // end function
  let targetNode = startingNode;

  // Go through the tag names one at a time
  for (let i = 0; i < tagNames.length; i += 1) {
    targetNode = transverseDOMForVisibleElement(startingNode, tagNames[i]);
    if (targetNode !== startingNode) {
      break;
    }
  }
  return targetNode;
}

function skipToElement(menuitem) {

  let focusNode = false;
  let scrollNode = false;
  let elem;

  const searchSelectors = ['input', 'button', 'a'];
  const navigationSelectors = ['a', 'input', 'button'];
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

function queryDOMForLandmarksAndHeadings (landmarkTargets, headingTargets) {
  let headingInfo = [];
  let landmarkInfo = [];
  let targetLandmarks = getLandmarkTargets(landmarkTargets.toLowerCase());
  let targetHeadings  = getHeadingTargets(headingTargets.toLowerCase());
  let onlyInMain = headingTargets.includes('main');

  function transverseDOM(startingNode, doc, inMain = false) {
    for (let node = startingNode.firstChild; node !== null; node = node.nextSibling ) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();
        if (targetLandmarks.indexOf(checkForLandmark(node)) >= 0) {
          landmarkInfo.push({ node: node, name: getAccessibleName(doc, node)});
            debug.flag && debug.log(`[transverseDOM]: ${tagName}[role=${node.getAttribute('role')}][aria-labelledby=${node.getAttribute('aria-labelledby')}]`, 1);
            debug.flag && debug.log(`[transverseDOM][accName]: ${getAccessibleName(doc, node)}]`);
        }
        if (targetHeadings.indexOf(tagName) >= 0) {
          if (!onlyInMain || inMain) {
            headingInfo.push({ node: node, name: getAccessibleName(doc, node)});
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
                if (targetLandmarks.indexOf(checkForLandmark(node)) >= 0) {
                  landmarkInfo.push({ node: node, name: getAccessibleName(doc, node)});
                }

                if (targetHeadings.indexOf(tagName) >= 0) {
                  if (!onlyInMain || inMain) {
                    headingInfo.push({ node: assignedNode, name: getAccessibleName(doc, assignedNode)});
                  }
                }
              }
            }
          } else {
            // check for custom elements
            if (isCustomElement(tagName)) {
              if (node.shadowRoot) {
                transverseDOM(node.shadowRoot, node.shadowRoot, inMain);
              }
            } else {
              transverseDOM(node, doc, inMain);
            }
          }
        }
      } // end if
    } // end for
  } // end function

  transverseDOM(document.body, document);

  // If no elements found when onlyInMain is set, try 
  // to find any headings
  if (headingInfo.length === 0 && onlyInMain) {
    onlyInMain = false;
    transverseDOM(document.body, document);
  }

  return [landmarkInfo, headingInfo];
}

/*
 * @function getLandmarksAndHeadings
 *
 * @desc 
 *
 * @param {Object} config - 
 *
 * @return {Array} 
 */

function getLandmarksAndHeadings (config) {

  let landmarkTargets = config.landmarks;
  if (typeof landmarkTargets !== 'string') {
    landmarkTargets = 'main search navigation';
  }

  let headingTargets = config.headings;
  // If targets undefined, use default settings
  if (typeof headingTargets !== 'string') {
    headingTargets = 'h1 h2';
  }

  const [landmarks, headings] = queryDOMForLandmarksAndHeadings(landmarkTargets, headingTargets);

  return [getLandmarks(config, landmarks), getHeadings(config, headings)];
}


function getHeadings (config, headings) {
  let dataId, level;
  let headingElementsArr = [];

  debug.flag && debug.log(`[getHeadings][headings]: ${headings.length}`);

  for (let i = 0, len = headings.length; i < len; i += 1) {
    let heading = headings[i];
    debug.flag && debug.log(`[getHeadings][${i}]: ${heading.node.tagName}: ${heading.name}`);
    let role = heading.node.getAttribute('role');
    if ((typeof role === 'string') && (role === 'presentation')) continue;
    if (isVisible(heading.node) && isNotEmptyString(heading.node.innerHTML)) {
      if (heading.node.hasAttribute('data-skip-to-id')) {
        dataId = heading.node.getAttribute('data-skip-to-id');
      } else {
        dataId = getSkipToIdIndex();
        heading.node.setAttribute('data-skip-to-id', dataId);
      }
      level = heading.node.tagName.substring(1);
      const headingItem = {};
      headingItem.dataId = dataId.toString();
      headingItem.class = 'heading';
      headingItem.name = heading.name;
      headingItem.ariaLabel = headingItem.name + ', ';
      headingItem.ariaLabel += config.headingLevelLabel + ' ' + level;
      headingItem.tagName = heading.node.tagName.toLowerCase();
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
 * @function getLandmarks
 *
 * @desc Traverses the DOM, including web compnents, for ARIA a set of landmarks
 *
 * @param {Object} config     - Object with configuration information
 * @param {Array}  landmarks  - Array of objects containing the DOM node and 
 *                              accessible name for landmarks
 *
 * @returns Array of dom nodes that are identified as landmarks
 */
function getLandmarks(config, landmarks) {
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
    if ((typeof role === 'string') && (role === 'presentation')) continue;
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
      // if using ID for selectQuery give tagName as main
      if (['aside', 'footer', 'form', 'header', 'main', 'nav', 'section', 'search'].indexOf(tagName) < 0) {
        tagName = 'main';
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

