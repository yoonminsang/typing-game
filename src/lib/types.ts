export type TState = Record<string, any>;

export interface IRouterState {
  pathname: string;
  query: TState;
  params: TState;
  push: (pathname: string) => void;
  goBack: () => void;
}
