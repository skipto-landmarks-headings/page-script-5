# Version history for SkipTo.js

## Version 5.8.3
* Fixes bug with hidden heading message not being hidden in some cases
* FIxes bug with keyboard navigation when focus is on the menu button

## Version 5.8.2
* Fixes bug in menu when the landmarks or headings are clipped
* Removed numbers from heading and landmark group labels in the menu, screen readers already have the information

## Version 5.8.1
* Fixes bug in reference to WCAG 2.4.1 in information dialog
* Added privacy statement to information dialog

## Version 5.8.0
* Improves labels for group labels for headings and landmarks
* Added 'landmarkOneGroupLabel' and 'headingOneGroupLabel' properties to configuration
* Changed default headers to be any h1 or h2 on the page
* Exclude SkipTo.js components from analysis
* New option to exclude landmarks without accessible names if there are more than 3 landmarks of that type (default is to exclude), this mimics screen reader behaviors
* Update accessible name calculation to exclude hidden :before and :after content
* Fixed bug in accessible name identification for including headings in menu (Issue #37)

## Version 5.7.5
* Fixing bug in banner and contentinfo navigation in menu (Issue #31)
* Configuration option for changing the border and offset for highlighting elements
* Added border style configuration to highlighting elements
* Fixed ID bug in menu

## Version 5.7.4
* Added support for dark mode in highlight overlay
* Improved programmatic constant management in source code
* Updated some of the custom element names
* Updated FAQ and home page

## Version 5.7.3
* Disabled support for dark mode in overlays

## Version 5.7.2
* Added about SkipTo.js button and dialog to menu
* Added support for night color scheme
* Added support for forced-colors: active media query

## Version 5.7.1
* Fixed bug with shortcut navigation getting stuck in "Skip To Content" button

## Version 5.7
* Added keyboard shortcuts for navigation to landmark regions and headings
* Fixed bug with 'main-only' option for headings
* Updates headings group label when all headings are in the main region
* Added information on the number of landmark regions and headings into the group label
* Added hidden heading message when a heading gets focus but is not visible
* Updated i18n in extensions to include initial values of labels and messsages

## Version 5.6.3
* Changed default highlight option to be 'instant' instead of 'none'
* Updated illinois configuration to have highlight option be 'none'
* Updated highlight div creation to be dynamic and CSS for styling

## Version 5.6.2
* Changed default highlight option to be 'disabled', added 'smooth' and 'instant' to replace 'enabled' option

## Version 5.6.1
* Added doc-order option for use in browser extensions only
* Added focus and setfocus features to skip-to-content element to support browser extensions
* Added popup-border displayOption to make the bottom border of the button visible when it does not have focus

## Version 5.6.0
* Updated button label configuration to simplify options in SkipTo.js browser extensions
* To support i18n a label for "shortcut" is added to configuration options
* aria-label for button is now computed using buttonLabel, altLabel, optionLabel and shortcutLabel
* Extensions version 1.01 to include configuration of i18n options for the SkipTo.js button and menu.
* Removed the four to eight bottom pixels (responsive to screen width) of the button show in the "popup" configuration so that a pointer can expose the entire SkipTo button on hover.  The feature disrupted the visual rendering and people I talked to wanted it to be an add-in rather than default.

## Version 5.5.2
* Update button menu not to use a html template for wider website support for extensions

## Version 5.5.1
* Updated data-skipto attribute changes to also update the stylesheet
* Version 1.0 of extensions for Opera, Chrome and Firefox

## Version 5.5
* Implemented custom element (e.g. skip-to-content) to contain button and menu
* Updated default colors for skipto button and menu
* Added web browser add-ons and extension support
* Fixed bug in traversing DOM with custom elements
* Deprecated 'attachElement' property due to new highlight behavior, menu is always visible
* Updated "main" value for headings to "main-only", "main" will still work for backward compatibility to clarify the function

## Version 5.4.1
* Improved highlighting to provide more contrast for the highlight border

## Version 5.4.0
* Added feature to scroll the page to the target when the corresponding  menu item receives focus or is hovered.
* Default 'displayOption' is changed from 'static' to 'fixed'.
* New option 'highlightTarget' add with the default value of 'enabled'.
* The four to eight bottom pixels (responsive to screen width) of the button show in the "popup" configuration so that a pointer can expose the entire SkipTo button on hover

## Version 5.3.2
* Removing pointer event fixed a undesirable behavior of focus not being on the first item if the mouse pointer happened to be in the menu when it opened in chrome
* Also minor update to hover styling in the menu to remove border

## Version 5.3.1
* Disable shortcut when focus is in text input element (e.g. textarea or input)

## Version 5.3.0
* In small screen mode use text instead of an image for the button label
* Deprecated configuration of shortcut key due to internationalization issues

## Version 5.2.1
* Fixed bug when some font families were causing text to wrap for heading levels in the menu

## Version 5.2.0
* Added `data-scripto` attribute support for the author to configure `skipto.js` features.

## Version 5.1.6
* Fixed bug in looking for headings outside the main landmark, if no headings were found in the main landmark and added additional console warning messages.  NOTE: In the default configuration, SkipTo.js looks for headings only in the main landmark, but if none are found it will look for any headings on the page.

## Version 5.1.5
* Fixed bug in detecting if SkipTo is already load, sends warning to console if loaded more than once

## Version 5.1.4
* Fixed bug in accessible name calculation for images included in heading contents for Firefox browser

## Version 5.1.3
* Minor edits to license to make version authorship clearer.
* Restore `containerElement` configuration option to allow the author to use SkipTo without creating a navigation landmark.

## Version 5.1.2
* Fixed bug computing accessible name when CSS ::before or ::after is used.

## Version 5.1.1
* Fixed typo in complementary landmark selector.

## Version 5.1.0
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

## Version 5.0.1
* Unify shortcut key to be consistent between browsers and to support screen reader users using the shortcut by changing the shortcut to use Javascript rather than the HTML `accesskey` attribute.
* Support a scrollable menu if the list of menu items does not fit in the current window size.
* Removed tooltip and added the shortcut key information to the button label to simplify the identification of the shortcut key.
* Fix bug in not moving focus to "hidden" elements.
* Fixes bug with Safari visual rendering of the menu item with focus.
* Deprecates "All headings" and "All landmarks" option to reduce code and configuration complexity
* Simplifies configuration object

## Version 4.1.6
* Revert the changes from 4.1.4

## Version 4.1.5
* Corrects packaging error in 4.1.4

## Version 4.1.4
* Fixes problem in failure to create the SkipTo menu due to invalid configuration

## Version 4.1.3
* Region landmarks must have an accessible name to be included as a landmark in the SkipTo menu to comply with ARIA specification for landmark regions, and will region landmarks be included after complementary landmarks in the SkipTo menu.
* Updated landmark prefixes in menu to align with actual ARIA role names with the following changes:
  * `header:` => `banner`
  * `footer:` => `contentinfo`
  * `aside:` => `complementary`

## Version 4.1.2
* Added <code>aria-busy="true"</code> attribute to menu element when SkipTo is initialized and being updated with new menu items to support validators looking for required menu items for the <code>menu</code> role.
* Added the <em>optional</em> <code>aria-controls</code> attribute to button element to reference the <code>id</code> of the menu element as defined in the W3C ARIA Authoring practices for [menu button pattern](https://w3c.github.io/aria-practices/#menubutton).

## Version 4.1.1
* Removed <code>aria-describedby</code> from button, since screen readers read the <code>accesskey</code> information.

## Version 4.1
* Added feature for the <kbd>escape</kbd> key to hide tooltip when focus is on button.
* Added new properties to set font family and font size.
* Adding CSS properties to the <code>.label</code> and <code>.level</code> class so the inherited values from <code>[role="menuitem"]</code> are not overridden as easily by other stylesheets used on a page.
* Updated moving focus to improve moving focus to visible targets within landmarks.
* Fixed broken shortcut keys in the menu

## Version 4.0.5
* Fixes a problem introduced in version 4.0.4 when button tooltip was updated, restores support for `buttonTitle` and `buttonTitleWithAccesskey` configuration properties.

## Version 4.0.4
* Popup tooltip shows accesskey to open menu when button on hover or focus.
* Popup tooltip is only displayed when a known accesskey is supported by the browser and device operating system.
* Popup tooltip supports high contrast operating system settings.
* Action menu items are disabled by default.
* M of N items in landmark or heading list is disabled by default.
* CDN reference to `skipto.min.js` is now available from University of Illinois.
* Changed the way the button is hidden visually in "popup" mode not to create wider pages

## Version 4.0.3
* Fixed bug in using role description as a class name for menuitem
* Fixed bug in setting `menuTextColor` property.
* Updated documentation.

## Version 4.0.2
* Changed landmarks from using the tag name in the class list to custom skip-to prefixed tag name.
* Fixed bug when no landmarks or headings found.
* Simplified color configuration options.

## Version 3.1.4
* Fixed Joomla configuration option.
* Added _m_ of _n_ to landmark and heading group labels.

## Version 3.1.3
* Added "fixed" to the `displayOptions` customization.

## Version 3.1.2
* Fixed bug in moving focus for landmarks.

## Version 3.1.1
* Changed "Important" to "Selected" landmarks and headings.

## Version 3.1

* Added `aria-label` for action menu items to make the label screen reader friendly
* For heading menuitems, use `aria-label` to make the label more like a screen reader
* Use element names as landmark labels instead of landmark names
* Support `aria-roledescription` for labeling landmark roles in menu
* Nested landmarks and header levels are indented
* Added actions to toggle between "Important" and "All" landmarks and headings.
* Added additional keyboard shortcuts in the menu based on heading level.
* Added more information about accesskey in help.
* Fixed bugs in 3.0

## Version 3.0

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

## Version 2.1

* Ignore hidden landmarks and headings, based on:
  * CSS: display: none
  * CSS: visibility: hidden
  * HTML5 hidden attribute
  * ARIA 1.0 aria-hidden=true attribute
  * ARIA 1.0 role=presentation attribute
  * any element that is less than 4 pixels high or wide

## Version 2.0

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

Copyright 2022, 2023, 2024, 2025 Jon Gunderson under the [BSD license](LICENSE.md).

Copyright 2021 University of Illinois and PayPal under the [BSD license](LICENSE.md).
