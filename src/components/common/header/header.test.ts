import { getByText } from '@testing-library/dom';
import Header from '.';

const renderComplex = () => {
  const $div = document.createElement('div');
  new Header($div);
  const header = () => $div.querySelector('.header');
  const a = () => getByText($div, '카카오페이 타자 게임');
  return { header, a };
};

describe('header', () => {
  it('should render default component', () => {
    const { header, a } = renderComplex();
    expect(header()).not.toBeNull();
    expect(a()).not.toBeNull();
  });

  it('snapshot', () => {
    const { header } = renderComplex();
    expect(header()).toMatchSnapshot();
  });
});
