#include <ESP8266WiFi.h> // Enables the ESP8266 to connect to the local network (via WiFi)
#include <PubSubClient.h> // Allows us to connect to, and publish to the MQTT broker
#include <SoftwareSerial.h>
#include "DHT.h"
#include "MQ7.h"

#define DHTPIN 12
#define DHTTYPE DHT22
#define MQ7PIN A0
#define MQ7V 5.0

//#define MUX_A 16
//#define MUX_B 5
//#define MUX_C 4

// WiFi
const char* ssid = "Raspberry";
const char* wifi_password = "projekt_iot_2020";
const char* clientID = "ESP8266_2";
const char* mqtt_server = "192.168.4.1";
const char* mqtt_username = "user2";
const char* mqtt_password = "pass2";

const char* mqtt_topic_temp = "sensor2/temperature/2";
const char* mqtt_topic_humm = "sensor2/humity/10";
const char* mqtt_topic_CO = "sensor2/CO/4";
const char* mqtt_topic_vibration = "sensor2/vibration/8";
const char* mqtt_topic_pm_1 = "sensor2/pm_1/12";
const char* mqtt_topic_pm_2_5 = "sensor2/pm_2_5/6";
const char* mqtt_topic_pm_10 = "sensor2/pm_10/14";


float pm_1;
float pm_2_5;
float pm_10;
DHT dht(DHTPIN, DHTTYPE);

float temperature;
float humidity;
float CO;
float vibration;

// Initialise the WiFi and MQTT Client objects
WiFiClient wifiClient;
PubSubClient client(mqtt_server, 1883, wifiClient); // 1883 is the listener port for the Broker
SoftwareSerial pmsSerial(13, 15);
MQ7 mq7(MQ7PIN, MQ7V);

void ReceivedMessage(char* topic, byte* payload, unsigned int length) {
  Serial.println((char)payload[0]);
  for (int i = 0; i < length; i ++)
  {
    Serial.print(char(payload[i]));
  }
  if ((char)payload[0] == '0') {
    digitalWrite(2, HIGH); // Notice for the HUZZAH Pin 0, HIGH is OFF and LOW is ON. Normally it is the other way around.
  }
  if ((char)payload[0] == '1') {
    digitalWrite(2, LOW);
  }
}

bool Connect() {
  // Connect to MQTT Server and subscribe to the topic
  if (client.connect(clientID, mqtt_username, mqtt_password)) {
    return true;
  }
  else {
    return false;
  }
}

void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, wifi_password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  const char* clientID = "ESP8266_2";
  client.setCallback(ReceivedMessage);
  if (Connect()) {
    Serial.println("Connected Successfully to MQTT Broker!");
  }
  else {
    Serial.println("Connection To MQTT Broker Failed!");
  }

//  pinMode(MUX_A, OUTPUT);
//  pinMode(MUX_B, OUTPUT);
//  pinMode(MUX_C, OUTPUT);

  dht.begin();
  pmsSerial.begin(9600);
}
struct pms5003data {
  uint16_t framelen;
  uint16_t pm10_standard, pm25_standard, pm100_standard;
  uint16_t pm10_env, pm25_env, pm100_env;
  uint16_t particles_03um, particles_05um, particles_10um, particles_25um, particles_50um, particles_100um;
  uint16_t unused;
  uint16_t checksum;
};

struct pms5003data data;

void loop() {
  if (readPMSdata(&pmsSerial)) {
    // reading data was successful!
    Serial.println();
    Serial.println("---------------------------------------");
    dht22Sensor();
    dfr0052Sensor();
    // changeMux(LOW, LOW, HIGH);
    // mq7Sensor();
    // changeMux(LOW, LOW, LOW);



    if (client.connected()) {
      Serial.println("===============MQTT================");
      client.publish(mqtt_topic_temp, String(temperature).c_str(), true);
      client.publish(mqtt_topic_humm, String(humidity).c_str(), true);
      client.publish(mqtt_topic_pm_1, String(data.pm10_standard).c_str(), true);
      client.publish(mqtt_topic_pm_2_5, String(data.pm25_standard).c_str(), true);
      client.publish(mqtt_topic_pm_10, String(data.pm100_standard).c_str(), true);
      client.publish(mqtt_topic_CO, String(CO).c_str(), true);
      client.publish(mqtt_topic_vibration, String(vibration).c_str(), true);
      Serial.println("===============END================");

    }
  }
}

float dht22Sensor()
{
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  if (isnan(t) || isnan(h)) {
    Serial.println("Failed to read from DHT sensor");
  }

  temperature = t;
  humidity = h;
}

bool readPMSdata(Stream *s) {
  if (! s->available()) {
    return false;
  }
  
  // Read a byte at a time until we get to the special '0x42' start-byte
  if (s->peek() != 0x42) {
    s->read();
    return false;
  }

  if (s->available() < 32) {
    return false;
  }

  uint8_t buffer[32];
  uint16_t sum = 0;
  s->readBytes(buffer, 32);

  // get checksum ready
  for (uint8_t i = 0; i < 30; i++) {
    sum += buffer[i];
  }
  // The data comes in endian'd, this solves it so it works on all platforms
  uint16_t buffer_u16[15];
  for (uint8_t i = 0; i < 15; i++) {
    buffer_u16[i] = buffer[2 + i * 2 + 1];
    buffer_u16[i] += (buffer[2 + i * 2] << 8);
  }

  // put it into a nice struct :)
  memcpy((void *)&data, (void *)buffer_u16, 30);

  if (sum != data.checksum) {
    Serial.println("Checksum failure");
    return false;
  }
  return true;
}

float mq7Sensor()
{
  float co = mq7.getPPM();
  CO = co;
}

float dfr0052Sensor()
{
  int v;
  v = analogRead(MQ7PIN);

  //      Serial.print("Vibration: ");
  //      Serial.println(v,DEC);

  vibration = v;
}

//void changeMux(int c, int b, int a) {
//  digitalWrite(MUX_A, a);
//  digitalWrite(MUX_B, b);
//  digitalWrite(MUX_C, c);
//}
