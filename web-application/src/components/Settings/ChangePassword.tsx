import axios from "axios";
import {AxiosError} from "axios";
import {useNavigate} from "react-router-dom";
import {useAuthUser} from "react-auth-kit";
import {Field, Form, Formik, FormikHelpers, useField} from "formik";
import React from "react";
import * as Yup from "yup";
import {FaEye, FaEyeSlash} from "react-icons/fa";

interface Values {
    username: string,
    old_password: string,
    new_password: string,
    confirmPassword: string,
}

interface PasswordCheckerProps {
    passwordName: string,
    confirmPasswordName: string,
}

const validationSchema = Yup.object({
    new_password: Yup.string()
        .min(8, 'Must be 8 characters or more')
        .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[@$!%*?&]/, 'Password must contain at least one special character')
        .required('This field is required.'),
    confirmPassword: Yup
        .string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
});

const PasswordInput: React.FC<{ name: string }> = ({ name }) => {
    const [passwordField, passwordMeta] = useField(name);
    const [passwordShown, setPasswordShown] = React.useState(false);

    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown);
    };

    return (
        <div className="relative flex items-center w-[400px] h-12 bg-white rounded-xl">
            <Field
                {...passwordField}
                type={passwordShown ? "text" : "password"}
                className="w-full h-full text-center pr-4 font-semibold text-black text-opacity-80 rounded-xl"
                placeholder="Old Password"
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
            {passwordMeta.touched && passwordMeta.error && (
            <p className="text-red-500 font">{passwordMeta.error}</p>
            )}
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

const ChangePassword = () =>
{
    const [error, setError] = React.useState("");

    const navigate = useNavigate();
    const auth = useAuthUser();

    const onSubmitRequest = async (values: any) => {
        console.log("Values: ", values);
        setError("");

        try {
            await axios.post(
                "http://51.20.128.164/api/change_password",
                { username: values.username, old_password: values.old_password, new_password: values.new_password }
            );
            navigate("/");

        } catch(err) {
            if (err && err instanceof AxiosError)
                setError(err.response?.data.message);
            else if (err && err instanceof Error) setError(err.message);

            console.log("Error: ", err);
        }}

    return (
        <div>
            <Formik
                initialValues={{
                    username: auth()?.username,
                    old_password: "",
                    new_password: "",
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
                        <PasswordInput name="old_password"/>
                        <PasswordChecker passwordName="new_password" confirmPasswordName="confirmPassword" />
                        <button type="submit" disabled={!isValid || isSubmitting} className="w-[400px] h-12 rounded-xl bg-secondary-color text-black text-opacity-80 text-center font-semibold opacity-80 hover:opacity-100">Submit</button>
                        <p className="text-red-500 font">{error}</p>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ChangePassword;