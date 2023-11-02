package com.example.start2

import com.example.start2.databinding.FragmentBirthdayStepBinding

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.DatePicker

class BirthdayStepFragment : Fragment() {

    private var _binding: FragmentBirthdayStepBinding? = null
    private val binding get() = _binding!!


    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        _binding = FragmentBirthdayStepBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.nextButtonBirthday.setOnClickListener {
            val day = binding.datePicker.dayOfMonth
            val month = binding.datePicker.month
            val year = binding.datePicker.year
            val birthday = "$day/$month/$year"
            (activity as? RegistrationStepsListener)?.onBirthdaySelected(birthday)

        }

    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
