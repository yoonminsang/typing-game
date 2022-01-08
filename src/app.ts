import Router from './lib/router';
import { ClassContructor, IRoute } from './lib/types';
import CompletePage from './pages/complete-page';
import GamePage from './pages/game-page';
import NotFoundPage from './pages/not-found-page';
import { addLoader } from './utils/loader';

class App {
  target: HTMLElement;
  loaderTarget: HTMLElement;
  routes: IRoute[];
  NotFoundPage: ClassContructor;

  constructor(target: HTMLElement, loaderTarget: HTMLElement) {
    this.target = target;
    this.loaderTarget = loaderTarget;
    this.routes = [
      { path: '/', component: GamePage },
      { path: '/complete', component: CompletePage },
    ];
    this.NotFoundPage = NotFoundPage;
    this.init();
    this.render();
  }

  init() {
    addLoader(this.loaderTarget);
  }

  render() {
    new Router(this.target, this.routes, this.NotFoundPage);
  }
}

export default App;
