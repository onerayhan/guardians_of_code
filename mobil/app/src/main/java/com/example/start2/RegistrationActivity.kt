package com.example.start2
import android.os.Bundle
import android.widget.Button
import android.widget.DatePicker
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity

class RegistrationActivity : AppCompatActivity() {

    // Variables to store user input across steps
    private var birthday: String = ""
    private var preferredUsername: String = ""
    private var password: String = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        showBirthdayStep()  // Begin with the birthday step
    }

    private fun showBirthdayStep() {
        setContentView(R.layout.step_birthday)

        val datePicker: DatePicker = findViewById(R.id.datePicker)
        val nextButton: Button = findViewById(R.id.nextButtonBirthday)

        nextButton.setOnClickListener {
            // Store the selected date
            val day = datePicker.dayOfMonth
            val month = datePicker.month
            val year = datePicker.year
            birthday = "$day/$month/$year"

            showUsernameStep()
        }
    }

    private fun showUsernameStep() {
        setContentView(R.layout.step_username)

        val usernameEditText: EditText = findViewById(R.id.preferredNameEditText)
        val nextButton: Button = findViewById(R.id.nextButtonUsername)

        nextButton.setOnClickListener {
            preferredUsername = usernameEditText.text.toString()

            // Optionally, add validation for username here

            showPasswordStep()
        }
    }

    private fun showPasswordStep() {
        setContentView(R.layout.step_password)

        val passwordEditText: EditText = findViewById(R.id.passwordEditText)
        val confirmPasswordEditText: EditText = findViewById(R.id.confirmPasswordEditText)
        val registerButton: Button = findViewById(R.id.registerButton)

        registerButton.setOnClickListener {
            val enteredPassword = passwordEditText.text.toString()
            val confirmedPassword = confirmPasswordEditText.text.toString()

            if (enteredPassword == confirmedPassword) {
                password = enteredPassword
                completeRegistration()
            } else {

                confirmPasswordEditText.error = "Passwords don't match"
            }
        }
    }

    private fun completeRegistration() {
        // Use the birthday, preferredUsername, and password variables to complete registration.
        // For example, you can make an API call to register the user.
    }
}
