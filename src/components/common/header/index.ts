import Component from '@/lib/component';
import './style.css';

class Header extends Component {
  markup() {
    return /* html */ `
    <header class="header">
      <h1>카카오페이 타자 게임</h1>
    </header>
    `;
  }
}

export default Header;
