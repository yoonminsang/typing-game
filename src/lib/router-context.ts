import { IRouterState } from './types';
import { getPathname, getQuery } from './utils';

class RouterContext {
  state: IRouterState;

  constructor() {
    this.state = {
      pathname: getPathname(),
      query: getQuery(),
      params: {},
      push: (url) => {
        window.history.pushState(null, '', url);
      },
      goBack: () => {},
    };
  }

  public setState(nextState: object) {
    this.state = { ...this.state, ...nextState };
  }
}

export { RouterContext };
export default new RouterContext();
