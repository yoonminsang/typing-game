import { getByText } from '@testing-library/dom';
import '@testing-library/jest-dom';
import Button from '.';

const CONST = '버튼';

const renderComplex = () => {
  const defaultButton = () => {
    const { body } = document;
    new Button(body, { text: CONST });
    return getByText(body, CONST);
  };
  const aButton = () => {
    const { body } = document;
    new Button(body, { text: CONST, href: '/' });
    return getByText(body, CONST);
  };
  return { defaultButton, aButton };
};

describe('button', () => {
  it('should render default component', () => {
    const { defaultButton, aButton } = renderComplex();
    expect(defaultButton()).toBeInTheDocument();
    expect(aButton()).toBeInTheDocument();
  });

  it('snapshot', () => {
    const { defaultButton, aButton } = renderComplex();
    expect(defaultButton()).toMatchSnapshot();
    expect(aButton()).toMatchSnapshot();
  });
});
