'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Reply extends Model {
  /**
   * A reply is to a tweet.
   *
   * @method tweet
   *
   */
  tweet() {
    return this.belongsTo('App/Models/Tweet');
  }

  /**
   * A reply is made by a user.
   *
   * @method user
   *
   */
  user() {
    return this.belongsTo('App/Models/User');
  }
}

module.exports = Reply;
