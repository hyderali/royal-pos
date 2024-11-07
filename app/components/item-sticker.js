import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

export default class ItemSticker extends Component {
  @service
  session;

  get isFirstRow() {
    let isFirstRow = this.args.index / 3 < 1;
    return isFirstRow;
  }

  get isLastRow() {
    let length = this.args.length;
    let index = this.args.index + 1;
    let maxlen = (parseInt(length / 3) + 1) * 3;
    let isLastRow = maxlen - index < 3;
    return isLastRow;
  }
}
