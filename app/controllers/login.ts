import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class LoginController extends Controller {
  declare model: {
    username?: string;
    password?: string;
    error?: string;
  };

  @action
  loginC(event: Event): void {
    event.preventDefault();
    this.send('login');
  }
}