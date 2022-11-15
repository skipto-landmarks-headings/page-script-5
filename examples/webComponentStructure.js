/* webComponentAriaRef.js */

const templateLink = document.createElement('template');
templateLink.innerHTML = `<slot name="link"><a href="#">Default Slot Link</a></slot>`;

class LinkComponentStructure extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }); // Creates a shadow DOM root node for the element

    // Add DOM tree from template
    this.shadowRoot.appendChild(templateLink.content.cloneNode(true));
  }
}

customElements.define('link-webcomponent', LinkComponentStructure);

const template1 = document.createElement('template');
template1.innerHTML = `
  <main aria-labelledby="id-main-title">
    <div id="id-main-title"><slot name="main-title">Default Web Component Title</slot></div>
    <p><a href="#">Test link</a></p>
    <section aria-labelledby="title-1">
      <h2 id="title-1"><slot name="section-1-title">Default Slot Content 1</slot></h2>
      <slot name="section-1-content">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Mauris viverra ultrices leo, ut sodales magna pulvinar et.
        Nunc scelerisque, eros sed feugiat sodales, mauris justo vulputate lorem,
        fringilla iaculis turpis arcu sit amet sapien. Vivamus facilisis orci leo.
      </slot>
      <ul>
        <li><a href="#">Item A1</a></li>
        <li><a href="#">Item B1</a></li>
        <li><a href="#">Item C1</a></li>
      </ul>
    </section>
    <section aria-labelledby="title-2">
      <h2 id="title-2"><slot name="section-2-title">Default Slot Content 2</slot></h2>
      <p>
        Usce imperdiet eu est id aliquet. Nullam ut leo quis ligula ultrices iaculis.
        Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
        Proin quis venenatis lacus, ac tincidunt nibh. Morbi eget ante ac ipsum tempor dictum.
      </p>
      <ul>
        <li><a href="#">Item A2</a></li>
        <li><a href="#">Item B2</a></li>
        <li><a href="#">Item C2</a></li>
      </ul>
      <slot name="nav">
          <nav aria-label="Default Navigation 1">
            <h2>Default Navigation 1</h2>
            <ul>
              <li><a href="#">Default link 11</a></li>
              <li><a href="#">Default link 12</a></li>
              <li><a href="#">Default link 13</a></li>
            </ul>
          </nav>     
          <nav aria-labelledby="default-nav-2">
            <h2 id="default-nav-2">Default Navigation 2</h2>
            <ul>
              <li><a href="#">Default link 21</a></li>
              <li><a href="#">Default link 22</a></li>
              <li><a href="#">Default link 23</a></li>
            </ul>
          </nav>     
      </slot>
    </section>
  </main>
`;

class WebComponentStructure extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }); // Creates a shadow DOM root node for the element

    // Add DOM tree from template
    this.shadowRoot.appendChild(template1.content.cloneNode(true));
  }
}

customElements.define('structure-webcomponent', WebComponentStructure);


