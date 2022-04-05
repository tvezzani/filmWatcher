# FilmWatcher
An app to make a watchlist all of your favorite movies.

# Routes
a. Get library
    This endpoint returns the general movie library or in other words the movies in the 
    database that have been set as 'approved' by an administrator.

b. Get movie details 
    This endpoint recieves a movie object ID from the request and returns the corresponding 
    movie object from the database. The movie must have been approved by an administrator.

c. Get user watch list
    This endpoint requires a user to be logged in. The server returns an array of movie objects 
    corresponding to that user's watch list.

d. Add movie to watch list
    This endpoint requires a user to be logged in. The server should receive a movie object ID.
    The ID will be added to the user's watch list on the database. 

e. Remove movie from watch list
    This endpoint requires a user to be logged in. The server should receive a movie ID. 
    The movie with the corresponding ID will be removed from the user's watch list on the 
    database.

f. Clear watch list
    This endpoint requires a user to be logged in. The server will empty all the movie IDs 
    from the user's watch list on the database.

g. Login
    This endpoint expects a request with an email and a password in plaintext. A user with an 
    email corresponding to the email from the request is searched for and found in the database.
    The password from the request is hashed and compared to the password saved to the database. 
    If the passwords match, the email and corresponding user ID are then signed to a JSON web 
    token. This web token is returned.

h. Logout
    This endpoint requires a user to be logged in. The server will return an expired JSON 
    web token.

i. Sign up
    This endpoint expects a request with a name, email and password. The user is created on 
    the database.

j. Add movie
    This endpoint expects a logged in user. This server should receive a movie object. If the 
    user is an administrator, the movie will then be added to the movie library. If the user 
    is not an administrator, the movie will be marked as not approved and await approval from an 
    administrator prior to be added to the general library.

k. Delete movie
    This endpoint expects a logged in user that is an administrator. The server expects a 
    movie object ID. If the user is an administrator, the movie will then be removed from 
    the movie library on the database.

l. Update movie
    This endpoint expects a logged in user that is an administrator. The server expects a 
    movie object and a movie object ID. The movie will be updated in the movie library on 
    the database.

m. Approve movie suggestion
    This endpoint expects a logged in user that is an administrator. The server should 
    recieve a movie object ID. The movie on the database with the corresponding ID will 
    be added to the general movie library.

n. Deny movie suggestion
    This endpoint expects a logged in user that is an administrator. The server should 
    recieve a movie object ID. The movie on the database with the corresponding ID will 
    be deleted from the database.

o. Get list of movie suggestions
    This endpoint expects a logged in user that is an administrator. The server will return 
    all movie objects from the database that have not been approved.

p. Get movie favorites
    This endpoint requires a user to be logged in. The server returns an array of movie objects 
    corresponding to that user's favorites.

q. Add movie to favorites
    This endpoint requires a user to be logged in. The server should receive a movie object ID.
    The ID will be added to the user's favorites list in the database. 

r. Remove from favorites
    This endpoint requires a user to be logged in. The server should receive a movie ID. 
    The movie with the corresponding ID will be removed from the user's favorites list 
    in the database.

s. Clear favorites
    This endpoint requires a user to be logged in. The server will empty all the movie IDs 
    from the user's favorites list in the database.
