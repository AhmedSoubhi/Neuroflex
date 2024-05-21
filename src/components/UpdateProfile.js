import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { db } from '../Firebase'; // Import your Firebase setup
import { doc, updateDoc } from "firebase/firestore"; // Import Firestore methods

export default function UpdateProfile() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const firstNameRef = useRef();
  const middleNameRef = useRef();
  const lastNameRef = useRef();
  const phoneRef = useRef();
  const injuryTypeRef = useRef(); // Ref for injury description
  const rehabStartRef = useRef(); // Ref for rehab start date
  const rehabEndRef = useRef(); // Ref for rehab end date
  const { currentUser, updatePassword, updateEmail } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    // Check if refs are correctly set
    if (!emailRef.current || !passwordRef.current || !passwordConfirmRef.current) {
      setError("Some form fields are not initialized properly.");
      setLoading(false);
      return; // Stop further execution if refs are not initialized
    }
  
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      setError("Passwords do not match");
      setLoading(false);
      return; // Stop further execution if passwords do not match
    }
  
    try {
      const promises = [];
      if (emailRef.current.value !== currentUser.email) {
        promises.push(updateEmail(emailRef.current.value));
      }
      if (passwordRef.current.value) {
        promises.push(updatePassword(passwordRef.current.value));
      }
  
      // Proceed with updating the profile
      const userProfileRef = doc(db, "users", currentUser.uid);
      const updatedProfile = {
        firstName: firstNameRef.current?.value,
        middleName: middleNameRef.current?.value,
        lastName: lastNameRef.current?.value,
        phone: phoneRef.current?.value,
        injuryDescription: injuryTypeRef.current?.value,
        rehabStartDate: rehabStartRef.current?.value,
        rehabEndDate: rehabEndRef.current?.value,
      };
  
      promises.push(updateDoc(userProfileRef, updatedProfile));
      
      await Promise.all(promises);
      navigate("/");
    } catch (error) {
      setError(`Failed to update account. Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }
  
  

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Update Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
          <Form.Group id="email">
  <Form.Label>Email</Form.Label>
  <Form.Control type="email" ref={emailRef} required defaultValue={currentUser?.email} />
</Form.Group>
<Form.Group id="password">
  <Form.Label>Password</Form.Label>
  <Form.Control type="password" ref={passwordRef} required />
</Form.Group>
<Form.Group id="passwordConfirm">
  <Form.Label>Confirm Password</Form.Label>
  <Form.Control type="password" ref={passwordConfirmRef} required />
</Form.Group>

            <Form.Group id="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" ref={firstNameRef} required defaultValue="" />
            </Form.Group>
            <Form.Group id="middleName">
              <Form.Label>Middle Name</Form.Label>
              <Form.Control type="text" ref={middleNameRef} defaultValue="" />
            </Form.Group>
            <Form.Group id="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" ref={lastNameRef} required defaultValue="" />
            </Form.Group>
            <Form.Group id="phone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="text" ref={phoneRef} required defaultValue="" />
            </Form.Group>
            <Form.Group id="injuryDescription">
              <Form.Label>Injury Description</Form.Label>
              <Form.Control as="textarea" rows={3} ref={injuryTypeRef} required />
            </Form.Group>
            <Form.Group id="rehabStartDate">
              <Form.Label>Rehabilitation Start Date</Form.Label>
              <Form.Control type="date" ref={rehabStartRef} required />
            </Form.Group>
            <Form.Group id="rehabEndDate">
              <Form.Label>Rehabilitation End Date</Form.Label>
              <Form.Control type="date" ref={rehabEndRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Update
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Link to="/">Cancel</Link>
      </div>
    </>
  );
}
