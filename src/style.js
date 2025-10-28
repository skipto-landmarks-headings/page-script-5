/* style.js */

/* Imports */
import {colorThemes} from './colorThemes.js';
import DebugLogging  from './debug.js';

import {
  HIDDEN_ELEMENT_ID,
  HIGHLIGHT_ID,
  MESSAGE_ID
}  from './constants.js';

import {
  getHighlightInfo
}  from './utils.js';

/* Constants */
const debug = new DebugLogging('style', false);
debug.flag = false;



const cssStyleTemplate = document.createElement('template');
cssStyleTemplate.textContent = `
.container {
  color-scheme: light dark;

  --skipto-popup-offset: -36px;
  --skipto-show-border-offset: -28px;
  --skipto-menu-offset: 36px;

  --skipto-font-family: 'inherit';
  --skipto-font-size: 'inherit';
  --skipto-position-left: '46%';
  --skipto-small-break-point: '580px';
  --skipto-medium-break-point: '992px';

  --skipto-button-text-color: '#13294b';
  --skipto-button-text-dark-color: '#ffffff';

  --skipto-button-background-color: '#dddddd';
  --skipto-button-background-dark-color: '#013c93';

  --skipto-focus-border-color: '#c5050c';
  --skipto-focus-border-dark-color: '#ffffff';

  --skipto-menu-text-color: '#13294b';
  --skipto-menu-text-dark-color: '#ffffff';

  --skipto-menu-background-color: '#dddddd';
  --skipto-menu-background-dark-color: '#000000';

  --skipto-menuitem-focus-text-color: '#dddddd';
  --skipto-menuitem-focus-text-dark-color: '#ffffff';

  --skipto-menuitem-focus-background-color: '#13294b';
  --skipto-menuitem-focus-background-dark-color: '#013c93';

  --skipto-dialog-text-color: '#000000';
  --skipto-dialog-text-dark-color: '#ffffff';

  --skipto-dialog-background-color: '#ffffff';
  --skipto-dialog-background-dark-color: '#000000';

  --skipto-dialog-background-title-color: '#eeeeee';
  --skipto-dialog-background-title-dark-color: '#013c93';

  --skipto-z-index-1: '2000001';
  --skipto-z-index-2: '20000002';
  --skipto-z-index-highlight: '1999900';

  --skipto-highlight-offset: '6px';
  --skipto-highlight-border-width: '4px':
  --skipto-highlight-font-size: '14pt':
  --skipto-highlight-shadow-border-width: '10px';
  --skipto-highlight-border-style: 'dashed';

  --skipto-hidden-text-color: '#000000';
  --skipto-hidden-text-dark-color: '#0000000';
  --skipto-hidden-background-color: '#ffcc00';
  --skipto-hidden-background-dark-color: '#ffcc00';

}

.container {
  display: block;
  z-index: var(--skipto-z-index-1);
}

.menu-button.popup {
  transform: translateY(var(--skipto-popup-offset));
  transition: top 0.35s ease;
}

.menu-button.popup.show-border {
  transform: translateY(var(--skipto-show-border-offset));
/* top: var(--skipto-show-border-offset); */
  transition: top 0.35s ease;
}

.menu-button.popup.mobile button {
  display: none;
}

.menu-button button .skipto-text {
  padding: 6px 8px 6px 8px;
  display: inline-block;
}

.menu-button button .skipto-small {
  padding: 6px 8px 6px 8px;
  display: none;
}

.menu-button button .skipto-medium {
  padding: 6px 8px 6px 8px;
  display: none;
}

.menu-button {
  position: fixed;
  left: var(--skipto-position-left);
  z-index: var(--skipto-z-index-1) !important;
}

.menu-button button {
  margin: 0;
  padding: 0;
  border-width: 0px 1px 1px 1px;
  border-style: solid;
  border-radius: 0px 0px 6px 6px;
  border-color: light-dark(var(--skipto-button-background-color), var(--skipto-button-background-dark-color));
  color: light-dark(var(--skipto-button-text-color), var(--skipto-button-text-dark-color));
  background-color: light-dark(var(--skipto-button-background-color), var(--skipto-button-background-dark-color));
  font-size: var(--skipto-font-size);
  font-family: var(--skipto-font-family);
}

@media screen and (max-width: var(--skipto-small-break-point)) {
  .menu-button:not(.popup) button .skipto-small {
    transition: top 0.35s ease;
    display: inline-block;
  }

  .menu-button:not(.popup) button .skipto-text,
  .menu-button:not(.popup) button .skipto-medium {
    transition: top 0.35s ease;
    display: none;
  }

  .menu-button:not(.popup) button:focus .skipto-text {
    transition: top 0.35s ease;
    display: inline-block;
  }

  .menu-button:not(.popup) button:focus .skipto-small,
  .menu-button:not(.popup) button:focus .skipto-medium {
    transition: top 0.35s ease;
    display: none;
  }
}

@media screen and (min-width: var(--skipto-small-break-point)) and (max-width: var(--skipto-medium-break-point)) {
  .menu-button:not(.popup) button .skipto-medium {
    transition: top 0.35s ease;
    display: inline-block;
  }

  .menu-button:not(.popup) button .skipto-text,
  .menu-button:not(.popup) button .skipto-small {
    transition: top 0.35s ease;
    display: none;
  }

  .menu-button:not(.popup) button:focus .skipto-text {
    transition: top 0.35s ease;
    display: inline-block;
  }

  .menu-button:not(.popup) button:focus .skipto-small,
  .menu-button:not(.popup) button:focus .skipto-medium {
    transition: top 0.35s ease;
    display: none;
  }
}

.menu-button.static {
  position: absolute !important;
}

.menu-button [role="menu"] {
  min-width: 16em;
  display: none;
  margin: 0;
  padding: 0.25rem;
  background-color: light-dark(var(--skipto-menu-background-color), var(--skipto-menu-background-dark-color));
  border-width: 2px;
  border-style: solid;
  border-color: light-dark(var(--skipto-focus-border-color), var(--skipto-focus-border-dark-color));
  border-radius: 5px;
  z-index: var(--skipto-z-index-1) !important;
  touch-action: none;
  font-size: var(--skipto-font-size);
  font-family: var(--skipto-font-family);
}

.menu-button [role="group"] {
  display: grid;
  grid-auto-rows: min-content;
  grid-row-gap: 1px;
}

.menu-button [role="group"].overflow {
  overflow-x: hidden;
  overflow-y: scroll;
}

.menu-button [role="separator"]:first-child {
  border-radius: 5px 5px 0 0;
}

.menu-button [role="menuitem"] {
  padding: 3px;
  width: auto;
  border-width: 0px;
  border-style: solid;
  color: light-dark(var(--skipto-menu-text-color), var(--skipto-menu-text-dark-color));
  background-color: light-dark(var(--skipto-menu-background-color), var(--skipto-menu-background-dark-color));
  display: grid;
  overflow-y: clip;
  grid-template-columns: repeat(6, 1.2rem) 1fr;
  grid-column-gap: 2px;
  z-index: var(--skipto-z-index-1);
}

.menu-button [role="menuitem"].shortcuts,
.menu-button [role="menuitem"].about {
  z-index: var(--skipto-z-index-2);
}


.menu-button [role="menuitem"] .level,
.menu-button [role="menuitem"] .label {
  font-size: 100%;
  font-weight: normal;
  color: light-dark(var(--skipto-menu-text-color), var(--skipto-menu-text-dark-color));
  background-color: light-dark(var(--skipto-menu-background-color), var(--skipto-menu-background-dark-color));
  display: inline-block;
  line-height: inherit;
  display: inline-block;
  white-space: nowrap;
  border: none;
}

.menu-button [role="menuitem"] .level {
  text-align: right;
  padding-right: 4px;
}

.menu-button [role="menuitem"] .label {
  text-align: left;
  margin: 0;
  padding: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-button [role="menuitem"] .level:first-letter,
.menu-button [role="menuitem"] .label:first-letter {
  text-decoration: underline;
  text-transform: uppercase;
}


.menu-button [role="menuitem"].skip-to-h1 .level { grid-column: 1; }
.menu-button [role="menuitem"].skip-to-h2 .level { grid-column: 2; }
.menu-button [role="menuitem"].skip-to-h3 .level { grid-column: 3; }
.menu-button [role="menuitem"].skip-to-h4 .level { grid-column: 4; }
.menu-button [role="menuitem"].skip-to-h5 .level { grid-column: 5; }
.menu-button [role="menuitem"].skip-to-h6 .level { grid-column: 6;}

.menu-button [role="menuitem"].skip-to-h1 .label { grid-column: 2 / 8; }
.menu-button [role="menuitem"].skip-to-h2 .label { grid-column: 3 / 8; }
.menu-button [role="menuitem"].skip-to-h3 .label { grid-column: 4 / 8; }
.menu-button [role="menuitem"].skip-to-h4 .label { grid-column: 5 / 8; }
.menu-button [role="menuitem"].skip-to-h5 .label { grid-column: 6 / 8; }
.menu-button [role="menuitem"].skip-to-h6 .label { grid-column: 7 / 8;}

.menu-button [role="menuitem"].skip-to-h1.no-level .label { grid-column: 1 / 8; }
.menu-button [role="menuitem"].skip-to-h2.no-level .label { grid-column: 2 / 8; }
.menu-button [role="menuitem"].skip-to-h3.no-level .label { grid-column: 3 / 8; }
.menu-button [role="menuitem"].skip-to-h4.no-level .label { grid-column: 4 / 8; }
.menu-button [role="menuitem"].skip-to-h5.no-level .label { grid-column: 5 / 8; }
.menu-button [role="menuitem"].skip-to-h6.no-level .label { grid-column: 6 / 8; }

.menu-button [role="menuitem"].skip-to-nesting-level-1 .nesting { grid-column: 1; }
.menu-button [role="menuitem"].skip-to-nesting-level-2 .nesting { grid-column: 2; }
.menu-button [role="menuitem"].skip-to-nesting-level-3 .nesting { grid-column: 3; }

.menu-button [role="menuitem"].skip-to-nesting-level-0 .label { grid-column: 1 / 8; }
.menu-button [role="menuitem"].skip-to-nesting-level-1 .label { grid-column: 2 / 8; }
.menu-button [role="menuitem"].skip-to-nesting-level-2 .label { grid-column: 3 / 8; }
.menu-button [role="menuitem"].skip-to-nesting-level-3 .label { grid-column: 4 / 8; }

.menu-button [role="menuitem"].no-items .label,
.menu-button [role="menuitem"].action .label {
  grid-column: 1 / 8;
}

.menu-button [role="separator"] {
  margin: 1px 0px 1px 0px;
  padding: 3px;
  display: block;
  width: auto;
  font-weight: bold;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: light-dark(var(--skipto-menu-text-color), var(--skipto-menu-text-dark-color));
  background-color: light-dark(var(--skipto-menu-background-color), var(--skipto-menu-background-dark-color));
  color: light-dark(var(--skipto-menu-text-color), var(--skipto-menu-text-dark-color));
  z-index: var(--skipto-z-index-1) !important;
}

.menu-button [role="separator"] .mofn {
  font-weight: normal;
  font-size: 85%;
}

.menu-button [role="separator"]:first-child {
  border-radius: 5px 5px 0 0;
}

.menu-button [role="menuitem"].last {
  border-radius: 0 0 5px 5px;
}

/* focus styling */

.menu-button button:focus,
.menu-button button:hover {
  background-color: light-dark(var(--skipto-menu-background-color), var(--skipto-menu-background-dark-color));
  color: light-dark(var(--skipto-menu-text-color), var(--skipto-menu-text-dark-color));
  outline: none;
  border-width: 0px 2px 2px 2px;
  border-color: light-dark(var(--skipto-focus-border-color), var(--skipto-focus-border-dark-color));
}

.menu-button.popup.focus,
.menu-button.popup.menu,
.menu-button.popup:hover {
  transform: translateY(0);
  display: block;
  transition: left 1s ease;
  z-index: var(--skipto-z-index-1) !important;
}

.menu-button.popup.mobile.focus button {
  display: block;
}

.menu-button button:focus .skipto-text,
.menu-button button:hover .skipto-text,
.menu-button button:focus .skipto-small,
.menu-button button:hover .skipto-small,
.menu-button button:focus .skipto-medium,
.menu-button button:hover .skipto-medium {
  padding: 6px 7px 5px 7px;
}

.menu-button [role="menuitem"]:focus {
  padding: 1px;
  border-width: 2px;
  border-style: solid;
  border-color: light-dark(var(--skipto-focus-border-color), var(--skipto-focus-border-dark-color));
  outline: none;
}

.menu-button [role="menuitem"].hover,
.menu-button [role="menuitem"].hover .level,
.menu-button [role="menuitem"].hover .label {
  background-color: light-dark(var(--skipto-menuitem-focus-background-color), var(--skipto-menuitem-focus-background-dark-color));
  color: light-dark(var(--skipto-menuitem-focus-text-color), var(--skipto-menuitem-focus-text-dark-color));
}

.menu-button [role="separator"].shortcuts-disabled,
.menu-button [role="menuitem"].shortcuts-disabled {
  display: none;
}


@media (forced-colors: active) {

  .menu-button button {
    border-color: ButtonBorder;
    color: ButtonText;
    background-color: ButtonFace;
  }

  .menu-button [role="menu"] {
    background-color: ButtonFace;
    border-color: ButtonText;
  }

  .menu-button [role="menuitem"] {
    color: ButtonText;
    background-color: ButtonFace;
  }

  .menu-button [role="menuitem"] .level,
  .menu-button [role="menuitem"] .label {
    color: ButtonText;
    background-color: ButtonFace;
  }

  .menu-button [role="separator"] {
    border-bottom-color: ButtonBorder;
    background-color: ButtonFace;
    color: ButtonText;
    z-index: var(--skipto-z-index-1) !important;
  }

  .menu-button button:focus,
  .menu-button button:hover {
    background-color: ButtonFace;
    color: ButtonText;
    border-color: ButtonBorder;
  }

  .menu-button [role="menuitem"]:focus {
    background-color: ButtonText;
    color: ButtonFace;
    border-color: ButtonBorder;
  }

  .menu-button [role="menuitem"].hover,
  .menu-button [role="menuitem"].hover .level,
  .menu-button [role="menuitem"].hover .label {
    background-color: ButtonText;
    color: ButtonFace;
  }
}

/* Dialog Styling */

dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  font-family: var(--skipto-font-family);
  font-size: var(--skipto-font-size);
  max-width: 70%;
  margin: 0;
  padding: 0;
  background-color: light-dark(var(--skipto-dialog-background-color), var(--skipto-dialog-background-dark-color));
  color: light-dark(var(--skipto-dialog-text-color), var(--skipto-dialog-text-dark-color));
  border-width: 2px;
  border-style: solid;
  border-color: light-dark(var(--skipto-focus-border-color), --skipto-focus-border-dark-color));
  border-radius: 5px;
  z-index: 2000001;
}

dialog .header {
  margin: 0;
  margin-bottom: 0.5em;
  padding: 4px;
  border-width: 0;
  border-bottom-width: 1px;
  border-style: solid;
  border-color: light-dark(--skipto-focus-border-color), --skipto-focus-border-dark-color));
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  font-weight:  bold;
  background-color: light-dark(var(--skipto-dialog-background-title-color), var(--skipto-dialog-background-title-dark-color));
  color: light-dark(var(--skipto-dialog-text-color), var(--skipto-dialog-text-dark-color));
  position: relative;
  font-size: 100%;
}

dialog .header h2 {
  margin: 0;
  padding: 0;
  font-size: 1em;
}

dialog .header button {
  position: absolute;
  top: 4px;
  right: 2px;
  border: none;
  background: transparent;
  font-weight: bold;
  color: light-dark(var(--skipto-dialog-text-color), var(--skipto-dialog-text-dark-color));
  font-family: var(--skipto-font-family);
  font-size: var(--skipto-font-size);
}

dialog .content {
  margin-left: 2em;
  margin-right: 2em;
  margin-top: 0;
  margin-bottom: 2em;
}

dialog .content .desc {
  margin: 0.25em;
  text-align: center;
}

dialog .content .privacy-label {
  margin: 0;
  margin-top: 1em;
  text-align: center;
  font-weight: bold;
}

dialog .content .privacy {
  text-align: center;
  margin-bottom: 1em;
}

dialog .content .happy {
  text-align: center;
  font-family: 'Brush Script MT', cursive;
  font-size: 200%;
  letter-spacing: 0.05em;
}

dialog .content .version,
dialog .content .copyright {
  margin-top: 0.5em;
  text-align: center;
}

dialog .content table {
  width: auto;
  border-collapse: collapse;
}

dialog .content caption {
  margin: 0;
  padding: 0;
  margin-top: 1em;
  text-align: left;
  font-weight: bold;
  font-size: 110%;
}

dialog .content th {
  margin: 0;
  padding: 0;
  padding-top: 0.125em;
  padding-bottom: 0.125em;
  text-align: left;
  font-weight: bold;
  font-size: 100%;
}

dialog .content th {
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: light-dark(#999999, #777777);
}

dialog .content td.shortcut,
dialog .content td.desc {
  margin: 0;
  padding-left: 0.25em;
  padding-right: 0.25em;
  padding-top: 0.125em;
  padding-bottom: 0.125em;
  text-align: left;
  font-size: 100%;
}

dialog .content th.shortcut {
  text-align: left;
  width: 3em;
}

dialog .content th.desc {
  text-align: left;
  width: 12em;
}

dialog .content table tr:nth-child(even) {
  background-color: light-dark(#eeeeee, #111111);
}

dialog .buttons {
  float: right;
  margin-right: 0.5em;
  margin-bottom: 0.5em;
}

dialog .buttons button {
  margin: 6px;
  min-width: 5em;
  font-family: var(--skipto-font-family);
  font-size: var(--skipto-font-size);
}

dialog button:focus {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

dialog button:hover {
  cursor: pointer;
}

/* Navigation Messages */

#${MESSAGE_ID} {
  position: fixed;
  display: block;
  opacity: 1;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);

  font-family: $fontFamily;
  font-size: $fontSize;
  max-width: 70%;
  margin: 0;
  padding: 0;
  background-color: light-dark(var(--skipto-dialog-background-color), var(--skipto-dialog-background-dark-color));
  border: 2px solid light-dark(var(--skipto-focus-border-color), var(--skipto-focus-border-dark-color));
  border-radius: 5px;
  color: light-dark(var(--skipto-dialog-text-color), var(--skipto-dialog-text-dark-color));
  z-index: 2000001;
  opacity: 1;
}

#${MESSAGE_ID} .header {
  margin: 0;
  padding: 4px;
  border-bottom: 1px solid light-dark(var(--skipto-focus-border-color), var(--skipto-focus-border-dark-color));
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  font-weight:  bold;
  background-color: light-dark(var(--skipto-dialog-background-title-color), var(--skipto-dialog-background-title-dark-color));
  color light-dark(var(--skipto-dialog-text-color), var(--skipto-dialog-text-dark-color));
  font-size: 100%;
}

#${MESSAGE_ID} .content {
  margin-left: 2em;
  margin-right: 2em;
  margin-top: 2em;
  margin-bottom: 2em;
  background-color: light-dark(var(--skipto-dialog-background-color), var(--skipto-dialog-background-dark-color));
  color: light-dark(var(--skipto-dialog-text-color), var(--skipto-dialog-text-dark-color));
  font-size: 110%;
  text-algin: center;
}

#${MESSAGE_ID}.hidden {
  display: none;
}

#${MESSAGE_ID}.fade {
  opacity: 0;
  transition: visibility 0s 1s, opacity 1s linear;
}

@media (forced-colors: active) {

  #${MESSAGE_ID} {
    background-color: Canvas;
    color CanvasText;
    border-color: AccentColor;
  }

  #${MESSAGE_ID} .header {
    background-color: Canvas;
    color CanvasText;
  }

  #${MESSAGE_ID} .content {
    background-color: Canvas;
    color: CanvasText;
  }
}

#${HIGHLIGHT_ID} {
  margin: 0;
  padding: 0;
  position: absolute;
  border-radius: var(--skipto-highlight-offset);
  border-width: var(--skipto-highlight-shadow-border-width);
  border-style: solid;
  border-color: light-dark(var(--skipto-menu-background-color), var(--skipto-menu-background-dark-color));
  box-sizing: border-box;
  pointer-events:none;
  z-index: var(--skipto-z-index-highlight);
}

#${HIGHLIGHT_ID} .overlay-border {
  margin: 0;
  padding: 0;
  position: relative;
  border-radius: var(--skipto-highlight-offset);
  border-width: var(--skipto-highlight-border-width);
  border-style: var(--skipto-highlight-border-style);
  border-color: light-dark(var(--skipto-focus-border-color), var(--skipto-focus-border-dark-color));
  z-index: var(--skipto-z-index-1);
  box-sizing: border-box;
  pointer-events:none;
  background: transparent;
}


@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

#${HIDDEN_ELEMENT_ID} {
  position: absolute;
  margin: 0;
  padding: .25em;
  background-color: light-dark(var(--skipto-hidden-background-color), var(--skipto-hidden-background-dark-color));
  color: light-dark(var(--skipto-hidden-text-color), var(--skipto-hidden-text-dark-color));
  font-family: var(--skipto-font-family);
  font-size: var(--skipto-highlight-font-size);
  font-style: italic;
  font-weight: bold;
  text-align: center;
  animation: fadeIn 1.5s;
  z-index: var(--skipto-z-index-1);
}

#${HIGHLIGHT_ID} .overlay-info {
  margin: 0;
  padding: 2px;
  position: relative;
  text-align: left;
  font-size: $fontSize;
  font-family: $fontFamily;
  border: var(--skipto-highlight-border-width) solid light-dark($menuBackgroundColor, $menuBackgroundDarkColor);
  background-color: light-dark(var(--skipto-menu-background-color), var(--skipto-menu-background-dark-color));
  color: light-dark(var(--skipto-menu-text-color), var(--skipto-menu-text-dark-color));
  z-index: var(--skipto-z-index-1);
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events:none;
}

#${HIGHLIGHT_ID} .overlay-info.hasInfoTop {
  border-radius: var(--skipto-highlight-offset) var(--skipto-highlight-offset) 0 0;
}

#${HIGHLIGHT_ID} .overlay-info.hasInfoBottom {
  border-radius: 0 0 var(--skipto-highlight-offset) var(--skipto-highlight-offset);
}

@media (forced-colors: active) {

  #${HIGHLIGHT_ID} {
    border-color: ButtonBorder;
  }

  #${HIGHLIGHT_ID} .overlay-border {
    border-color: ButtonBorder;
  }

  #${HIGHLIGHT_ID} .overlay-border.skip-to-hidden {
    background-color: ButtonFace;
    color: ButtonText;
  }

  #${HIGHLIGHT_ID} .overlay-info {
    border-color: ButtonBorder;
    background-color: ButtonFace;
    color: ButtonText;
  }

}

`;

