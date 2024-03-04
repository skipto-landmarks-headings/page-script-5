/*  gen-documentation.js */

/* Requirements */

const fs = require('fs');
const path = require('path');
const nunjucks  = require('nunjucks');

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

const files = [
  { template: './src-docs/templates/content-index.njk',
    title: 'Home',
    filename: 'index.html'
  },
  { template: './src-docs/templates/content-using.njk',
    title: 'Using Skipto.js on a Web Page',
    filename: 'using.html'
  },
  { template: './src-docs/templates/content-about.njk',
    title: 'About',
    filename: 'about.html'
  },
  { template: './src-docs/templates/content-config.njk',
    title: 'Configuration Options',
    filename: 'config.html'
  },
  { template: './src-docs/templates/content-examples.njk',
    title: 'Example Configurations',
    filename: 'examples.html'
  }
  ];


const examples = [
  { template: './src-docs/templates/example/content-example.njk',
    title: 'Default Configuration',
    filename: 'example-default.html',
    description: 'SkipTo button is visible on load',
    config: ``
  },
  { template: './src-docs/templates/example/content-example.njk',
    title: 'Popup Menu Button',
    filename: 'example-popup.html',
    description: 'The SkipTo menu button appears when it gets focus',
    config: `displayOption: popup`
  },
  { template: './src-docs/templates/example/content-example.njk',
    title: 'Headings (h1-h6)',
    filename: 'example-headings.html',
    description: 'The SkipTo menu shows all H1, h2, H3, H4, H5, H6 heading levels.',
    config: `headings: h1 h2 h3 h4 h5 h6`
  },
  { template: './src-docs/templates/example/content-example.njk',
    title: 'Illinois Theme',
    filename: 'example-illinois.html',
    description: 'The color theme of the menu uses the "illinois" theme.',
    config: `colorTheme: illinois`
  },
  { template: './src-docs/templates/example/content-example.njk',
    title: 'ARIA Theme',
    filename: 'example-aria.html',
    description: 'The color theme of the menu uses the "aria" theme.',
    config: `colorTheme: aria`
  },
  { template: './src-docs/templates/example/content-example.njk',
    title: 'Fonts',
    filename: 'example-fonts.html',
    description: 'The fonts for skipto are set to 8pt and monospace.',
    config: `fontSize: 8pt; fontFamily: monospace`
  }
  ];

const tests = [
  { template: './src-docs/templates/example/content-no-landmarks.njk',
    title: 'No landmarks',
    filename: 'test-no-landmarks.html',
    description: 'No landmarks on page',
    config: ``
  },
  { template: './src-docs/templates/example/content-no-headings.njk',
    title: 'No headings',
    filename: 'test-no-headings.html',
    description: 'No headings on page',
    config: ``
  }
  ]


// Create files


examples.forEach( f => {
  console.log(`[example]: ${f.filename}`);
  outputFile(f.filename, nunjucks.render(f.template, {
    title: f.title,
    description: f.description,
    config: f.config,
    examples: examples
  }));
})

tests.forEach( f => {
  console.log(`[test]: ${f.filename}`);
  outputFile(f.filename, nunjucks.render(f.template, {
    title: f.title,
    description: f.description,
    config: f.config,
    tests: tests
  }));
})

files.forEach( f => {
  console.log(`[file]: ${f.filename}`);
  outputFile(f.filename, nunjucks.render(f.template,
    {title: f.title,
     examples: examples,
     tests: tests
  }));
})

