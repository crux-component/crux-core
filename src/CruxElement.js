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
import { h } from './vdom/index';
import { patch, patchInner } from 'incremental-dom';
import { attributeToPropertyName } from './vdom/extract-attributes';
import { isFunction } from './vdom/is-type';

export default class CruxElement extends HTMLElement {

    constructor() {
        super();

        this.useShadowDom = true;
        this.useIdom = true;
        this.$ = {};
        this.slots = {};
        this._visible = true;
        this.test = 'jasim';
    }

    connectedCallback() {
        if (super.connectedCallback) { super.connectedCallback(); }

        let sRoot = this;
        if (this.useShadowDom)
            sRoot = this.attachShadow({ mode: 'open' });
        this.root = sRoot;
        if (this.render !== undefined && typeof this.render == 'function') {
            if (this.useIdom) {
                this.patch()
            }
            else {
                this.render();
            }
        }

        if (this.useShadowDom) {
            this.createShadowElementReferences();
            this.getAvailableSlots();
        }

        this.setAttribute('defined', '');
        this.emit('ready');
        if (this.elementDidRendered) {
            this.elementDidRendered();
        }
    }

    patch() {
        patchInner(this.root, () => {
            const possibleFn = this.render();
            if (isFunction(possibleFn)) {
                possibleFn();
            } else if (Array.isArray(possibleFn)) {
                possibleFn.forEach((fn) => {
                    if (isFunction(fn)) {
                        fn();
                    }
                });
            }
        });
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
        if (super.attributeChangedCallback) { super.attributeChangedCallback(); }
        let propertyName = attributeToPropertyName(attrName);
        if (propertyName in this && !(propertyName in HTMLElement.prototype)) {
            this[propertyName] = newValue;
        }
    }

    createShadowElementReferences() {
        if (this.shadowRoot) {
            this.$ = {};
            const nodesWithIDs = this.shadowRoot.querySelectorAll('[id]');
            [].forEach.call(nodesWithIDs, node => {
                const id = node.getAttribute('id');
                this.$[id] = node;
            });
        }
    }

    getAvailableSlots() {
        if (this.shadowRoot) {
            this.slots = {};
            const slots = this.shadowRoot.querySelectorAll('slot');
            [].forEach.call(slots, node => {
                const id = node.getAttribute('id') || 'default';
                this.slots[id] = node;
            });
        }
    }

    get defined() {
        return this.hasAttribute('defined') || false;
    }

    emit(name, options = {}) {
        const { detail } = options;
        delete options.detail;

        let e;
        if (Event) {
            e = new Event(name, options);
            Object.defineProperty(e, 'detail', { value: detail });
        }
        else {
            e = document.createEvent('CustomEvent');
            Object.defineProperty(e, 'composed', { value: options.composed });
            e.initCustomEvent(name, options.bubbles, options.cancellable, detail);
        }
        return this.dispatchEvent(e, options);
    }

    update() {
        this.patch();
    }

    set visible(_value) {
        this._visible = _value;
        if (!this._visible) {
            this.style.display = 'none';
        }
        else {
            this.style.display = '';
        }
        this.test = 'Test Changed';
        this.update();
    }

    get visible() {
        return this._visible || true;
    }

    render() {
        return [
            <style>
                {`:host {background-color: yellow;color: black;display: block;}`}
            </style>,
            <div onClick={() => {
                this.test = 'jksdhfjksdhf';
                this.patch();
                console.log(this.$);
                console.log(this.slots);
                console.log('Workd');
                this.emit('abc', { detail: 34 });
            } }>
                <div id="test">gjhgjhghjghgj</div>
            </div>,
            <slot></slot>,
            <div>{this.test}</div>
        ];
    }
}

customElements.define('crux-test', CruxElement);