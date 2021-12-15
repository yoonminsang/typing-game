import { getPathname, getQuery } from './utils';

type TState = Record<string, any>;

interface IState {
  pathname: string;
  query: TState;
  params: TState;
  push: (pathname: string) => void;
  goBack: () => void;
}

class RouterContext {
  state: IState;

  constructor() {
    this.state = { pathname: getPathname(), query: getQuery(), params: {}, push: () => {}, goBack: () => {} };
  }

  public setState(nextState: object) {
    this.state = { ...this.state, ...nextState };
  }
}

export { RouterContext };
export default new RouterContext();
