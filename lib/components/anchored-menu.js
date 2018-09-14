import { MDCMenu } from '@material/menu';

export class AnchoredMenuComponent {
  constructor(menu) {
    this.$menu = $(menu);
    this.menu = new MDCMenu(this.$menu[0]);
    this.$trigger = $(this.$menu.data('menu-trigger'));
    this.$trigger.on('click', (evt) => {
      this.menu.open = !this.menu.open;
    });
  }
}
