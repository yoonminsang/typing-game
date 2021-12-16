import { getByText } from '@testing-library/dom';
import Header from '.';

const renderComplex = () => {
  const $div = document.createElement('div');
  new Header($div);
  const header = () => $div.querySelector('.header');
  const h1 = () => getByText($div, '카카오페이 타자 게임');
  return { header, h1 };
};

describe('header', () => {
  it('should render default component', () => {
    const { header, h1 } = renderComplex();
    expect(header()).not.toBeNull();
    expect(h1()).not.toBeNull();
  });

  it('snapshot', () => {
    const { header } = renderComplex();
    expect(header()).toMatchSnapshot();
  });
});
