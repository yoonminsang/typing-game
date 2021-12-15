import Loader from '.';

const renderComplex = () => {
  const $div = document.createElement('div');
  new Loader($div);
  const svg = () => $div.querySelector('svg');
  return { svg };
};

describe('loader', () => {
  it('should render default component', () => {
    const { svg } = renderComplex();
    expect(svg()).not.toBeNull();
  });

  it('snapshot', () => {
    const { svg } = renderComplex();
    expect(svg()).toMatchSnapshot();
  });
});
