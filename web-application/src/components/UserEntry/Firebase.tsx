
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";



const firebaseConfig = {
    apiKey: "AIzaSyAb3HLdiLNzXkFppZ0Vn4CX1cFDIRATxug",
    authDomain: "my-project-95793-cs308.firebaseapp.com",
    projectId: "my-project-95793-cs308",
    storageBucket: "my-project-95793-cs308.appspot.com",
    messagingSenderId: "751309334758",
    appId: "1:751309334758:web:c620f36537c104662d3327",
    measurementId: "G-ZMB6HRC9RS"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export const SignInWithGoogle = () => {
    signInWithPopup(auth,provider)
        .then((result)  => {
            console.log(result);


        }).catch((error) =>  {
        console.log(error);
    })
};
