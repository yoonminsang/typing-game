import Component from '@/lib/component';
import './style.css';

class Button extends Component {
  markup() {
    const { href, type, text } = this.props;
    return /* html */ `
    ${
      href
        ? /* html */ `<a class="button" href="${href}">${text}</a>`
        : /* html */ `<button class="button" type="${type || 'button'}">${text}</button>`
    }
    `;
  }
}

export default Button;
