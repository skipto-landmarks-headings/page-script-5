/* optionsStyleViewer.js */

// Constants

const debug = true;

const optionsColorViwerTemplate = document.createElement('template');
optionsColorViwerTemplate.innerHTML = `
  <div class="color-viewer">

    <h2 id="id-h2">Preview</h2>

    <table aria-labelledby="id-h2">
      <thead>
        <tr>
          <th>Feature</th>
          <th>Preview</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Button</td>
          <td>
            <button class="button">Skip To Content</button>
          </td>
        </tr>
        <tr>
          <td>Button<br/>(with focus)</td>
          <td>
            <button class="border-focus">Skip To Content</button>
          </td>
        </tr>
        <tr>
          <td>Menu</td>
          <td>
            <div class="menu border-focus">
              <div class="separator">Landmarks</div>
              <div class="group">
                <div class="menuitem skip-to-nesting-level-0">
                  <span class="label">Main</span>
                </div>
                <div class="menuitem skip-to-nesting-level-0 border-focus menuitem-focus">
                  <span class="label">Navigation: Site</span>
                </div>
                <div class="menuitem skip-to-nesting-level-0 last">
                  <span class="label">Navigation: Breadcrumbs</span>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
`;

const cssOptionsColorViwerTemplate = document.createElement('template');
cssOptionsColorViwerTemplate.innerHTML = `
<style>

.color-viewer {
  margin-top: 1em;
  border: 2px #555 solid;
  border-radius: 5px;
  padding: 0;
  width: 40em;
}

h2 {
  margin: 0;
  padding: 0;
  text-align: center;
  color: #fff;
  background: #000;
  padding-top: 0.25em;
  padding-bottom: 0.25em;
}

.color-viewer table {
  font-family: sans-serif;
  font-size: 1.2em;
  padding: 0.5em;
}

.color-viewer table tbody {
  border-top: 1px solid gray;
}

.color-viewer table th,
.color-viewer table td {
  padding: 0.5em;
  text-align: left;
}

button {
  margin: 0;
  padding: 0;
  padding: 6px 8px 6px 8px;
  border-width: 0px 1px 1px 1px;
  border-style: solid;
  border-radius: 0px 0px 6px 6px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12pt;
}

button.border-focus {
  outline: none;
  border-width: 0px 2px 2px 2px;
  padding: 6px 7px 5px 7px;
}

.menu {
  min-width: 17em;
  margin: 0;
  padding: 0.25rem;
  border-width: 2px;
  border-style: solid;
  border-radius: 5px;
  overflow-x: hidden;
  overflow-y: scroll;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12pt;
}

.group {
  display: grid;
  grid-auto-rows: min-content;
  grid-row-gap: 1px;
}

.separator:first-child {
  border-radius: 5px 5px 0 0;
}

.group .menuitem {
  padding: 3px;
  width: auto;
  border-width: 0px;
  border-style: solid;
  display: grid;
  overflow-y: clip;
  grid-template-columns: repeat(6, 1.2rem) 1fr;
  grid-column-gap: 2px;
  font-size: 1em;
}

.group .menuitem .level,
.group .menuitem .label {
  font-size: 100%;
  font-weight: normal;
  display: inline-block;
  line-height: inherit;
  display: inline-block;
  white-space: nowrap;
  border: none;
}

.group .menuitem .level {
  text-align: right;
  padding-right: 4px;
}

.group .menuitem .label {
  text-align: left;
  margin: 0;
  padding: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menuitem .level:first-letter,
.menuitem .label:first-letter {
  text-decoration: underline;
  text-transform: uppercase;
}

.menuitem.skip-to-h1 .level { grid-column: 1; }
.menuitem.skip-to-h2 .level { grid-column: 2; }

.menuitem.skip-to-h1 .label { grid-column: 2 / 8; }
.menuitem.skip-to-h2 .label { grid-column: 3 / 8; }

.menuitem.skip-to-h1.no-level .label { grid-column: 1 / 8; }
.menuitem.skip-to-h2.no-level .label { grid-column: 2 / 8; }

.menuitem.skip-to-nesting-level-1 .nesting { grid-column: 1; }
.menuitem.skip-to-nesting-level-2 .nesting { grid-column: 2; }

.menuitem.skip-to-nesting-level-0 .label { grid-column: 1 / 8; }
.menuitem.skip-to-nesting-level-1 .label { grid-column: 2 / 8; }

.menuitem.no-items .label,
.menuitem.action .label {
  grid-column: 1 / 8;
}

.separator {
  margin: 1px 0px 1px 0px;
  padding: 3px;
  display: block;
  width: auto;
  font-weight: bold;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: $menuTextColor;
  background-color: $menuBackgroundColor;
  color: $menuTextColor;
  z-index: $zIndex !important;
}

.separator:first-child {
  border-radius: 5px 5px 0 0;
}

.menuitem.last {
  border-radius: 0 0 5px 5px;
}

.menuitem.border-focus {
  padding: 1px;
  border-width: 2px;
  border-style: solid;
  outline: none;
}

</style>
`;



class OptionsStyleViewer extends HTMLElement {

  constructor() {

    super();

    this.attachShadow({ mode: 'open' });
    // const used for help function

    const optionsColorViewerClone = optionsColorViwerTemplate.content.cloneNode(true);
    this.shadowRoot.appendChild(optionsColorViewerClone);

    // Add stylesheet
    const cssOptionsColorViewerClone = cssOptionsColorViwerTemplate.content.cloneNode(true);
    this.shadowRoot.appendChild(cssOptionsColorViewerClone);

  }

  static get observedAttributes() {
    return [
      "data-button-text-color",
      "data-button-background-color",
      "data-focus-border-color",
      "data-menu-text-color",
      "data-menu-background-color",
      "data-menuitem-focus-text-color",
      "data-menuitem-focus-background-color"
    ];
  }

  updateColor (node, color, isBackground) {
    if (isBackground) {
      node.style.backgroundColor = color;
    }
    else {
      node.style.color = color;
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {

    const updateColor = this.updateColor;

    if (oldValue !== newValue) {
      const isButton     = name.includes('-button-');
      const isMenu       = name.includes('-menu-');
      const isMenuitem   = name.includes('-menuitem-');
      const isFocus      = name.includes('-focus-');
      const isBackground = name.includes('-background-');
      const isBorder     = name.includes('-border-');

      if (isButton) {
        const button = this.shadowRoot.querySelector('button');
        updateColor(button, newValue, isBackground);
        if (isBackground) {
          button.style.borderColor = newValue;
        }
      }

      if (isMenu) {
        const menus = this.shadowRoot.querySelectorAll('.menu, button.border-focus');
        menus.forEach( (m) => {
          updateColor(m, newValue, isBackground);
        });
      }

      if (isFocus) {
        if (isBorder) {
          const items = this.shadowRoot.querySelectorAll('.border-focus');
          items.forEach( (m) => {
            m.style.borderColor = newValue;
          });
        }
        if (isMenuitem) {
          const items = this.shadowRoot.querySelectorAll('.menuitem-focus');
          items.forEach( (m) => {
            updateColor(m, newValue, isBackground);
          });
        }
      }
    }
  }
}

window.customElements.define("options-style-viewer", OptionsStyleViewer);
