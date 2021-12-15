import Header from '@/components/common/header';
import Complete from '@/components/complete';
import Component from '@/lib/component';

class CompletePage extends Component {
  markup() {
    return /* html */ `
    <div class="wrapper">
      <inside class="header-inside"></inside>
      <inside class="complete-inside"></inside>
    </div>
    `;
  }

  appendComponent(target: HTMLElement | DocumentFragment) {
    const $header = target.querySelector('.header-inside') as HTMLElement;
    const $complete = target.querySelector('.complete-inside') as HTMLElement;
    new Header($header);
    new Complete($complete);
  }
}

export default CompletePage;
