/* shortcutInfoDialog.js */

/* Imports */
import DebugLogging  from './debug.js';

/* Constants */
const debug = new DebugLogging('[shortcutsInfoDialog]', false);
debug.flag = false;

const defaultStyleOptions = {
  fontFamily: 'sans-serif',
  fontSize: '12pt',
  focusBorderColor: '#c5050c',
  focusBorderDarkColor: '#ffffff',

  // Dialog styling defaults
  dialogTextColor: '#000000',
  dialogTextDarkColor: '#ffffff',
  dialogBackgroundColor: '#ffffff',
  dialogBackgroundDarkColor: '#000000',
  dialogBackgroundTitleColor: '#eeeeee',
  dialogBackgroundTitleDarkColor: '#806000',

};


const MORE_PAGE_INFO_URL='https://skipto-landmarks-headings.github.io/page-script-5/page.html';
const MORE_SHORTCUT_INFO_URL='https://skipto-landmarks-headings.github.io/page-script-5/shortcuts.html';

const styleTemplate = document.createElement('template');
styleTemplate.textContent = `
/* infoDialog.css */

dialog#skip-to-info-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  font-family: $fontFamily;
  font-size: $fontSize;
  max-width: 70%;
  margin: 0;
  padding: 0;
  background-color: light-dark($dialogBackgroundColor, $dialogBackgroundDarkColor);
  color: light-dark($dialogTextColor, $dialogTextDarkColor);
  border-width: 2px;
  border-style: solid;
  border-color: light-dark($focusBorderColor, $focusBorderDarkColor);
  border-radius: 5px;
  z-index: 2000001;

}

dialog#skip-to-info-dialog .header {
  margin: 0;
  margin-bottom: 0.5em;
  padding: 4px;
  border-width: 0;
  border-bottom-width: 1px;
  border-style: solid;
  border-color: light-dark($focusBorderColor, $focusBorderDarkColor);
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  font-weight:  bold;
  background-color: light-dark($dialogBackgroundTitleColor, $dialogBackgroundTitleDarkColor);
  color: light-dark($dialogTextColor, $dialogTextDarkColor);
  position: relative;
  font-size: 100%;
}

dialog#skip-to-info-dialog .header h2 {
  margin: 0;
  padding: 0;
  font-size: 1em;
}

dialog#skip-to-info-dialog .header button {
  position: absolute;
  top: -0.25em;
  right: 0;
  border: none;
  background: transparent;
  font-weight: bold;
  color: light-dark(black, white);
}

dialog#skip-to-info-dialog .content {
  margin-left: 2em;
  margin-right: 2em;
  margin-top: 0;
  margin-bottom: 2em;
}

dialog#skip-to-info-dialog .content .desc {
  max-width: 20em;
}

dialog#skip-to-info-dialog .content .happy {
  margin-top: 0.5em;
  text-align: center;
  font-family: fantasy, cursive;
  font-size: 1.25em;
  font-weight: bold;
  font-style: italic;
  letter-spacing: 0.05em;
}


dialog#skip-to-info-dialog .content .version,
dialog#skip-to-info-dialog .content .copyright {
  margin-top: 0.5em;
  text-align: center;
  font-weight: bold;
  font-size: 90%;
}

dialog#skip-to-info-dialog .content table {
  width: auto;
}

dialog#skip-to-info-dialog .content caption {
  margin: 0;
  padding: 0;
  margin-top: 1em;
  text-align: left;
  font-weight: bold;
  font-size: 110%;
}

dialog#skip-to-info-dialog .content th {
  margin: 0;
  padding: 0;
  padding-top: 0.125em;
  padding-buttom: 0.125em;
  text-align: left;
  font-weight: bold;
  font-size: 100%;
}

dialog#skip-to-info-dialog .content th {
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: light-dark(#999999, #777777);
}

dialog#skip-to-info-dialog .content th.shortcut {
  width: 2.5em;
}

dialog#skip-to-info-dialog .content td {
  margin: 0;
  padding: 0;
  padding-top: 0.125em;
  padding-buttom: 0.125em;
  text-align: left;
  font-size: 100%;
}


dialog#skip-to-info-dialog .content table tr:nth-child(even) {
  background-color: light-dark(#eeeeee, #111111);
}

dialog#skip-to-info-dialog .buttons {
  float: right;
  margin-right: 0.5em;
  margin-bottom: 0.5em;
}

dialog#skip-to-info-dialog button {
  margin: 6px;
}

dialog#skip-to-info-dialog .buttons button {
  min-width: 5em;
}

button:focus {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

button:hover {
  cursor: pointer;
}
`;

