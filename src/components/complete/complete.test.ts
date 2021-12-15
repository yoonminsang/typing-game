import { getByText } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import Complete from '.';

const renderComplex = () => {
  const $div = document.createElement('div');
  sessionStorage.setItem('score', '1');
  sessionStorage.setItem('average', '2');
  new Complete($div);
  const complete = () => $div.querySelector('.complete');
  const score = () => getByText($div, '1점');
  const average = () => getByText($div, '2초');
  const button = () => getByText($div, '다시 시작');
  const onClick = () => userEvent.click(button());
  return { complete, score, average, button, onClick };
};

const renderSessionEmpty = () => {
  const $div = document.createElement('div');
  new Complete($div);
  return $div;
};

describe('complete', () => {
  it('should render default component', () => {
    const { complete, score, average, button } = renderComplex();
    expect(score()).not.toBeNull();
    expect(average()).not.toBeNull();
    expect(button()).not.toBeNull();
    expect(complete()).not.toBeNull();
  });

  it('should prevent when session empty', () => {
    window.history.pushState(null, '', '/complete');
    expect(window.location.pathname).toBe('/complete');
    renderSessionEmpty();
    expect(window.location.pathname).toBe('/');
  });

  it('should click button', () => {
    window.history.pushState(null, '', '/complete');
    expect(window.location.pathname).toBe('/complete');
    const { onClick } = renderComplex();
    onClick();
    expect(sessionStorage.getItem('again')).toBe('true');
    expect(window.location.pathname).toBe('/');
  });

  it('snapshot', () => {
    const { complete } = renderComplex();
    expect(complete()).toMatchSnapshot();
  });
});
