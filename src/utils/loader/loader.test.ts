import { addLoader } from '.';

const requestEvent = new CustomEvent('request');
const requestEndEvent = new CustomEvent('request-end');

describe('add-loader', () => {
  it('toggle class after dispatch event', () => {
    const $div = document.createElement('div');
    addLoader($div);
    window.dispatchEvent(requestEvent);
    expect($div.classList.contains('show')).toBeTruthy();
    window.dispatchEvent(requestEndEvent);
    expect($div.classList.contains('show')).not.toBeTruthy();
  });
});
