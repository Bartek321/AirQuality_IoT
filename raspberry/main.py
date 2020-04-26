import socket
import ssl
import time
import json
import subprocess
import utils
import paho.mqtt.client as mqtt
from .config import TCP_SERVER_IP_ADDR, TCP_SERVER_PORT, MOSQUITTO_SERVER_PORT, MOSQUITTO_SERVER_IP, SUBJECTS, VALUE_TO_ALARM_MAPPER, LIMIT, TIMESTAMP_FORMAT

DATA_DICTS_LIST = []
SENSORS_WITH_ALARM_ON = []

SENSORS_WATCH = utils.SensorsWatch()
[SENSORS_WATCH.add_sensor(utils.Sensor(topic)) for topic in SUBJECTS.keys()]
[sensor.add_alarm(VALUE_TO_ALARM_MAPPER) for sensor in SENSORS_WATCH.get_sensors()]


def start_mosquitto_broker(broker_port):
    subprocess.Popen(['sudo', 'mosquitto', '-p', str(broker_port)], stdout=subprocess.PIPE, stderr=subprocess.PIPE)


def get_current_timestamp():
    return time.strftime(TIMESTAMP_FORMAT)


def check_response(response):
    response_json = json.loads(response)
    tmp_alarms = []

    if response_json['is_alarm']:
        for alarm in response_json['alarms']:
            sensor = SENSORS_WATCH.get_sensor(alarm['alarm_sensor_id'])
            if sensor.id not in SENSORS_WITH_ALARM_ON:
                SENSORS_WITH_ALARM_ON.append(sensor.id)
                tmp_alarms.append(sensor.id)
                sensor.alarm.start_counteraction()
                print("Added sensor: {}, {}".format(sensor.id, SENSORS_WITH_ALARM_ON))
    else:
        [SENSORS_WATCH.get_sensor(id).alarm.stop_counteraction() for id in set(SENSORS_WITH_ALARM_ON)]
        try:
            del SENSORS_WITH_ALARM_ON[:]
        except Exception as e:
            print(e)
        return None

    for sensor_id in SENSORS_WITH_ALARM_ON:
        if sensor_id not in tmp_alarms and sensor_id not in [SENSORS_WATCH.get_sensor(alarm['alarm_sensor_id']).id for alarm in response_json['alarms']]:
            SENSORS_WITH_ALARM_ON.remove(sensor_id)
            SENSORS_WATCH.get_sensor(sensor_id).alarm.stop_counteraction()
            print("Removed sensor: {}, {}".format(sensor_id, SENSORS_WITH_ALARM_ON))

def connect_to_server(data_to_send, addr, port):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(20)
    print("Initializing tcp connection...")
    wrapped_socket = ssl.wrap_socket(s, ca_certs="server.crt", cert_reqs=ssl.CERT_REQUIRED)
    wrapped_socket.connect((addr, port))
    print(" TCP Connection successfull!")
    wrapped_socket.send(data_to_send)
#    print(data_to_send)
    response = wrapped_socket.recv(2048).decode('utf-8')
    print(response)
    check_response(response)
    wrapped_socket.close()


def on_connect(client, userdata, flags, rc):
    print("Connected to MQTT with result code "+str(rc))
    for subject in SUBJECTS.keys():
        client.subscribe(subject)
        print("    Subscribed to a {}".format(subject))


def validate_data(data):
    try:
        if float(data) > LIMIT:
            return "NULL"
        return data
    except Exception as E:
        print(E)
        return "NULL"


def on_message(client, userdata, msg):
    sensor_id = SUBJECTS[msg.topic.decode()]
    data = validate_data(msg.payload.decode())
    timestamp = get_current_timestamp()
#    print("Recived data: {} from sensor: {}".format(data, sensor_id))
    DATA_DICTS_LIST.append({'sensor_id': sensor_id,
                            'timestamp': timestamp,
                            'value': data})

    if len(DATA_DICTS_LIST) is len(SUBJECTS.keys()):
        json_data = json.dumps({"json_id": "5000", "data": DATA_DICTS_LIST})
        connect_to_server(json_data, TCP_SERVER_IP_ADDR, TCP_SERVER_PORT)
        del DATA_DICTS_LIST[:]



#start_mosquitto_broker(MOSQUITTO_SERVER_PORT)


try:
    client = mqtt.Client()
    client.connect(MOSQUITTO_SERVER_IP, MOSQUITTO_SERVER_PORT, 60)
    client.on_connect = on_connect
    client.on_message = on_message

    client.loop_forever()
except Exception as e:
    print(e)

