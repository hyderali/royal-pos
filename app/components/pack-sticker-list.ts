import Component from '@glimmer/component';

interface PackStickerItem {
  size: string;
  weight: string;
  pcs: string;
  price: string;
}

interface PackStickerListArgs {
  items: PackStickerItem[];
}

export default class PackStickerList extends Component<PackStickerListArgs> {}