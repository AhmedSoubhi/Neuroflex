#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

// Network credentials
#define WIFI_SSID "soubhi"
#define WIFI_PASSWORD "0507965284"


// Firebase project API Key and database URL
#define API_KEY "AIzaSyDrIHxdEAJsTA6JDUIWlFEoLVftC9hK9C8"
#define DATABASE_URL "https://smart-db586-default-rtdb.europe-west1.firebasedatabase.app/"

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

#define ENA_PIN  19
#define IN1_PIN  22
#define IN2_PIN  23

int currentSpeed = 255; // Default speed
int currentReps = 1;    // Default number of repetitions
const int pwmChannel = 0;    // PWM channel
void setup() {
  Serial.begin(115200);
  pinMode(ENA_PIN, OUTPUT);
  pinMode(IN1_PIN, OUTPUT);
  pinMode(IN2_PIN, OUTPUT);

  const int freq = 5000;
  const int resolution = 8;
  ledcSetup(pwmChannel, freq, resolution);
  ledcAttachPin(ENA_PIN, pwmChannel);
  ledcWrite(pwmChannel, currentSpeed);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println(" connected!");
 Serial.println(WiFi.localIP());

  config.api_key = API_KEY;
    config.database_url = DATABASE_URL;
    Firebase.begin(&config, &auth);
    Firebase.reconnectWiFi(true);


  // Ensure database paths are initialized
  initializeFirebase("/actuators/speed", currentSpeed);
  initializeFirebase("/actuators/reps", currentReps);

  Firebase.RTDB.setStreamCallback(&fbdo, streamCallback, streamTimeoutCallback);
  Firebase.RTDB.beginStream(&fbdo, "/actuators");
     if (Firebase.signUp(&config, &auth, "", "")) {
        Serial.println("Firebase sign-up successful");
    } else {
        Serial.printf("Firebase sign-up failed: %s\n", config.signer.signupError.message.c_str());
    }

    Serial.println("System and sensors ready");
}

void loop() {
  // No need to handle anything in loop, Firebase handles updates via callbacks
}

void streamCallback(FirebaseStream data) {
  String path = data.dataPath();
  String value = data.stringData();

  if (path == "/speed") {
    int newSpeed = value.toInt();
    if (newSpeed >= 0 && newSpeed <= 255) {
      currentSpeed = newSpeed;
      ledcWrite(pwmChannel, currentSpeed);
      Serial.print("Speed updated to ");
      Serial.println(currentSpeed);
    }
  } else if (path == "/reps") {
    int newReps = value.toInt();
    if (newReps > 0) {
      currentReps = newReps;
      operateActuator();
    }
  }
}

void streamTimeoutCallback(bool timeout) {
  if (timeout) {
    Serial.println("Firebase stream timeout, reconnecting...");
    Firebase.RTDB.beginStream(&fbdo, "/actuators");
  }
}

void operateActuator() {
  for (int i = 0; i < currentReps; i++) {
    Serial.println("Extending the actuator");
    digitalWrite(IN1_PIN, HIGH);
    digitalWrite(IN2_PIN, LOW);
    delay(6500);
    Serial.println("Retracting the actuator");
    digitalWrite(IN1_PIN, LOW);
    digitalWrite(IN2_PIN, HIGH);
    delay(6500);
  }
  Serial.println("Stopping the actuator");
  digitalWrite(IN1_PIN, LOW);
  digitalWrite(IN2_PIN, LOW);
}

void initializeFirebase(String path, int defaultValue) {
  if (!Firebase.RTDB.getInt(&fbdo, path)) {
    Serial.print("Initializing ");
    Serial.print(path);
    Serial.print(" to ");
    Serial.println(defaultValue);
    if (!Firebase.RTDB.setInt(&fbdo, path, defaultValue)) {
      Serial.print("Failed to initialize ");
      Serial.print(path);
      Serial.print(": ");
      Serial.println(fbdo.errorReason());
    }
  }
}
