import { getByText } from '@testing-library/dom';
import Game from '.';

const BTN_INITIAL = '초기화';
const BTN_START = '시작';
const TYPING = 'typing';
const TEXT = 'text';
const MESSAGE = 'message';

const renderInitial = () => {
  const $div = document.createElement('div');
  const props = {
    isStart: false,
    round: null,
    score: null,
    typing: '',
    message: '',
    text: null,
    timer: null,
  };
  new Game($div, props);
  const game = () => $div.querySelector('.game');
  const button = () => getByText($div, BTN_START);
  return { game, button };
};

const renderComplex = () => {
  const $div = document.createElement('div');
  const props = {
    isStart: true,
    round: 1,
    score: 2,
    typing: TYPING,
    message: MESSAGE,
    text: TEXT,
    timer: 4,
  };
  new Game($div, props);
  const game = () => $div.querySelector('.game');
  const button = () => getByText($div, BTN_INITIAL);
  const round = () => getByText($div, `${props.round} 라운드`);
  const timer = () => getByText($div, `남은 시간 : ${props.timer}`);
  const score = () => getByText($div, `점수 : ${props.score}`);
  const text = () => getByText($div, props.text);
  const message = () => getByText($div, props.message);
  const input = () => $div.querySelector('input') as HTMLInputElement;
  return { game, button, round, timer, score, text, message, input };
};

describe('game', () => {
  it('should render default component', () => {
    const { game, button } = renderInitial();
    expect(game()).not.toBeNull();
    expect(button()).not.toBeNull();
  });

  it('should render start component', () => {
    const { game, button, round, timer, score, text, message, input } = renderComplex();
    expect(game()).not.toBeNull();
    expect(button()).not.toBeNull();
    expect(round()).not.toBeNull();
    expect(timer()).not.toBeNull();
    expect(score()).not.toBeNull();
    expect(text()).not.toBeNull();
    expect(input()).not.toBeNull();
    expect(input().value).toBe(TYPING);
    expect(message()).not.toBeNull();
  });

  it('snapshot', () => {
    const { game: initialGame } = renderInitial();
    const { game: complexGame } = renderComplex();
    expect(initialGame()).toMatchSnapshot();
    expect(complexGame()).toMatchSnapshot();
  });
});
