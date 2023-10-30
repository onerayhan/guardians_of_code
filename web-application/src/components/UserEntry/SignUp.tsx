import { useEffect } from "react";
import { CgClose } from "react-icons/cg";
import { Link } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useUserEntry } from "../../contexts/UserEntryContext";
import PasswordInput from "../../contexts/PasswordState";

const SignUp = () => {
    useEffect(() => {
        document.title = "Sign Up";
    });

    const { user } = useUser();
    const { showSignIn, showForgotPassword } = useUserEntry();

  return (
        <div className="flex flex-col items-center justify-center h-full pl-32">
            <div className="flex flex-col items-center justify-center gap-y-4">
                <h1 className="text-4xl text-white font-bold">Sign Up</h1>
                <p className="text-white text-opacity-80">Sign up to Guardian.fm to be a part of the music itself.</p>
            </div>

            <div className="flex flex-col items-center justify-center gap-y-4 mt-8">
                <div className="flex justify-between gap-4">
                    <button className="w-[200px] h-12 rounded-xl bg-white text-black text-opacity-80 text-center font-semibold">Sign Up with Google</button>
                    <button className="w-[200px] h-12 rounded-xl bg-white text-black text-opacity-80 text-center font-semibold">Sign Up with Spotify</button>
                </div>

                <span className="flex-shrink mx-4 text-secondary-color">...or Register via Mail</span>
                
                <form className="flex flex-col items-center justify-center gap-y-4">
                    <input type="text" name="name" placeholder="Username" className="w-[400px] h-12 rounded-xl bg-white text-black text-opacity-80 text-center font-semibold"/>
                    <input type="text" name="email" placeholder="Email" className="w-[400px] h-12 rounded-xl bg-white text-black text-opacity-80 text-center font-semibold"/>
                    <PasswordInput />
                    <button type="submit" className="w-[400px] h-12 rounded-xl bg-secondary-color text-white text-opacity-80 text-center font-semibold">Sign Up</button>
                </form>
            </div>

            <div className="flex flex-col items-center justify-center gap-y-4 mt-8">
                <p className="text-white text-opacity-80">Already have an account? <button onClick={showSignIn} className="text-white text-opacity-80 hover:text-opacity-100">Sign In</button></p>
                <p className="text-white text-opacity-80">Forgot your password? <button onClick={showForgotPassword} className="text-white text-opacity-80 hover:text-opacity-100">Renew Password</button></p>
            </div>
        </div>
    );
}

export default SignUp;