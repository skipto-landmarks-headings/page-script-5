/* toggle.js */


(function () {
  console.log(`[toggle][onclick]`);

  let skipToContentElem = document.querySelector('skip-to-content');

  console.log(`[toggle]: ${skipToContentElem} ${skipToContentElem.checked}`);

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

