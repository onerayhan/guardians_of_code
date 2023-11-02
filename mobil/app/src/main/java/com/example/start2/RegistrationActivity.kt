package com.example.start2

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.ImageButton
import androidx.activity.viewModels
import androidx.fragment.app.FragmentManager

import androidx.lifecycle.ViewModel

class RegistrationActivity : AppCompatActivity(), RegistrationStepsListener{

    private val TAG = "RegistrationActivity"
    private val registrationViewModel by viewModels<RegistrationViewModel>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_registration)

        val phoneNumber = intent.getStringExtra("phoneNumber")
        phoneNumber?.let {
            registrationViewModel.savePhoneNumber(it)
        }

        val backButton = findViewById<ImageButton>(R.id.back_button)
        backButton.setOnClickListener {


            if (supportFragmentManager.findFragmentById(R.id.fragment_container) is BirthdayStepFragment) {
                supportFragmentManager.popBackStack(null, FragmentManager.POP_BACK_STACK_INCLUSIVE)
                finish() // Eğer MainFragment Activity'nin bir parçası değilse Activity'yi kapat
            } else {
                supportFragmentManager.popBackStack()
            }
        }

        Log.d(TAG, "onCreate called")

        if (savedInstanceState == null) {
            supportFragmentManager.beginTransaction()
                .replace(R.id.fragment_container, BirthdayStepFragment())
                .addToBackStack(null)
                .commit()

            Log.d(TAG, "Initial fragment (BirthdayStepFragment) is set")
        }
    }

    override fun onBirthdaySelected(birthday: String) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragment_container, UsernameStepFragment())
            .addToBackStack(null)
            .commit()

        registrationViewModel.saveBirthday(birthday)

    }

    override fun onUsernameSelected(username: String) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragment_container, PasswordStepFragment())
            .addToBackStack(null)
            .commit()

        registrationViewModel.saveUsername(username)
    }

    override fun onPasswordSelected(password: String) {
        registrationViewModel.savePassword(password)
        registrationViewModel.sendUserDataToApi()

    }



}
