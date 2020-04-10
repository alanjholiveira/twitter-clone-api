'use strict';

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

Route.post('/signup', 'UserController.signup').validator(['Signup']);
Route.post('/login', 'UserController.login').validator(['Login']);

// Account user
Route.group(() => {
  Route.get('/me', 'UserController.me');
  Route.put('/update_profile', 'UserController.updateProfile').validator([
    'UpdateProfile',
  ]);
  Route.put('/change_password', 'UserController.changePassword').validator([
    'ChangePassword',
  ]);
})
  .prefix('account')
  .middleware(['auth']);

// User use auth
Route.group(() => {
  Route.get('/timeline', 'UserController.timeline');
  Route.get('/users_to_follow', 'UserController.usersToFollow');
  Route.post('/follow', 'UserController.follow');
  Route.delete('/unfollow/:id', 'UserController.unFollow');
})
  .prefix('users')
  .middleware(['auth']);

Route.post('/tweet', 'TweetController.store')
  .middleware(['auth'])
  .validator(['Tweet']);
Route.get('/tweets/:id', 'TweetController.show');
Route.post('/tweets/reply/:id', 'TweetController.reply')
  .middleware(['auth'])
  .validator(['TweetReply']);
// Delete tweet
Route.delete('/tweets/destroy/:id', 'TweetController.destroy').middleware([
  'auth',
]);

// tweet reactions
Route.group(() => {
  // favorite tweet
  Route.post('/create', 'FavoriteController.store');
  // unfavorite tweet
  Route.delete('/destroy/:id', 'FavoriteController.unFavorite');
})
  .prefix('favorites')
  .middleware(['auth']);

// User profile
Route.get(':username', 'UserController.showProfile');
