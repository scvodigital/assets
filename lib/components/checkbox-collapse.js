import { MDCCheckbox } from '@material/checkbox';

export class CheckboxCollapseComponent {
  constructor(parent) {
    this.$parent = $(parent);
    this.collapseName = this.$parent.data('checkbox-collapse');
    this.$parentIcon = this.$parent.find('.fas, .far');
    this.collapsed = false;

    this.$parent.on('click', (evt) => {
      this.toggle();
    });

    this.toggle();
  }

  toggle() {
    if (!this.collapsed) {
      this.$parentIcon
        .removeClass('fa-eye-slash')
        .addClass('fa-eye');
      $('[data-checkbox-collapse-parent="' + this.collapseName + '"] input[type="checkbox"]:not(:checked), [data-checkbox-collapse-parent="' + this.collapseName + '"][data-checkbox-collapse-always-hide] input[type="checkbox"]').each((i, o) => {
        $(o).parents('[data-checkbox-collapse-parent]').hide();
      });
      this.collapsed = true;
    } else {
      this.$parentIcon
        .removeClass('fa-eye')
        .addClass('fa-eye-slash');
      $('[data-checkbox-collapse-parent="' + this.collapseName + '"] input[type="checkbox"]:not(:checked), [data-checkbox-collapse-parent="' + this.collapseName + '"][data-checkbox-collapse-always-hide] input[type="checkbox"]').each((i, o) => {
        $(o).parents('[data-checkbox-collapse-parent]').show();
      });
      this.collapsed = false;
    }
  }
}