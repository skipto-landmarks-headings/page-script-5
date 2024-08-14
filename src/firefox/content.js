/* content.js */

const SCRIPT_URL = 'http://localhost/~jongunderson/page-script-5/docs/dist/skipto.js';
// const SCRIPT_URL = 'https://skipto-landmarks-headings.github.io/page-script-5/dist/skipto.min.js';

const scriptNode = document.createElement('script');
scriptNode.type = 'text/javascript';
scriptNode.id = 'id-skip-to-extension';
scriptNode.setAttribute('data-skipto', 'displayOption: popup');
scriptNode.src = SCRIPT_URL;
document.body.appendChild(scriptNode);

