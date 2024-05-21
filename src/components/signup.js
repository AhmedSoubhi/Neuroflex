import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert, FormSelect } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { auth, storage, db } from '../Firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passConfirmRef = useRef();
  const nameRef = useRef();
  const avatarRef = useRef();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const roleRef = useRef();  // Reference for role select
  const navigate = useNavigate();

  const handleSignup = async (email, password, displayName, file, role) => {
    setLoading(true);
    setError("");
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      let downloadURL = null;
  
      if (file) {
        const storageRef = ref(storage, `avatars/${user.uid}`);
        const uploadTask = await uploadBytes(storageRef, file);
        console.log('Uploaded a blob or file!');
        downloadURL = await getDownloadURL(uploadTask.ref);
      }
  
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName,
        email,
        role,  // Store role in Firestore
        photoURL: downloadURL,
      });
  
      try {
        // Your user creation logic
        navigate("/create-profile");
      } catch (error) {
        console.error("Error during signup:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
      
    } catch (error) {
      console.error("Error during signup:", error);
      setError('Failed to create an account. ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!avatarRef.current.files[0]) {
      setError("Please upload an avatar image.");
      return;
    }
  
    if (passwordRef.current.value !== passConfirmRef.current.value) {
      setError("Passwords do not match.");
      return;
    }
  
    setLoading(true);
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const displayName = nameRef.current.value;
    const file = avatarRef.current.files[0];
    const role = roleRef.current.value;

    handleSignup(email, password, displayName, file, role);
  };
  
  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="displayName">
              <Form.Label>Display Name</Form.Label>
              <Form.Control type="text" ref={nameRef} required />
            </Form.Group>
            <Form.Group id="role">
              <Form.Label>Role</Form.Label>
              <FormSelect ref={roleRef} required>
                <option value="">Select Role</option>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </FormSelect>
            </Form.Group>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Form.Group id="passwordConfirm">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" ref={passConfirmRef} required />
            </Form.Group>
            <Form.Group id="avatar">
              <Form.Label>Avatar</Form.Label>
              <Form.Control type="file" ref={avatarRef} />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/login">Log in</Link>
      </div>
    </>
  );
}
