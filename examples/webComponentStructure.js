/* webComponentAriaRef.js */

const template1 = document.createElement('template');
template1.innerHTML = `
  <main aria-labelledby="id-main-title">
    <div id="id-main-title"><slot name="main-title">Web Component</slot></div>
    <slot name="title"><h1>Web Component</h1></slot>
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


