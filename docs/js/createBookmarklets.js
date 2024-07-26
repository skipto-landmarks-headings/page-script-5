/* createBookmarklet */

const domainURL = new URL(window.location.href);
const pathname = domainURL.pathname.toString();

const domainHREF = pathname.lastIndexOf('/') >= 0 ?
                   domainURL.protocol + '//' + domainURL.hostname + pathname.substring(0,pathname.lastIndexOf('/')) :
                   domainURL.protocol + '//' + domainURL.hostname;

console.log(`[domainHREF]: ${domainHREF}`);

function createSkiptoBookmarklet (a) {
  const params = a.getAttribute('data-params');

  if (params) {
    a.href = `javascript:(() => {if(!document.getElementById('id-skip-to')){const%20script=document.createElement('script');script.id='id-skip-to-bookmarklet';script.type='text/javascript';script.setAttribute('${params}');script.src='${domainHREF}/dist/skipto.min.js';document.head.appendChild(script);}})()`;
  }
  else {
    a.href = `javascript:(() => {if(!document.getElementById('id-skip-to')){const%20script=document.createElement('script');script.id='id-skip-to-bookmarklet';script.type='text/javascript';script.src='${domainHREF}/dist/skipto.min.js';document.head.appendChild(script);}})()`;
  }
}

window.addEventListener('load', function () {
  const skiptoBookmarklets = document.querySelectorAll('.skiptobookmarlet');

  skiptoBookmarklets.forEach( a => {
    createSkiptoBookmarklet(a);
  });
});
