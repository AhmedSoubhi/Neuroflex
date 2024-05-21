import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';

const SensorReadings = () => {
  const NUM_FSR_SENSORS = 5;
  const [sensorReadings, setSensorReadings] = useState(new Array(NUM_FSR_SENSORS).fill(0));

  useEffect(() => {
    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyBC4fT2nSr2oH6bXUmxToMdQ45feqkwNZ0",
        authDomain: "smartglove-c9b51.firebaseapp.com",
        databaseURL: "https://smartglove-c9b51-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "smartglove-c9b51",
        storageBucket: "smartglove-c9b51.appspot.com",
        messagingSenderId: "747770955188",
        appId: "1:747770955188:web:01ae5f6584f0bed1181ee1",
        measurementId: "G-VLMPPL4XC5"
    };

    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    // Database Paths for FSR sensors
    const dataPaths = [
      'FSR_sensor_1/force',
      'FSR_sensor_2/force',
      'FSR_sensor_3/force',
      'FSR_sensor_4/force',
      'FSR_sensor_5/force'
    ];

    // Get database references for FSR sensors
    const database = firebase.database();
    const databaseRefs = dataPaths.map(path => database.ref(path));

    // Attach asynchronous callbacks to read the data for each sensor
    const unsubscribeCallbacks = databaseRefs.map((ref, index) => {
      return ref.on('value', (snapshot) => {
        const newReadings = [...sensorReadings];
        newReadings[index] = snapshot.val();
        setSensorReadings(newReadings);
        console.log("Sensor " + (index + 1) + " Reading:", newReadings[index]);
      }, (errorObject) => {
        console.log('The read failed for Sensor ' + (index + 1) + ': ' + errorObject.name);
      });
    });

    // Cleanup by unsubscribing from Firebase listeners
    return () => {
      unsubscribeCallbacks.forEach(unsubscribe => unsubscribe());
    };
  }, [sensorReadings]); // Include sensorReadings in dependency array to handle updates

  return (
    <div>
      {sensorReadings.map((reading, index) => (
        <p key={index}>Sensor {index + 1} reading: {reading}</p>
      ))}
    </div>
  );
};

export default SensorReadings;
