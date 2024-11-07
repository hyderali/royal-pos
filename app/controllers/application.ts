import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import SessionService from '../services/session';

export default class ApplicationController extends Controller {
  @service declare session: SessionService;

  @tracked canShowStockDD = false;
  @tracked canShowStickersDD = false;

  @action
  showStockDD(): void {
    this.canShowStockDD = !this.canShowStockDD;
    this.canShowStickersDD = false;
  }

  @action
  showStickerDD(): void {
    this.canShowStockDD = false;
    this.canShowStickersDD = !this.canShowStickersDD;
  }

  @action
  closeDropDowns(): void {
    this.canShowStockDD = false;
    this.canShowStickersDD = false;
  }
}