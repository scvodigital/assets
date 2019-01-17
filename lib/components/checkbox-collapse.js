import { MDCCheckbox } from '@material/checkbox';

export class CheckboxCollapseComponent {
  constructor(parent) {
    this.$parent = $(parent);
    this.collapseName = this.$parent.data('checkbox-collapse');
    this.$parentIcon = this.$parent.find('.fas, .far');
    this.collapsed = true;

    this.$parent.on('click', (evt) => {
      if (!this.collapsed) {
        this.$parentIcon
          .removeClass('fa-eye-slash')
          .addClass('fa-eye');
        $('[data-checkbox-collapse-parent="' + this.collapseName + '"] input[type="checkbox"]:not(:checked)').each((i, o) => {
          $(o).parents('[data-checkbox-collapse-parent]').hide();
        });
        this.collapsed = true;
      } else {
        this.$parentIcon
          .removeClass('fa-eye')
          .addClass('fa-eye-slash');
        $('[data-checkbox-collapse-parent="' + this.collapseName + '"] input[type="checkbox"]:not(:checked)').each((i, o) => {
          $(o).parents('[data-checkbox-collapse-parent]').show();
        });
        this.collapsed = false;
      }
    });
  }
}