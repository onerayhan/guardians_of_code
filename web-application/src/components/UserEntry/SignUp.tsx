import React, { useEffect, ChangeEvent } from "react";
import { useUserEntry } from "../../contexts/UserEntryContext";
import { FcGoogle } from "react-icons/fc";
import { BsSpotify } from "react-icons/bs";
import { Formik, Form, Field, useField, FormikHelpers } from "formik";
import * as Yup from 'yup';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface Values {
  username: string;
  email: string;
  password: string;
}

interface EmailCheckerProps {
  name: string;
}

interface PasswordCheckerProps {
  name: string;
}

const validationSchema = Yup.object({
  username: Yup.string().required('This field is required.'),
  email: Yup.string().email('Invalid email address.').required('This field is required.'),
  password: Yup.string()
  .min(8, 'Must be 8 characters or more')
  .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
  .matches(/[0-9]/, 'Password must contain at least one number')
  .matches(/[@$!%*?&]/, 'Password must contain at least one special character')
  .required('This field is required.'),
});

const UsernameChecker: React.FC<EmailCheckerProps> = ({ name }) => {
    const [field, meta] = useField(name);
  
    return (
      <div className="relative">
        <div className="relative flex items-center w-[400px] h-12 bg-white rounded-xl">
          <Field
            {...field}
            className="w-full h-full text-center font-semibold text-black text-opacity-80 rounded-xl"
            placeholder="User Name"
          />
        </div>
        {meta.touched && meta.error ? (
          <p className="text-red-500 font">{meta.error}</p>
        ) : null}
      </div>
    );
  };

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

const SignUp = () => {
    useEffect(() => {
        document.title = "Sign Up";
    });

    const { showSignIn, showForgotPassword } = useUserEntry();

  return (
        <div className="flex flex-col items-center justify-center h-full pl-14">
            <div className="flex flex-col items-center justify-center gap-y-4">
                <h1 className="text-4xl text-white font-bold">Sign Up</h1>
                <p className="text-white text-opacity-80">Sign up to Guardian.fm to be a part of the music itself.</p>
            </div>

            <div className="flex flex-col items-center justify-center gap-y-4 mt-8">
                <div className="flex justify-between gap-4">
                    <button className="w-[200px] h-12 rounded-xl bg-white text-black text-opacity-80 text-center font-semibold">
                        <div>
                            <FcGoogle size={20} className="inline-block mr-2"/>
                            Sign Up with Google
                        </div>
                    </button>
                    <button className="w-[200px] h-12 rounded-xl bg-white text-black text-opacity-80 text-center font-semibold">
                        <div>
                            <BsSpotify size={20} className="inline-block mr-2"/>
                            Sign Up with Spotify
                        </div>
                    </button>
                </div>

                <span className="flex-shrink mx-4 text-secondary-color">...or Register via Mail</span>
                <Formik
                    initialValues={{
                        username: "",
                        email: "",
                        password: ""
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(
                        values: Values,
                        { setSubmitting }: FormikHelpers<Values>
                    ) => {
                        setTimeout(() => {
                        alert(JSON.stringify(values, null, 2));
                        setSubmitting(false);
                        }, 500);
                    }}
                    >
                    {({ isValid, isSubmitting }) => (
                        <Form className="flex flex-col items-center justify-center gap-y-4">
                            <UsernameChecker name="username" />
                            <EmailChecker name="email" />
                            <PasswordChecker name="password" />
                            <button type="submit" disabled={!isValid || isSubmitting} className="w-[400px] h-12 rounded-xl bg-secondary-color text-black text-opacity-80 text-center font-semibold opacity-80 hover:opacity-100">Submit</button>
                        </Form>
                    )}
                </Formik>
            </div>

            <div className="flex flex-col items-center justify-center gap-y-4 mt-8">
                <p className="text-white text-opacity-80">Already have an account? <button onClick={showSignIn} className="text-white text-opacity-80 hover:text-opacity-100">Sign In</button></p>
                <p className="text-white text-opacity-80">Forgot your password? <button onClick={showForgotPassword} className="text-white text-opacity-80 hover:text-opacity-100">Renew Password</button></p>
            </div>
        </div>
    );
}

export default SignUp;