export default class SkipToContentInfoDialog extends HTMLElement {
  constructor () {

    super();
    this.attachShadow({ mode: 'open' });

    // Get references

    this.infoDialog  = document.createElement('dialog');
    this.infoDialog.id = 'skip-to-info-dialog';
    this.shadowRoot.appendChild(this.infoDialog);

    const headerElem  = document.createElement('div');
    headerElem.className = 'header';
    this.infoDialog.appendChild(headerElem);

    this.h2Elem  = document.createElement('h2');
    this.h2Elem.textContent = 'Keyboard Shortcuts';
    headerElem.appendChild(this.h2Elem);

    this.closeButton1  = document.createElement('button');
    this.closeButton1.textContent = '✕';
    headerElem.appendChild(this.closeButton1);
    this.closeButton1.addEventListener('click', this.onCloseButtonClick.bind(this));
    this.closeButton1.addEventListener('keydown', this.onKeyDown.bind(this));

    this.contentElem  = document.createElement('div');
    this.contentElem.className = 'content';
    this.infoDialog.appendChild(this.contentElem);

    const buttonsElem  = document.createElement('div');
    buttonsElem.className = 'buttons';
    this.infoDialog.appendChild(buttonsElem);

    this.moreInfoButton  = document.createElement('button');
    this.moreInfoButton.textContent = 'More Information';
    buttonsElem.appendChild(this.moreInfoButton);
    this.moreInfoButton.addEventListener('click', this.onMoreInfoClick.bind(this));

    this.closeButton2  = document.createElement('button');
    this.closeButton2.textContent  = 'Close';
    buttonsElem.appendChild(this.closeButton2);
    this.closeButton2.addEventListener('click', this.onCloseButtonClick.bind(this));
    this.closeButton2.addEventListener('keydown', this.onKeyDown.bind(this));

    this.moreInfoURL = '';

  }

  onCloseButtonClick () {
    this.infoDialog.close();
  }

  openDialog () {
    this.infoDialog.showModal();
    this.closeButton2.focus();
  }

  onMoreInfoClick () {
    if (this.moreInfoURL) {
      window.open(this.moreInfoURL, '_blank').focus();
    }
  }

  configureStyle(config={}) {

    function updateOption(style, option, configOption, defaultOption) {
      if (configOption) {
        return style.replaceAll(option, configOption);
      }
      else {
        return style.replaceAll(option, defaultOption);
      }
    }

    // make a copy of the template
    let style = styleTemplate.textContent.slice(0);

    style = updateOption(style,
                         '$fontFamily',
                         config.fontFamily,
                         defaultStyleOptions.fontFamily);

    style = updateOption(style,
                         '$fontSize',
                         config.fontSize,
                         defaultStyleOptions.fontSize);

    style = updateOption(style,
                         '$focusBorderColor',
                         config.focusBorderColor,
                         defaultStyleOptions.focusBorderColor);

    style = updateOption(style,
                         '$focusBorderDarkColor',
                         config.focusBorderDarkColor,
                         defaultStyleOptions.focusBorderDarkColor);

    style = updateOption(style,
                         '$dialogTextColor',
                         config.dialogTextColor,
                         defaultStyleOptions.dialogTextColor);

    style = updateOption(style,
                         '$dialogextDarkColor',
                         config.dialogextDarkColor,
                         defaultStyleOptions.dialogextDarkColor);

    style = updateOption(style,
                         '$dialogBackgroundColor',
                         config.dialogBackgroundColor,
                         defaultStyleOptions.dialogBackgroundColor);

    style = updateOption(style,
                         '$dialogBackgroundDarkColor',
                         config.dialogBackgroundDarkColor,
                         defaultStyleOptions.dialogBackgroundDarkColor);

    style = updateOption(style,
                         '$dialogBackgroundTitleColor',
                         config.dialogBackgroundTitleColor,
                         defaultStyleOptions.dialogBackgroundTitleColor);

    style = updateOption(style,
                         '$dialogBackgroundTitleDarkColor',
                         config.dialogBackgroundTitleDarkColor,
                         defaultStyleOptions.dialogBackgroundTitleDarkColor);


    let styleNode = this.shadowRoot.querySelector('style');

    if (styleNode) {
      styleNode.remove();
    }

    styleNode = document.createElement('style');
    styleNode.textContent = style;
    this.shadowRoot.appendChild(styleNode);

  }


