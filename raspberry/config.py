TCP_SERVER_IP_ADDR = 'localhost'
TCP_SERVER_PORT = 50065
MOSQUITTO_SERVER_PORT = 1883
MOSQUITTO_SERVER_IP = "127.0.0.1"
SUBJECTS = {"sensor1/temperature/1": 1, "sensor1/CO/3": 3, "sensor1/pm_2_5/5": 5, "sensor1/vibration/7": 7,
            "sensor1/humity/9": 9, "sensor1/pm_1/11": 11, "sensor1/pm_10/13": 13, "sensor2/temperature/2": 2,
            "sensor2/humity/10": 10, "sensor2/CO/4": 4, "sensor2/vibration/8": 8, "sensor2/pm_1/12":12,
            "sensor2/pm_2_5/6": 6, "sensor2/pm_10/14": 14}

VALUE_TO_ALARM_MAPPER = {('temperature', 'vibration', 'humity'): utils.TemperatureAlarm(),
                         ('CO', 'pm_2_5', 'pm_1', 'pm_10'): utils.GasConcentrationAlarm()}


LIMIT = 3000
TIMESTAMP_FORMAT = "%Y-%m-%d %H:%M:%S.00"
