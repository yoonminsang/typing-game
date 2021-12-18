import Loader from '.';

const renderComplex = () => {
  const { body } = document;
  new Loader(body);
  const svg = () => body.querySelector('svg');
  return { svg };
};

describe('loader', () => {
  it('should render default component', () => {
    const { svg } = renderComplex();
    expect(svg()).toBeInTheDocument();
  });

  it('snapshot', () => {
    const { svg } = renderComplex();
    expect(svg()).toMatchSnapshot();
  });
});
