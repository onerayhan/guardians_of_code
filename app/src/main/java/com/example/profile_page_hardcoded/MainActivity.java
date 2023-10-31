package com.example.profile_page_hardcoded;

import android.os.Bundle;
//import android.support.v7.app.AppCompatActivity;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;


import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Get references to the UI elements
        ImageView profileImage = findViewById(R.id.profileImage);
        TextView username = findViewById(R.id.username);
        TextView email = findViewById(R.id.email);
        TextView followers = findViewById(R.id.followers);
        ListView favoriteSongsList = findViewById(R.id.favoriteSongsList);
        TextView following = findViewById(R.id.following);


        String usernameText = "John Doe";
        String emailText = "john.doe@example.com";
        int followersCount = 100;
        int followingCount = 50;

        // List of favorite songs
        String[] favoriteSongs = {
                "Danza Kuduro",
                "Toca Toca",
                "Black Day",
                "Nectarines",
                "Your Mind"
        };


        username.setText(usernameText);
        email.setText(emailText);
        followers.setText("Followers: " + followersCount);
        following.setText("Following: " + followingCount);


        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, favoriteSongs);
        favoriteSongsList.setAdapter(adapter);
    }
}
