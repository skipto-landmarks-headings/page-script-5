  /*  gen-documentation.js */

/* Requirements */

const fs = require('fs');
const path = require('path');
const nunjucks  = require('nunjucks');

const version = "5.7";

/* Constants */

const outputDirectory = './docs/';
const templateDirectory = './src-docs/templates';

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

const pages = [
  { template: './src-docs/templates/content-home.njk',
    title: 'SkipTo.js for Bypass Blocks',
    link: 'Home',
    filename: 'index.html'
  },
  { template: './src-docs/templates/content-page-script.njk',
    title: 'Adding SkipTo.js to a Web Page',
    link: 'Page Script',
    filename: 'page-script.html'
  },
  { template: './src-docs/templates/content-bookmarklets.njk',
    title: 'SkipTo.js Bookmarklets',
    link: 'Bookmarklets',
    filename: 'bookmarklets.html'
  },
  { template: './src-docs/templates/content-extensions.njk',
    title: 'SkipTo.js Web Browser Extensions',
    link: 'Extensions',
    filename: 'extensions.html'
  },
  { template: './src-docs/templates/content-shortcuts.njk',
    title: 'Shortcut Keys',
    link: 'Shortcuts',
    filename: 'shortcuts.html'
  },
  { template: './src-docs/templates/content-faq.njk',
    title: 'Frequently Asked Questions',
    link: 'FAQ',
    filename: 'faq.html'
  },
  { template: './src-docs/templates/content-about.njk',
    title: 'About',
    link: 'About',
    filename: 'about.html'
  }
  ];

const secondLevelPages = [
  { template: './src-docs/templates/content-config.njk',
    title: 'Configuration Options',
    link: 'Configuration',
    filename: 'config.html'
  },
  { template: './src-docs/templates/content-examples.njk',
    title: 'Example Configurations',
    link: 'Examples',
    filename: 'examples.html'
  },
  ];


const examples = [
  { template: './src-docs/templates/example/content-example.njk',
    title: 'Default Menu Button',
    filename: 'example-default.html',
    description: 'The "Skip To Content" menu button is always visible at the top of the window',
    config: ``
  },
  { template: './src-docs/templates/example/content-example.njk',
    title: 'Popup Menu Button',
    filename: 'example-popup.html',
    description: 'The "Skip To Content" menu button appears when it gets focus',
    config: `displayOption: popup; positionLeft: 46%`
  },
  { template: './src-docs/templates/example/content-example.njk',
    title: 'Popup with Border',
    filename: 'example-popup-border.html',
    description: 'The "Skip To Content" menu button appears when it gets focus, bottom border is always visible.',
    config: `displayOption: popup-border; positionLeft: 46%`
  },
  { template: './src-docs/templates/example/content-example.njk',
    title: 'Smooth Highlight of menu options',
    filename: 'example-smooth.html',
    description: '"Skip To Content" button is visible on load and scrolling to content is enabled using the smooth value',
    config: `highlightTarget: smooth`
  },
  { template: './src-docs/templates/example/content-example.njk',
    title: 'Instant Highlight of menu options',
    filename: 'example-instant.html',
    description: '"Skip To Content" button is visible on load and scrolling to content is enabled using the instant value',
    config: `highlightTarget: instant`
  },
  { template: './src-docs/templates/example/content-example.njk',
    title: 'Landmarks',
    filename: 'example-landmarks.html',
    description: 'The SkipTo.js menu lists only main, navigation and complementary landmarks in the "Landmark Regions" section of the menu.',
    config: `landmarks: main navigation complementary`
  },
  { template: './src-docs/templates/example/content-example.njk',
    title: 'Only Headings in Main Landmark Region (h1-h3)',
    filename: 'example-main-headings.html',
    description: 'The SkipTo.js menu shows only H1, h2 and H3 heading levels within the main landmark region in the "Headings" section of the menu.',
    config: `headings: main h1 h2 h3`
  },
  { template: './src-docs/templates/example/content-example.njk',
    title: 'All Headings on Page (h1-h6)',
    filename: 'example-headings.html',
    description: 'The SkipTo.js menu shows all H1, h2, H3, H4, H5 and H6 headings in the "Headings" section of the menu.',
    config: `headings: h1 h2 h3 h4 h5 h6`
  },
  { template: './src-docs/templates/example/content-example.njk',
    title: 'Illinois Theme',
    filename: 'example-illinois.html',
    description: 'The color theme of the button and the menu uses the "illinois" theme.',
    config: `colorTheme: illinois`
  },
  { template: './src-docs/templates/example/content-example.njk',
    title: 'ARIA Theme',
    filename: 'example-aria.html',
    description: 'The color theme of the button and the menu uses the "aria" theme.',
    config: `colorTheme: aria`
  },
  { template: './src-docs/templates/example/content-example.njk',
    title: 'Walmart Theme',
    filename: 'example-walmart.html',
    description: 'The color theme of the button and the menu uses the "walmart" theme.',
    config: `colorTheme: walmart`
  },
  { template: './src-docs/templates/example/content-example.njk',
    title: 'Fonts',
    filename: 'example-fonts.html',
    description: 'The fonts for button and menu are set to 8pt and monospace.',
    config: `fontSize: 8pt; fontFamily: monospace`
  },
  { template: './src-docs/templates/example/content-example.njk',
    title: 'Colors',
    filename: 'example-colors.html',
    description: 'Setting the colors for button and menu.',
    config: `menuTextColor: #003366; menuBackgroundColor: #ffffff;menuitemFocusTextColor: #ffffff;menuitemFocusBackgroundColor: #003366;focusBorderColor: #dd3444;buttonTextColor: #ffffff;buttonBackgroundColor: #003366; fontSize: 90%`
  },
  { template: './src-docs/templates/example/content-example.njk',
    title: 'Position',
    filename: 'example-position.html',
    description: 'Setting the position of "Skip To Content" button from the left side of the window.',
    config: `positionLeft: 25%`
  }
  ];

