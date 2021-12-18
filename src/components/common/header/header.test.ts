import { getByText } from '@testing-library/dom';
import Header from '.';

const renderComplex = () => {
  const { body } = document;
  new Header(body);
  const header = () => body.querySelector('.header');
  const h1 = () => getByText(body, '카카오페이 타자 게임');
  return { header, h1 };
};

describe('header', () => {
  it('should render default component', () => {
    const { header, h1 } = renderComplex();
    expect(header()).toBeInTheDocument();
    expect(h1()).toBeInTheDocument();
  });

  it('snapshot', () => {
    const { header } = renderComplex();
    expect(header()).toMatchSnapshot();
  });
});
