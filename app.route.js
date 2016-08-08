var base = new Route('/', "BaseController", 'index.html');
base.add('/user', 'UserController', 'user.html');
base.add('/profile', 'ProfileController', 'profile.html');
