import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class SalesController extends Controller {
  @service session;
  @tracked errorMessage = '';
}