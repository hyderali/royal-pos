import Component from '@glimmer/component';

interface PantStickerArgs {
  item: {
    size: string;
    fit: string;
    price: string;
  };
  index: number;
  length: number;
}

export default class PantSticker extends Component<PantStickerArgs> {
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