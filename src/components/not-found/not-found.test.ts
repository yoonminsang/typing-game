import NotFound from '.';

const renderComplex = () => {
  const { body } = document;
  new NotFound(body);
  const notFound = () => body.querySelector('.not-found');
  return { notFound };
};

describe('notFound', () => {
  it('should render default component', () => {
    const { notFound } = renderComplex();
    expect(notFound()).toBeInTheDocument();
    expect(notFound()).toBeInTheDocument();
  });

  it('snapshot', () => {
    const { notFound } = renderComplex();
    expect(notFound()).toMatchSnapshot();
  });
});
