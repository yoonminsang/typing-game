import Component from '@/lib/component';
import './style.css';

class Input extends Component {
  markup() {
    const { type, value, placeholder, maxlength, required } = this.props;
    return /* html */ `
    <input class="input" type="${type}" value="${value}" placeholder="${placeholder || ''}" maxlength="${
      maxlength || ''
    }" ${required ? 'required' : ''}>
    `;
  }
}

export default Input;
