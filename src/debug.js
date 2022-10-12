/*
*   debug.js
*
*   Usage
*     import DebugLogging from './debug.js';
*     const debug = new DebugLogging('myLabel', true); // e.g. 'myModule'
*     ...
*     if (debug.flag) debug.log('myMessage');
*
*   Notes
*     new DebugLogging() - calling the constructor with no arguments results
*                   in debug.flag set to false and debug.label set to 'debug';
*                   constructor accepts 0, 1 or 2 arguments in any order
*                   @param flag [optional] {boolean} - sets debug.flag
*                   @param label [optional] {string} - sets debug.label
*   Properties
*     debug.flag    {boolean} allows you to switch debug logging on or off;
*                   default value is false
*     debug.label   {string} rendered as a prefix to each log message;
*                   default value is 'debug'
*   Methods
*     debug.log        calls console.log with label prefix and message
*                      @param message {object} - console.log calls toString()
*                      @param spaceAbove [optional] {boolean}
*
*     debug.tag        outputs tagName and textContent of DOM element
*                      @param node {DOM node reference} - usually an HTMLElement
*                      @param spaceAbove [optional] {boolean}
*
*     debug.separator  outputs only debug.label and a series of hyphens
*                      @param spaceAbove [optional] {boolean}
*/

export default class DebugLogging {
  constructor (...args) {
    // Default values for cases where fewer than two arguments are provided
    this._flag = false;
    this._label = 'debug';

    // The constructor may be called with zero, one or two arguments. If two
    // arguments, they can be in any order: one is assumed to be the boolean
    // value for '_flag' and the other one the string value for '_label'.
    for (const [index, arg] of args.entries()) {
      if (index < 2) {
        switch (typeof arg) {
          case 'boolean':
            this._flag = arg;
            break;
          case 'string':
            this._label = arg;
            break;
        }
      }
    }
  }

  get flag () { return this._flag; }

  set flag (value) {
    if (typeof value === 'boolean') {
      this._flag = value;
    }
  }

  get label () { return this._label; }

  set label (value) {
    if (typeof value === 'string') {
      this._label = value;
    }
  }

  log (message, spaceAbove) {
    const newline = spaceAbove ? '\n' : '';
    console.log(`${newline}[${this._label}] ${message}`);
  }

  tag (node, spaceAbove) {
    if (node && node.tagName) {
      const text = node.textContent.trim().replace(/\s+/g, ' ');
      this.log(`[${node.tagName}]: ${text.substring(0, 40)}`, spaceAbove);
    }
  }

  separator (spaceAbove) {
    this.log('-----------------------------', spaceAbove);
  }

}
