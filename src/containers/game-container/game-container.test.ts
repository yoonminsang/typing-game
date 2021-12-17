import { queryByText, fireEvent } from '@testing-library/dom';
// import userEvent from '@testing-library/user-event';
import { IWord } from '@/types/words';
import GameContainer from '.';
import { GAME_HELP_MESSAGE } from '@/constants';

jest.useFakeTimers();

const BTN_INITIAL = '초기화';
const BTN_START = '시작';

const mockWords: IWord[] = [
  {
    second: 10,
    text: 'hello',
  },
  {
    second: 5,
    text: 'world',
  },
];

const renderComplex = () => {
  const $div = document.createElement('div');
  const container = new GameContainer($div);
  const game = () => $div.querySelector('.game');
  const form = () => $div.querySelector('form') as HTMLFormElement;
  const initialButton = () => queryByText($div, BTN_INITIAL);
  const startButton = () => queryByText($div, BTN_START);

  // getwords 모킹 바꿀까?? axios 모킹하고 에러도 처리
  const onClickInitialButton = async () => {
    container.setState({ words: mockWords, isStart: true, round: 1, score: mockWords.length });
  };

  const round = (num: number) => queryByText($div, `${num} 라운드`);
  const timer = (num: number) => queryByText($div, `남은 시간 : ${num}`);
  const score = (num: number) => queryByText($div, `점수 : ${num}`);
  const text = (str: string) => queryByText($div, str);
  const message = (str: string) => queryByText($div, str);
  const input = () => $div.querySelector('input') as HTMLInputElement;

  // TODO: 왜 안될까?? 아얘 input 이벤트가 발생을 안해
  const onInput = (str: string) => {
    // userEvent.type(input(), str);
    // fireEvent.change(input(), str);
    container.onChange(str);
  };

  const onSubmit = () => {
    fireEvent.submit(form());
  };

  return {
    game,
    initialButton,
    startButton,
    onClickInitialButton,
    round,
    timer,
    score,
    text,
    message,
    input,
    onInput,
    onSubmit,
    form,
  };
};

beforeEach(() => {
  window.sessionStorage.clear();
  jest.restoreAllMocks();
  jest.spyOn(global, 'setInterval');
  window.history.pushState(null, '', '/');
});

describe('game-container', () => {
  it('should render default component', () => {
    const { game, initialButton, startButton } = renderComplex();
    expect(game()).not.toBeNull();
    expect(startButton()).not.toBeNull();
    expect(initialButton()).toBeNull();
  });

  it('should render component when start', () => {
    const { game, initialButton, startButton, onClickInitialButton, round, timer, score, text } = renderComplex();
    expect(game()).not.toBeNull();
    expect(startButton()).not.toBeNull();
    expect(initialButton()).toBeNull();
    onClickInitialButton();
    expect(game()).not.toBeNull();
    expect(startButton()).toBeNull();
    expect(initialButton()).not.toBeNull();
    expect(round(1)).not.toBeNull();
    expect(timer(mockWords[0].second)).not.toBeNull();
    expect(score(mockWords.length)).not.toBeNull();
    expect(text(mockWords[0].text)).not.toBeNull();
  });

  it('should update onchange(input)', () => {
    const { onClickInitialButton, input, onInput } = renderComplex();
    onClickInitialButton();
    onInput('a');
    expect(input().value).toBe('a');
  });

  it('case help message', () => {
    const { onClickInitialButton, onInput, message, onSubmit } = renderComplex();
    onClickInitialButton();
    onInput('a');
    expect(message(GAME_HELP_MESSAGE.wrongChange)).not.toBeNull();
    onSubmit();
    expect(message(GAME_HELP_MESSAGE.wrongSubmit)).not.toBeNull();
    onInput(mockWords[0].text);
    expect(message(GAME_HELP_MESSAGE.correctChange)).not.toBeNull();
  });

  it('correct submit word', () => {
    const { onClickInitialButton, onInput, onSubmit, round, score, text, timer } = renderComplex();
    onClickInitialButton();
    onInput(mockWords[0].text);
    onSubmit();
    expect(round(2)).not.toBeNull();
    expect(score(mockWords.length)).not.toBeNull();
    expect(timer(mockWords[1].second)).not.toBeNull();
    expect(text(mockWords[1].text)).not.toBeNull();
  });

  it('submit success and next round', () => {
    const { onClickInitialButton, onInput, onSubmit, round, score, text, timer, message } = renderComplex();
    onClickInitialButton();
    onInput(mockWords[0].text);
    onSubmit();
    expect(round(2)).not.toBeNull();
    expect(score(mockWords.length)).not.toBeNull();
    expect(timer(mockWords[1].second)).not.toBeNull();
    expect(text(mockWords[1].text)).not.toBeNull();
    expect(message(GAME_HELP_MESSAGE.correctChange)).toBeNull();
  });

  it('score 1 average 1 game end', () => {
    const { onClickInitialButton, onInput, onSubmit } = renderComplex();
    onClickInitialButton();
    jest.advanceTimersByTime(1000);
    onInput(mockWords[0].text);
    onSubmit();
    jest.advanceTimersByTime(6000);
    expect(sessionStorage.getItem('score')).toBe('1');
    expect(sessionStorage.getItem('average')).toBe('1');
    expect(window.location.pathname).toBe('/complete');
  });

  it('score 0 game end', () => {
    const { onClickInitialButton } = renderComplex();
    onClickInitialButton();
    jest.runAllTimers();
    expect(sessionStorage.getItem('score')).toBe('0');
    expect(sessionStorage.getItem('average')).toBe('Infinity');
    expect(window.location.pathname).toBe('/complete');
  });

  it('snapshot', () => {
    const { game, onClickInitialButton } = renderComplex();
    expect(game()).toMatchSnapshot();
    onClickInitialButton();
    expect(game()).toMatchSnapshot();
  });
});
