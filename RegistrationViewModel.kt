


import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.start2.UserRegistrationRequest
import com.example.start2.UserRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class RegistrationViewModel : ViewModel() {
    private val userRepository = UserRepository()

    // Use LiveData or StateFlow to communicate registration success/failure to the View
    // Example using LiveData
    val registrationResult = userRepository.registrationResult

    fun registerUser(username: String, email: String, password: String,birthday: String,phoneNumber:String) {
        viewModelScope.launch(Dispatchers.IO) {
            userRepository.registerUser(UserRegistrationRequest(username, email, password,birthday, phoneNumber ))
        }
    }


}












