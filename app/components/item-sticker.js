import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class ItemStickerComponent extends Component {
  @service session;

  get isFirstRow() {
    return (this.args.index / 3) < 1;
  }

  get isLastRow() {
    const length = this.args.length;
    const index = this.args.index + 1;
    const maxlen = (Math.floor(length / 3) + 1) * 3;
    return maxlen - index < 3;
  }
}