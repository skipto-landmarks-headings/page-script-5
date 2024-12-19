/* toggle.js */

const SkipToExtensionElmName   = 'skip-to-content-extension';

(function () {

  const debug = false;

  debug && console.log(`[toggle.js][onclick]`);

  let skipToContentElem = document.querySelector(SkipToExtensionElmName);

  debug && console.log(`[toggle.js]: ${skipToContentElem} ${skipToContentElem.checked}`);

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

