# API Documentation

## Spoti Login

**Request**

- **URL:** `/spoti_login`
- **Method:** `GET`

**Description**

Initiates the Spotify login process and redirects the user to the Spotify authentication page.

**Response**

- **Redirect:** User is redirected to the Spotify authentication page.

## Callback

**Request**

- **URL:** `/callback`
- **Method:** `GET`

**Parameters**

- `code` (string): Authorization code received from Spotify.
- `state` (string): State parameter for security.

**Description**

Handles the callback from Spotify after successful user authentication. Retrieves the access token and user information.

**Response**

- **Success:** User information in JSON format.
- **Failure:** Error message if the token request fails.

## User Registration

**Request**

- **URL:** `/api/register`
- **Method:** `POST`
- **Content-Type:** `application/json`

**Parameters**

- `username` (string): User's username.
- `password` (string): User's password.
- `email` (string): User's email address.
- `birthday` (string): User's birthday.

**Description**

Registers a new user.

**Response**

- **Success:** User registered successfully, public_id in JSON format.
- **Failure:** Error message if registration fails.

## User Login

**Request**

- **URL:** `/api/login`
- **Method:** `POST`
- **Content-Type:** `application/json`

**Parameters**

- `username` (string): User's username.
- `password` (string): User's password.

**Description**

Logs in an existing user and returns an authentication token.

**Response**

- **Success:** User login successful, authentication token in JSON format.
- **Failure:** Error message if login fails.

## Upload Photo

### Request

