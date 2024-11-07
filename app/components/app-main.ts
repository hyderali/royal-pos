import Component from '@glimmer/component';
import { action } from '@ember/object';

interface AppMainArgs {
  closeDropDowns: () => void;
}

export default class AppMain extends Component<AppMainArgs> {
  @action
  handleClick(event: MouseEvent): void {
    const target = event.srcElement as HTMLElement;
    if (target.getAttribute('data-toggle') !== 'dropdown') {
      this.args.closeDropDowns();
    }
  }
}