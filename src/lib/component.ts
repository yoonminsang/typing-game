/* eslint-disable @typescript-eslint/no-unused-vars */

import { IRouterState, TState } from './types';

abstract class Component {
  target: HTMLElement;
  props: TState;
  inside: boolean | undefined;
  state: any;
  history: IRouterState | undefined;

  constructor(target: HTMLElement, props = {}) {
    this.target = target;
    this.props = props;
    this.setup();
    this.render();
    this.componentDidMount();
    this.setEvent();
  }

  public setup() {}

  private render() {
    this.target.innerHTML = this.markup();
    if (this.props?.class) {
      this.addClass();
    }
    this.appendComponent(this.target);
    if (this.target.nodeName === 'INSIDE') {
      this.inside = true;
      this.changeInside();
    }
  }

  private addClass() {
    const el = this.target.firstElementChild;
    const classArr: string[] = this.props.class.split(' ');
    if (el) {
      classArr.forEach((className) => {
        el.classList.add(className);
      });
    }
  }

  private changeInside() {
    const temp = this.target.firstElementChild as HTMLElement;
    this.target.replaceWith(...this.target.childNodes);
    this.target = temp;
  }

  public appendComponent(_newDom: DocumentFragment | HTMLElement) {}

  public componentDidMount() {}

  public componentDidUpdate(state: TState, nextState: TState) {}

  public markup() {
    return '';
  }

  public setEvent() {}

  public addEvent(eventType: string, selector: string, callback: Function) {
    const children = [...this.target.querySelectorAll(selector)] as HTMLElement[];
    const isTarget = (target: HTMLElement) => children.includes(target) || target.closest(selector);
    this.target.addEventListener(eventType, (e) => {
      if (isTarget(e.target as HTMLElement)) {
        callback(e);
      }
    });
  }

  public setState(nextState: TState, cb?: Function) {
    this.componentDidUpdate({ ...this.state }, { ...this.state, ...nextState });
    this.state = { ...this.state, ...nextState };
    this.update();
    if (cb) {
      cb();
    }
  }

  private update() {
    const newMarkup = this.markup();

    const newDom = document.createRange().createContextualFragment(newMarkup);

    this.appendComponent(newDom);

    if (!newDom.firstElementChild) return;
    const newElements = this.inside
      ? [...newDom.firstElementChild.querySelectorAll('*')]
      : [...newDom.querySelectorAll('*')];
    const currentElements = [...this.target.querySelectorAll('*')];

    if (newElements.length !== currentElements.length) {
      this.target.innerHTML = this.inside
        ? [...newDom.firstElementChild.children].map((el) => el.outerHTML).join('')
        : newDom.firstElementChild.outerHTML;
      return;
    }

    for (let i = 0; i < newElements.length; i++) {
      const newEl = newElements[i];
      const curEl = currentElements[i];
      if (newEl.childElementCount !== curEl.childElementCount) {
        this.target.innerHTML = this.inside
          ? [...newDom.firstElementChild.children].map((el) => el.outerHTML).join('')
          : newDom.firstElementChild.outerHTML;
        return;
      }
      if (!newEl.isEqualNode(curEl)) {
        if (newEl.tagName !== curEl.tagName) {
          curEl.replaceWith(newEl);
        } else {
          if (curEl.firstChild?.nodeName === '#text' && newEl.firstChild?.nodeName === '#text') {
            if (curEl.firstChild.nodeValue !== newEl.firstChild.nodeValue) {
              curEl.firstChild.nodeValue = newEl.firstChild.nodeValue;
            }
          } else if (curEl.firstChild?.nodeName === '#text') {
            curEl.removeChild(curEl.firstChild);
          } else if (newEl.firstChild?.nodeName === '#text') {
            const text = document.createTextNode(newEl.firstChild.nodeValue as string);
            curEl.appendChild(text);
          }

          const curAttributes = curEl.attributes;
          const newAttributes = newEl.attributes;

          [...curAttributes].forEach((curAttr) => {
            if (!newAttributes.getNamedItem(curAttr.name)) curEl.removeAttribute(curAttr.name);
          });

          [...newAttributes].forEach((newAttr) => {
            const currentAttribute = curAttributes.getNamedItem(newAttr.name);
            if (!currentAttribute || currentAttribute.value !== newAttr.value)
              curEl.setAttribute(newAttr.name, newAttr.value);
          });
        }
      }
    }
  }
}

export default Component;
