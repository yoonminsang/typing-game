import Router from './lib/router';
import NotFoundPage from './pages/not-found-page';
import { IRoute } from './types/route';
import { addLoader } from './utils/loader';

class App {
  target: HTMLElement;
  routes: IRoute[];
  NotFoundPage: any;

  constructor(target: HTMLElement) {
    this.target = target;
    this.routes = [];
    this.NotFoundPage = NotFoundPage;
    this.init();
    this.render();
  }

  init() {
    addLoader();
  }

  render() {
    new Router(this.target, this.routes, this.NotFoundPage);
  }
}

export default App;
