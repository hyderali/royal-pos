import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class AppMainComponent extends Component {
  @action
  handleClick(event) {
    if (event.srcElement.attributes['data-toggle']?.value !== 'dropdown') {
      this.args.closeDropDowns();
    }
  }
}
