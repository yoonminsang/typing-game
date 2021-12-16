import Component from '@/lib/component';
import { useHistory } from '@/lib/routerHooks';
import Button from '../common/button';
import './style.css';

class Complete extends Component {
  setup() {
    this.history = useHistory();
    const score = sessionStorage.getItem('score');
    const average = sessionStorage.getItem('average');
    if (!score || !average) {
      this.history.push('/');
    }
    this.state = { score, average };
    sessionStorage.removeItem('score');
    sessionStorage.removeItem('average');
  }

  markup() {
    const { score, average } = this.state;
    return /* html */ `
    <main class="complete">
      <h2>Mission Complete!</h2>
      <div class="score">당신의 점수는 <b>${score}점</b>입니다.</div>
      <div class="average">단어당 평균 답변 시간은 <b>${average}초</b>입니다.</div>
      <inside class="button-again-inside"></inside>
    </main>
    `;
  }

  appendComponent(target: HTMLElement | DocumentFragment) {
    const $againButton = target.querySelector('.button-again-inside') as HTMLElement;
    new Button($againButton, { text: '다시 시작', class: 'js-btn-again' });
  }

  setEvent() {
    this.addEvent('click', '.js-btn-again', () => {
      sessionStorage.setItem('again', 'true');
      this.history?.push('/');
    });
  }
}

export default Complete;
