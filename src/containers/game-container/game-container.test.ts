import MockAdapter from 'axios-mock-adapter';
import { queryByText, fireEvent } from '@testing-library/dom';
// import userEvent from '@testing-library/user-event';
import axiosInstance from '@/utils/api/axios-instance';
import { IWord } from '@/types/words';
import GameContainer from '.';
import { AXIOS_ERROR, GAME_HELP_MESSAGE } from '@/constants';

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

const mock = new MockAdapter(axiosInstance, { onNoMatch: 'throwException' });

const renderComplex = () => {
  const $div = document.createElement('div');
  const container = new GameContainer($div);
  const game = () => $div.querySelector('.game');
  const form = () => $div.querySelector('form') as HTMLFormElement;
  const initialButton = () => queryByText($div, BTN_INITIAL) as HTMLElement;
  const startButton = () => queryByText($div, BTN_START) as HTMLElement;

  // TODO
  const onClickStartButton = async () => {
    mock.onGet('kakaopay-fe/resources/words').reply(200, mockWords);
    // fireEvent.click(startButton());
    // userEvent.click(startButton());
    await container.getWords();
  };

  const onClickStartButtonFail = async () => {
    mock.onGet('kakaopay-fe/resources/words').reply(500);
    // fireEvent.click(startButton());
    // userEvent.click(startButton());
    await container.getWords();
  };

  const onClickInitialButton = () => {
    fireEvent.click(initialButton());
  };

  const round = (num: number) => queryByText($div, `${num} 라운드`);
  const timer = (num: number) => queryByText($div, `남은 시간 : ${num}`);
  const score = (num: number) => queryByText($div, `점수 : ${num}`);
  const text = (str: string) => queryByText($div, str);
  const message = (str: string) => queryByText($div, str);
  const input = () => $div.querySelector('input') as HTMLInputElement;

  // TODO
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
    onClickStartButton,
    onClickStartButtonFail,
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

beforeAll(() => {
  jest.useFakeTimers();
});

beforeEach(() => {
  jest.restoreAllMocks();
  jest.spyOn(window, 'setInterval');
  window.sessionStorage.clear();
  window.history.pushState(null, '', '/');
  mock.reset();
});

describe('game-container', () => {
  it('should render default component', () => {
    const { game, initialButton, startButton } = renderComplex();
    expect(game()).not.toBeNull();
    expect(startButton()).not.toBeNull();
    expect(initialButton()).toBeNull();
  });

  it('should render component when start', async () => {
    const { game, initialButton, startButton, onClickStartButton, round, timer, score, text } = renderComplex();
    expect(game()).not.toBeNull();
    expect(startButton()).not.toBeNull();
    expect(initialButton()).toBeNull();
    await onClickStartButton();
    expect(game()).not.toBeNull();
    expect(startButton()).toBeNull();
    expect(initialButton()).not.toBeNull();
    expect(round(1)).not.toBeNull();
    expect(timer(mockWords[0].second)).not.toBeNull();
    expect(score(mockWords.length)).not.toBeNull();
    expect(text(mockWords[0].text)).not.toBeNull();
  });

  it('fail axios', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    const { onClickStartButtonFail } = renderComplex();
    await onClickStartButtonFail();
    expect(window.alert).toBeCalledWith(AXIOS_ERROR);
  });

  it('click initial button, should render default component', async () => {
    const { onClickStartButton, onClickInitialButton, initialButton, startButton } = renderComplex();
    expect(startButton()).not.toBeNull();
    expect(initialButton()).toBeNull();
    await onClickStartButton();
    expect(startButton()).toBeNull();
    expect(initialButton()).not.toBeNull();
    onClickInitialButton();
    expect(startButton()).not.toBeNull();
    expect(initialButton()).toBeNull();
  });

  it('should update onchange(input)', async () => {
    const { onClickStartButton, input, onInput } = renderComplex();
    await onClickStartButton();
    onInput('a');
    expect(input().value).toBe('a');
  });

  it('case help message', async () => {
    const { onClickStartButton, onInput, message, onSubmit } = renderComplex();
    await onClickStartButton();
    onInput('a');
    expect(message(GAME_HELP_MESSAGE.wrongChange)).not.toBeNull();
    onSubmit();
    expect(message(GAME_HELP_MESSAGE.wrongSubmit)).not.toBeNull();
    onInput(mockWords[0].text);
    expect(message(GAME_HELP_MESSAGE.correctChange)).not.toBeNull();
  });

  it('correct submit word', async () => {
    const { onClickStartButton, onInput, onSubmit, round, score, text, timer } = renderComplex();
    await onClickStartButton();
    onInput(mockWords[0].text);
    onSubmit();
    expect(round(2)).not.toBeNull();
    expect(score(mockWords.length)).not.toBeNull();
    expect(timer(mockWords[1].second)).not.toBeNull();
    expect(text(mockWords[1].text)).not.toBeNull();
  });

  it('submit success and next round', async () => {
    const { onClickStartButton, onInput, onSubmit, round, score, text, timer, message } = renderComplex();
    await onClickStartButton();
    onInput(mockWords[0].text);
    onSubmit();
    expect(round(2)).not.toBeNull();
    expect(score(mockWords.length)).not.toBeNull();
    expect(timer(mockWords[1].second)).not.toBeNull();
    expect(text(mockWords[1].text)).not.toBeNull();
    expect(message(GAME_HELP_MESSAGE.correctChange)).toBeNull();
  });

  it('score 2 average 1.5 game end', async () => {
    const { onClickStartButton, onInput, onSubmit } = renderComplex();
    await onClickStartButton();
    jest.advanceTimersByTime(1000);
    onInput(mockWords[0].text);
    onSubmit();
    jest.advanceTimersByTime(2000);
    onInput(mockWords[1].text);
    onSubmit();
    expect(sessionStorage.getItem('score')).toBe('2');
    expect(sessionStorage.getItem('average')).toBe('1.5');
    expect(window.location.pathname).toBe('/complete');
  });

  it('score 1 average 1 game end', async () => {
    const { onClickStartButton, onInput, onSubmit } = renderComplex();
    await onClickStartButton();
    jest.advanceTimersByTime(1000);
    onInput(mockWords[0].text);
    onSubmit();
    jest.advanceTimersByTime(5000);
    expect(sessionStorage.getItem('score')).toBe('1');
    expect(sessionStorage.getItem('average')).toBe('1');
    expect(window.location.pathname).toBe('/complete');
  });

  it('score 0 game end', async () => {
    const { onClickStartButton } = renderComplex();
    await onClickStartButton();
    jest.runAllTimers();
    expect(sessionStorage.getItem('score')).toBe('0');
    expect(sessionStorage.getItem('average')).toBe('Infinity');
    expect(window.location.pathname).toBe('/complete');
  });

  it('snapshot', async () => {
    const { game, onClickStartButton } = renderComplex();
    expect(game()).toMatchSnapshot();
    await onClickStartButton();
    expect(game()).toMatchSnapshot();
  });
});
