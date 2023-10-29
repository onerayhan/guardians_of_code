import { useEffect } from "react";

const SignUp = () => {
    useEffect(() => {
    document.title = "Sign Up - Guardian.fm";
    }, []);

  return (
    <div>
      <h1>Sign Up Page</h1>
    </div>
  );
};

export default SignUp;