  updateShortcutContent (config) {

      while (this.contentElem.lastElementChild) {
        this.contentElem.removeChild(this.contentElem.lastElementChild);
      }

      this.moreInfoURL = MORE_SHORTCUT_INFO_URL;

      this.h2Elem.textContent = config.shortcutsInfoLabel;
      this.closeButton1.setAttribute('aria-label', config.closeLabel);
      this.closeButton2.textContent = config.closeLabel;
      this.moreInfoButton.textContent = config.moreInfoLabel;

      function addRow(tbodyElem, shortcut, desc) {

        const trElem = document.createElement('tr');
        tbodyElem.appendChild(trElem);

        const tdElem1 = document.createElement('td');
        tdElem1.className = 'shortcut';
        tdElem1.textContent = shortcut;
        trElem.appendChild(tdElem1);

        const tdElem2 = document.createElement('td');
        tdElem2.className = 'desc';
        tdElem2.textContent = desc;
        trElem.appendChild(tdElem2);
      }

      // Regions

      const tableElem1 = document.createElement('table');
      this.contentElem.appendChild(tableElem1);

      const captionElem1 = document.createElement('caption');
      captionElem1.textContent = config.landmarkGroupLabel;
      tableElem1.appendChild(captionElem1);

      const theadElem1 = document.createElement('thead');
      tableElem1.appendChild(theadElem1);

      const trElem1 = document.createElement('tr');
      theadElem1.appendChild(trElem1);

      const thElem1 = document.createElement('th');
      thElem1.className = 'shortcut';
      thElem1.textContent = config.msgKey;
      trElem1.appendChild(thElem1);

      const thElem2 = document.createElement('th');
      thElem2.className = 'desc';
      thElem2.textContent = config.msgDescription;
      trElem1.appendChild(thElem2);

      const tbodyElem1 = document.createElement('tbody');
      tableElem1.appendChild(tbodyElem1);

      addRow(tbodyElem1, config.shortcutRegionNext,          config.msgNextRegion);
      addRow(tbodyElem1, config.shortcutRegionPrevious,      config.msgPreviousRegion);
      addRow(tbodyElem1, config.shortcutRegionMain,          config.msgMainRegions);
      addRow(tbodyElem1, config.shortcutRegionNavigation,    config.msgNavigationRegions);
      addRow(tbodyElem1, config.shortcutRegionComplementary, config.msgComplementaryRegions);

      // Headings

      const tableElem2 = document.createElement('table');
      this.contentElem.appendChild(tableElem2);

      const captionElem2 = document.createElement('caption');
      captionElem2.textContent = config.headingGroupLabel;
      tableElem2.appendChild(captionElem2);

      const theadElem2 = document.createElement('thead');
      tableElem2.appendChild(theadElem2);

      const trElem2 = document.createElement('tr');
      theadElem2.appendChild(trElem2);

      const thElem3 = document.createElement('th');
      thElem3.className = 'shortcut';
      thElem3.textContent = config.msgKey;
      trElem2.appendChild(thElem3);

      const thElem4 = document.createElement('th');
      thElem4.className = 'desc';
      thElem4.textContent = config.msgDescription;
      trElem2.appendChild(thElem4);

      const tbodyElem2 = document.createElement('tbody');
      tableElem2.appendChild(tbodyElem2);

      addRow(tbodyElem2, config.shortcutHeadingNext, config.msgNextHeading);
      addRow(tbodyElem2, config.shortcutHeadingPrevious, config.msgPreviousHeading);
      addRow(tbodyElem2, config.shortcutHeadingH1, config.msgH1Headings);
      addRow(tbodyElem2, config.shortcutHeadingH2, config.msgH2Headings);
      addRow(tbodyElem2, config.shortcutHeadingH3, config.msgH3Headings);
      addRow(tbodyElem2, config.shortcutHeadingH4, config.msgH4Headings);
      addRow(tbodyElem2, config.shortcutHeadingH5, config.msgH5Headings);
      addRow(tbodyElem2, config.shortcutHeadingH6, config.msgH6Headings);

  }

  updateAboutContent (config) {

    while (this.contentElem.lastElementChild) {
      this.contentElem.removeChild(this.contentElem.lastElementChild);
    }

    this.moreInfoURL = MORE_PAGE_INFO_URL;

    this.h2Elem.textContent = config.aboutInfoLabel;
    this.closeButton1.setAttribute('aria-label', config.closeLabel);
    this.closeButton2.textContent = config.closeLabel;
    this.moreInfoButton.textContent = config.moreInfoLabel;

    let divElem = document.createElement('div');
    divElem.className = 'desc';
    divElem.textContent = config.aboutDesc;
    this.contentElem.appendChild(divElem);

    divElem = document.createElement('div');
    divElem.className = 'happy';
    divElem.textContent = config.aboutHappy;
    this.contentElem.appendChild(divElem);

    divElem = document.createElement('div');
    divElem.className = 'version';
    divElem.textContent = config.aboutVersion;
    this.contentElem.appendChild(divElem);

    divElem = document.createElement('div');
    divElem.className = 'copyright';
    divElem.textContent = config.aboutCopyright;
    this.contentElem.appendChild(divElem);

  }

  onKeyDown (event) {

    if ((event.key === "Tab") &&
        !event.altKey &&
        !event.ctlKey &&
        !event.metaKey) {

      if (event.shiftKey &&
          (event.currentTarget === this.closeButton1)) {
        this.closeButton2.focus();
        event.preventDefault();
        event.stopPropagation();
      }

      if (!event.shiftKey &&
          (event.currentTarget === this.closeButton2)) {
        this.closeButton1.focus();
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }
}


