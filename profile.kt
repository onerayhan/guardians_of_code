package com.example.start2

import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject

class profile {
    private val client = OkHttpClient()
    private val apiBaseUrl = "" // Replace with the actual API base URL

    data class UserStats(val followers: Int, val following: Int)

    fun getFollowers(userId: String): String {
        val request = Request.Builder()
            .url("$apiBaseUrl/followers?user_id=$userId")
            .get()
            .build()

        val response = client.newCall(request).execute()
        return response.body?.string() ?: ""
    }

    fun getFollowing(userId: String): String {
        val request = Request.Builder()
            .url("$apiBaseUrl/following?user_id=$userId")
            .get()
            .build()

        val response = client.newCall(request).execute()
        return response.body?.string() ?: ""
    }
    private fun parseFollowCount(responseBody: String?): Int {
        try {
            val json = responseBody?.let { JSONObject(it) }
            if (json != null) {
                return json.getInt("count")
            } // Adjust the JSON field name according to the API response
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return 0
    }
    fun unfollowUser(userIdToUnfollow: String, authToken: String) {


        val requestBody =
            byteArrayOf().toRequestBody(null, 0, content.size) // Request body for DELETE request

        val request = Request.Builder()
            .url("$apiBaseUrl/unfollow/$userIdToUnfollow")
            .delete(requestBody)
            .header("Authorization", "Bearer $authToken") // Include the user's authentication token
            .build()

        val response = client.newCall(request).execute()

        if (response.isSuccessful) {
            println("Unfollowed user $userIdToUnfollow")
        } else {
            println("Failed to unfollow user $userIdToUnfollow")
            // Handle the error as needed
        }
    }






}


