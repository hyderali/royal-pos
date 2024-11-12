import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class PrintStickerController extends Controller {
  @action
  print() {
    window.print();
  }
}