const tests = [
  { template: './src-docs/templates/example/content-no-landmarks.njk',
    title: 'No landmarks',
    filename: 'test-no-landmarks.html',
    description: 'No landmarks on page',
    config: `containerElement: div`
  },
  { template: './src-docs/templates/example/content-no-headings.njk',
    title: 'No headings',
    filename: 'test-no-headings.html',
    description: 'No headings on page',
    config: ``
  },
  { template: './src-docs/templates/example/content-role-heading.njk',
    title: 'Uses Role Heading',
    filename: 'test-role-headings.html',
    description: 'Heading role used on page and empty H2, h3 and H4 elements',
    config: ``
  },
  { template: './src-docs/templates/example/content-text-input.njk',
    title: 'Input controls',
    filename: 'test-input-controls.html',
    description: 'Shortcut keys is disabled when focus is a text input.',
    config: ``
  },
  { template: './src-docs/templates/example/content-init-object.njk',
    title: 'Initialization Object',
    filename: 'test-init-object.html',
    description: 'Uses the SkipToConfig configuration object',
    config: ``
  }
  ]


// Create files


examples.forEach( f => {
  console.log(`[example]: ${f.filename}`);
  outputFile(f.filename, nunjucks.render(f.template, {
    version: version,
    title: 'Example: ' + f.title,
    description: f.description,
    config: f.config,
    pages: pages,
    examples: examples
  }));
})

tests.forEach( f => {
  console.log(`[test]: ${f.filename}`);
  outputFile(f.filename, nunjucks.render(f.template, {
    version: version,
    title: 'Test Page: ' + f.title,
    description: f.description,
    config: f.config,
    pages: pages,
    tests: tests
  }));
})

secondLevelPages.forEach( p => {
  console.log(`[secondLevelPages]: ${p.filename}`);
  outputFile(p.filename, nunjucks.render(p.template,{
    version: version,
    title: p.title,
    pages: pages,
    examples: examples,
    tests: tests
  }));
})

pages.forEach( p => {
  console.log(`[page]: ${p.filename}`);
  outputFile(p.filename, nunjucks.render(p.template,{
    version: version,
    title: p.title,
    pages: pages,
    examples: examples,
    tests: tests
  }));
})

