import React, { useState } from 'react';
import { db } from '../Firebase';
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import './Main.scss';
function SearchPatients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, "users"), where("role", "==", "patient"), where("displayName", "==", searchTerm));
      const querySnapshot = await getDocs(q);
      const users = [];
      querySnapshot.forEach(doc => {
        console.log(doc.data()); // Debug output to check data
        users.push({ ...doc.data(), uid: doc.id }); // Include doc.id to ensure 'uid' is available
      });
      setResults(users);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data');
      setLoading(false);
      console.error(err);
    }
  };
  return (
    <div className="search-patients">
      <div className="search-input">
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search patients by name" />
        <button onClick={handleSearch} disabled={loading}>{loading ? 'Loading...' : 'Search'}</button>
      </div>
      {error && <div className="error-message">Error: {error}</div>}
      <ul className="results-list">
        {results.map(user => (
          <li key={user.uid}>
            {user.displayName} - {user.email}
            <button onClick={() => navigate(`/sensor-dashboard/${user.uid}`)}>View Sensors</button>
            <button onClick={() => navigate(`/patient-profile/${user.uid}`)}>View Profile</button>
          </li>
        ))}
      </ul>
    </div>
  );
  
}

export default SearchPatients;
