import Component from '@glimmer/component';

interface PantStickerItem {
  size: string;
  fit: string;
  price: string;
}

interface PantStickerListArgs {
  items: PantStickerItem[];
}

export default class PantStickerList extends Component<PantStickerListArgs> {}