import React, { useState, useEffect } from 'react';
import { db, storage } from '../Firebase';
import { doc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref as storageRef } from "firebase/storage";
import { useParams } from 'react-router-dom';

export default function PatientProfileDisplay() {
    const { patientId } = useParams();
    const [patientData, setPatientData] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Fetching data for patient ID:", patientId);
        const fetchProfileData = async () => {
            if (patientId) {
                const docRef = doc(db, "users", patientId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    console.log("Document data:", data);
                    setPatientData(data);

                    try {
                        const imageRef = storageRef(storage, `avatars/${patientId}`);
                        const imageUrl = await getDownloadURL(imageRef);
                        setProfileImage(imageUrl);
                        console.log("Image URL:", imageUrl);
                    } catch (error) {
                        console.error("Error fetching avatar image:", error);
                        setProfileImage("/default-avatar.png");
                    }
                } else {
                    console.log("No such document!");
                }
                setLoading(false);
            } else {
                console.log("No patient ID provided");
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [patientId]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="patient-profile-display">
            <div className="profile-section">
                <img src={profileImage} alt="Profile" />
                {patientData && (
                    <>
                        <h1>{`${patientData.firstName} ${patientData.middleName} ${patientData.lastName}`}</h1>
                        <p>{patientData.phone}</p>
                        <p>{patientData.email}</p>
                        <p>{patientData.address}</p>
                    </>
                )}
            </div>
            <div className="overview-section">
                {patientData && (
                    <>
                        <p>Gender: {patientData.gender}</p>
                        <p>Date of Birth: {patientData.dob}</p>
                        <p>Allergies: {patientData.allergies}</p>
                        {/* Other overview details */}
                    </>
                )}
            </div>
            {/* Add other sections as necessary */}
        </div>
    );
}
