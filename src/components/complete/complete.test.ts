import { getByText } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import Complete from '.';

const renderComplex = () => {
  const { body } = document;
  sessionStorage.setItem('score', '1');
  sessionStorage.setItem('average', '2');
  new Complete(body);
  const complete = () => body.querySelector('.complete');
  const score = () => getByText(body, '1점');
  const average = () => getByText(body, '2초');
  const button = () => getByText(body, '다시 시작');
  const onClick = () => {
    userEvent.click(button());
  };
  return { complete, score, average, button, onClick };
};

const renderSessionEmpty = () => {
  const { body } = document;
  new Complete(body);
};

beforeEach(() => {
  window.history.pushState(null, '', '/complete');
});

describe('complete', () => {
  it('should render default component', () => {
    const { complete, score, average, button } = renderComplex();
    expect(score()).toBeInTheDocument();
    expect(average()).toBeInTheDocument();
    expect(button()).toBeInTheDocument();
    expect(complete()).toBeInTheDocument();
  });

  it('should prevent when session empty', () => {
    renderSessionEmpty();
    expect(window.location.pathname).toBe('/');
  });

  it('should click button', () => {
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
