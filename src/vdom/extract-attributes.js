/**
 * Copyright (c) 2016 - 2017
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this 
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify, merge, 
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons 
 * to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies 
 * or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING 
 * BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
 * OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
'use strict';

const propertyNamesToAttributes = {};
const attributesToPropertyNames = {};

/**
 * @param {HTMLElement} element
 */
export function extractAttributes(element) {

}

/**
 * Convert a camel case fooBar property name to a hyphenated foo-bar attribute.
 * @param {String} propertyName
 * @returns {String} attributeName
 */
export function propertyNameToAttribute(propertyName) {
    let attribute = propertyNamesToAttributes[propertyName];
    if (!attribute) {
        const regEx = /([A-Z])/g;
        attribute = propertyName.replace(regEx, '-$1').toLowerCase();
    }
    return attribute;
}

/**
 * Converts hypernated foo-bar attribute to camel case fooBar property name
 * @param {String} attributeName
 * @param {String} propertyName
 */
export function attributeToPropertyName(attributeName) {
    let propertyName = attributesToPropertyNames[attributeName];
    if (!propertyName) {
        const regEx = /-([a-z])/g;
        propertyName = attributeName.replace(regEx, match => match[1].toUpperCase());
        attributesToPropertyNames[attributeName] = propertyName;
    }
    return propertyName;
}