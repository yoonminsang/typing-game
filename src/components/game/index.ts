import Component from '@/lib/component';
import Button from '../common/button';
import Input from '../common/input';
import './style.css';

interface IProps {
  isStart: boolean;
  round: number;
  score: number;
  typing: string;
  message: string;
  text: string;
  timer: number;
}

class Game extends Component {
  markup() {
    const { isStart, round, score, message, text, timer } = this.props as IProps;

    if (!isStart)
      return /* html */ `
      <main class="game">
        <inside class="button-start-inside"></inside>
      </main class="game">
    `;

    return /* html */ `
    <main class="game">
      <form class="form-game">
        <h2>${round} 라운드</h2>
        <div class="flex">
          <div>남은 시간 : ${timer}</div>
          <div>점수 : ${score}</div>
        </div>
        <div class="text">${text}</div>
        <inside class="input-inside"></inside>
        <div class="error">${message}</div>
        <inside class="button-initial-inside"></inside>
      </form>
    </main>
    `;
  }

  appendComponent(target: HTMLElement | DocumentFragment) {
    const { isStart, typing } = this.props as IProps;
    const btnText = isStart ? '초기화' : '시작';

    const $input = target.querySelector('.input-inside') as HTMLInputElement;
    const $startButton = target.querySelector('.button-start-inside') as HTMLElement;
    const $initialButton = target.querySelector('.button-initial-inside') as HTMLElement;

    if (isStart) {
      new Input($input, {
        placeholder: '위의 단어를 입력하세요',
        required: true,
        value: typing,
        class: 'input-typing',
        type: 'text',
      });
      new Button($initialButton, { text: btnText, class: 'js-btn-initial' });
    } else {
      new Button($startButton, { text: btnText, class: 'js-btn-start' });
    }
  }
}

export default Game;
