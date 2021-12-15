import { getByText } from '@testing-library/dom';
import '@testing-library/jest-dom';
import Button from '.';

const CONST = '버튼';

const renderComplex = () => {
  const defaultButton = () => {
    const $div = document.createElement('div');
    new Button($div, { text: CONST });
    return getByText($div, CONST);
  };
  const aButton = () => {
    const $div = document.createElement('div');
    new Button($div, { text: CONST, href: '/' });
    return getByText($div, CONST);
  };
  return { defaultButton, aButton };
};

describe('button', () => {
  it('should render default component', () => {
    const { defaultButton, aButton } = renderComplex();
    expect(defaultButton()).not.toBeNull();
    expect(aButton()).not.toBeNull();
  });

  it('snapshot', () => {
    const { defaultButton, aButton } = renderComplex();
    expect(defaultButton()).toMatchSnapshot();
    expect(aButton()).toMatchSnapshot();
  });
});
