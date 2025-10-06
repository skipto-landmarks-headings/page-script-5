/* toggle.js */

(function () {

  const debug = false;

  debug && console.log(`[toggle.js][onclick]`);

  let skipToContentElem = document.querySelector('skip-to-content-extension');

  debug && skipToContentElem &&console.log(`[toggle.js]: ${skipToContentElem} ${skipToContentElem.getAttribute('focus')}`);

  if (skipToContentElem) {
    const focus = skipToContentElem.getAttribute('focus');
    if (focus === 'menu') {
      skipToContentElem.setAttribute('setfocus', 'none');
    }
    else {
      skipToContentElem.setAttribute('setfocus', 'menu');
    }
  }

})();

