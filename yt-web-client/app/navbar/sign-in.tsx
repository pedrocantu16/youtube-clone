"use client";

import { signInWithGoogle, signOutWithGoogle } from "@/app/utils/firebase/firebase";
import styles from "./sign-in.module.css";
import { Fragment } from "react";
import { User } from "firebase/auth";

interface SignInProps {
    user: User | null;
}

export default function SignIn({ user }: SignInProps) {

    return (
        <Fragment>
            {
                user ? 
                (
                    <button className={styles.sigin} onClick={signOutWithGoogle}>
                    Sign Out
                    </button> 
                ) : (
                    <button className={styles.signout} onClick={signInWithGoogle}>
                    Sign In
                    </button>
                )
            }
        </Fragment>
    )
}
