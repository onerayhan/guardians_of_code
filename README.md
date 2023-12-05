# SUtatify Music Information System

## Overview
SUtatify is an integrated web platform and backend service designed for music enthusiasts. It allows users to track and analyze their favorite songs, manage their music library, and receive personalized song recommendations. The system includes both a backend API and a web client interface.

---

### Features
- Spotify Authentication
- User Registration and Management
- Song Management
- Social Interaction Features
- Data Analysis and Recommendations

### API Endpoints
- `/spoti_login`: Initiates Spotify login.
- `/callback`: Handles Spotify authentication callback.
- `/api/register`: User registration.
- `/api/login`: User login.
- `/api/upload_photo`: Upload user profile photo.
- `/api/profile_picture`: Retrieve user profile picture.
- `/api/user_delete`: Delete a user.
- `/api/user_info`: Get user information.
- `/api/change_password`: Change user's password.
- `/api/add_song`: Add a song to the database.
- `/api/remove_song`: Remove a song from the database.
- `/api/user_songs`: Review user-added songs.
- `/api/user_followings`: Get user's followers and followings.
- `/api/follow`: Follow a user.
- `/api/unfollow`: Unfollow a user.
- `/api/get_all_follows`: List all user follow relationships.
- `/api/get_all_users`: List all users.

---

## Web Client

### Features
- Interactive User Interface for Music Management
- Spotify Account Integration
- Profile Management
- Song Library Management
- Social Features and Community Interaction
- Responsive Design for Desktop and Mobile

### Setup and Running Web Client
1. Clone and navigate to the web directory.
2. Install dependencies with `npm install`.
3. Start the web client using `npm run dev`.
4. Access via `http://localhost:3000`.

### Usage
- Homepage for main features navigation.
- User profile management.
- Music library addition and analysis.
- Social interaction with other users.

---

## Contributing
Contributions to both the backend and web client of SUtatify are welcome. Please see `CONTRIBUTING.md` for contribution guidelines.

## Versioning
We use [SemVer](http://semver.org/) for versioning. For the available versions, see the [tags on our repository](#).

## Authors
- **[Kanat Özgen](https://github.com/koezgen)** - Initial work on SUtatify.
- **[Can Çiftçioğlu](https://github.com/syyunko)** - Initial work on SUtatify.
- **[Emre Zeytinoğlu](https://github.com/emrezeytinoglu)** - Initial work on SUtatify.
  

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## Acknowledgments
- Thanks to all contributors and users of the SUtatify platform.
- Special thanks to TheAudioDB and Spotify for providing music metadata and authentication services.
