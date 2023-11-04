package com.example.start2

import androidx.lifecycle.MutableLiveData
import retrofit2.Call
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import retrofit2.http.Body
import retrofit2.http.POST
class UserRepository {
    // LiveData to communicate registration result to the ViewModel
    val registrationResult = MutableLiveData<Boolean>()

    interface RegistrationApiService {
        @POST("registration_endpoint")
        fun registerUser(@Body request: UserRegistrationRequest): Call<ApiResponse>
    }



    suspend fun registerUser(userRegistrationRequest: UserRegistrationRequest) {
        try {
            // Perform the registration API request here
            val registrationResponse = makeRegistrationAPIRequest(userRegistrationRequest)

            // Check if the registration was successful based on the response.
            // You may need to adjust this part depending on your API's response structure.
            if (registrationResponse.isSuccessful) {
                // Registration was successful
                registrationResult.postValue(true)
            } else {
                // Registration failed, handle the error
                registrationResult.postValue(false)
            }
        } catch (e: Exception) {
            // Handle the exception and set registrationResult to false on failure
            registrationResult.postValue(false)
        }
    }

    // This is a hypothetical function to make the registration API request.
// You should replace it with your actual networking code.
    private suspend fun makeRegistrationAPIRequest(userRegistrationRequest: UserRegistrationRequest): ApiResponse {
        // Create a Retrofit instance.
        val retrofit = Retrofit.Builder()
            .baseUrl("https://your.api.base.url/") // Replace with your API base URL
            .addConverterFactory(MoshiConverterFactory.create()) // You can use another converter based on your API response format
            .build()

        // Create an instance of your API service.
        val apiService = retrofit.create(RegistrationApiService::class.java)

        // Make the API request using a coroutine adapter.
        val response = apiService.registerUser(userRegistrationRequest).await()

        // Handle the response.
        if (response.isSuccessful) {
            val apiResponse = response.body()
            if (apiResponse != null) {
                // Request was successful, return the ApiResponse.
                return apiResponse
            } else {
                throw ApiException("Response body is null")
            }
        } else {
            throw ApiException("API request failed with code ${response.code()}")
        }
    }
}
