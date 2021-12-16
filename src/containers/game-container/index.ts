import axios from 'axios';
import Component from '@/lib/component';
import { IWord } from '@/types/words';
import { getWordsApi } from '@/utils/api/words';
import { useHistory } from '@/lib/routerHooks';
import Game from '@/components/game';

interface IState {
  isStart: boolean;
  words: IWord[] | null;
  round: number | null;
  score: number | null;
  typing: string;
  message: string;
  text: string;
  second: number | null;
  timer: number | null;
  timeArr: number[];
  timerId: number | null;
}

class GameContainer extends Component {
  setup() {
    this.state = {
      isStart: false,
      words: null,
      round: null,
      score: null,
      typing: '',
      message: '',
      text: null,
      second: null,
      timer: null,
      timeArr: [],
      timerId: null,
    };
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
      clearInterval(timerId as number);
    });
    this.addEvent('submit', '.form-game', async (e: Event) => {
      e.preventDefault();
      const { typing, text, timeArr, second, timer, timerId, round } = this.state as IState;
      if (typing === text) {
        clearInterval(timerId as number);
        const nextAnswerTimerArr = [...(timeArr as number[]), (second as number) - (timer as number)];
        this.setState({ timeArr: nextAnswerTimerArr, round: (round as number) + 1 });
        // (this.target.querySelector('.input-typing') as HTMLInputElement).value = '';
        this.initializeInput();
      } else {
        this.setState({ message: '틀렸어요!! 다시 시도해주세요' });
      }
    });
    this.addEvent('input', '.input-typing', (e: Event) => {
      const { value } = e.target as HTMLInputElement;
      const { text } = this.state as IState;
      this.setState({ typing: value });
      if (value === text) {
        this.setState({ message: '엔터 버튼을 눌러주세요' });
      } else {
        this.setState({ message: '주어진 단어와 달라요' });
      }
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
    if (nextState.words && nextState.round === nextState.words.length + 1) {
      const { score, timeArr } = nextState;
      const average = timeArr.length ? timeArr.reduce((acc, cur) => acc + cur) / timeArr.length : Infinity;
      const history = useHistory();
      sessionStorage.setItem('score', (score as number).toString());
      sessionStorage.setItem('average', average.toString());
      history.push('/complete');
    } else if (state.round !== nextState.round) {
      const { text, second } = (nextState.words as IWord[])[(nextState.round as number) - 1];
      this.initialization(text, second);
    }
  }

  initialization(text: string, second: number) {
    this.setState(
      { typing: '', message: '', text, second, timer: second, timerId: setInterval(() => this.countDown(), 1000) },
      () => this.initializeInput(),
    );
  }

  initializeInput() {
    setTimeout(() => {
      (this.target.querySelector('.input-typing') as HTMLInputElement).value = '';
    });
  }

  async countDown() {
    const { timer, timerId, round, score } = this.state as IState;
    if (timer === 0) {
      clearInterval(timerId as number);
      this.setState({ round: (round as number) + 1, score: (score as number) - 1 });
    } else {
      this.setState({ timer: (timer as number) - 1 });
    }
  }

  async getWords() {
    try {
      const { data: words } = await getWordsApi();
      this.setState({ words, isStart: true, round: 1, score: words.length });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // eslint-disable-next-line no-alert
        alert('데이터를 불러올 수 없습니다. 잠시 후에 시도해주세요');
      }
      console.error(err);
    }
  }
}

export default GameContainer;
