import Component from '@glimmer/component';

interface PackStickerArgs {
  item: {
    size: string;
    weight: string;
    pcs: string;
    price: string;
  };
  index: number;
  length: number;
}

export default class PackSticker extends Component<PackStickerArgs> {
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