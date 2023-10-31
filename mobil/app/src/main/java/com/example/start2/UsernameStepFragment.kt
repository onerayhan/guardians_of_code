package com.example.start2

import android.content.Context
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.example.start2.databinding.FragmentUsernameStepBinding



class UsernameStepFragment : Fragment() {



    private var _binding: FragmentUsernameStepBinding? = null
    private lateinit var binding: FragmentUsernameStepBinding
    private var registrationListener: RegistrationStepsListener? = null

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentUsernameStepBinding.inflate(inflater, container, false)
        binding = _binding!!
        return binding.root

    }

    override fun onAttach(context: Context) {
        super.onAttach(context)
        if (context is RegistrationStepsListener) {
            registrationListener = context
        } else {
            throw RuntimeException("$context must implement RegistrationStepsListener")
        }
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.nextButtonUsername.setOnClickListener {
            val preferredUsername = binding.preferredNameEditText.text.toString()
            // Optionally, add validation for username here

            (activity as? RegistrationStepsListener)?.onUsernameSelected(preferredUsername)


        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}


