The NeuroFlex-Glove project is an IoT-based smart glove designed for hand rehabilitation. It combines embedded sensors and actuators with a real-time monitoring system to assist patients in restoring hand function. This innovative approach aims to enhance rehabilitation efficiency and patient engagement by providing personalized exercises and interactive feedback.

Key Components
ESP32 Microcontroller: This serves as the central processing unit for the glove, handling data from sensors and controlling actuators. It features built-in Wi-Fi and Bluetooth for seamless data transmission to a web server.

Flex Sensors: These sensors measure the degree of finger bending, providing essential data for tracking hand movements during exercises.

Force Sensitive Resistors (FSR): These sensors detect the force exerted by the hand, helping to monitor grip strength and pressure distribution.

Mechanical Actuators: Mounted on the fingers, these actuators assist or resist finger movements based on the patient's needs, facilitating various rehabilitation exercises.

Firebase Realtime Database: This cloud-based database stores and synchronizes data in real-time, allowing both patients and therapists to access exercise data and progress remotely.

Web Application: Developed using React JS, Node.js, and PostgreSQL, this web application provides an interface for patients to view their progress and for therapists to monitor and customize rehabilitation plans.

System Overview
Hardware Integration: The smart glove integrates multiple sensors (flex sensors, FSRs) with the ESP32 microcontroller. The ESP32 processes sensor data and controls the actuators, which aid in finger movements.

Real-Time Data Processing: Sensor data is transmitted to a Firebase Realtime Database via the ESP32’s Wi-Fi module. This data is then visualized in real-time on the web application, providing immediate feedback to users.

Software Architecture:

Frontend: Built with React JS for a responsive user interface, allowing users to interact with the system easily.
Backend: Developed using Node.js, handling data requests and communication with the database.
Database: PostgreSQL stores user profiles, session logs, and sensor data, ensuring secure and reliable data management.
User Interaction: Patients wear the smart glove during rehabilitation exercises. The sensors collect data on hand movements and forces, which is processed by the ESP32 and transmitted to the web application. Therapists can monitor this data in real-time, adjust exercise plans, and provide feedback.

Implementation
Prototyping: Initial prototypes of the glove are created using soft materials and 3D printing for comfort and adaptability. These prototypes are iteratively improved based on feedback from preliminary testing.

Firmware Development: The ESP32 firmware is developed using the Arduino IDE with C++, focusing on sensor data acquisition and processing, as well as data transmission to the web server.

Web Development: The web application is developed using HTML5, CSS3, JavaScript, and PHP, providing a user-friendly interface for data visualization and interaction.

Testing and Validation: The system undergoes rigorous testing to ensure functionality, accuracy, and user satisfaction. This includes black box testing for usability and white box testing for code validation.

Conclusion
The NeuroFlex-Glove project represents a significant advancement in rehabilitation technology, offering a state-of-the-art solution to assist in hand recovery. By integrating real-time data processing, interactive feedback, and personalized rehabilitation plans, it aims to improve the overall effectiveness and accessibility of hand therapy.
