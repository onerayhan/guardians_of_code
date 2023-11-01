import { useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import PasswordInput from "../../contexts/PasswordState";

const RenewPass = () => {
    useEffect(() => {
        document.title = "Renew Your Password";
    });

    const { user } = useUser();

  return (
        <div className="flex flex-col items-center justify-center h-full pl-14">
            <div className="flex flex-col items-center justify-center gap-y-4">
                <h1 className="text-4xl text-white font-bold">Reset your password</h1>
                <p className="text-white text-opacity-80">We will send your password to you.</p>
            </div>

            <div className="flex flex-col items-center justify-center gap-y-4 mt-8">
                <form className="flex flex-col items-center justify-center gap-y-4">
                    <input type="text" name="email" placeholder="Email" className="w-[400px] h-12 rounded-xl bg-white text-black text-opacity-80 text-center font-semibold"/>
                    <button type="submit" className="w-[400px] h-12 rounded-xl bg-secondary-color text-black text-opacity-80 text-center font-semibold opacity-80 hover:opacity-100">Send Password</button>
                    <PasswordInput />
                    <button type="submit" className="w-[400px] h-12 rounded-xl bg-secondary-color text-black text-opacity-80 text-center font-semibold opacity-80 hover:opacity-100">Try to Sign In</button>
                </form>
            </div>
        </div>
    );
}

export default RenewPass;