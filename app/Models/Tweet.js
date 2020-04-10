'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Tweet extends Model {
  /**
   * A tweet belong to a user.
   *
   * @method user
   *
   */
  user() {
    return this.belongsTo('App/Models/User');
  }

  /**
   * A tweet can have as many replies as possible.
   *
   * @method replies
   *
   */
  replies() {
    return this.hasMany('App/Models/Reply');
  }

  /**
   * A tweet can have as many favorites.
   *
   * @method favorites
   *
   */
  favorites() {
    return this.hasMany('App/Models/Favorite');
  }
}

module.exports = Tweet;
