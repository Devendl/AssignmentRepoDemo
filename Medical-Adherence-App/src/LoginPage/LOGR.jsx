import styles from './LOGR.module.css';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios'
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
function LOGR(){
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();
    var message = searchParams.get('message');
    const SignIn = (e) => {
        e.preventDefault()
        axios.post('http://localhost:3000/SignIn', {email, password})
        .then(result => {
            if(result.data === "Fail"){
                setError("Invalid email or password. Please try again.")
            }else{
                localStorage.setItem('token',result.data.token);
                navigate('/dashboard')
            }
        })
        .catch(err=> console.log(err))
    }
    useEffect(() => {
        if (message) {
          setError("Session expired please sign back in");
        }
      }, [searchParams]);

    return(
        <div className={styles.myDiv}>
            <h1>Sign in to MediTrack</h1>
            {error && <p className={styles.ErrorM}>{error}</p>}
            <div className="inputsContainer">
                <div className={styles.inputE}>
                    <label for="Email">Email</label>
                    <input type="email"  id="Email" onChange={(e)=> setEmail(e.target.value)}/>
                </div>
                <div className={styles.inputP}>
                    <label for="Password">Password</label>
                    <input type="password" id="Password" onChange={(e)=> setPassword(e.target.value)}/>
                </div>
            </div>
            <div className={styles.forgetPDiv}>
                <button className={styles.forgetPButton}>Forgot Password?</button>
            </div>
            <div className={styles.buttonsdiv}>
                <button className={styles.SignIn} onClick={SignIn}>Sign In</button>
            </div>
            <div className={styles.SignUpdiv}>
                <p className={styles.Normal}>Don't have an account yet?</p>
                <Link className={styles.SignUp} to="/register">Make one here</Link>
            </div>
        </div>

    );
    
}

export default LOGR