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
