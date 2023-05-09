
<img src="./images/skipto-128.png" alt="SkipTo logo"/>

# SkipTo Landmarks and Headings Page Script, Version 5.1

See the [Authors](#authors) section for more information.

SkipTo is a replacement for your old classic "Skip To Main Content" link, (so please use it as such)!
The SkipTo creates a drop-down menu consisting of the links to important landmarks and headings on a given web page identified by the author. Once installed and configured, the menu makes it easier for keyboard and screen reader users to quickly jump to the desired region of a page by simply choosing it from the list of options.  

**NOTE:** SkipTo 5 is a total rewrite of [SkipTo 4](https://github.com/paypal/skipto) to support custom web components and solidify SkipTo 5 in promoting the proper understanding and use of headings and landmark regions by making them visible to everyone, not just screen reader users.  The SkipTo 5 code uses Javascript Modules for improved development and maintenance of SkipTo features.

### Benefits

* Modern way to conform to the "[Bypass Blocks](https://www.w3.org/TR/WCAG/#bypass-blocks)" requirement of the [Web Content Accessibility Guidelines](https://www.w3.org/TR/WCAG/).
* Screen reader users can get a higher level navigation menu without having to use the screen reader landmark and header navigation commands which typically include longer lists of lower level headings and less used landmarks.
* Keyboard only users can more efficiently navigate to content on a page.
* Speech recognition users can use the menu to more efficiently navigate to content on a page.
* When the "Skip To Content" menu button is visible when the page is loaded everyone can use it to identify and navigate to important regions on a page.
* Authors can configure SkipTo to identify the most important regions, ideally about 7-12 items to make it easier for people to read the list and choose an option.  Remember the more items, the longer it will take for the user to identify which item they want to choose.

![Example Screen Shot](images/example_screen_shot.png "Example Screen Shot")

## Websites using SkipTo

There are two main ways to use the menu button for SkipTo in a page.  In the default configuration the menu button is always visible making it useful to everyone to easily find and navigate to the important content regions identified by the author.  This is similar to how curb cuts help more than just people using wheelchairs.  It is also easier for people using voice recognition to activate the button using the "click skip to content" command and use similar voice commands to activate SkipTo menu items.  The "popup" option is the more traditional approach to fulfilling the "[bypass bocks](https://www.w3.org/TR/WCAG/#bypass-blocks)" requirement of the [Web Content Accessibility Guidelines](https://www.w3.org/TR/WCAG/), but this option makes the feature less visible to people who might benefit.

### Visible Menu Button (default)
* [DRES Accessible IT Group](https://accessibleit.disability.illinois.edu/)
* [College of Applied Health Sciences](https://ahs.illinois.edu/)

### Popup Menu Button
* [W3C WAI Authoring Practices](https://w3.org/WAI/ARIA/apg)
* [Admissions at the University of Illinois](https://admissions.illinois.edu/)
* [cPanel Web Hosting Service @ Illinois](http://cpanel.web.illinois.edu)
* [Functional Accessibility Evaluator (FAE)](https://fae.disability.illinois.edu/)
* [College of Education](https://education.illinois.edu/) (Web components)

NOTE: Popup menu button option is available through configuration of SkipTo when it is loaded.

## How it works

1. The SkipTo menu button should be the first tabable element on the page, and by default the button is visible, but can be configured to "popup" when the button becomes receives focus.
2. Once the keyboard focus is on the menu button, pressing the ENTER, SPACE, DOWN ARROW or UP ARROW keys will pull down the list of important landmarks and headings on the page.  The button is based on the ARIA Authoring Practice [design pattern for menu button](https://w3c.github.io/aria-practices/#menubutton).
3. Use arrow keys to select your choice and press ENTER to move focus to the section of the page.

## Shortcut key

A shortcut key can be used to open the SKipTo menu from anywhere on the page.  Version 5 changes the shortcut key operation from using the HTML `accesskey` attribute to use a scripted method to improve consistency of the shortcut keys between browsers and to support screen reader users, since some screen readers do not support accesskeys. 

To use the "SkipTo" shortcut key, you would press either `alt + 0` (Windows/Unix/Linux) or `Option + 0` (macOS).  macOS does not have an `Alt` key, so the `Option` key is used as the modifier.  The access keys are the same for Firefox, Chrome and Safari on the same operating system.


* `Alt+0` : Windows, Unix and Linux.
* `Option+0` : macOS.

## Adding to Website

All you need are either skipto.js or skipto.min.js from the "[dist/](dist/)" directory of this repository. Please note that skipto.min.js is a minified (a lighter version) of the script.

### Local File on Your Web Server

Copy the [skipto.js](https://skipto-landmarks-headings.github.io/page-script-5/dist/skipto.js) or [skipto.min.js](https://skipto-landmarks-headings.github.io/page-script-5/dist/skipto.min.js) to the file system of your web server and reference it from your web page or templates using a `script` tag, as follows:


```html
<script src="https://[path to Javascript files]/skipto.min.js"></script>
```

### CDN Service

The easiest way is to include a reference to `skipto.min.js`  on your HTML page or template is through the CDN service, as follows:

github.com CDN service:

```html
<script src="https://skipto-landmarks-headings.github.io/page-script-5/dist/skipto.min.js"></script>
```

or

University of Illinois CDN service:

```html
<script src="https://cdn.disability.illinois.edu/skipto.min.js"></script>
```

NOTE: CDN referenced files may not be available to computers behind firewall protected networks.

## Reporting Issues

Please use [Github issues](https://github.com/skipto-landmarks-headings/page-script-5/issues) to report problems, ask support questions or offer feature enahancement ideas.

## Configure Options

All settings have a default value, a configuration object can be used to change the default values.

### Options for adding the `button` element

The following options are useful for identify where the menu will be in the DOM structure of the page and which elements will be used as the container for the menu button.  The options are of type `string`.

| Property       | default     | Description |
| :------------- | :---------- | :---------- |
| `containerElement` | 'nav'  | Container element for SkipTo button and menu. Can be set to 'div' element if you do not want a landmark created for SkipTo menu. |
| `displayOption` | 'static' | Values of `static`, `fixed` or `popup` are defined.  The value `static` the button is always visible, the value `fixed` the button is always visible at the top of the page even when the page scrolls, and the value `popup` is used the button is initially not visible, but becomes visible when it receives focus. |
| `attachElement` | 'body' | A CSS selector for identifying which element to attach the menu button container. |
| `customClass` | none | CSS class added to the container `div` element. Can be used for customize styling of the button and menu with author supplied stylesheet. |
| `altShortcut`    | '0'      | Shortcut character for Windows/Linux/Unix when the alt key is pressed to open the menu. | 
| `optionShortcut` | 'º'      | Shortcut character for macOS when the option key is pressed to open the menu. |


### Button Positioning

| Property       | Type   | Default | Description |
| :------------- | :----- | :------ | :---------- |
| `positionLeft` | length | `46%`  | The position of the "Skip To Content" button from left margin. |

### Button Font Family and Font Size

| Property       | Type   | Default | Description |
| :------------- | :----- | :------ | :---------- |
| `fontSize` | CSS font size | `inherit`  | Set the CSS `font-size` using the configuration object. |
| `fontFamily` | CSS font string | `inherit`  | Set the CSS `font-family` using the configuration object. |

### Identifying Landmarks and Headings for the menu

The `landmarks` and 'headings' options are a space separated list of tag and landmark region names to identify the important landmark regions and headings on the page for the purpose of keyboard navigation.  The list of landmarks and headings should be **relatively short**, the more items the menu contains the more time the user will need to scan and navigate to the section they want to "skip to".  The values are considered tokens to maximize compatibility with version 4 CSS selectors for these properties.

The options are of type `string`.

| Property       | Default | Description |
| :------------- | :------ | :---------- |
| `landmarks` | 'main search navigation complementary' | A space separated list of landmark names. Allowed values include: `banner`, `complementary`, `contentinfo`, `main`, `navigation`, `region` and `search` |
| `headings` | 'main h1 h2' | A space separated list of heading tags, "main" is included only headings contained in the main.  Allowed values include: `h1`, `h2`, `h3`, `h4`, `h5`, `h6` and `main`  |

### Color Theme Options

A color theme sets all the color options defined by the theme. 

| Property       | Type   | Default | Description |
| :------------- | :----- | :------ | :---------- |
| `colorTheme` | string | `default`  | A predefined color scheme for skipTo|

Current Color Theme Values:

* 'aria' : Used in ARIA Authoring practices
* 'illinois': Used by the University of Illinois at Champaign/Urbana
* 'uic' : Used by the University of Illinois at Chicago
* 'uillinois' : Used by the University of Illinois Administration
* 'uis' : Used by the University of Illinois at Springfield

* If you would like a them added for your organization, please file an [issue](./issues) with the desired colors

### Colors used for Button and Menu styling

Color values must use [CSS color values](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value), for example `#8AF`, `rgb(40, 50, 90)`, `#a0bf32`, `blue`.

| Property       | Type   | Default | Description |
| :------------- | :----- | :------ | :---------- |
| `buttonTextColor` | Color | `#1a1a1a`  | Color of text for "Skip To Content" button. |
| `buttonBackgroundColor` | Color | `#eeeeee` | Background color of text for "Skip To Content" button. |
| `focusBorderColor` | Color | `#1a1a1a` | Border color for items with keyboard focus. |
| `menuTextColor` | Color | `#1a1a1a` | Menu text color |
| `menuBackgroundColor` | Color | `#dcdcdc` | Menu background color. |
| `menuitemFocusTextColor` | Color | `#eeeeee`  | Menuitem text color when a menuitem has focus. |
| `menuitemFocusBackgroundColor` | Color | `#1a1a1a`  | Menuitem text background when a menuitem has focus. |

NOTE: Make sure colors meet the color contrast requirements of WCAG 2.1 for text

## Internationalization (I18N)

The text labels and messages can be updated through configuration to local language requirements.

### Button Labeling

The labels and messages can be localized for specific languages or updated to reflect custom selectors.

| Property         | Default  | Description |
| :--------------- | :------- |:----------- |
| `buttonLabel`    | 'Skip to Content' | Change the label for the button. |
| `altLabel`       | 'Alt'    | Label for modifier key for Windows and Unix/Linux operating systems |
| `optionLabel`    | 'Opt'    | Label for modifier key for macOS operating systems |
| `altShortcut`    | '0'      | Shortcut character used in combination with the alt key for opening the menu | 
| `optionShortcut` | 'º'      | Character generated by macOS when the option key is pressed with the shortcut key. |
| `altButtonAriaLabel`    | 'Skip To Content, shortcut Alt plus $key'    | `aria-label` template for button when the OS uses `alt` key |
| `optionButtonAriaLabel` | 'Skip To Content, shortcut Option plus $key' | `aria-label` template for button when the OS uses `option` key (e.g, macOS) |


### Menu, Group and Menuitem Labeling

The labels and messages can be localized for specific languages or updated to reflect custom selectors.

| Property       | Default | Description |
| :------------- | :------ |:---------- |
| `menuLabel` | 'Landmarks and Headings' | Change the label for the menu. |
| `landmarkGroupLabel` | 'Landmark Regions' | Menu group label for landmarks . |
| `headingGroupLabel` | 'Headings' | Menu group label for headings. |
| `mofnGroupLabel` | '$m of $n' | Provides information on the number of items that are displayed and the total number of items in the document.  The information is added to the landmark and heading group labels. |
| `headingLevelLabel` | 'Heading level' | Used for `aria-label` to improve labeling of heading menu items for screen reader users. |
| `mainLabel` | 'main' | The label in the menu for `main` landmarks |
| `searchLabel` | 'search' | The label in the menu for `search` landmarks |
| `navLabel` | 'navigation' | The label in the menu for `navigation` landmarks |
| `asideLabel` | 'aside' | The label in the menu for `complementary` landmarks |
| `footerLabel` | 'footer' | The label in the menu for `contentinfo` landmarks |
| `headerLabel` | 'header' | The label in the menu for `banner` landmarks |
| `formLabel` | 'form' | The label in the menu for `form` landmarks |
| `msgNoLandmarksFound` | 'No landmarks to skip to'| Message for when no landmarks are found. |
| `msgNoHeadingsFound` | 'No main headings to skip to'| Message for when no headings are found. |

#### Deprecated Configuration Properties from Version 4

The following properties were deprecated from previous versions of SkipTo and will be ignored if defined.

* `actionGroupLabel` 
* `actionShowHeadingsHelp` 
* `actionShowSelectedHeadingsLabel` 
* `actionShowAllHeadingsLabel` 
* `actionShowLandmarksHelp` 
* `actionShowSelectedLandmarksLabel` 
* `actionShowAllLandmarksLabel` 
* `actionShowSelectedHeadingsAriaLabel` 
* `actionShowAllHeadingsAriaLabel` 
* `actionShowSelectedLandmarksAriaLabel` 
* `actionShowAllLandmarksAriaLabel`
* `buttonTitle` 
* `buttonTitleAccesskey` 
* `containerRole`

## Example Settings

You can custiomize SkipTo to the features of your website by using a configuration object. The following is a sample configuration:

```html
<script>
var SkipToConfig =  {
  landmarks: 'main search navigation',
  headings: 'main h1 h2 h3',
  colorTheme: 'illinois'
};
</script>
```

NOTE: Configuration objects in [version 4.x](https://github.com/skipto-landmarks-headings/page-script-4#user-content-example-settings) are still supported for compatibility with existing installations.  Version 5.0 is providing a less complex object for customizing SkipTo.

### HTML, Classes and Ids for custom styling

The source code in this section is for developers to understand the HTML, classes and ids used in the SkipTo menu button and menu for use in custom styling.

```html
<div class="id-skip-to">
  <!--
  //
  // Menu Button
  //
  -->
  <button
    aria-haspopup="true"
    aria-expanded="true"
    aria-label="Skip to content, shortcut Alt plus 0">
    Skip To Content (Alt+0)
  </button>
  <!--
  //
  // ARIA enabled menu
  //
  -->
  <div role="menu">
    <!--
    //
    // Landmark group label and menu items
    //
    -->
    <div id="id-skip-to-group-landmarks-label"
      role="separator">
      Important Landmarks
    </div>
    <div role="group"
      aria-labelledby="id-skip-to-group-landmarks-label" id="id-skip-to-group-landmarks">
      <div role="menuitem"
        class="landmark skip-to-main skipto-nesting-level-0"
        data-id="1">
        <span class="label">Main</span>
      </div>
      <div role="menuitem"
        class="landmark skip-to-nav skipto-nesting-level-0"
        data-id="2">
        <span class="label">Navigation: SkipTo test pages</span>
      </div>
      <!--
      ... more menu items ...
      -->
    </div>
    <!-- End Landmarks Group -->

    <!--
    //
    // Heading group label and menu items
    //
    -->
    <div id="id-skip-to-group-headings-label"
      role="separator">
      Important Headings
    </div>
    <div role="group"
      aria-labelledby="id-skip-to-group-headings-label"
      id="id-skip-to-group-headings">
      <div role="menuitem"
        class="heading skip-to-h1"
        data-id="9"
        data-level="1">
        <span class="level"><span>1</span>)</span>
        <span class="label">Example Content</span>
      </div>
      <div role="menuitem"
        class="heading skip-to-h2"
        data-id="10"
        data-level="2">
        <span class="level"><span>2</span>)</span>
        <span class="label">Pastrami</span>
      </div>
      <!--
      ... more menu items ...
      -->
    </div>
    <!-- End Headings Group -->
  </div>
</div>


```
## Warning Messages

The following warning messages maybe be rendered to the console:

| Message                          | Action                          |
| :------------------------------- | :------------------------------ |
| Skipto is already loaded         | Additional SkipTo's are ignored |
| No headings found in main        | Will search for any headings on the page |
| No headings found on page        | SkipTo menu reports no headings on the page |
| No landmarks found on page       | SkipTo menu reports no landmarks on the page |
| Error in heading configuration   | Sets configuration to look for any `h1` of `h2` headings  |
| Error in landmark configuration  | Sets configuration to look for `main search` and `navigation` landmarks|

### Notes

* Parameters are optional.
* SkipTo will be attached to the `header`element as the first child by default.  If the `header`element is not present, it will be attached as the first child of the `body` element on the page.  The attachment can be changed using the "attachElement" parameter.
* When the custom class is specified (see the customClass parameter), the user can override the style:

```css
nav#id-skip-to.MyCustomClass {
  background:  red;
  left: 50px;
  top: 50px;
}
```

## Compiling CSS and JavaScript

The [SkipTo.js code](https://github.com/skipto-landmarks-headings/page-script-5) is open-source. You may feel slightly adventurous and decide to change some colors by creating a built-in color theme or even enhance the script with your changes. Once you do this, here is how you compile the skipTo script for production.

```sh
git clone https://github.com/skipto-landmarks-headings/page-script-5.git
cd page-script-5
sudo npm install grunt-cli -g
npm install
gulp
```

1. You should now have a directory called **`dist`** with the necessary files in it.
1. See instructions above on which files you need to get the SkipTo script running on your web site.

## Of course, we want feedback 

Please do not hesitate to [raise issues and comment on Github](https://github.com/skipto-landmarks-headings/page-script-5/issues) if something doesn't work or you have ideas on how to improve the script.

Happy skipping!

## Authors

### Current Contributors

**Jon Gunderson**
[https://github.com/jongund](https://github.com/jongund)

**Nicholas Hoyt**
[https://github.com/nhoyt](https://github.com/nhoyt)

**Prem Nawaz Khan**
[https://github.com/mpnkhan](https://github.com/mpnkhan) || [@mpnkhan](https://twitter.com/mpnkhan)

### Previous Contributors 

**Ron Feathers**
[https://github.com/rfeathers](https://github.com/rfeathers) || [@ronfeathers](https://twitter.com/ronfeathers)

**Marc Kocher**
[https://github.com/mdkocher](https://github.com/mdkocher) || [@marckocher](https://twitter.com/marckocher)

**Brian Teeman**
[https://github.com/brianteeman](https://github.com/brianteeman)

**Victor Tsaran**
[https://github.com/vick08](https://github.com/vick08) || [@vick08](https://twitter.com/vick08)


## Version History

### Version 5.1.6
* Fixed bug in looking for headings outside the main landmark, if no headings were found in the main landmark and added additional console warning messages.  NOTE: In the default configuration, SkipTo.js looks for headings only in the main landmark, but if none are found it will look for any headings on the page.

### Version 5.1.5
* Fixed bug in detecting if SkipTo is already load, sends warning to console if loaded more than once

### Version 5.1.4
* Fixed bug in accessible name calculation for images included in heading contents for Firefox browser

### Version 5.1.3
* Minor edits to license to make version authorship clearer.
* Restore `containerElement` configuration option to allow the author to use SkipTo without creating a navigation landmark.

### Version 5.1.2
* Fixed bug computing accessible name when CSS ::before or ::after is used.

### Version 5.1.1
* Fixed typo in complementary landmark selector.

### Version 5.1.0
* Supports including landmark regions and headings in custom web components.
* Makes the skipto container element a navigation landmark region with an accessible name.
* Deprecates the `containerElement` and `containerRole` configuration options (e.g. uses "nav" element).
* Reorganizes the code into modules for improved development and readability.
* Switch from using `grunt` to `gulp` for building release files.
* Updated accessible name calculation.
* Added transition effect for "popup" display option when button receives focus.
* Responsive: Button text changes to skipto icon when screen width is less than 540px
* Use template element for creating `style` element.
* `skipto.min.js.map` file is no longer generated for `skipto.min.js` for debugging, reference `skipto.js` instead for debugging needs.

### Version 5.0.1
* Unify shortcut key to be consistent between browsers and to support screen reader users using the shortcut by changing the shortcut to use Javascript rather than the HTML `accesskey` attribute.
* Support a scrollable menu if the list of menu items does not fit in the current window size.
* Removed tooltip and added the shortcut key information to the button label to simplify the identification of the shortcut key.
* Fix bug in not moving focus to "hidden" elements.
* Fixes bug with Safari visual rendering of the menu item with focus.
* Deprecates "All headings" and "All landmarks" option to reduce code and configuration complexity
* Simplifies configuration object

### Version 4.1.6
* Revert the changes from 4.1.4

### Version 4.1.5
* Corrects packaging error in 4.1.4

### Version 4.1.4
* Fixes problem in failure to create the SkipTo menu due to invalid configuration

### Version 4.1.3
* Region landmarks must have an accessible name to be included as a landmark in the SkipTo menu to comply with ARIA specification for landmark regions, and will region landmarks be included after complementary landmarks in the SkipTo menu.
* Updated landmark prefixes in menu to align with actual ARIA role names with the following changes:
  * `header:` => `banner`
  * `footer:` => `contentinfo`
  * `aside:` => `complementary`

### Version 4.1.2
* Added <code>aria-busy="true"</code> attribute to menu element when SkipTo is initialized and being updated with new menu items to support validators looking for required menu items for the <code>menu</code> role.
* Added the <em>optional</em> <code>aria-controls</code> attribute to button element to reference the <code>id</code> of the menu element as defined in the W3C ARIA Authoring practices for [menu button pattern](https://w3c.github.io/aria-practices/#menubutton).

### Version 4.1.1
* Removed <code>aria-describedby</code> from button, since screen readers read the <code>accesskey</code> information.

### Version 4.1
* Added feature for the <kbd>escape</kbd> key to hide tooltip when focus is on button.
* Added new properties to set font family and font size.
* Adding CSS properties to the <code>.label</code> and <code>.level</code> class so the inherited values from <code>[role="menuitem"]</code> are not overridden as easily by other stylesheets used on a page.
* Updated moving focus to improve moving focus to visible targets within landmarks.
* Fixed broken shortcut keys in the menu

### Version 4.0.5
* Fixes a problem introduced in version 4.0.4 when button tooltip was updated, restores support for `buttonTitle` and `buttonTitleWithAccesskey` configuration properties.

### Version 4.0.4
* Popup tooltip shows accesskey to open menu when button on hover or focus.
* Popup tooltip is only displayed when a known accesskey is supported by the browser and device operating system.
* Popup tooltip supports high contrast operating system settings.
* Action menu items are disabled by default.
* M of N items in landmark or heading list is disabled by default.
* CDN reference to `skipto.min.js` is now available from University of Illinois.
* Changed the way the button is hidden visually in "popup" mode not to create wider pages

### Version 4.0.3
* Fixed bug in using role description as a class name for menuitem
* Fixed bug in setting `menuTextColor` property.
* Updated documentation.

### Version 4.0.2
* Changed landmarks from using the tag name in the class list to custom skip-to prefixed tag name.
* Fixed bug when no landmarks or headings found.
* Simplified color configuration options.

### Version 3.1.4
* Fixed Joomla configuration option.
* Added _m_ of _n_ to landmark and heading group labels.

### Version 3.1.3
* Added "fixed" to the `displayOptions` customization.

### Version 3.1.2
* Fixed bug in moving focus for landmarks.

### Version 3.1.1
* Changed "Important" to "Selected" landmarks and headings.

### Version 3.1

* Added `aria-label` for action menu items to make the label screen reader friendly
* For heading menuitems, use `aria-label` to make the label more like a screen reader
* Use element names as landmark labels instead of landmark names
* Support `aria-roledescription` for labeling landmark roles in menu
* Nested landmarks and header levels are indented
* Added actions to toggle between "Important" and "All" landmarks and headings.
* Added additional keyboard shortcuts in the menu based on heading level.
* Added more information about accesskey in help.
* Fixed bugs in 3.0

### Version 3.0

* Removed id selector options, if ids are needed they could be added to the landmarks selector
* Removed need to call initialization function
* Removed support for Internet Explorer
* Improved code readability and ARIA support, by removing complexity needed to support Internet Explorer
* Improved configuration of button and menu labeling
* Add configuration of button and menu colors, without adding a stylesheet
* Update the landmarks and headings in the menu by querying the DOM every time the menu is opened
* Reduced markup conflicts by using a data attribute rather than an IDREF for targets
* Reduced changes in page markup by only applying tabindex=-1 when focus is moved to a target
* Updated the function for testing if an element is visible

### Version 2.1

* Ignore hidden landmarks and headings, based on:
  * CSS: display: none
  * CSS: visibility: hidden
  * HTML5 hidden attribute
  * ARIA 1.0 aria-hidden=true attribute
  * ARIA 1.0 role=presentation attribute
  * any element that is less than 4 pixels high or wide

### Version 2.0

* Support for HTML5 section elements
* Calculate accessible names for landmarks and headings
* Updated menu to separate headings from landmarks
* Created default for main content
  * main element
  * [role=Main]
* Created default for HTML5 sections
  * nav element
* Updated defaults for landmarks
  * [role=navigation]
  * [role=search]
* Updated defaults for headings
  * h1 element
  * h2 element

## Copyright and license

Copyright 2022, Jon Gunderson, University of Illinois and PayPal under the [BSD license](LICENSE.md).
