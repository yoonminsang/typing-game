import NotFound from '.';

const renderComplex = () => {
  const $div = document.createElement('div');
  new NotFound($div);
  const notFound = () => $div.querySelector('.not-found');
  return { notFound };
};

describe('notFound', () => {
  it('should render default component', () => {
    const { notFound } = renderComplex();
    expect(notFound()).not.toBeNull();
  });

  it('snapshot', () => {
    const { notFound } = renderComplex();
    expect(notFound()).toMatchSnapshot();
  });
});
