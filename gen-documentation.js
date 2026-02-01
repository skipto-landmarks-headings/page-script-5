  /*  gen-documentation.js */

/* Requirements */

const fs = require('fs');
const path = require('path');
const nunjucks  = require('nunjucks');

/* Constants */

const version = "5.10";

const tagLineName = "SkipTo.js for WCAG Bypass Blocks";
const projectName   = "SkipTo.js";

const issuesURL   = "https://github.com/skipto-landmarks-headings/page-script-5/issues";
const issuesEmail = "jongund@illinois.edu";

const outputDirectory   = './docs/';
const templateDirectory = './src-docs/templates';
const websiteURL        = 'https://skipto-landmarks-headings.github.io/page-script-5/';
const repositoryURL = 'https://github.com/skipto-landmarks-headings/page-script-5/';

// setUseCodeTags(true);

/* Helper functions */

function outputFile(fname, data) {
  fs.writeFile(path.join(outputDirectory, fname), data, err => {
      if (err) {
        console.error(err)
        return
      }
  })
}

function outputTemplate(fname, data) {
  fs.writeFile(path.join(templateDirectory, fname), data, err => {
      if (err) {
        console.error(err)
        return
      }
  })
}

const examplePages = [
  { content: 'example/content-example.njk',
    link: 'Defaults',
    title: 'Default Menu Button',
    filename: 'example-default.html',
    description: 'The "Skip To Content" menu button is always visible at the top of the window',
    config: ``,
    isExample: true
  },
  { content: 'example/content-example.njk',
    link: 'Popup',
    title: 'Popup Menu Button',
    filename: 'example-popup.html',
    description: 'The "Skip To Content" menu button appears when it gets focus',
    config: `displayOption: popup; positionLeft: 46%`,
    isExample: true
  },
  { content: 'example/content-example.njk',
    link: 'Large Fonts',
    title: 'Popup Menu Button with large fonts',
    filename: 'example-popup-large-fonts.html',
    description: 'The "Skip To Content" menu button appears when it gets focus.  But is suing a large font.',
    config: `displayOption: popup; positionLeft: 46%; fontSize: 24pt`,
    isExample: true
  },
  { content: 'example/content-example.njk',
    link: 'Visible Border',
    title: 'Popup with Border',
    filename: 'example-popup-border.html',
    description: 'The "Skip To Content" menu button appears when it gets focus, bottom border is always visible.',
    config: `displayOption: popup-border; positionLeft: 46%`,
    isExample: true
  },
  { content: 'example/content-example.njk',
    link: 'Smooth Scroll',
    title: 'Smooth Highlight of menu options',
    filename: 'example-smooth.html',
    description: '"Skip To Content" button is visible on load and scrolling to content is enabled using the smooth value',
    config: `highlightTarget: smooth`,
    isExample: true
  },
  { content: 'example/content-example.njk',
    link: 'Instant Scroll',
    title: 'Instant Highlight of menu options',
    filename: 'example-instant.html',
    description: '"Skip To Content" button is visible on load and scrolling to content is enabled using the instant value',
    config: `highlightTarget: instant`,
    isExample: true
  },
  { content: 'example/content-example.njk',
    link: 'Setting Landmarks',
    title: 'Setting landmarks visible in menu',
    filename: 'example-landmarks.html',
    description: 'The SkipTo.js menu lists only main, navigation and complementary landmarks in the "Landmark Regions" section of the menu.',
    config: `landmarks: main navigation complementary`,
    isExample: true
  },
  { content: 'example/content-example.njk',
    link: 'Only headings in main',
    title: 'Only Headings in Main Landmark Region (h1-h3)',
    filename: 'example-main-headings.html',
    description: 'The SkipTo.js menu shows only H1, h2 and H3 heading levels within the main landmark region in the "Headings" section of the menu.',
    config: `headings: main h1 h2 h3`,
    isExample: true
  },
  { content: 'example/content-example.njk',
    link: 'Setting Headings',
    title: 'Setting all headings visible in the menu',
    filename: 'example-headings.html',
    description: 'The SkipTo.js menu shows all H1, h2, H3, H4, H5 and H6 headings in the "Headings" section of the menu.',
    config: `headings: h1 h2 h3 h4 h5 h6`,
    isExample: true
  },
  { content: 'example/content-example.njk',
    link: 'Illinois Theme',
    title: 'Illinois Theme',
    filename: 'example-illinois.html',
    description: 'The color theme of the button and the menu uses the "illinois" theme.',
    config: `colorTheme: illinois`,
    isExample: true
  },
  { content: 'example/content-example.njk',
    link: 'ARIA Theme',
    title: 'ARIA Theme',
    filename: 'example-aria.html',
    description: 'The color theme of the button and the menu uses the "aria" theme.',
    config: `colorTheme: aria`,
    isExample: true
  },
  { content: 'example/content-example.njk',
    link: 'Fonts',
    title: 'Setting Font Styling',
    filename: 'example-fonts.html',
    description: 'The fonts for button and menu are set to 8pt and monospace.',
    config: `fontSize: 8pt; fontFamily: monospace`,
    isExample: true
  },
  { content: 'example/content-example.njk',
    link: 'Colors',
    title: 'Setting Color styles',
    filename: 'example-colors.html',
    description: 'Setting the colors for button and menu.',
    config: `menuTextColor: #003366; menuBackgroundColor: #ffffff;menuitemFocusTextColor: #ffffff;menuitemFocusBackgroundColor: #003366;focusBorderColor: #dd3444;buttonTextColor: #ffffff;buttonBackgroundColor: #003366; fontSize: 90%`,
    isExample: true
  },
  { content: 'example/content-example.njk',
    link: 'Position',
    title: 'Setting button position',
    filename: 'example-position.html',
    description: 'Setting the position of "Skip To Content" button from the left side of the window.',
    config: `positionLeft: 25%`,
    isExample: true
  }
];

