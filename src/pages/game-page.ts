import Header from '@/components/common/header';
import GameContainer from '@/containers/game-container';
import Component from '@/lib/component';

class GamePage extends Component {
  markup() {
    return /* html */ `
    <div class="wrapper">
      <inside class="header-inside"></inside>
      <inside class="game-container-inside"></inside>
    </div>
    `;
  }

  appendComponent(target: HTMLElement | DocumentFragment) {
    const $header = target.querySelector('.header-inside') as HTMLElement;
    const $gameContainer = target.querySelector('.game-container-inside') as HTMLElement;
    new Header($header);
    new GameContainer($gameContainer);
  }
}

export default GamePage;
