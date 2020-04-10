'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Favorite extends Model {
  /**
   * A favorite is for a tweet.
   *
   * @method tweet
   *
   */
  tweet() {
    return this.belongsTo('App/Models/Tweet');
  }

  /**
   * A favorite is for a user.
   *
   * @method user
   *
   * @return {Object}
   */
  user() {
    return this.belongsTo('App/Models/User');
  }
}

module.exports = Favorite;
