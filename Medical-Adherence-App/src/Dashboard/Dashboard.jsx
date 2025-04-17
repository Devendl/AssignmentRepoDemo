import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import Charted from './Charted.jsx';
import logo from '../assets/starLogo.png';
import noti from '../assets/emailIcon.png';
import account from '../assets/accountIcon.png';
import dots from '../assets/3Dots.png';
import xIcon from '../assets/xicon.webp';
import rIcon from '../assets/rIcon.png';
import wIcon from '../assets/wIcon.png';
import sIcon from '../assets/sIcon.png';
function Dashboard(){
    const [userName, setName] = useState(null);
    const [medicine, setMedicine] = useState(null);
    const [dosage, setDosage] = useState(null);
    const [units, setUnits] = useState("mL");
    const [rName, setrName] = useState(null);
    const [dateT, setdateT] = useState(null);
    const [medicationTab, setmedicationTab] = useState(false);
    const [reminderTab, setreminderTab] = useState(false);
    const [logTab, setlogTab] = useState(false);
    const [medications, setMedications] = useState([]);
    const [reminders, setReminders] = useState([]);
    const navigate = useNavigate()
    const logout = () =>{
        localStorage.removeItem('token');
        localStorage.clear();
        navigate('/');
    }
    const labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const datasets = medications.map((med) => {
        const hexColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
      
        return {
          label: med.name,
          data: med.dosesThisWeek,
          borderColor: hexColor,
          backgroundColor: hexColor, // match with transparency
        };
    });
    
    

    const addReminder = () => {
        const dateTime = new Date(dateT);
        console.log(medicine+dosage);
        axios.post('http://localhost:3000/addReminder', {rName,medicine, dateTime},{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
        })
        .then(result => {
            checkReminders();
            setreminderTab(false);
        })
        .catch(err=> {
            if (err.status === 401 || err.status === 403) {
                // Token expired or invalid
                localStorage.removeItem('token');
                navigate('/login?message=TokenExpired');
            }
        })
    }

    const addLog = () => {
        const today = new Date();
        axios.post('http://localhost:3000/addLog', {medicine, dosage,today},{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
        })
        .then(result => {
            setlogTab(false);
            checkMeds();
            console.log(logTab);
        })
        .catch(err=> {
            if (err.status === 401 || err.status === 403) {
                // Token expired or invalid
                localStorage.removeItem('token');
                navigate('/login?message=TokenExpired');
            }
        })
    }

    const checkReminders = () => {
        axios.post('http://localhost:3000/checkReminders', {},{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
        })
        .then(result => {
            setReminders(result.data.reminders);
        })
        .catch(err=> {
            if (err.status === 401 || err.status === 403) {
                // Token expired or invalid
                localStorage.removeItem('token');
                navigate('/login?message=TokenExpired');
            }
        })
    }


    const addMeds = () => {
        const send = dosage+units;
        console.log(medicine+dosage);
        axios.post('http://localhost:3000/addMeds', {medicine, send},{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
        })
        .then(result => {
            checkMeds();
            console.log(result.data)
        })
        .catch(err=> {
            if (err.status === 401 || err.status === 403) {
                // Token expired or invalid
                localStorage.removeItem('token');
                navigate('/login?message=TokenExpired');
            }
        })
    }

    const checkMeds = () => {
        axios.post('http://localhost:3000/checkMeds', {},{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
        })
        .then(result => {
            console.log(result.data.medications)
            setMedications(result.data.medications);
        })
        .catch(err=> {
            if (err.status === 401 || err.status === 403) {
                // Token expired or invalid
                localStorage.removeItem('token');
                navigate('/login?message=TokenExpired');
            }
        })
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
        checkReminders();
        checkMeds();
    }
    const functM = () =>{
        checkMeds();
        setmedicationTab(true);
    }
    const functR = () =>{
        checkMeds();
        setreminderTab(true);
    }
    useEffect(() => {
        obtainInfo(); // Call function when component mounts
      }, []);
    return(
        <>
            <div className={styles.container}>
                <div className={styles.MainDiv}>
                    <div className={styles.titleDiv}>
                        <img src={logo} className = {styles.logo}/>
                        <h1 className={styles.title}> MediTrack</h1>
                    </div>
                    
                    <div className={styles.welcomeDiv}>
                        <p className={styles.user}> Hello, {userName}!</p>
                        <p className={styles.created}>Created:</p>
                    </div>
                    <h1 className={styles.logH}> Log Adherence</h1>
                    <div className={styles.logDiv}>
                        <div className={styles.infoBox}>
                            <div className={styles.help}>
                                <h1 className={styles.infoH}>Medication adherence log</h1>
                                <button className={styles.i}>i</button>
                            </div>
                            <p className={styles.infoP}>Log current days medications<br></br>All logs available in weekly report which can be accessed by healthcare providers </p>
                            <button className={styles.logBt} onClick={() =>{setlogTab(true)}}>Log medications  →</button>

                        </div>
                        <div className={styles.infoBox}>
                            <div className={styles.help}>
                                <h1 className={styles.infoH}>Benefits of logging medical adherence</h1>
                                <button className={styles.i}>i</button>
                            </div>
                            <p className={styles.infoP}>Help patients follow healthplans and track behavioral changes. <br></br>Can help explain symptoms </p>
                            <button className={styles.infoL}>Learn more  →</button>
                        </div>
                        <div className={styles.infoBox}>
                             <div className={styles.help}>
                                <h1 className={styles.infoH}>Help healthcare providers provide treatment</h1>
                                <button className={styles.i}>i</button>
                            </div>
                            <p className={styles.infoP}>Help experts understand the patient's journey and resolve any issues <br></br>Info used to provide better treatment </p>
                            <button className={styles.infoL}>Learn more  →</button>
                        </div>
                    </div>
                  
                    <div className={styles.aDiv}>
                        <h1 className={styles.reportH}> Adherence Report</h1>
                        <div className={styles.chartDiv}>
                            <Charted labels={labels} datasets={datasets} />
                        
                        </div>
                            
                     
                    </div>
                </div>
                <div className={styles.sideDiv}>
                    <div className={styles.topBar}>
                        <button className={styles.imageButtonE}><img src={noti}/></button>
                        <button className={styles.barButton} onClick={functM}>Medications</button>
                        <button className={styles.barButton}onClick={functR}>Reminders</button>
                        <button className={styles.imageButton}><img src={account}/></button>
                        <button className={styles.imageButton2}><img src={dots}/></button>
                    </div>
                    <div className={styles.sideLabelDiv}>
                        <h1 className={styles.sideH}>Doctors' Notes</h1>
                        <button className={styles.seeAll}>See All</button>
                    </div>
                    <div className={styles.dDiv}>
                        <div className={styles.sideNotiDiv}>
                            <div className={styles.imgBD}>
                                <img src={wIcon} className={styles.imgB}/>
                            </div>
                            <h1 className={styles.snd}>Link your healthcare provider</h1>
                        </div>
                        <div className={styles.sideNotiDiv}>
                            <div className={styles.imgBD}>
                                <img src={wIcon} className={styles.imgB}/>
                            </div>
                            <h1 className={styles.snd}>Finish setting up account</h1>
                        </div>
            
                    </div>
                    <div className={styles.sideLabelDiv}>
                        <h1 className={styles.sideH}>Upcoming Reminders</h1>
                        <button className={styles.seeAll}>See All</button>
                    </div>
                    <div className={styles.dDiv}>
                        {reminders.length > 0 ? (
                                reminders.slice(0, 3).map((rem, i) => (
                                    <div className={styles.sideNotiDiv}>
                                         <div className={styles.imgBD}>
                                            <img src={rIcon} className={styles.imgB}/>
                                         </div>
                                         <div className={styles.sideNotiInD}>
                                            <h1 className={styles.snh}>{new Date(rem.scheduledTime).toLocaleString('default', { month: 'long' })} {new Date(rem.scheduledTime).getDay()}, {new Date(rem.scheduledTime).getFullYear()}, {new Date(rem.scheduledTime).toLocaleTimeString([], {hour: '2-digit',minute: '2-digit'})}</h1>
                                            <p className={styles.snp}>{rem.name}: {rem.medicine}</p>
                                        </div>
                                         
                                    </div>
                                ))
                            ) : (
                                <div className={styles.dDiv}>
                                    <img src={sIcon} className={styles.imgs}/>
                                    <h1 className={styles.snd}>No upcoming reminders found</h1>
                                </div>
                        )}
                    </div>
                    <div className={styles.sideLabelDiv}>
                        <h1 className={styles.sideH}>Past Reminders</h1>
                        <button className={styles.seeAll}>Clear All</button>
                    </div>
                    <div className={styles.dDiv}>
                        <img src={sIcon} className={styles.imgs}/>
                        <h1 className={styles.snd}>No past reminders found</h1>
                    </div>
                </div>
            </div>
            {medicationTab && (
                <div className={styles.greyOut}>
                   <div className={styles.mTab}>

                        <button className={styles.x} onClick={() =>{setmedicationTab(false)}}><img src={xIcon} /></button>
                         <div className={styles.addDiv}>
                            <input type="text" className={styles.inputMed}  onChange={(e)=> setMedicine(e.target.value)} placeholder="Medication"/>
                            <button className={styles.addB} onClick={addMeds} >Add</button>
                        </div>
                        <div className={styles.addDiv}>
                            <input type="number" className={styles.doseInputs} onChange={(e)=> setDosage(e.target.value)} placeholder="Dosage"/>
                            <select className={styles.doseUnits} onChange={(e)=> setUnits(e.target.value)}>
                                <option > </option>
                                <option >mL</option>
                                <option >mg</option>
                            </select>
                        </div>
                        
                        <div className={styles.slots}>
                            {medications.length > 0 ? (
                                medications.map((med, i) => (
                                    <div className={styles.fmDiv}>
                                        <div>
                                            <p className={styles.info}>{med.name}</p>
                                            <p className={styles.info2}>{med.dosage}</p>
                                        </div>
                                       
                                        <button className={styles.x2}>Remove</button>
                                    </div>
                                ))
                            ) : (
                                <p className={styles.noInfo}>No medications added yet...</p>
                            )}
                            
                        </div>
                   </div>
                </div>
            )}

            {reminderTab && (
                <div className={styles.greyOut}>
                   <div className={styles.rTab}>

                        <button className={styles.x} onClick={() =>{setreminderTab(false)}}><img src={xIcon} /></button>
                         <div className={styles.addDiv}>
                            <input type="text" className={styles.inputMed}  onChange={(e)=> setrName(e.target.value)} placeholder="Title"/>
                            <button className={styles.addB} onClick={addReminder} >Add</button>
                        </div>
                        <div className={styles.addDiv}>
                            <input type="datetime-local" className={styles.dateIn} onChange={(e)=> setdateT(e.target.value)}/>
                            <select className={styles.mChoice} onChange={(e)=> setMedicine(e.target.value)}>
                                <option > </option>
                                {medications.map((med, i) => (
                                    <option >{med.name} </option>
                                ))}
                            </select>
                        </div>
                   </div>
                </div>
            )}
             {logTab && (
                <div className={styles.greyOut}>
                   <div className={styles.rTab}>

                        <button className={styles.x} onClick={() =>{setlogTab(false)}}><img src={xIcon} /></button>
                         <div className={styles.addDiv}>
                            <select className={styles.inputM} onChange={(e)=> setMedicine(e.target.value)}>
                                <option > </option>
                                {medications.map((med, i) => (
                                    <option >{med.name} </option>
                                ))}
                            </select>
                            <button className={styles.addB} onClick={addLog} >Log</button>
                        </div>
                        
                        <div className={styles.addDiv}>
                            <input type="time" className={styles.doseInputs} onChange={(e)=> setdateT(e.target.value)}/>
                            <input type="number" className={styles.doseInputs} onChange={(e)=> setDosage(e.target.value)} placeholder="Dosage"/>
                        </div>
                   </div>
                </div>
            )}
        </>
    )
}

export default Dashboard;
