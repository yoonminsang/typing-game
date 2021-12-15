import Component from '@/lib/component';
import './style.css';

class NotFound extends Component {
  markup() {
    return /* html */ `
    <div class="not-found">
      <span>404</span>
      <span>Not Found</span>
    </div>
    `;
  }
}

export default NotFound;