const testPages = [
  { content: 'example/content-test.njk',
    link: 'No Landmarks',
    title: 'No landmarks',
    filename: 'test-no-landmarks.html',
    description: 'No landmarks on page',
    config: `containerElement: div`,
    test: 'nolandmarks'
  },
  { content: 'example/content-test.njk',
    link: 'No headings',
    title: 'No headings',
    filename: 'test-no-headings.html',
    description: 'No headings on page',
    test: 'noheadings'
  },
  { content: 'example/content-role-heading.njk',
    link: 'Role Heading',
    title: 'Uses Role Heading',
    filename: 'test-role-headings.html',
    description: 'Heading role used on page and empty H2, h3 and H4 elements',
    test: `roleheading`,
    config: 'headings: h1 h2 h3 h4 h5 h6'
  },
  { content: 'example/content-test.njk',
    link: 'Config Object',
    title: 'Configuration Object',
    filename: 'test-config-object.html',
    description: 'Uses the SkipToConfig javascript object for configuring SkipTo.js',
    test: `config-object`
  },
  { content: 'example/content-text-input.njk',
    link: 'Input controls',
    title: 'Input controls',
    filename: 'test-input-controls.html',
    description: 'Shortcut keys is disabled when focus is a text input.',
    test: `controls`
  },
  { content: 'example/content-slot-content.njk',
    link: 'Slotted Content',
    title: 'Custom Elements with Slotted Content',
    filename: 'test-slotted-content.html',
    description: 'Uses custom elements to render headings and landmarks.',
    test: `slotted`
  },
  { content: 'example/content-header-size.njk',
    title: 'Header Size',
    title: 'Header Size',
    filename: 'test-header-size.html',
    description: 'Testing if the dimensional size (e.g. height and width) of headings effects which headings screen readers will include in lists and header navigation',
    config: `headings: h1 h2 h3 h4 h5 h6`
  }
];


