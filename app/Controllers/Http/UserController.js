'use strict';

const User = use('App/Models/User');
const Hash = use('Hash');
const Tweet = use('App/Models/Tweet');

class UserController {
  /**
   * Handles user signup
   *
   * @method signup
   *
   * @param  {Object} request
   * @param  {Object} auth
   * @param  {Object} response
   *
   */
  async signup({ request, auth, response }) {
    const userExists = await User.findBy('email', request.body.email);

    if (userExists) {
      return response.status(400).json({ error: 'User already exists.' });
    }
    // get user data from signup form
    const userRequest = request.only(['name', 'username', 'email', 'password']);

    try {
      const user = await User.create(userRequest);

      // generate token for user (JWT)
      const token = await auth.generate(user);

      return response.status(200).json({
        status: 'success',
        data: token,
      });
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message:
          'There was a problem creating the user, please try again later.',
      });
    }
  }

  /**
   * Handles user authentication
   *
   * @method login
   *
   * @param  {Object} request
   * @param  {Object} auth
   * @param  {Object} response
   *
   */
  async login({ request, auth, response }) {
    const { email, password } = request.body;

    const token = await auth.attempt(email, password);

    return response.status(200).json({
      status: 'success',
      data: token,
    });
  }

  /**
   * Fetch user and followers tweets
   *
   * @method index
   * @param  {Object} auth
   * @param  {Object} response
   *
   */
  async timeline({ auth, response }) {
    const user = await User.find(auth.current.user.id);

    // get an array of IDs of the user's followers
    const followersIds = await user.following().ids();

    // add the user's ID also to the array
    followersIds.push(user.id);

    const tweets = await Tweet.query()
      .whereIn('user_id', followersIds)
      .with('user')
      .with('favorites')
      .with('replies')
      .fetch();

    return response.status(200).json({
      status: 'success',
      data: tweets,
    });
  }

  /**
   * Get details of the currently authenticated user
   *
   * @method me
   *
   * @param  {Object} auth
   * @param  {Object} response
   *
   */
  async me({ auth, response }) {
    const user = await User.query()
      .where('id', auth.current.user.id)
      .with('tweets', (builder) => {
        builder.with('user');
        builder.with('favorites');
        builder.with('replies');
      })
      .with('following')
      .with('followers')
      .with('favorites')
      .with('favorites.tweet', (builder) => {
        builder.with('user');
        builder.with('favorites');
        builder.with('replies');
      })
      .firstOrFail();

    return response.status(200).json({
      status: 'success',
      data: user,
    });
  }

  /**
   * Update user profile
   *
   * @method updateProfile
   *
   * @param  {Object} request
   * @param  {Object} auth
   * @param  {Object} response
   *
   */
  async updateProfile({ request, auth, response }) {
    try {
      const {
        name,
        username,
        email,
        location,
        bio,
        website_url,
      } = request.body;

      // user currently authenticated
      const { user } = auth.current;

      // check email exits
      if (email !== user.email) {
        const userExits = await User.findBy('email', email);

        if (userExits) {
          return response.status(400).json({
            status: 'error',
            message: 'User already exists',
          });
        }
      }

      user.name = name;
      user.username = username;
      user.email = email;
      user.location = location;
      user.bio = bio;
      user.website_url = website_url;

      await user.save();

      return response.status(200).json({
        status: 'success',
        message: 'Profile updated!',
        data: user,
      });
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message:
          'There was a problem updating profile, please try again later.',
        error,
      });
    }
  }

  /**
   * Change user password
   *
   * @method changePassword
   *
   * @param  {Object} request
   * @param  {Object} auth
   * @param  {Object} response
   *
   */
  async changePassword({ request, auth, response }) {
    const { oldPassword, password } = request.body;

    // user currently authenticated
    const { user } = auth.current;

    // verify if current password matches
    const verifyPassword = await Hash.verify(oldPassword, user.password);

    // display appropriate message
    if (!verifyPassword) {
      return response.status(400).json({
        status: 'error',
        message: 'Current password could not be verified! Please try again.',
      });
    }

    // Create hash new password and save db
    user.password = await Hash.make(password);
    await user.save();

    return response.status(200).json({
      status: 'success',
      message: 'Password updated!',
    });
  }

  /**
   * Show user profile
   *
   * @method showProfile
   *
   * @param  {Object} params
   * @param  {Object} response
   *
   */
  async showProfile({ params, response }) {
    try {
      const user = await User.query()
        .where('username', params.username)
        .with('tweets', (builder) => {
          builder.with('user');
          builder.with('favorites');
          builder.with('replies');
        })
        .with('following')
        .with('followers')
        .with('favorites')
        .with('favorites.tweet', (builder) => {
          builder.with('user');
          builder.with('favorites');
          builder.with('replies');
        })
        .firstOrFail();

      return response.status(200).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      return response.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }
  }

  /**
   * Users to follow
   *
   * @method usersToFollow
   *
   * @param  {Object} auth
   * @param  {Object} response
   *
   */
  async usersToFollow({ auth, response }) {
    // user currently authenticated
    const { user } = auth.current;

    // get the IDs of users the currently authenticated user is already following
    const usersAlreadyFollowing = await user.following().ids();

    // fetch users the currently authenticated user is not already following
    const usersToFollow = await User.query()
      .whereNot('id', user.id)
      .whereNotIn('id', usersAlreadyFollowing)
      .pick(3);

    return response.status(200).json({
      status: 'success',
      data: usersToFollow,
    });
  }

  /**
   * Follow User
   *
   * @method follow
   *
   * @param  {Object} request
   * @param  {Object} auth
   * @param  {Object} response
   *
   */
  async follow({ request, auth, response }) {
    const { userId } = request.body;

    // user currently authenticated
    const { user } = auth.current;

    // add to user followers
    await user.following().attach(userId);

    return response.json({
      status: 'success',
      data: null,
    });
  }

  /**
   * Unfollow User
   *
   * @method unFollow
   *
   * @param  {Object} params
   * @param  {Object} auth
   * @param  {Object} response
   *
   */
  async unFollow({ params, auth, response }) {
    const { id } = params;

    // user currently authenticated
    const { user } = auth.current;

    // remove from user's followers
    await user.following().detach(id);

    return response.status(200).json({
      status: 'success',
      message: 'You are no longer following this user.',
    });
  }
}

module.exports = UserController;
