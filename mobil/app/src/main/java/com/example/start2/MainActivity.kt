package com.example.start2
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.EditText
import android.widget.AdapterView
import android.widget.Spinner
import androidx.appcompat.app.AppCompatActivity
import com.example.start2.databinding.ActivityMainBinding
import com.example.start2.models.Country
import com.example.start2.utils.CountryHelper

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val countryHelper = CountryHelper()
        val countries = countryHelper.loadCountriesFromJson(this)
        val adapter = CountryAdapter(this, countries)

        binding.countrySpinner.adapter = adapter

        binding.countrySpinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(
                parent: AdapterView<*>,
                view: View,
                position: Int,
                id: Long
            ) {
                val selectedCountry = countries[position]
                binding.phoneNumberEditText.setText(selectedCountry.dial_code)
            }

            override fun onNothingSelected(parent: AdapterView<*>) {
                // Handle case where nothing is selected if necessary
            }
        }

        binding.button.setOnClickListener {
            var phoneNumber = binding.phoneNumberEditText.text.toString()
            if (" " in phoneNumber) {
                phoneNumber = phoneNumber.replace(" ", "")
            }

            if (isNumberRegistered(phoneNumber)) {
                binding.button.visibility = View.GONE
                binding.passwordEditText.visibility = View.VISIBLE
                binding.loginButton.visibility = View.VISIBLE

                binding.loginButton.setOnClickListener {
                    // Handle login logic here (e.g., API call to authenticate user)
                }
            } else {
                val intent = Intent(this, RegistrationActivity::class.java)
                startActivity(intent)            }
        }
    }

    private fun isNumberRegistered(phoneNumber: String): Boolean {
        // This is just a mock function for demonstration purposes.
        // In a real-world scenario, you'll make an API call to your backend to check the existence of the phone number.
        return true
    }
}
