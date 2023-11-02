package com.example.kotlin_profile_page

import android.os.Bundle
import android.view.View
import android.widget.*
//import android.support.v7.app.AppCompatActivity
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.cardview.widget.CardView

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)


        val profileCard = findViewById<CardView>(R.id.profileCard)
        val profileImage = findViewById<ImageView>(R.id.profileImage)
        profileImage.setImageResource(R.drawable.default_profile_image)
        val username = findViewById<TextView>(R.id.username)
        val email = findViewById<TextView>(R.id.email)
        val followers = findViewById<TextView>(R.id.followers)
        val favoriteSongsList = findViewById<ListView>(R.id.favoriteSongsList)
        val following = findViewById<TextView>(R.id.following)


        val usernameText = "Tommy Shelby"
        val emailText = "tommy.shelby@sabanciuniv.com"
        val followersCount = 100
        val followingCount = 50


        val favoriteSongs = arrayOf(
            "Danza Kuduro",
            "Toca Toca",
            "Black Day",
            "Nectarines",
            "Your Mind",
            "Another Level",
            "Dance Monkey"
        )


        username.text = usernameText
        email.text = emailText
        followers.text = "Followers: $followersCount"
        following.text = "Following: $followingCount"


        val adapter = ArrayAdapter(this, android.R.layout.simple_list_item_1, favoriteSongs)
        favoriteSongsList.adapter = adapter

        followers.setOnClickListener(View.OnClickListener {
            FollowerListFragment.show(supportFragmentManager)
        })

        following.setOnClickListener(View.OnClickListener {
            FollowingsListFragment.show(supportFragmentManager)
        })
    }


    private fun showFollowerList() {

        val alertDialogBuilder = AlertDialog.Builder(this)
        alertDialogBuilder.setTitle("Followers List")


        val inflater = layoutInflater
        val dialogLayout = inflater.inflate(R.layout.follower_list, null)


        val followerListView = dialogLayout.findViewById<ListView>(R.id.followerListView)
        val followerData =
            arrayOf("Follower 1", "Follower 2", "Follower 3") // Replace with actual follower data
        val adapter = ArrayAdapter(this, android.R.layout.simple_list_item_1, followerData)
        followerListView.adapter = adapter


        alertDialogBuilder.setView(dialogLayout)


        alertDialogBuilder.setPositiveButton("OK") { _, _ -> }


        val alertDialog = alertDialogBuilder.create()
        alertDialog.show()
    }

    private fun showFollowingList() {

        val alertDialogBuilder = AlertDialog.Builder(this)
        alertDialogBuilder.setTitle("Following List")


        val inflater = layoutInflater
        val dialogLayout = inflater.inflate(R.layout.following_list, null)


        val followerListView = dialogLayout.findViewById<ListView>(R.id.followingListView)
        val followerData =
            arrayOf("Follower 1", "Follower 2", "Follower 3")
        val adapter = ArrayAdapter(this, android.R.layout.simple_list_item_1, followerData)
        followerListView.adapter = adapter


        alertDialogBuilder.setView(dialogLayout)


        alertDialogBuilder.setPositiveButton("OK") { _, _ -> }


        val alertDialog = alertDialogBuilder.create()
        alertDialog.show()
    }




}
