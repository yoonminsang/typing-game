import { queryByText } from '@testing-library/dom';
import { IWord } from '@/types/words';
import GameContainer from '.';

const BTN_INITIAL = '초기화';
const BTN_START = '시작';
const MESSAGE = {
  wrongSubmit: '틀렸어요!! 다시 시도해주세요',
  wrongChange: '주어진 단어와 달라요',
  correctChange: '엔터 버튼을 눌러주세요',
};

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
  const initialButton = () => queryByText($div, BTN_INITIAL);
  const startButton = () => queryByText($div, BTN_START);
  const onClickInitialButton = async () => {
    container.setState({ words: mockWords, isStart: true, round: 1, score: mockWords.length });
  };
  const round = (num: number) => queryByText($div, `${num} 라운드`);
  const timer = (num: number) => queryByText($div, `남은 시간 : ${num}`);
  const score = (num: number) => queryByText($div, `점수 : ${num}`);
  const text = (str: string) => queryByText($div, str);
  const message = (str: string) => queryByText($div, str);
  const input = () => $div.querySelector('input') as HTMLInputElement;
  const onInput = (str: string) => {
    const value = str;
    const { text } = mockWords[0];
    container.setState({ typing: value });
    if (value === text) {
      container.setState({ message: MESSAGE.correctChange });
    } else {
      container.setState({ message: MESSAGE.wrongChange });
    }
  };
  const onSubmit = (str: string) => {
    if (str !== mockWords[0].text) {
      container.setState({ message: MESSAGE.wrongSubmit });
    }
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

  it('case message', () => {
    const { onClickInitialButton, onInput, message, onSubmit } = renderComplex();
    onClickInitialButton();
    onInput('a');
    expect(message(MESSAGE.wrongChange)).not.toBeNull();
    onSubmit('a');
    expect(message(MESSAGE.wrongSubmit)).not.toBeNull();
    onInput(mockWords[0].text);
    expect(message(MESSAGE.correctChange)).not.toBeNull();
  });

  it('snapshot', () => {
    const { game, onClickInitialButton } = renderComplex();
    expect(game()).toMatchSnapshot();
    onClickInitialButton();
    expect(game()).toMatchSnapshot();
  });
});
