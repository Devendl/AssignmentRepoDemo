import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { Link } from 'react-router-dom';
function Dashboard(){
    const [userName, setName] = useState(null);
    const navigate = useNavigate()
    const logout = () =>{
        localStorage.removeItem('token');
        localStorage.clear();
        navigate('/');
    }
    


    
    const obtainInfo = (e) => {
       // e.preventDefault()
       //console.log(localStorage.getItem('token'))
        axios.post('http://localhost:3000/DashboardInfo', {},{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
        })
        .then(result => {
            console.log(result.data.name)
            setName(result.data.name)
        })
        .catch(err=> {
            if (err.status === 401 || err.status === 403) {
                // Token expired or invalid
                localStorage.removeItem('token');
                navigate('/login?message=TokenExpired');
            }
        })
    }
    useEffect(() => {
        obtainInfo(); // Call function when component mounts
      }, []);
    return(
        <>
            <h1> MediTrack Dashboard</h1>
            <h1> Welcome {userName}</h1>
            <div className="buttonsdiv">
                <button className="style" onClick={logout} >Logout</button>
            </div>
        </>
    )
}

export default Dashboard;
