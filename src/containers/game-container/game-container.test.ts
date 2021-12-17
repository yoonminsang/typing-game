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
    second: 10,
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

  it('snapshot', () => {
    const { game, onClickInitialButton } = renderComplex();
    expect(game()).toMatchSnapshot();
    onClickInitialButton();
    expect(game()).toMatchSnapshot();
  });
});
