package com.example.start2
import android.content.Context
import android.widget.EditText
import android.widget.Button
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup

class PasswordStepFragment : Fragment() {

    // İlerlemeyi kontrol etmek için bir listener tanımlayalım
    private var listener: RegistrationStepsListener? = null

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_password_step, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val passwordEditText: EditText = view.findViewById(R.id.passwordEditText)
        val confirmPasswordEditText: EditText = view.findViewById(R.id.confirmPasswordEditText)
        val registerButton: Button = view.findViewById(R.id.registerButton)

        registerButton.setOnClickListener {
            val enteredPassword = passwordEditText.text.toString()
            val confirmedPassword = confirmPasswordEditText.text.toString()

            if (enteredPassword == confirmedPassword) {
                // Burada listener aracılığıyla ana aktiviteye bilgi gönderelim
                listener?.onPasswordSelected(enteredPassword)
            } else {
                confirmPasswordEditText.error = "Passwords don't match"
            }
        }
    }

    override fun onAttach(context: Context) {
        super.onAttach(context)
        if (context is RegistrationStepsListener) {
            listener = context
        } else {
            throw RuntimeException("$context must implement RegistrationStepsListener")
        }
    }

    override fun onDetach() {
        super.onDetach()
        listener = null
    }
}

