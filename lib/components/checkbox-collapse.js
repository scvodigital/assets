import { MDCCheckbox } from '@material/checkbox';

export class CheckboxCollapseComponent {
  constructor(parent) {
    this.$parent = $(parent);
    this.collapseName = this.$parent.data('checkbox-collapse');
    this.$triggers = $('[data-checkbox-collapse-trigger="' + this.collapseName + '"]');
    this.collapsed = true;

    this.$parent.on('click', (evt) => {
      this.collapsed = !this.collapsed;
      this.refresh();
    });

    this.$triggers.on('click', (evt) => {
      this.collapsed = !this.collapsed;
      this.refresh();
    });

    this.refresh();
  }

  refresh() {
    if (this.collapsed) {
      $('[data-checkbox-collapse-parent="' + this.collapseName + '"] input[type="checkbox"]:not(:checked), [data-checkbox-collapse-parent="' + this.collapseName + '"][data-checkbox-collapse-always-hide] input[type="checkbox"]').each((i, o) => {
        $(o).parents('[data-checkbox-collapse-parent]').hide();
      });
      this.$parent.parents('.mdc-list-group')
        .removeClass('not-collapsed')
        .addClass('collapsed');
      this.$triggers.find('.fas, .far').removeClass('fa-chevron-up').addClass('fa-ellipsis-h');
    } else {
      $('[data-checkbox-collapse-parent="' + this.collapseName + '"] input[type="checkbox"]:not(:checked), [data-checkbox-collapse-parent="' + this.collapseName + '"][data-checkbox-collapse-always-hide] input[type="checkbox"]').each((i, o) => {
        $(o).parents('[data-checkbox-collapse-parent]').show();
      });
      this.$parent.parents('.mdc-list-group')
        .removeClass('collapsed')
        .addClass('not-collapsed');
      this.$triggers.find('.fas, .far').removeClass('fa-ellipsis-h').addClass('fa-chevron-up');
    }
  }
}