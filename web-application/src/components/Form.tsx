
import React, { createContext, useContext, ReactNode } from 'react';
import { useUser } from '../contexts/UserContext';
import { useUserEntry } from '../contexts/UserEntryContext';
import axios from 'axios';

interface SignInData {
  email: string;
  password: string;
}

interface SignUpData {
    name: string;
    email: string;
    password: string;
}

interface RenewPassData {
    email: string;
}

interface FormContextProps {
  signIn: (data: SignInData) => void;
  signUp: (data: SignUpData) => void;
  renewPass: (data: RenewPassData) => void;
}

const FormContext = createContext<FormContextProps | null>(null);

{/* */}
{/* */}
{/* */}