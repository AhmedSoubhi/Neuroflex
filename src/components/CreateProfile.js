import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { db } from '../Firebase';
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../Context/AuthContext";
import "./navmenu.scss"  // Assuming you have an SCSS file for styles

export default function CreateProfile() {
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [allergies, setAllergies] = useState("");
    const [gender, setGender] = useState("");
    const [age, setAge] = useState("");
    const [dob, setDob] = useState("");
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        if (!currentUser) {
            console.error("No user logged in");
            return;
        }
    
        try {
            // Update Firestore with user profile information, ensuring display name is not altered
            await setDoc(doc(db, "users", currentUser.uid), {
                firstName,
                middleName,
                lastName,
                phone,
                address,
                allergies,
                gender,
                age,
                dateOfBirth: dob
            }, { merge: true });  // Using { merge: true } to avoid overwriting existing fields unintentionally

            navigate("/dashboard");  // Redirects the user to the dashboard after profile creation
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    }

    return (
        <Card>
            <Card.Body>
                <h2 className="text-center mb-4">Create Your Profile</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group id="firstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" required onChange={e => setFirstName(e.target.value)} />
                    </Form.Group>
                    <Form.Group id="middleName">
                        <Form.Label>Middle Name</Form.Label>
                        <Form.Control type="text" onChange={e => setMiddleName(e.target.value)} />
                    </Form.Group>
                    <Form.Group id="lastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" required onChange={e => setLastName(e.target.value)} />
                    </Form.Group>
                    <Form.Group id="phone">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control type="text" required onChange={e => setPhone(e.target.value)} />
                    </Form.Group>
                    <Form.Group id="address">
                        <Form.Label>Address</Form.Label>
                        <Form.Control type="text" required onChange={e => setAddress(e.target.value)} />
                    </Form.Group>
                    <Form.Group id="allergies">
                        <Form.Label>Allergies</Form.Label>
                        <Form.Control type="text" onChange={e => setAllergies(e.target.value)} />
                    </Form.Group>
                    <Form.Group id="gender">
                        <Form.Label>Gender</Form.Label>
                        <Form.Control as="select" required onChange={e => setGender(e.target.value)}>
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group id="age">
                        <Form.Label>Age</Form.Label>
                        <Form.Control type="number" required onChange={e => setAge(e.target.value)} />
                    </Form.Group>
                    <Form.Group id="dob">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control type="date" required onChange={e => setDob(e.target.value)} />
                    </Form.Group>
                    <Button className="w-100" type="submit">Create Profile</Button>
                </Form>
            </Card.Body>
        </Card>
    );
}
