package com.example.start2
import com.example.start2.databinding.FragmentMainBinding
import android.content.Intent
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import com.example.start2.utils.CountryHelper

class MainFragment : Fragment() {

    private lateinit var binding: FragmentMainBinding



   /*** override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        binding = FragmentMainBinding.inflate(inflater, container, false)
        return binding.root
    }***/

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val countryHelper = CountryHelper()
        val countries = countryHelper.loadCountriesFromJson(requireContext())
        val adapter = CountryAdapter(requireContext(), countries)

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
                val intent = Intent(requireContext(), RegistrationActivity::class.java)
                startActivity(intent)            }
        }
    }

    private fun isNumberRegistered(phoneNumber: String): Boolean {
        // This is just a mock function for demonstration purposes.
        return false
    }
}


