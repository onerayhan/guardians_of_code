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
  "photo": (JPEG file),
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
- `username` (string): The username of the user adding the song.
- `length` (string): The length of the song in HH:MM:SS format.
- `tempo` (integer): The tempo of the song.
- `recording_type` (string): The recording type of the song (e.g., 'LIVE', 'STUDIO', 'RADIO').
- `listens` (integer): The number of times the song has been listened to.
- `release_year` (string): The release year of the song.
- `added_timestamp` (string): The timestamp when the song was added (format: "YYYY-MM-DD HH:MM:SS").
- `username` (string): The username of the user who added the song.

**Description**

Adds a new song to the database.

### Response

- **Success:** 
  - Status Code: 201 Created
  - JSON Object:
    ```json
    {
      "message": "Song added successfully by {username}",
      "song_details": {
        "song_id": "song_id",
        "song_name": "song_name",
        "length": "HH:MM:SS",
        "tempo": "Integer",
        "recording_type": "LIVE",
        "listens": "listens",
        "release_year": "release_year",
        "added_timestamp": "YYYY-MM-DD HH:MM:SS",
        "username": "username"
      }
    }
    ```
- **Failure:** 
  - Status Code: 400 Bad Request
  - JSON Object:
    ```json
    {
      "error": "A song name has to be given"
    }
    ```
  - Status Code: 400 Bad Request
  - JSON Object:
    ```json
    {
      "error": "Same song exits in the database"
    }
    ```

## Remove Song

### Request

- **URL:** `/api/remove_song`
- **Method:** `POST`
- **Content-Type:** `application/json`

**Parameters**

- `song_id` (integer): The ID of the song to be removed.
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
      "error": "A song_id has to be given"
    }
    ```
  - Status Code: 404 Not Found
  - JSON Object:
    ```json
    {
      "error": "Song not found"
    }
    ```

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
