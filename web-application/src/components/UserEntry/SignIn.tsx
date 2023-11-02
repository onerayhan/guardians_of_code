import React, { useEffect, ChangeEvent } from "react";
import { useUserEntry } from "../../contexts/UserEntryContext";
import { FcGoogle } from "react-icons/fc";
import { BsSpotify } from "react-icons/bs";
import { Formik, Form, Field, useField, FormikHelpers } from "formik";
import * as Yup from 'yup';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios, { AxiosError } from "axios";
import { useSignIn } from "react-auth-kit";

interface Values {
  username: string;
  password: string;
}

interface EmailCheckerProps {
  name: string;
}

interface PasswordCheckerProps {
  name: string;
}

const validationSchema = Yup.object({
  username: Yup.string().email('Invalid email address.').required('Required for login, duh.'),
});

const EmailChecker: React.FC<EmailCheckerProps> = ({ name }) => {
  const [field, meta] = useField(name);

  return (
    <div className="relative">
      <div className="relative flex items-center w-[400px] h-12 bg-white rounded-xl">
        <Field
          {...field}
          className="w-full h-full text-center font-semibold text-black text-opacity-80 rounded-xl"
          placeholder="E-Mail Address"
        />
      </div>
      {meta.touched && meta.error ? (
        <p className="text-red-500 font">{meta.error}</p>
      ) : null}
    </div>
  );
};

const PasswordChecker: React.FC<PasswordCheckerProps> = ({ name }) => {
  const [field, meta] = useField(name);
  const [passwordShown, setPasswordShown] = React.useState(false);

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <div className="relative">
      <div className="relative flex items-center w-[400px] h-12 bg-white rounded-xl">
        <Field
          {...field}
          type={passwordShown ? "text" : "password"}
          className="w-full h-full text-center pr-4 font-semibold text-black text-opacity-80 rounded-xl"
          placeholder="Password"
          style={{ textIndent: '20px' }}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 flex items-center px-2"
          style={{ marginRight: '10px' }}
        >
          {passwordShown ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
        </button>
      </div>
      {meta.touched && meta.error ? (
        <p className="text-red-500 font">{meta.error}</p>
      ) : null}
    </div>
  );
};

const SignIn = () => {
  useEffect(() => {
    document.title = "Sign In";
  });

  const [error, setError] = React.useState("");
  const signIn = useSignIn();

  const onSubmitRequest = async (values: any) => {
    console.log("Values: ", values);
    setError("");

    try {
        axios.post(
            "http://13.51.167.155/api/register",
            values
        );
        
        {/* 
            signIn({
              token: response.data.token,
              expiresIn: 3600,
              tokenType: "Bearer",
              authState: { email: values.email}
            })
      */}
    } catch(err) {
        if (err && err instanceof AxiosError)
            setError(err.response?.data.message);
        else if (err && err instanceof Error) setError(err.message);

        console.log("Error: ", err);
    }}

  const { showSignUp, showForgotPassword } = useUserEntry();

  return (
    <div className="flex flex-col items-center justify-center h-full pl-14">
      <div className="flex flex-col items-center justify-center gap-y-4">
        <h1 className="text-4xl text-white font-bold">Sign In</h1>
        <p className="text-white text-opacity-80">Sign into Guardian.fm to enjoy its full capabilities.</p>
      </div>

      <div className="flex flex-col items-center justify-center gap-y-4 mt-8">
        <div className="flex justify-between gap-4">
          <button className="w-[200px] h-12 rounded-xl bg-white text-black text-opacity-80 text-center font-semibold">
            <div>
              <FcGoogle size={20} className="inline-block mr-2" />
              Sign In with Google
            </div>
          </button>
          <button className="w-[200px] h-12 rounded-xl bg-white text-black text-opacity-80 text-center font-semibold">
            <div>
              <BsSpotify size={20} className="inline-block mr-2" />
              Sign In with Spotify
            </div>
          </button>
        </div>

        <span className="flex-shrink mx-4 text-secondary-color">...or use your E-Mail for logging in</span>
        <Formik
          initialValues={{
            username: "",
            password: ""
          }}
          validationSchema={validationSchema}
          onSubmit={(
            values: Values,
            { setSubmitting }: FormikHelpers<Values>
          ) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              onSubmitRequest(values);
              setSubmitting(false);
            }, 500);
          }}
        >
          {({ isValid, isSubmitting }) => (
            <Form className="flex flex-col items-center justify-center gap-y-4">
              <EmailChecker name="username" />
              <PasswordChecker name="password" />
              <button type="submit" disabled={!isValid || isSubmitting} className="w-[400px] h-12 rounded-xl bg-secondary-color text-black text-opacity-80 text-center font-semibold opacity-80 hover:opacity-100">Submit</button>
            </Form>
          )}
        </Formik>
      </div>

      <div className="flex flex-col items-center justify-center gap-y-4 mt-8">
        <p className="text-white text-opacity-80">Don't have an account? <button onClick={showSignUp} className="text-white text-opacity-80 hover:text-opacity-100">Sign Up</button></p>
        <p className="text-white text-opacity-80">Forgot your password? <button onClick={showForgotPassword} className="text-white text-opacity-80 hover:text-opacity-100">Renew Password</button></p>
      </div>
    </div>
  );
};

export default SignIn;