const mainPages = [
  { content: 'content-home.njk',
    title: 'SkipTo.js for Bypass Blocks',
    link: 'Home',
    filename: 'index.html'
  },
  { content: 'content-shortcuts.njk',
    title: 'Shortcut Keys',
    link: 'Shortcuts',
    filename: 'shortcuts.html'
  },
  { dropdown: 'Extensions',
    pages: [
      { content: 'content-extensions-overview.njk',
        title: 'SkipTo.js Browser Extensions',
        link: 'Overview',
        filename: 'extensions.html'
      },
      { content: 'content-extensions-menu.njk',
        title: 'Menu Options',
        link: 'Menu',
        filename: 'extensions-options-menu.html'
      },
      { content: 'content-extensions-button.njk',
        title: 'Button Options',
        link: 'Button',
        filename: 'extensions-options-button.html'
      },
      { content: 'content-extensions-highlight.njk',
        title: 'Highlight Options',
        link: 'Highlight',
        filename: 'extensions-options-highlight.html'
      },
      { content: 'content-extensions-shortcuts.njk',
        title: 'Shortcut Options',
        link: 'Shortcuts',
        filename: 'extensions-options-shortcuts.html'
      },
      { content: 'content-extensions-style.njk',
        title: 'Styling Options',
        link: 'Fonts and Colors',
        filename: 'extensions-options-style.html'
      },
      { content: 'content-extensions-i18n.njk',
        title: 'Internationalization Options',
        link: 'I18n',
        filename: 'extensions-options-i18n.html'
      }
    ]
  },
  { content: 'content-bookmarklets.njk',
    title: 'SkipTo.js Bookmarklets',
    link: 'Bookmarklets',
    filename: 'bookmarklets.html'
  },
  { dropdown: 'Page Script',
    pages: [
      { content: 'content-page-script-add.njk',
        title: 'Adding SkipTo.js to a Web Page',
        link: 'Adding to Page',
        filename: 'page-script.html'
      },
      { content: 'content-page-script-config.njk',
        title: 'Configuration Options',
        link: 'Configuration',
        filename: 'page-script-config.html'
      },
      { content: 'content-page-script-examples.njk',
        title: 'Example Configurations',
        link: 'Example Configurations',
        filename: 'page-script-examples.html',
        subpages: examplePages
      },
      { content: 'content-page-script-tests.njk',
        title: 'Test Pages',
        link: 'Test Pages',
        filename: 'page-script-tests.html',
        subpages: testPages
      }
    ]
  },
  { content: 'content-faq.njk',
    title: 'Frequently Asked Questions',
    link: 'FAQ',
    filename: 'faq.html'
  },
  { dropdown: 'About',
    pages: [
      { content: 'content-about-history.njk',
        title: 'History',
        link: 'History',
        filename: 'about-history.html'
      },
      { content: 'content-about-privacy.njk',
        title: 'Privacy',
        link: 'Privacy',
        filename: 'about-privacy.html'
      },
      { content: 'content-about-feedback.njk',
        title: 'Feedback and Issues',
        link: 'Feedback',
        filename: 'about-feedback.html'
      },
      {
        spacer: ''
      },
      { url: 'https://opena11y.github.io/evaluation-library/',
        link: 'Evaluation Library'
      },
      { url: 'https://opena11y.github.io/ainspector/',
        link: 'AInspector for WCAG'
      },
      { url: 'https://opena11y.github.io/h2l-side-panel/',
        link: 'H2L Side Panel'
      }
    ]
  }
];




// Create content files

function createNavigation(pages) {
  console.log(`[create Navigation]`);
  let html = '\n';
  pages.forEach( item => {
    console.log(`[create Navigation]: ${item.dropdown} ${item.filename}`);
    if (item.dropdown) {
      html += `
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle"
             data-bs-toggle="dropdown"
            href="#"
            role="button"
            aria-expanded="false">${item.dropdown}</a>
          <ul class="dropdown-menu">`;

      item.pages.forEach( p => {
        console.log(`[dropdown][page]: ${p.filename}`);
        if (p.filename) {
          html += `<li><a class="dropdown-item" href="${p.filename}">${p.link}</a></li>`;
        }
        else {
          if (p.url) {
          html += `<li><a class="dropdown-item" href="${p.url}">${p.link}</a></li>`;
          }
          else {
            html += `<li><hr class="dropdown-divider"></li>`;
          }
        }
      });

      html += `
          </ul>
        </li>
      `;
    }
    else {
      html += `
        <li class="nav-item">
          <a class="nav-link" href="${item.filename}">${item.link}</a>
        </li>
      `;
    }
  });
  html += '\n';

  return html;
}

const mainNav = createNavigation(mainPages);


function createPage(page, mainNav, dropdownName='', dropdownPages=false, subPages=[], subPagesTitle='') {
  if (page.filename) {
    console.log(`  [createPage]: ${page.filename}`);

    const desc   = page.description ? page.description : '';
    let config = page.config ? page.config : '';
    if (!config.includes('positionLeft')) {
      config += config ? ';positionLeft: 30%' : 'positionLeft: 30%';
    }

    outputFile(page.filename,
      nunjucks.render('./src-docs/templates/page.njk',{
        content: page.content,
        navigation: mainNav,
        dropdownName: dropdownName,
        dropdownPages: dropdownPages,
        websiteURL: websiteURL,
        repositoryURL: repositoryURL,
        projectName: projectName,
        tagLineName: tagLineName,
        issuesURL: issuesURL,
        issuesEmail: issuesEmail,
        version: version,
        title: page.title,
        description: desc,
        config: config,
        subPages: subPages,
        subPagesTitle: subPagesTitle,
        test: page.test
      })
    );
  }
}

// Create files

function createPages(pages) {
  console.log(`[create pages]`);
  pages.forEach( item => {
    if (item.dropdown) {
      item.pages.forEach( p => {
        const subPages     = p.subpages ? p.subpages : [];
        const subPageTitle = p.subpages ? p.link : '';
        createPage(p, mainNav, item.dropdown, item.pages, subPages, '');
        if (subPages) {
          subPages.forEach( sp => {
            createPage(sp, mainNav, item.dropdown, item.pages, subPages, subPageTitle);
          });
        }
      });
    }
    else {
      createPage(item, mainNav);
    }
  });
}

createPages(mainPages);


