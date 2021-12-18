import flushPromises from 'flush-promises';
import MockAdapter from 'axios-mock-adapter';
import { queryByText, fireEvent } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
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
  const { body } = document;
  const $div = document.createElement('div');
  body.innerHTML = '';
  body.appendChild($div);
  new GameContainer($div);
  const game = () => body.querySelector('.game');
  const form = () => body.querySelector('form') as HTMLFormElement;
  const initialButton = () => queryByText(body, BTN_INITIAL) as HTMLElement;
  const startButton = () => queryByText(body, BTN_START) as HTMLElement;

  const onClickStartButton = () => {
    mock.onGet('kakaopay-fe/resources/words').reply(200, mockWords);
    userEvent.click(startButton());
  };

  const onClickStartButtonFail = () => {
    mock.onGet('kakaopay-fe/resources/words').reply(500);
    userEvent.click(startButton());
  };

  const onClickInitialButton = () => {
    fireEvent.click(initialButton());
  };

  const round = (num: number) => queryByText(body, `${num} 라운드`);
  const timer = (num: number) => queryByText(body, `남은 시간 : ${num}`);
  const score = (num: number) => queryByText(body, `점수 : ${num}`);
  const text = (str: string) => queryByText(body, str);
  const message = (str: string) => queryByText(body, str);
  const input = () => body.querySelector('input') as HTMLInputElement;

  const onInput = (str: string) => {
    userEvent.type(input(), str);
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

const renderSession = () => {
  sessionStorage.setItem('again', 'true');
  mock.onGet('kakaopay-fe/resources/words').reply(200, mockWords);
  const { body } = document;
  const $div = document.createElement('div');
  body.innerHTML = '';
  body.appendChild($div);
  new GameContainer($div);
  const initialButton = () => queryByText(body, BTN_INITIAL) as HTMLElement;
  const startButton = () => queryByText(body, BTN_START) as HTMLElement;
  return { initialButton, startButton };
};

beforeEach(() => {
  jest.restoreAllMocks();
  jest.useFakeTimers();
  jest.spyOn(window, 'setInterval');
  window.sessionStorage.clear();
  window.history.pushState(null, '', '/');
  mock.reset();
});

describe('game-container', () => {
  it('should render default component', () => {
    const { game, initialButton, startButton } = renderComplex();
    expect(game()).toBeInTheDocument();
    expect(startButton()).toBeInTheDocument();
    expect(initialButton()).not.toBeInTheDocument();
  });

  it('should render component when start', async () => {
    const { game, initialButton, startButton, onClickStartButton, round, timer, score, text } = renderComplex();
    expect(game()).toBeInTheDocument();
    expect(startButton()).toBeInTheDocument();
    expect(initialButton()).not.toBeInTheDocument();
    onClickStartButton();
    await flushPromises();
    expect(game()).toBeInTheDocument();
    expect(startButton()).not.toBeInTheDocument();
    expect(initialButton()).toBeInTheDocument();
    expect(round(1)).toBeInTheDocument();
    expect(timer(mockWords[0].second)).toBeInTheDocument();
    expect(score(mockWords.length)).toBeInTheDocument();
    expect(text(mockWords[0].text)).toBeInTheDocument();
  });

  it('should start because of session', async () => {
    const { initialButton, startButton } = renderSession();
    await flushPromises();
    expect(startButton()).not.toBeInTheDocument();
    expect(initialButton()).toBeInTheDocument();
  });

  it('fail axios', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    const { onClickStartButtonFail } = renderComplex();
    onClickStartButtonFail();
    await flushPromises();
    expect(window.alert).toBeCalledWith(AXIOS_ERROR);
  });

  it('click initial button, should render default component', async () => {
    const { onClickStartButton, onClickInitialButton, initialButton, startButton } = renderComplex();
    expect(startButton()).toBeInTheDocument();
    expect(initialButton()).not.toBeInTheDocument();
    onClickStartButton();
    await flushPromises();
    expect(startButton()).not.toBeInTheDocument();
    expect(initialButton()).toBeInTheDocument();
    onClickInitialButton();
    expect(startButton()).toBeInTheDocument();
    expect(initialButton()).not.toBeInTheDocument();
  });

  it('should update onchange(input)', async () => {
    const { onClickStartButton, input, onInput } = renderComplex();
    onClickStartButton();
    await flushPromises();
    onInput('a');
    expect(input().value).toBe('a');
  });

  it('case help message', async () => {
    const { onClickStartButton, onInput, message, onSubmit } = renderComplex();
    onClickStartButton();
    await flushPromises();
    onInput('a');
    expect(message(GAME_HELP_MESSAGE.wrongChange)).toBeInTheDocument();
    onSubmit();
    expect(message(GAME_HELP_MESSAGE.wrongSubmit)).toBeInTheDocument();
    onInput(mockWords[0].text);
    expect(message(GAME_HELP_MESSAGE.correctChange)).toBeInTheDocument();
  });

  it('correct submit word', async () => {
    const { onClickStartButton, onInput, onSubmit, round, score, text, timer } = renderComplex();
    onClickStartButton();
    await flushPromises();
    onInput(mockWords[0].text);
    onSubmit();
    expect(round(2)).toBeInTheDocument();
    expect(score(mockWords.length)).toBeInTheDocument();
    expect(timer(mockWords[1].second)).toBeInTheDocument();
    expect(text(mockWords[1].text)).toBeInTheDocument();
  });

  it('submit success and next round', async () => {
    const { onClickStartButton, onInput, onSubmit, round, score, text, timer, message } = renderComplex();
    onClickStartButton();
    await flushPromises();
    onInput(mockWords[0].text);
    onSubmit();
    expect(round(2)).toBeInTheDocument();
    expect(score(mockWords.length)).toBeInTheDocument();
    expect(timer(mockWords[1].second)).toBeInTheDocument();
    expect(text(mockWords[1].text)).toBeInTheDocument();
    expect(message(GAME_HELP_MESSAGE.correctChange)).not.toBeInTheDocument();
  });

  it('score 2 average 1.5 game end', async () => {
    const { onClickStartButton, onInput, onSubmit } = renderComplex();
    onClickStartButton();
    await flushPromises();
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
    onClickStartButton();
    await flushPromises();
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
    onClickStartButton();
    await flushPromises();
    jest.runAllTimers();
    expect(sessionStorage.getItem('score')).toBe('0');
    expect(sessionStorage.getItem('average')).toBe('Infinity');
    expect(window.location.pathname).toBe('/complete');
  });

  it('snapshot', async () => {
    const { game, onClickStartButton } = renderComplex();
    expect(game()).toMatchSnapshot();
    onClickStartButton();
    await flushPromises();
    expect(game()).toMatchSnapshot();
  });
});
