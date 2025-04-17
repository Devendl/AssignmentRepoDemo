import styles from './Register.module.css';
import {useState} from "react";
import axios from 'axios'
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
function Register(){
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const createA = (e) => {
        e.preventDefault()
        axios.post('http://localhost:3000/createA', {name, email, password})
        .then(result => {
            if(result.data === "Success"){
                navigate('/login')
            }else{
                setError("This email is already registered. Please log in or use a different email to sign up.")
            }
        })
        .catch(err=> console.log(err))
    }
    return(
        <div className={styles.myDiv}>
            < h1 className = {styles.header}>Create an Account</h1>
           
            {error && <p className={styles.ErrorM}>{error}</p>}
        
            <div className="inputsContainer">
                <div className={styles.inputN}>
                    <label for="Name">Name</label>
                    <input type="text"  id="Name" onChange={(e)=> setName(e.target.value)}/>
                </div>
                <div className={styles.inputE}>
                    <label for="Email">Email</label>
                    <input type="email"  id="Email" onChange={(e)=> setEmail(e.target.value)}/>
                </div>
                <div className={styles.inputP}>
                    <label for="Password">Password</label>
                    <input type="password" id="Password" onChange={(e)=> setPassword(e.target.value)}/>
                </div>
            </div>
            <div className={styles.PreqDiv}>
                  <p className={styles.TermsP}>By creating an account you agree to our <span className={styles.underline}>Terms of Service</span> and <span className={styles.underline}>Privacy Policy</span></p>
            </div>
            <div className={styles.buttonsdiv}>
                <button className={styles.CreateAccount} onClick={createA}>Create Account</button>
            </div>
            <div className={styles.SignIndiv}>
                <p className={styles.Normal}>Already have an account?</p>
                <Link className={styles.SignIn} to="/login">Sign in</Link>
            </div>
        </div>

    );
    
}

export default Register