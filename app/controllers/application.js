import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
export default class ApplicationController extends Controller {
  @service
  session;

  @tracked
  canShowStockDD = false;

  @tracked
  canShowStickersDD = false;

  @action
  showStockDD() {
    if (this.canShowStockDD) {
      this.canShowStockDD = false;
    } else {
      this.canShowStockDD = true;
    }
    this.canShowStickersDD = false;
  }

  @action
  showStickerDD() {
    this.canShowStockDD = false;
    if (this.canShowStickersDD) {
      this.canShowStickersDD = false;
    } else {
      this.canShowStickersDD = true;
    }
  }
  @action
  closeDropDowns() {
    this.canShowStockDD = false;
    this.canShowStickersDD = false;
  }
}