- **URL:** `/api/upload_photo`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`

**Parameters**

- `photo` (file): The photo file to be uploaded (allowed format: JPEG).
- `username` (string): User's username.

**Description**

Uploads a user's profile photo. Ensure that the request includes a valid photo file and the corresponding username.

**Response**

- **Success:** Message indicating successful photo upload and user profile picture update.
- **Failure:**
  - Error message if the request is invalid or missing parameters.
  - Error message if the file format is not allowed.
  - Error message if the specified user is not found.

**Example Request:**

- POST /api/upload_photo
- Content-Type: multipart/form-data
```json
{
  "photo": "(JPEG file)",
  "username": "example_username"
}
```

## Get Profile Picture

### Request

- **URL:** `/api/profile_picture`
- **Method:** `POST`
- **Content-Type:** `application/json`

**Parameters**

- `username` (string): User's username.

**Description**

Retrieves the profile picture of a user. Ensure that the request includes a valid username.

**Response**

- **Success:** Returns the user's profile picture as a JPEG image.
- **Failure:**
  - Error message if the specified user is not found.
  - Error message if the user's profile picture is not available.

**Example Request:**

- POST /api/profile_picture
- Content-Type: application/json
```json
{
  "username": "example_username"
}
```

## Delete User

**Request**

- **URL:** `/api/user_delete`
- **Method:** `POST`
- **Content-Type:** `application/json`

**Parameters**

- `username` (string): User's username.

**Description**

Deletes an existing user.

**Response**

- **Success:** User successfully deleted.
- **Failure:** Error message if deletion fails.

## Get User Information

**Request**

- **URL:** `/api/user_info`
- **Method:** `POST`
- **Content-Type:** `application/json`

**Parameters**

- `username` (string): User's username.

**Description**

Retrieves information about a user, including follower and following counts.

**Response**

- **Success:** User information in JSON format.
- **Failure:** Error message if user not found.

## Change Password

**Request**

- **URL:** `/api/change_password`
- **Method:** `POST`
- **Content-Type:** `application/json`

**Parameters**

- `username` (string): User's username.
- `old_password` (string): User's old password.
- `new_password` (string): User's new password.

**Description**

Changes the user's password.

**Response**

- **Success:** Password changed successfully.
- **Failure:** Error message if password change fails.

## Add Song

### Request

- **URL:** `/api/add_song`
- **Method:** `POST`
- **Content-Type:** `application/json`

**Parameters (only song_name and username are needed & others are optional)**

- `song_name` (string): The name of the song.
- `username` (string): Username of the user adding the song.
- `length` (string): Length of the song in HH:MM:SS format.
- `tempo` (integer): Tempo of the song.
- `recording_type` (string): Recording type of the song (e.g., 'LIVE', 'STUDIO', 'RADIO').
- `listens` (integer): Number of times the song has been listened to.
- `release_year` (integer): Release year of the song.
- `added_timestamp` (string): Timestamp when the song was added (format: "YYYY-MM-DD HH:MM:SS").
- `username` (string): The username of the user who added the song.
- `album_name` (string): The name of the album that song is within.
- `album_release_year` (integer): Release year of the album song is in.
- `performer_name` (string): The name of the performer.
- `genre` (string): The genre of the song.
- `mood` (string): The 'mood' of the song.
- `instrument` (string): Instrument of the song.

**Description**

Adds a new song to the database.

### Response

- **Success:** Song_name succesfully added by user
  
- **Failure:** 
  - Status Code: 400 Bad Request
  - JSON Object:
    ```json
    {
      "error": "A song name & username has to be given"
    }
    ```
  - Status Code: 400 Bad Request
  - JSON Object:
    ```json
    {
      "error": "Same song exits in the database"
    }
    ```

## Add Songs Batch

### Request

- **URL:** `/api/add_songs_batch`
- **Method:** `POST`
- **Content-Type:** `application/json`

**Parameters**

- `username` (string): The username of the user adding the songs (non-optional!).
- `songs` (list): A list of song objects.

**Song Object Parameters (only song_name is mandatory; others are optional)**

- Same as add_song without the username parameter.

**Example JSON Input**

```json
{
  "username": "JohnDoe",
  "songs": [
    {
      "song_name": "Imagine",
      "length": "04:30",
      "tempo": 120,
      "recording_type": "Studio",
      "listens": 5000,
      "release_year": "1971",
      "added_timestamp": "2023-01-15T12:30:00",
      "album_name": "Imagine",
      "performer_name": "John Lennon",
      "genre": "Rock",
      "mood": "Reflective",
      "instrument": "Piano"
    },
    {
      "song_name": "Bohemian Rhapsody",
      "length": "05:54",
      "tempo": 72,
      "recording_type": "Studio",
      "listens": 10000,
      "release_year": "1975",
      "added_timestamp": "2023-02-10T15:45:00",
      "album_name": "A Night at the Opera",
      "performer_name": "Queen",
      "genre": "Rock",
      "mood": "Epic",
      "instrument": "Guitar"
    }
  ]
}
```

**Description**

Adds multiple songs to the database.

### Response

- **Success:** Song_name succesfully added by user
  
- **Failure:** 
  - Not giving a list i.e empty songs[], no username input, + same errors with add_song

## Add Rate Batch

### Endpoint

`POST /api/user_rate_batch`

### Description
This endpoint allows users to submit batches of ratings for songs, albums, or performers associated with a given username.

### Request 

- `username` (string, required): The username for which the ratings are submitted.
- `ratings` (list, required): A list of rating objects, where each object includes:
- `rating_type` (string, required): The type of rating, which can be one of the following: `song_rate`, `album_rate`, or `performer_rate`.
-  Other parameters specific to the rating type (e.g., `song_name`, `album_name`, `performer_name`).
- `rating` (int, required): The numerical rating assigned to the item.

#### Example JSON Input
```json
{
  "username": "john_doe",
  "ratings": [
    {
      "rating_type": "song_rate",
      "song_name": "Beautiful Song",
      "rating": 4
    },
    {
      "rating_type": "album_rate",
      "album_name": "Awesome Album",
      "rating": 5
    },
    {
      "rating_type": "performer_rate",
      "performer_name": "Talented Artist",
      "rating": 4
    }
  ]
}
```

### Response

- **201 Created**: Successfully added the rating.
```json
{
  "results": [
    {"message": "Rating of type song_rate added successfully by john_doe"},
    {"message": "Rating of type album_rate added successfully by john_doe"},
    {"message": "Rating of type performer_rate added successfully by john_doe"}
  ]
}
```
- **Failure**
  - Not giving a list i.e empty ratings[], no username input, + same errors with user_ratings


## Add User Song Rating

### Endpoint

`POST /api/add_user_song_ratings`

### Description

Adds a user rating for a specific song.

### Request Body

- `username` (string, required): The username of the user submitting the rating.
- `song_name` (string, required): The name of the song for which the user is submitting the rating.
- `rating` (integer, required): Self evident.

### Response

- **201 Created**: Successfully added the song rating.
  - Body: `{"message": "Song rating added successfully by {username}"}`

- **400 Bad Request**: Missing required parameters.
  - Body: `{"message": "Username/song_name/rating are required"}`

## Add User Album Rating

### Endpoint

`POST /api/add_user_album_ratings`

### Description

Adds a user rating for a specific album.

### Request Body

- `username` (string, required): The username of the user submitting the rating.
- `album_name` (string, required): The name of the album for which the user is submitting the rating.
- `rating` (integer, required): Self evident.

### Response

- **201 Created**: Successfully added the album rating.
  - Body: `{"message": "Album rating added successfully by {username}"}`

- **400 Bad Request**: Missing required parameters.
  - Body: `{"message": "Username/album_name/rating are required"}`

## Add User Performer Rating

### Endpoint

`POST /api/add_user_performer_ratings`

### Description

Adds a user rating for a specific performer.

### Request Body

- `username` (string, required): The username of the user submitting the rating.
- `performer_name` (integer, required): The name of the performer for which the user is submitting the rating.
- `rating` (integer, required): Self evident.

### Response

- **201 Created**: Successfully added the performer rating.
  - Body: `{"message": "Performer rating added successfully by {username}"}`

- **400 Bad Request**: Missing required parameters.
  - Body: `{"message": "Username/performer_name/rating are required"}`


## Remove Song

### Request

- **URL:** `/api/remove_song`
- **Method:** `POST`
- **Content-Type:** `application/json`

**Parameters**

- `song_name` (integer): The name of the song to be removed.
- `username` (string): The username of the user removing the song.

**Description**

Removes an existing song from the database.

### Response

- **Success:** 
  - Status Code: 200 OK
  - JSON Object:
    ```json
    {
      "message": "{song_name} removed successfully by {username}"
    }
    ```
- **Failure:** 
  - Status Code: 400 Bad Request
  - JSON Object:
    ```json
    {
      "error": "A song_name has to be given"
    }
    ```
  - Status Code: 404 Not Found
  - JSON Object:
    ```json
    {
      "error": "Song not found"
    }
    ```

## Review User Song Info

**Request**

- **URL:** `/api/user_songs`
- **Method:** `POST`
- **Content-Type:** `application/json`

**Parameters**

- `username` (string): User's username.

**Description**

Retrieves all of the songs a user has added with their info.

**Response**

- **Success:** JSON object containing song info about the songs added by the user.
- **Failure:** Error message if user not found.

## Get User Song Ratings

### Endpoint

`POST /api/user_song_ratings`

### Description

Retrieves all song ratings submitted by a specific user.

### Request Body

- `username` (string, required): The username of the user whose song ratings are being retrieved.

### Response

- **200 OK**: Successfully retrieved user song ratings.
  - Body: `{"user_song_ratings": [{"song_id": <song_id>, "rating": <rating>, "rating_timestamp": <timestamp>}, ...]}`

- **Error**: Username has to be given.

## Get User Album Ratings

### Endpoint

`POST /api/user_album_ratings`

### Description

Retrieves all album ratings submitted by a specific user.

### Request Body

- `username` (string, required): The username of the user whose album ratings are being retrieved.

### Response

- **200 OK**: Successfully retrieved user album ratings.
  - Body: `{"user_album_ratings": [{"album_id": <album_id>, "rating": <rating>,"rating_timestamp": <timestamp>}, ...]}`

- **Error**: Username has to be given.

## Get User Performer Ratings

### Endpoint

`POST /api/user_performer_ratings`

### Description

Retrieves all performer ratings submitted by a specific user.

### Request Body

- `username` (string, required): The username of the user whose performer ratings are being retrieved.

### Response

- **200 OK**: Successfully retrieved user performer ratings.
  - Body: `{"user_performer_ratings": [{"performer_id": <performer_id>, "rating": <rating>,"rating_timestamp": <timestamp>}, ...]}`

- **Error**: Username has to be given.

## User Genre Preferences

### Endpoint

`POST /api/user_genre_preference`

### Description

Retrieves genre preferences based on the songs associated with a specific user.

### Request Body

- `username` (string, required): The username of the user whose performer preferences are being retrieved.

### Response

- **200 OK**: Successfully retrieved user performer preferences.
  - Body: `{"genre": [{"genre": <genre_name>, "count": <song_count>}, ...]}`

- **400 Bad Request**: Username has to be given.
  - Body: `{"error": "A username has to be given"}`

## User Album Preferences

### Endpoint

`POST /api/user_album_preference`

### Description

Retrieves performer preferences based on the songs associated with a specific user.

### Request Body

- `username` (string, required): The username of the user whose performer preferences are being retrieved.

### Response

- **200 OK**: Successfully retrieved user performer preferences.
  - Body: `{"album": [{"album": <album_name>, "count": <song_count>}, ...]}`

- **400 Bad Request**: Username has to be given.
  - Body: `{"error": "A username has to be given"}`

## User Performer Preferences

### Endpoint

`POST /api/user_performer_preference`

### Description

Retrieves performer preferences based on the songs associated with a specific user.

### Request Body

- `username` (string, required): The username of the user whose performer preferences are being retrieved.

### Response

- **200 OK**: Successfully retrieved user performer preferences.
  - Body: `{"performers": [{"performer": <performer_name>, "count": <song_count>}, ...]}`

- **400 Bad Request**: Username has to be given.
  - Body: `{"error": "A username has to be given"}`

## User Followings Genre Preference

### Endpoint

`POST /api/user_followings_genre_preference`

### Description

Retrieves genre preferences based on the songs of users whom the specified user follows.

### Request Body

- `username` (string, required): The username of the user whose followings' genre preferences are being retrieved.

### Response

- **200 OK**: Successfully retrieved user followings genre preferences.
  - Body: `{"genres": [{"genre": <genre_name>, "count": <song_count>}, ...]}`

- **200 OK**: User does not follow anyone.
  - Body: `{"message": "User does not follow anyone"}`

- **400 Bad Request**: Username has to be given.
  - Body: `{"error": "A username has to be given"}`

## User Followings Album Preference

### Endpoint

`POST /api/user_followings_album_preference`

### Description

Retrieves album preferences based on the songs of users whom the specified user follows.

### Request Body

- `username` (string, required): The username of the user whose followings' album preferences are being retrieved.

### Response

- **200 OK**: Successfully retrieved user followings album preferences.
  - Body: `{"albums": [{"album": <album_name>, "count": <song_count>}, ...]}`

- **200 OK**: User does not follow anyone.
  - Body: `{"message": "User does not follow anyone"}`

- **400 Bad Request**: Username has to be given.
  - Body: `{"error": "A username has to be given"}`

## User Followings Performer Preference

### Endpoint

`POST /api/user_followings_performer_preference`

### Description

Retrieves performer preferences based on the songs of users whom the specified user follows.

### Request Body

- `username` (string, required): The username of the user whose followings' performer preferences are being retrieved.

### Response

- **200 OK**: Successfully retrieved user followings performer preferences.
  - Body: `{"performers": [{"performer": <performer_name>, "count": <song_count>}, ...]}`

- **200 OK**: User does not follow anyone.
  - Body: `{"message": "User does not follow anyone"}`

- **400 Bad Request**: Username has to be given.
  - Body: `{"error": "A username has to be given"}`



## User Followings

**Request**

- **URL:** `/api/user_followings`
- **Method:** `POST`
- **Content-Type:** `application/json`

**Parameters**

- `username` (string): User's username.

**Description**

Retrieves the list of followers and users followed by a user.

**Response**

- **Success:** JSON object containing followers and followed users.
- **Failure:** Error message if user not found.

## Follow User

**Request**

- **URL:** `/api/follow`
- **Method:** `POST`
- **Content-Type:** `application/json`

**Parameters**

- `follower_username` (string): Username of the follower.
- `followed_username` (string): Username of the user to be followed.

**Description**

Follows a user.

**Response**

- **Success:** Relationship added successfully.
- **Failure:** Error message if relationship already exists.

## Unfollow User

**Request**

- **URL:** `/api/unfollow`
- **Method:** `POST`
- **Content-Type:** `application/json`

**Parameters**

- `follower_username` (string): Username of the follower.
- `followed_username` (string): Username of the user to be unfollowed.

**Description**

Unfollows a user.

**Response**

- **Success:** Relationship removed successfully.
- **Failure:** Error message if relationship does not exist.

## Get All Follows

**Request**

- **URL:** `/api/get_all_follows`
- **Method:** `GET`

**Description**

Retrieves a list of all user follow relationships.

**Response**

- **Success:** List of all user follow relationships in JSON format.

## Get All Users

**Request**

- **URL:** `/api/get_all_users`
- **Method:** `GET`

**Description**

Retrieves a list of all registered users.

**Response**

- **Success:** List of all users in JSON format.
