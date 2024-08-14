/* content.js */

const scriptNode = document.createElement('script');
scriptNode.type = 'text/javascript';
scriptNode.id = 'id-skip-to-extension';
scriptNode.setAttribute('data-skipto', 'displayOption: popup');
scriptNode.src = 'http://localhost/~jongunderson/page-script-5/docs/dist/skipto.js';
document.body.appendChild(scriptNode);

