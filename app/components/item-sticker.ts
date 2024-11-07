import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import SessionService from '../services/session';

interface ItemStickerArgs {
  item: {
    SKU: string;
    CF: {
      Design: string;
      Brand: string;
      Size: string;
    };
    Description: string;
    printRate?: number;
  };
  index: number;
  length: number;
}

export default class ItemSticker extends Component<ItemStickerArgs> {
  @service declare session: SessionService;

  get isFirstRow(): boolean {
    return this.args.index / 3 < 1;
  }

  get isLastRow(): boolean {
    const length = this.args.length;
    const index = this.args.index + 1;
    const maxlen = (Math.floor(length / 3) + 1) * 3;
    return maxlen - index < 3;
  }
}