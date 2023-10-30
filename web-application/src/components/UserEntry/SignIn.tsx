import { useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import { useUserEntry } from "../../contexts/UserEntryContext";
import PasswordInput from "../../contexts/PasswordState";

const SignIn = () => {
    useEffect(() => {
        document.title = "Sign In";
    });

    const { user } = useUser();
    const { showSignUp, showForgotPassword } = useUserEntry();

    const selectRef = useRef(null);
    const checkboxRef = useRef(null);
    const inputRef = useRef(null);
  
    function handleSubmit(event) {
      event.preventDefault();
      console.log("Input value:", inputRef.current.value);
      console.log("Select value:", selectRef.current.value);
      console.log("Checkbox value:", checkboxRef.current.checked);

      {/* THE SERVER RESPONSE IS CHECKED HERE*/}

      {/* THE SERVER RESPONSE IS CHECKED HERE*/}
    }

  return (
        <div className="flex flex-col items-center justify-center h-full pl-32">
            <div className="flex flex-col items-center justify-center gap-y-4">
                <h1 className="text-4xl text-white font-bold">Sign In</h1>
                <p className="text-white text-opacity-80">Sign into Guardian.fm to enjoy its full capabilities.</p>
            </div>

            <div className="flex flex-col items-center justify-center gap-y-4 mt-8">
                <div className="flex justify-between gap-4">
                    <button className="w-[200px] h-12 rounded-xl bg-white text-black text-opacity-80 text-center font-semibold">Sign In with Google</button>
                    <button className="w-[200px] h-12 rounded-xl bg-white text-black text-opacity-80 text-center font-semibold">Sign In with Spotify</button>
                </div>

                <span className="flex-shrink mx-4 text-secondary-color">...or use your E-Mail for logging in</span>
                
                <form className="flex flex-col items-center justify-center gap-y-4">
                    <input type="text" name="email" placeholder="Email" className="w-[400px] h-12 rounded-xl bg-white text-black text-opacity-80 text-center font-semibold"/>
                    <PasswordInput />
                    <button type="submit" className="w-[400px] h-12 rounded-xl bg-secondary-color text-black text-opacity-80 text-center font-semibold opacity-80 hover:opacity-100">Sign In</button>
                </form>
            </div>

            <div className="flex flex-col items-center justify-center gap-y-4 mt-8">
                <p className="text-white text-opacity-80">Don't have an account? <button onClick={showSignUp} className="text-white text-opacity-80 hover:text-opacity-100">Sign Up</button></p>
                <p className="text-white text-opacity-80">Forgot your password? <button onClick={showForgotPassword} className="text-white text-opacity-80 hover:text-opacity-100">Renew Password</button></p>
            </div>
        </div>
    );
}

export default SignIn;