'use strict';

class ChangePassword {
  get rules() {
    return {
      oldPassword: 'min:4',
      password: 'confirmed:confirmPassword|required_if:oldPassword|min:4',
      password_confirmation: 'same:password|min:4',
    };
  }
}

module.exports = ChangePassword;
