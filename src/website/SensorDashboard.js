import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from "firebase/database";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './Style.scss'; // Import custom SCSS for additional styling

// Sensor dashboard specific Firebase configuration
const sensorFirebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

const sensorApp = initializeApp(sensorFirebaseConfig, "SensorDashboard");
const realDatabase = getDatabase(sensorApp);

const SensorDashboard = () => {
  const sensorPaths = [
    'FSR_sensor_1/force', 'FSR_sensor_2/force', 'FSR_sensor_3/force',
    'FSR_sensor_4/force', 'FSR_sensor_5/force',
    'Flex_sensor_1/angle', 'Flex_sensor_6/angle', 'Flex_sensor_3/angle',
    'Flex_sensor_4/angle', 'Flex_sensor_5/angle',
    'accelerometer/roll', 'accelerometer/pitch', 'accelerometer/yaw'
  ];

  const [sensorData, setSensorData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [speed, setSpeed] = useState(255);
  const [reps, setReps] = useState(1);

  useEffect(() => {
    const handles = sensorPaths.map(path => {
      const sensorRef = ref(realDatabase, path);
      return onValue(sensorRef, snapshot => {
        const data = snapshot.val();
        setSensorData(prevData => ({
          ...prevData,
          [path]: data ?? "N/A"
        }));
      }, errorObject => {
        console.error('Firebase read failed:', errorObject);
        setError(`Failed to fetch sensor data. Error: ${errorObject.message}`);
      });
    });
  
    setLoading(false);
    return () => handles.forEach(unsub => unsub());
  }, []);

  const handleSpeedChange = (event) => {
    const newSpeed = parseInt(event.target.value);
    setSpeed(newSpeed);
    set(ref(realDatabase, '/actuators/speed'), newSpeed);
  };

  const handleRepsChange = (event) => {
    const newReps = parseInt(event.target.value);
    if (!isNaN(newReps)) {
      setReps(newReps);
      set(ref(realDatabase, '/actuators/reps'), newReps);
    } else {
      console.error("Invalid input for number of repetitions");
    }
  };
  
  if (loading) return <div>Loading sensor data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="sensor-dashboard">
      <h1>ESP32 Firebase Web App Example</h1>

      <h2>FSR Sensor Readings</h2>
      <div className="sensor-container">
        {sensorPaths.slice(0, 5).map((path, index) => (
          <div key={path} className="sensor-card">
            <h3>Sensor {index + 1}</h3>
            <CircularProgressbar
              value={isNaN(sensorData[path]) ? 0 : sensorData[path]}
              text={`${sensorData[path]} N`}
              maxValue={10}
              styles={buildStyles({
                pathColor: `rgba(62, 152, 199, ${sensorData[path] / 10})`,
                textColor: '#f88',
                trailColor: '#d6d6d6',
              })}
            />
          </div>
        ))}
      </div>

      <h2>Flex Sensor Readings</h2>
      <div className="sensor-container">
        {sensorPaths.slice(5, 10).map((path, index) => (
          <div key={path} className="sensor-card">
            <h3>Sensor {index + 1}</h3>
            <CircularProgressbar
              value={isNaN(sensorData[path]) ? 0 : sensorData[path]}
              text={`${sensorData[path]}°`}
              maxValue={90}
              styles={buildStyles({
                pathColor: `rgba(255, 165, 0, ${sensorData[path] / 90})`,
                textColor: '#f88',
                trailColor: '#d6d6d6',
              })}
            />
          </div>
        ))}
      </div>

      <h2>Accelerometer Readings</h2>
      <div className="accelerometer-container">
        {['accelerometer/roll', 'accelerometer/pitch', 'accelerometer/yaw'].map(path => (
          <div key={path} className="accelerometer-card">
            <h3>{path.split('/')[1]}</h3>
            <div className="accelerometer-value">
              {sensorData[path] ?? "N/A"}
            </div>
          </div>
        ))}
      </div>

      <div className="control-container">
        <label>Actuator Speed:</label>
        <input 
          type="number" 
          value={speed} 
          onChange={handleSpeedChange} 
          className="control-input" 
        />
      </div>

      <div className="control-container">
        <label>Number of Repetitions:</label>
        <input 
          type="number" 
          value={reps} 
          onChange={handleRepsChange} 
          className="control-input" 
        />
      </div>
    </div>
  );
};

export default SensorDashboard;
