package com.example.start2

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import org.json.JSONObject

class RegistrationViewModel : ViewModel() {

    // Private mutable data which we will update
    private  val _phoneNumber = MutableLiveData<String>()
    private val _birthday = MutableLiveData<String>()
    private val _username = MutableLiveData<String>()
    private val _password = MutableLiveData<String>()

    // Public immutable data which the UI can observe
    val birthday: LiveData<String> = _birthday
    val username: LiveData<String> = _username
    val password: LiveData<String> = _password


    fun savePhoneNumber(phoneNumber: String){
        _phoneNumber.value= phoneNumber
    }
    fun saveBirthday(birthday: String) {
        _birthday.value = birthday
    }

    fun saveUsername(username: String) {
        _username.value = username
    }
    fun savePassword(password: String) {
        _password.value = password
    }

    fun sendUserDataToApi() {
        // Create a JSONObject to hold the combined user data
        val jsonObject = JSONObject().apply {
            put("phoneNumber", _phoneNumber.value)
            put("birthday", _birthday.value)
            put("username", _username.value)
            put("password", _password.value)


        }

    }
}
