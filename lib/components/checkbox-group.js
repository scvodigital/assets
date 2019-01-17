import { MDCCheckbox } from '@material/checkbox';

export class CheckboxGroupComponent {
  get selectionState() {
    const total = this.$children.length;
    const checked = $('[data-checkbox-group-parent="' + this.groupName + '"]:checked').length;
    if (total === checked) {
      return 'all';
    } else if (checked === 0) {
      return 'none';
    } else {
      return 'some';
    }
  }

  constructor(parent) {
    this.$parent = $(parent);
    this.groupName = this.$parent.data('checkbox-group');
    this.parentCheckbox = new MDCCheckbox(this.$parent[0]);

    this.refreshChildren();
    this.refreshParent();

    this.$parent.on('change', (evt) => {
      if (this.selectionState === 'all') {
        this.$children.prop('checked', false);
      } else {
        this.$children.prop('checked', true);
      } 
      this.refreshParent();
    });
  }

  refreshChildren() {
    if (this.$children) {
      this.$children.off('change.checkboxGroup');
    }
    this.$children = $('[data-checkbox-group-parent="' + this.groupName + '"]');
    this.$children.on('change.checkboxGroup', (evt) => {
      this.refreshParent();
    });
  }

  refreshParent() {
    switch(this.selectionState) {
      case('all'): 
        this.parentCheckbox.indeterminate = false; 
        this.parentCheckbox.checked = true; 
        break;
      case('none'):
        this.parentCheckbox.indeterminate = false; 
        this.parentCheckbox.checked = false; 
      break;
      case('some'):
        this.parentCheckbox.indeterminate = true; 
      break;
    }
  }
}