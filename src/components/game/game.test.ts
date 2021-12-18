import { getByText } from '@testing-library/dom';
import Game from '.';

const BTN_INITIAL = '초기화';
const BTN_START = '시작';
const TYPING = 'typing';
const TEXT = 'text';
const MESSAGE = 'message';

const renderInitial = () => {
  const { body } = document;
  const props = {
    isStart: false,
    round: null,
    score: null,
    typing: '',
    message: '',
    text: null,
    timer: null,
  };
  new Game(body, props);
  const game = () => body.querySelector('.game');
  const button = () => getByText(body, BTN_START);
  return { game, button };
};

const renderComplex = () => {
  const { body } = document;
  const props = {
    isStart: true,
    round: 1,
    score: 2,
    typing: TYPING,
    message: MESSAGE,
    text: TEXT,
    timer: 4,
  };
  new Game(body, props);
  const game = () => body.querySelector('.game');
  const button = () => getByText(body, BTN_INITIAL);
  const round = () => getByText(body, `${props.round} 라운드`);
  const timer = () => getByText(body, `남은 시간 : ${props.timer}`);
  const score = () => getByText(body, `점수 : ${props.score}`);
  const text = () => getByText(body, props.text);
  const message = () => getByText(body, props.message);
  const input = () => body.querySelector('input') as HTMLInputElement;
  return { game, button, round, timer, score, text, message, input };
};

describe('game', () => {
  it('should render default component', () => {
    const { game, button } = renderInitial();
    expect(game()).toBeInTheDocument();
    expect(button()).toBeInTheDocument();
  });

  it('should render start component', () => {
    const { game, button, round, timer, score, text, message, input } = renderComplex();
    expect(game()).toBeInTheDocument();
    expect(button()).toBeInTheDocument();
    expect(round()).toBeInTheDocument();
    expect(timer()).toBeInTheDocument();
    expect(score()).toBeInTheDocument();
    expect(text()).toBeInTheDocument();
    expect(input()).toBeInTheDocument();
    expect(input().value).toBe(TYPING);
    expect(message()).toBeInTheDocument();
  });

  it('snapshot', () => {
    const { game: initialGame } = renderInitial();
    const { game: complexGame } = renderComplex();
    expect(initialGame()).toMatchSnapshot();
    expect(complexGame()).toMatchSnapshot();
  });
});
