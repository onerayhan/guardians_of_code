import React from "react";
import { FcGoogle } from "react-icons/fc";
import { Formik, Form, Field, useField, FormikHelpers } from "formik";
import * as Yup from 'yup';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios, { AxiosError } from "axios";
import { useSignIn } from "react-auth-kit";
import 'react-phone-number-input/style.css'
import { useNavigate } from "react-router-dom";
import {SignInWithGoogle} from "./Firebase.tsx";
import "react-datepicker/dist/react-datepicker.css";
import Spotify_Entry_Handler from "./Spotify_Entry_Handler.tsx";

interface Values {
    username: string;
    password: string;
    birthday: string;
    email: string;
    confirmPassword: string;
}
interface EmailCheckerProps {
    name: string;
}
interface PasswordCheckerProps {
    passwordName: string;
    confirmPasswordName: string;
}
const SignInButtonHandler: React.FC = () => {
    const history = useNavigate();

    const handleClick = () => {
        history('/signin');
    };

    return (
        <button className="text-white text-opacity-80 hover:text-opacity-100" onClick={handleClick}>Sign In</button>
    );
}

const validationSchema = Yup.object({
    username: Yup.string().required('This field is required.'),
    email: Yup.string().required('This field is required.').email('Invalid email address.'),
    password: Yup.string()
        .min(8, 'Must be 8 characters or more')
        .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[@$!%*?&]/, 'Password must contain at least one special character')
        .required('This field is required.'),
    birthday: Yup.string().required('This field is required.').matches(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-(19|20)\d\d$/, "Please enter a valid date in the format dd-mm-yyyy"),
    confirmPassword: Yup
        .string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
});

const DateChecker: React.FC<{ name: string }> = ({ name }) => {
    const [field, meta] = useField(name);

    return (
        <div className="relative">
            <div>
                <Field
                    {...field}
                    className="w-[400px] h-12 text-center font-semibold text-black text-opacity-80 rounded-xl"
                    placeholder="Birthday (dd-mm-yyyy)"
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

const UsernameChecker: React.FC<{ name: string }> = ({ name }) => {
    const [field, meta] = useField(name);

    return (
        <div className="relative">
            <div>
                <Field
                    {...field}
                    className="w-[400px] h-12 text-center font-semibold text-black text-opacity-80 rounded-xl"
                    placeholder="Username"
                />
            </div>
            {meta.touched && meta.error ? (
                <p className="text-red-500 font">{meta.error}</p>
            ) : null}
        </div>
    );
};

const PasswordChecker: React.FC<PasswordCheckerProps> = ({passwordName, confirmPasswordName}) => {
    const [passwordField, passwordMeta] = useField(passwordName);
    const [confirmPasswordField, confirmPasswordMeta] = useField(confirmPasswordName);
    const [passwordShown, setPasswordShown] = React.useState(false);

    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown);
    };

    return (
        <div className="relative">
            <div className="relative flex items-center w-[400px] h-12 bg-white rounded-xl">
                <Field
                    {...passwordField}
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
            {passwordMeta.touched && passwordMeta.error && (
                <p className="text-red-500 font">{passwordMeta.error}</p>
            )}
            <div className="py-2" />
            <div className="relative flex items-center w-[400px] h-12 bg-white rounded-xl">
                <Field
                    {...confirmPasswordField}
                    type={passwordShown ? "text" : "password"}
                    className="w-full h-full text-center pr-4 font-semibold text-black text-opacity-80 rounded-xl"
                    placeholder="Re-enter Password"
                    style={{ textIndent: '20px' }}
                />
            </div>
            {confirmPasswordMeta.touched && confirmPasswordMeta.error && (
                <p className="text-red-500 font">{confirmPasswordMeta.error}</p>
            )}
        </div>
    );
};
const SignUp = () => {

    const [error, setError] = React.useState("");
    const signIn = useSignIn();

    const onSubmitRequest = async (values: any) => {
        console.log("Values: ", values);
        setError("");

        try {
            await axios.post(
                "http://51.20.128.164/api/register",
                { username: values.username, password: values.password, email: values.email, birthday: values.birthday }
            );

            const response_login = await axios.post(
                "http://51.20.128.164/api/login",
                { username: values.username, password: values.password }
            );

            signIn({
                token: response_login.data.token,
                expiresIn: 3600,
                tokenType: "Bearer",
                authState: { username: values.username}
            })

        } catch(err) {
            if (err && err instanceof AxiosError)
                setError(err.response?.data.message);
            else if (err && err instanceof Error) setError(err.message);

            console.log("Error: ", err);
        }}

    return (
        <div className="flex flex-col items-center justify-center h-full pl-14">
            <div className="flex flex-col items-center justify-center gap-y-4">
                <h1 className="text-4xl text-white font-bold">Sign Up</h1>
                <p className="text-white text-opacity-80">Sign up to Armonify to be a part of the music itself.</p>
            </div>

            <div className="flex flex-col items-center justify-center gap-y-4 mt-8">
                <div className="flex justify-between gap-4">
                    <button onClick={ SignInWithGoogle } className="w-[200px] h-12 rounded-xl bg-white text-black text-opacity-80 text-center font-semibold">
                        <div>
                            <FcGoogle size={20} className="inline-block mr-2" />
                            Sign Up with Google
                        </div>
                    </button>
                    <Spotify_Entry_Handler/>
                </div>

                <span className="flex-shrink mx-4 text-secondary-color">...or Register via Mail</span>
                <Formik
                    initialValues={{
                        username: "",
                        email: "",
                        birthday: "",
                        password: "",
                        confirmPassword: "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={async (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
                        const { confirmPassword, ...valuesToSend } = values;

                        setTimeout(() => {
                            onSubmitRequest(valuesToSend);
                            setSubmitting(false);
                        }, 100);
                    }}
                >
                    {({ isValid, isSubmitting }) => (
                        <Form className="flex flex-col items-center justify-center gap-y-4">
                            <UsernameChecker name="username" />
                            <EmailChecker name="email" />
                            <DateChecker name="birthday" />
                            <PasswordChecker passwordName="password" confirmPasswordName="confirmPassword" />
                            <button type="submit" disabled={!isValid || isSubmitting} className="w-[400px] h-12 rounded-xl bg-secondary-color text-black text-opacity-80 text-center font-semibold opacity-80 hover:opacity-100">Submit</button>
                            <p className="text-red-500 font">{error}</p>
                        </Form>
                    )}
                </Formik>
            </div>

            <div className="flex flex-col items-center justify-center gap-y-4 mt-8">
                <p className="text-white text-opacity-80">Already have an account? <SignInButtonHandler/></p>
            </div>
        </div>
    );
}

export default SignUp;