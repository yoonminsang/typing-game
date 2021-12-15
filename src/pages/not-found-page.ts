import NotFound from '@/components/not-found';
import Component from '@/lib/component';

class NotFoundPage extends Component {
  markup() {
    return /* html */ `
    <div class="wrapper">
      <inside class="not-found-inside"></inside>
    </div>
    `;
  }

  appendComponent(target: HTMLElement | DocumentFragment) {
    const $notFound = target.querySelector('.not-found-inside') as HTMLElement;
    new NotFound($notFound);
  }
}

export default NotFoundPage;
