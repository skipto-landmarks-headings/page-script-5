/* keyboardHelper.js */

export {
  elementTakesText,
  inContentEditable,
  onlyShiftPressed,
  noModifierPressed,
  onlyAltPressed,
  onlyOptionPressed
};

/*
 * @method isInteractiveElement
 *
 * @desc  Returns true if the element can use key presses, otherwise false
 *
 * @param  {object} elem - DOM node element
 *
 * @returns {Boolean}  see @desc
 */

function elementTakesText (elem) {

  const enabledInputTypes = [
    'button',
    'checkbox',
    'color',
    'image',
    'radio',
    'range',
    'reset',
    'submit'
  ];

  const tagName = elem.tagName ? elem.tagName.toLowerCase() : '';
  const type =  tagName === 'input' ?
                (elem.type.toLowerCase() ? elem.type.toLowerCase() : 'text') :
                '';

  return (tagName === 'textarea') ||
        ((tagName === 'input') &&
          enabledInputTypes.includes(type)) ||
        inContentEditable(elem);
}

/*
 * @function inContentEditable
 *
 * @desc Returns false if node is not in a content editable element,
 *       otherwise true if it does
 *
 * @param  {Object}  elem - DOM node
 *
 * @returns {Boolean} see @desc
 */
function inContentEditable (elem) {
  let n = elem;
  while (n.hasAttribute) {
    if (n.hasAttribute('contenteditable') &&
        (n.getAttribute('contenteditable').toLowerCase().trim() !== 'false')) {
      return true;
    }
    n = n.parentNode;
  }
  return false;
}

/*
 * @function noModifierPressed
 *
 * @desc Returns true if no modifier key is pressed, other false
 *
 * @param  {Object}  event - Event object
 *
 * @returns {Boolean} see @desc
 */

function noModifierPressed (event) {
  return !event.altKey &&
        !event.ctrlKey &&
        !event.shiftKey &&
        !event.metaKey;
}

/*
 * @function onlyShiftPressed
 *
 * @desc Returns true if only the shift modifier key is pressed, other false
 *
 * @param  {Object}  event - Event object
 *
 * @returns {Boolean} see @desc
 */

function onlyShiftPressed (event) {
  return !event.altKey &&
        !event.ctrlKey &&
        event.shiftKey &&
        !event.metaKey;
}

/*
 * @function onlyAltPressed
 *
 * @desc Returns true if only the alt modifier key is pressed, other false
 *
 * @param  {Object}  event - Event object
 *
 * @returns {Boolean} see @desc
 */

function onlyAltPressed (event) {
  return event.altKey &&
        !event.ctrlKey &&
        !event.shiftKey &&
        !event.metaKey;
}

/*
 * @function onlyOptionPressed
 *
 * @desc Returns true if only the option modifier key is pressed, other false
 *
 * @param  {Object}  event - Event object
 *
 * @returns {Boolean} see @desc
 */

function onlyOptionPressed (event) {
  return event.altKey &&
        !event.ctrlKey &&
        !event.shiftKey &&
        !event.metaKey;
}
