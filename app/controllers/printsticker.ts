import { action } from '@ember/object';
import Controller from '@ember/controller';

export default class PrintstickerController extends Controller {
  @action
  print(): void {
    window.print();
  }
}