/*
 *   @function getTheme
 *
 *   @desc Returns
 *
 *   @param  {String}  colorTheme   -  A string identifying a color theme  
 *
 *   @returns {Object}  see @desc
 */
function getTheme(colorTheme) {
  if (typeof colorThemes[colorTheme] === 'object') {
    return colorThemes[colorTheme];
  }
  // if no theme defined, use urlSelectors
  let hostnameMatch = '';
  let pathnameMatch = '';
  let hostandpathnameMatch = '';

  const locationURL = new URL(location.href);
  const hostname = locationURL.hostname;
  const pathname = location.pathname;

  for (let item in colorThemes) {
    const hostnameSelector = colorThemes[item].hostnameSelector;
    const pathnameSelector = colorThemes[item].pathnameSelector;
    let hostnameFlag = false; 
    let pathnameFlag = false; 

    if (hostnameSelector) {
      if (hostname.indexOf(hostnameSelector) >= 0) {
        if (!hostnameMatch || 
            (colorThemes[hostnameMatch].hostnameSelector.length < hostnameSelector.length)) {
          hostnameMatch = item;
          hostnameFlag = true; 
          pathnameMatch = '';
        }
        else {
          // if the same hostname is used in another theme, set the hostnameFlas in case the pathname
          // matches
          if (colorThemes[hostnameMatch].hostnameSelector.length === hostnameSelector.length) {
            hostnameFlag = true;
          }
        }
      }
    }

    if (pathnameSelector) {
      if (pathname.indexOf(pathnameSelector) >= 0) {
        if (!pathnameMatch || 
            (colorThemes[pathnameMatch].pathnameSelector.length < pathnameSelector.length)) {
          pathnameMatch = item;
          pathnameFlag = true; 
        }
      }
    }

    if (hostnameFlag && pathnameFlag) {
      hostandpathnameMatch = item;
    }
  }

  if (hostandpathnameMatch) {
    return colorThemes[hostandpathnameMatch];      
  }
  else {
    if (hostnameMatch) {
      return colorThemes[hostnameMatch];      
    } else {
      if (pathnameMatch) {
        return colorThemes[pathnameMatch];      
      }
    }
  }

  // if no other theme is found use default theme
  return colorThemes['default'];
}

