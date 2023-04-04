import { useEffect } from "react";
import { useSearchParams } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import { setAuth } from "../api/spotify";

const SignedIn = () => {
    // read the query parameters
    const searchParams = useSearchParams()[0];
    const navigate = useNavigate();

    useEffect(() => {
        // read the query params
        const code = searchParams.get("code");
        if (!code) { // if we don't find a code param, then they didn't accept permissions
            navigate("/fail");
        }
        else {
            // then we can set that code paramter in spotify.
            setAuth(code).then(() => {
                navigate("/form")
            });
        }
    }, [searchParams, navigate]);

    return (
        <>
            Signed in. redirecting.
        </>
    )
}

export default SignedIn;