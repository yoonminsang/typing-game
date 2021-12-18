import Input from '.';

const CONST = '인풋';

const renderComplex = () => {
  const { body } = document;
  new Input(body, { value: CONST });
  const input = () => body.querySelector('input');
  const value = () => input()?.value;
  return { input, value };
};

describe('input', () => {
  it('should render default component', () => {
    const { input, value } = renderComplex();
    expect(value()).toBe(CONST);
    expect(input()).toBeInTheDocument();
  });

  it('snapshot', () => {
    const { input } = renderComplex();
    expect(input()).toMatchSnapshot();
  });
});