/*
 *   @function updateStyle
 *
 *   @desc  Updates the value of a css variable
 *
 *   @param  {string} cssVariable -
 *   @param  {string} configValue -
 *   @param  {string} themeValue  -
 */
function updateStyle(containerNode, cssVariable, configValue, themeValue, defaultValue) {
  let value = '';
  if (typeof configValue === 'string' && configValue) {
    value = configValue;
  } else {
    if (typeof themeValue === 'string' && themeValue) {
      value = themeValue;
    }
    else {
      value = defaultValue;
    }
  }

  if ((typeof value === 'string') && value.length) {
    containerNode.style.setProperty(cssVariable, value);
  }
}

/*
 * @function addCSSColors
 *
 * @desc Updates the styling for the menu and highlight information
 *       and returns the updated strings
 *
 * @param  {Object}  config        -  SkipTo.js configuration information object
 * @param  {Boolean} useURLTheme   -  When true use the theme associated with the URL
 *
 * @returns. see @desc
 */
function updateCSS (containerNode, config, useURLTheme=false) {
  const d = colorThemes['default'];
  const theme = useURLTheme ? getTheme(config.colorTheme) : {};

  // Check for display option in theme
  if ((typeof config.displayOption === 'string') &&
      (['popup-border', 'fixed', 'popup', 'static'].includes(config.displayOption.toLowerCase()) < 0)) {

    if ((typeof theme.displayOption === 'string') &&
        (['popup-border', 'fixed', 'popup', 'static'].includes(theme.displayOption.toLowerCase())>= 0)) {
      config.displayOption = theme.displayOption;
    }
    else {
      config.displayOption = 'popup';
    }
  }

  updateStyle(containerNode, '--skipto-font-family', config.fontFamily, theme.fontFamily, d.fontFamily);
  updateStyle(containerNode, '--skipto-font-size',   config.fontSize,   theme.fontSize,   d.fontSize);

  updateStyle(containerNode, '--skipto-position-left',      config.positionLeft,     theme.positionLeft,     d.positionLeft);
  updateStyle(containerNode, '--skipto-small-break-point',  config.smallBreakPoint,  theme.smallBreakPoint,  d.smallBreakPoint);
  updateStyle(containerNode, '--skipto-medium-break-point', config.mediumBreakPoint, theme.mediumBreakPoint, d.mediumBreakPoint);

  updateStyle(containerNode, '--skipto-menu-text-color',            config.menuTextColor,           theme.menuTextColor,           d.menuTextColor);
  updateStyle(containerNode, '--skipto-menu-text-dark-color',       config.menuTextDarkColor,       theme.menuTextDarkColor,       d.menuTextDarkColor);
  updateStyle(containerNode, '--skipto-menu-background-color',      config.menuBackgroundColor,     theme.menuBackgroundColor,     d.menuTextDarkColor);
  updateStyle(containerNode, '--skipto-menu-background-dark-color', config.menuBackgroundDarkColor, theme.menuBackgroundDarkColor, d.menuBackgroundDarkColor);

  updateStyle(containerNode, '--skipto-menuitem-focus-text-color',            config.menuitemFocusTextColor,           theme.menuitemFocusTextColor,           d.menuitemFocusTextColor);
  updateStyle(containerNode, '--skipto-menuitem-focus-text-dark-color',       config.menuitemFocusTextDarkColor,       theme.menuitemFocusTextDarkColor,       d.menuitemFocusTextDarkColor);
  updateStyle(containerNode, '--skipto-menuitem-focus-background-color',      config.menuitemFocusBackgroundColor,     theme.menuitemFocusBackgroundColor,     d.menuitemFocusBackgroundColor);
  updateStyle(containerNode, '--skipto-menuitem-focus-background-dark-color', config.menuitemFocusBackgroundDarkColor, theme.menuitemFocusBackgroundDarkColor, d.menuitemFocusBackgroundDarkColor);

  updateStyle(containerNode, '--skipto-focus-border-color',      config.focusBorderColor,     theme.focusBorderColor,     d.focusBorderColor);
  updateStyle(containerNode, '--skipto-focus-border-dark-color', config.focusBorderDarkColor, theme.focusBorderDarkColor, d.focusBorderDarkColor);

  updateStyle(containerNode, '--skipto-button-text-color',            config.buttonTextColor,           theme.buttonTextColor,           d.buttonTextColor);
  updateStyle(containerNode, '--skipto-button-text-dark-color',       config.buttonTextDarkColor,       theme.buttonTextDarkColor,       d.buttonTextDarkColor);
  updateStyle(containerNode, '--skipto-button-background-color',      config.buttonBackgroundColor,     theme.buttonBackgroundColor,     d.buttonBackgroundColor);
  updateStyle(containerNode, '--skipto-button-background-dark-color', config.buttonBackgroundDarkColor, theme.buttonBackgroundDarkColor, d.buttonBackgroundDarkColor);

  updateStyle(containerNode, '--skipto-dialog-text-color',                  config.dialogTextColor,                theme.dialogTextColorr,               d.dialogTextColor);
  updateStyle(containerNode, '--skipto-dialog-text-dark-color',             config.dialogTextDarkColor,            theme.dialogTextDarkColor,            d.dialogTextDarkColor);
  updateStyle(containerNode, '--skipto-dialog-background-color',            config.dialogBackgroundColor,          theme.dialogBackgroundColor,          d.dialogBackgroundColor);
  updateStyle(containerNode, '--skipto-dialog-background-dark-color',       config.dialogBackgroundDarkColor,      theme.dialogBackgroundDarkColor,      d.dialogBackgroundDarkColor);
  updateStyle(containerNode, '--skipto-dialog-background-title-color',      config.dialogBackgroundTitleColor,     theme.dialogBackgroundTitleColor,     d.dialogBackgroundTitleColor);
  updateStyle(containerNode, '--skipto-dialog-background-title-dark-color', config.dialogBackgroundTitleDarkColor, theme.dialogBackgroundTitleDarkColor, d.dialogBackgroundTitleDarkColor);

  let borderWidth, shadowWidth, offset, fontSize;

  [borderWidth, shadowWidth, offset, fontSize] = getHighlightInfo(config.highlightBorderSize);

  const shadowBorderWidth = borderWidth + 2 * shadowWidth;

  updateStyle(containerNode, '--skipto-highlight-offset',              `${offset}px`,               '', '');
  updateStyle(containerNode, '--skipto-highlight-border-width',        `${borderWidth}px`,          '', '');
  updateStyle(containerNode, '--skipto-highlight-font-size',           fontSize,                    '', '');
  updateStyle(containerNode, '--skipto-highlight-shadow-border-width', `${shadowBorderWidth}px`,    '', '');
  updateStyle(containerNode, '--skipto-highlight-border-style',        config.highlightBorderStyle, '', '');

  updateStyle(containerNode, '--skipto-hidden-text-color',            config.hiddenTextColor,           '', d.hiddenTextColor);
  updateStyle(containerNode, '--skipto-hidden-text-dark-color',       config.hiddenTextDarkColor,       '', d.hiddenTextDarkColor);
  updateStyle(containerNode, '--skipto-hidden-background-color',      config.hiddenBackgroundColor,     '', d.hiddenBackgroundColor);
  updateStyle(containerNode, '--skipto-hidden-background-dark-color', config.hiddenBackgroundDarkColor, '', d.hiddenBackgroundDarkColor);

  updateStyle(containerNode, '--skipto-z-index-1', config.zIndex, theme.zIndex, d.zIndex);


  const menuButtonNode = containerNode.querySelector('.menu-button');
  const buttonNode = containerNode.querySelector('button');
  const rect = buttonNode.getBoundingClientRect();
  if (menuButtonNode.classList.contains('show-border')) {
    const borderOffset = -1 * rect.height + 3 + 'px';
    containerNode.style.setProperty('--skipto-show-border-offset', borderOffset);
  }
  else {
    if (menuButtonNode.classList.contains('popup')) {
      const popupOffset = -1 * rect.height + 'px';
      containerNode.style.setProperty('--skipto-popup-offset', popupOffset);
    }
  }
  containerNode.style.setProperty('--skipto-menu-offset', rect.height + 'px');

  const zIndex2 = config.zIndex ?
                  (parseInt(config.zIndex) + 1).toString() :
                  '2000001';

  updateStyle(containerNode, '--skipto-z-index-2', zIndex2, '');

  const zIndexHighlight = config.zIndex ?
                  (parseInt(config.zIndex) - 1).toString() :
                  '199999';

  updateStyle(containerNode, '--skipto-z-index-highlight', zIndexHighlight, '');

  // Special case for theme configuration used in Illinois theme
  if (typeof theme.highlightTarget === 'string') {
    config.highlightTarget = theme.highlightTarget;
  }

}

/*
 *   @function renderStyleElement
 *
 *   @desc  Updates the style sheet template and then attaches it to the document
 *
 * @param  {Object}  attachNode      - DOM element node to attach button and menu container element
 * @param  {Object}  config          -  Configuration information object
 * @param  {Boolean} useURLTheme     - When true use the theme associated with the URL
 */
export default function renderStyleElement (attachNode, config, useURLTheme=false) {
  let styleNode = attachNode.querySelector(`style`);
  if (!styleNode) {
    styleNode = document.createElement('style');
    attachNode.appendChild(styleNode);
    styleNode.textContent = cssStyleTemplate.textContent;
  }

  const containerNode = attachNode.querySelector('.container');

  updateCSS(containerNode, config, useURLTheme);

}
