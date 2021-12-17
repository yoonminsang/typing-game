import axios from 'axios';
import Component from '@/lib/component';
import { IWord } from '@/types/words';
import { getWordsApi } from '@/utils/api/words';
import { useHistory } from '@/lib/routerHooks';
import Game from '@/components/game';
import { AXIOS_ERROR, GAME_HELP_MESSAGE } from '@/constants';

interface IState {
  isStart: boolean;
  words: IWord[];
  round: number;
  score: number;
  typing: string;
  message: string;
  text: string;
  second: number;
  timer: number;
  timeArr: number[];
  timerId: number;
}

class GameContainer extends Component {
  setup() {
    this.state = {
      isStart: false,
      words: [],
      round: -1,
      score: -1,
      typing: '',
      message: '',
      text: '',
      second: -1,
      timer: -1,
      timeArr: [],
      timerId: -1,
    };
    this.history = useHistory();
  }

  markup() {
    return /* html */ `
    <inside class="game-inside"></inside>
    `;
  }

  appendComponent(target: HTMLElement | DocumentFragment) {
    const { isStart, round, score, message, text, timer, typing } = this.state as IState;
    const $game = target.querySelector('.game-inside') as HTMLElement;
    new Game($game, { isStart, round, score, message, text, timer, typing });
  }

  setEvent() {
    this.addEvent('click', '.js-btn-start', () => {
      this.getWords();
    });
    this.addEvent('click', '.js-btn-initial', () => {
      const { timerId } = this.state as IState;
      this.setState({ isStart: false });
      clearInterval(timerId);
    });
    this.addEvent('submit', '.form-game', async (e: Event) => {
      e.preventDefault();
      this.onSubmit();
    });
    this.addEvent('input', '.input-typing', (e: Event) => {
      this.onChange((e.target as HTMLInputElement).value);
    });
  }

  componentDidMount() {
    const again = sessionStorage.getItem('again');
    if (again) {
      this.getWords();
      sessionStorage.removeItem('again');
    }
  }

  componentDidUpdate(state: IState, nextState: IState): void {
    if (nextState.round === nextState.words.length + 1) {
      this.gameEnd(nextState);
    } else if (state.round !== nextState.round) {
      const { text, second } = nextState.words[nextState.round - 1];
      this.initialization(text, second);
    }
  }

  gameEnd(nextState: IState) {
    const { score, timeArr } = nextState;
    const average = timeArr.length ? timeArr.reduce((acc, cur) => acc + cur) / timeArr.length : Infinity;
    sessionStorage.setItem('score', score.toString());
    sessionStorage.setItem('average', average.toString());
    this.history?.push('/complete');
  }

  onSubmit() {
    const { typing, text, timeArr, second, timer, timerId, round } = this.state as IState;
    if (typing === text) {
      clearInterval(timerId);
      const nextTimeArr = [...timeArr, second - timer];
      this.setState({ timeArr: nextTimeArr, round: round + 1, typing: '' });
    } else {
      this.setState({ message: GAME_HELP_MESSAGE.wrongSubmit, typing: '' });
    }
  }

  onChange(value: string) {
    const { text } = this.state as IState;
    this.setState({ typing: value });
    if (value === text) {
      this.setState({ message: GAME_HELP_MESSAGE.correctChange });
    } else {
      this.setState({ message: GAME_HELP_MESSAGE.wrongChange });
    }
  }

  initialization(text: string, second: number) {
    this.setState({
      typing: '',
      message: '',
      text,
      second,
      timer: second,
      timerId: setInterval(() => this.countDown(), 1000),
    });
  }

  countDown() {
    const { timer, timerId, round, score } = this.state as IState;
    if (timer === 1) {
      clearInterval(timerId);
      this.setState({ round: round + 1, score: score - 1 });
    } else {
      this.setState({ timer: timer - 1 });
    }
  }

  async getWords() {
    try {
      const { data: words } = await getWordsApi();
      this.setState({ words, isStart: true, round: 1, score: words.length });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // eslint-disable-next-line no-alert
        alert(AXIOS_ERROR);
      }
      console.error(err);
    }
  }
}

export default GameContainer;
