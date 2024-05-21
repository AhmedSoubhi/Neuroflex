#include <CD74HC4067.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

// Network credentials
#define WIFI_SSID "soubhi"
#define WIFI_PASSWORD "0507965284"

// Firebase project API Key and database URL
#define API_KEY ""
#define DATABASE_URL ""

// Define Firebase Data object
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// Pin definitions for the multiplexer
#define S0 18
#define S1 5
#define S2 16
#define S3 17
#define SIG_PIN 32 // Analog input pin
const int x_out = 33;
const int y_out = 35;
const int z_out = 34;
double roll, pitch, yaw;
// Initialize the multiplexer
CD74HC4067 multiplexer(S0, S1, S2, S3);

const int NUM_FLEX_SENSORS = 7;
const int NUM_FSR_SENSORS = 6;
float newtons[NUM_FSR_SENSORS];

// Flex Sensor setup
const float VCC = 3.3;
const float R_DIV = 35000.0;
const float flatResistance = 30000.0;
const float bendResistance = 90000.0;

void setup() {
    Serial.begin(115200);

    // Set up pins for multiplexer control
    pinMode(S0, OUTPUT);
    pinMode(S1, OUTPUT);
    pinMode(S2, OUTPUT);
    pinMode(S3, OUTPUT);
    pinMode(SIG_PIN, INPUT);

    // Connect to WiFi
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    Serial.print("Connecting to WiFi");
    while (WiFi.status() != WL_CONNECTED) {
        Serial.print(".");
        delay(300);
    }
    Serial.println(" connected!");
    Serial.println(WiFi.localIP());

    // Initialize Firebase
    config.api_key = API_KEY;
    config.database_url = DATABASE_URL;
    Firebase.begin(&config, &auth);
    Firebase.reconnectWiFi(true);

    // Try to sign up with Firebase
    if (Firebase.signUp(&config, &auth, "", "")) {
        Serial.println("Firebase sign-up successful");
    } else {
        Serial.printf("Firebase sign-up failed: %s\n", config.signer.signupError.message.c_str());
    }

    Serial.println("System and sensors ready");
}

void loop() {
    // Flex Sensor readings
    for (int i = 0; i < NUM_FLEX_SENSORS; i++) {
        multiplexer.channel(i);
        delay(50);
        int ADCflex = analogRead(SIG_PIN);
        float Vflex = ADCflex * VCC / 4095.0;
        float Rflex = R_DIV * (VCC / Vflex - 1.0);
        float angle = mapFloat(Rflex, flatResistance, bendResistance, 0, 90);
        angle = constrain(angle, 0, 90);
        String flexPath = "/Flex_sensor_" + String(i) + "/angle";
        Firebase.RTDB.setFloat(&fbdo, flexPath.c_str(), angle);
        Serial.print("Flex Sensor ");
        Serial.print(i);
        Serial.print(": ");
        Serial.print(angle);
        Serial.println(" degrees");
    }

    // FSR readings
    for (int i = 0; i < NUM_FSR_SENSORS; i++) {
        int channelIndex = i + NUM_FLEX_SENSORS; // Offset by the number of Flex sensors
        multiplexer.channel(channelIndex);
        delay(50);
        int fsrReading = analogRead(SIG_PIN);
        float voltage = fsrReading * (3.3 / 4095.0);
        newtons[i] = (voltage / 3.3) * 10.0;
        String fsrPath = "/FSR_sensor_" + String(i) + "/force";
        Firebase.RTDB.setFloat(&fbdo, fsrPath.c_str(), newtons[i]);
        Serial.print("FSR Sensor ");
        Serial.print(i);
        Serial.print(": ");
        Serial.print(newtons[i]);
        Serial.println(" newtons");
    }
int x_adc_value = analogRead(x_out);
    int y_adc_value = analogRead(y_out);
    int z_adc_value = analogRead(z_out);
    
    double x_g_value = (((double)(x_adc_value * 3.3)/4096) - 1.65) / 0.330;
    double y_g_value = (((double)(y_adc_value * 3.3)/4096) - 1.65) / 0.330;
    double z_g_value = (((double)(z_adc_value * 3.3)/4096) - 1.80) / 0.330;

    roll = (((atan2(y_g_value,z_g_value) * 180) / 3.14) + 180);
    pitch = (((atan2(z_g_value,x_g_value) * 180) / 3.14) + 180);
    yaw = ((atan2(x_g_value, y_g_value) * 180) / 3.14) + 180;

    // Post roll and pitch to Firebase
    Firebase.RTDB.setDouble(&fbdo, "/accelerometer/roll", roll);
    Firebase.RTDB.setDouble(&fbdo, "/accelerometer/pitch", pitch);
    Firebase.RTDB.setDouble(&fbdo, "/accelerometer/yaw", yaw);
    delay(2000); // Adjust the delay as needed
}

// Helper function to map the resistance to angle
float mapFloat(float x, float in_min, float in_max, float out_min, float out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
