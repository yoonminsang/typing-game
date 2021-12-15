import Input from '.';

const CONST = '인풋';

const renderComplex = () => {
  const $div = document.createElement('div');
  new Input($div, { value: CONST });
  const input = () => $div.querySelector('input');
  const value = () => input()?.value;
  return { input, value };
};

describe('input', () => {
  it('should render default component', () => {
    const { input, value } = renderComplex();
    expect(value()).toBe(CONST);
    expect(input()).not.toBeNull();
  });

  it('snapshot', () => {
    const { input } = renderComplex();
    expect(input()).toMatchSnapshot();
  });
});
