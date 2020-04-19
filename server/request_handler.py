import json
from database import Database
from datetime import datetime
import psycopg2
import logging
import math
from logging.handlers import RotatingFileHandler
import data_processor

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
file_handler = RotatingFileHandler('logfile.log', mode='a', maxBytes=50*1024*1024)
formatter = logging.Formatter('%(asctime)s :: %(levelname)s :: %(message)s')
file_handler.setFormatter(formatter)

logger.addHandler(file_handler)
status_counter = {}
sensor_status = {}

alarm_stack = []


def initialize_status_counter():
    db = Database()
    sensors_list = db.get_sensors_limit_values()
    for sensor in sensors_list:
        status = db.get_sensor_status(sensor[0])
        sensor_status[sensor[0]] = status
        status_counter[sensor[0]] = 0
    logger.info("Sensor status: {}".format(sensor_status))
    logger.info("Status counter: {}".format(status_counter))


def add_alarm_to_alarm_stack(alarm_type, sensor_id, timestamp):
    alarm_stack.append(dict({"alarm_type" : alarm_type,
                             "alarm_sensor_id" : sensor_id,
                             "alarm_timestamp" : timestamp,
                             "sent_to_rpi": False }))
    logger.info("ALARM!!! " + str(sensor_id))

class RequestHandler(object):

    def __init__(self, request):
        self.request = request
        self.result = None
        self.database = Database()
        deserialized_data = self.deserialize_data(request)
        if deserialized_data is "NOT_JSON":
            self.result = "NOT_JSON"
        else:
            self.handle_request(deserialized_data)

    def deserialize_data(self, request):
        try:
            deserialized_data = json.loads(request)
            return deserialized_data
        except ValueError:
            logger.info("Request does not contain JSON! {}".format(request))
            return "NOT_JSON"

    def serialize_result(self):
        try:
            self.result = json.dumps(self.result)
        except ValueError:
            return "REQUEST_UNHANDLABLE"

    def handle_request(self, request):
        if request["json_id"] == "1":
            self.list_of_sensors_with_limit_value(request)
            self.handle_alarm_sending_to_application()
            self.serialize_result()
        elif request["json_id"] == "2":
            self.time_based_measurements(request)
            self.handle_alarm_sending_to_application()
            self.serialize_result()
        elif request["json_id"] == "3":
            self.n_last_measurements(request)
            self.handle_alarm_sending_to_application()
            self.serialize_result()
        elif request["json_id"] == "4":
            self.time_based_average_measurements(request)
            self.handle_alarm_sending_to_application()
            self.serialize_result()
        elif request["json_id"] == "5":
            self.get_name_and_unit(request)
            self.handle_alarm_sending_to_application()
            self.serialize_result()
        elif request["json_id"] == "6":
            self.get_sensors_by_status(request)
            self.handle_alarm_sending_to_application()
            self.serialize_result()
        elif request["json_id"] == "7":
            self.get_values_for_dynamic_plot(request)
            self.handle_alarm_sending_to_application()
            self.serialize_result()
        elif request["json_id"] == "101":
            self.update_sensor_limit_min(request)
            self.handle_alarm_sending_to_application()
            self.serialize_result()
        elif request["json_id"] == "102":
            self.update_sensor_limit_max(request)
            self.handle_alarm_sending_to_application()
            self.serialize_result()
        elif request["json_id"] == "103":
            self.update_sensor_location(request)
            self.handle_alarm_sending_to_application()
            self.serialize_result()
        elif request["json_id"] == "5000":
            self.insert_measurements_into_database(request)
            self.serialize_result()
        else:
            logger.warning("Unknown request type: {}".format(str(request)))
            self.result = "UNKNOWN_REQUEST_TYPE"

    def time_based_measurements(self, request):
        self.result = {}
        measurements_list = []
        measurements_list_per_sensor = []
        measurements = self.database.get_sensor_measurements_from_time_period(request["sensor_id"],
                                                                              request["timestamp_start"],
                                                                              request["timestamp_end"])
        for measurement in measurements:
            value = measurement[0]
            timestamp = str(measurement[1])
            measurements_list.append({"value": value, "timestamp": timestamp})

        dict_inside = {"sensor_id": request["sensor_id"], "data": measurements_list}
        measurements_list_per_sensor.append(dict_inside)
        # Building response
        self.result["json_id"] = request["json_id"]
        self.result["timestamp_start"] = request["timestamp_start"]
        self.result["timestamp_end"] = request["timestamp_end"]
        self.result["result"] = measurements_list_per_sensor

    def list_of_sensors_with_limit_value(self, request):
        self.result = {}
        sensors_list = []
        sensors = self.database.get_sensors_limit_values()

        for sensor in sensors:
            sensors_list.append(
                {"sensor_id": sensor[0], "name": sensor[1], "limit_min": sensor[2], "limit_max": sensor[3]})

        self.result["json_id"] = request["json_id"]
        self.result["result"] = sensors_list

    def n_last_measurements(self, request):
        self.result = {}
        measurements_list = []
        measurements_list_per_sensor = []
        measurements = self.database.get_n_measurements_from_sensor(request["sensor_id"],
                                                                    request["measures"])
        for measurement in measurements:
            value = measurement[0]
            timestamp = str(measurement[1])
            measurements_list.append({"value": value, "timestamp": timestamp})

        dict_inside = {"sensor_id": request["sensor_id"], "data": measurements_list}
        measurements_list_per_sensor.append(dict_inside)
        # Building response
        self.result["json_id"] = request["json_id"]
        self.result["measures"] = request["measures"]
        self.result["result"] = measurements_list_per_sensor

    def time_based_average_measurements(self, request):
        self.result = {}
        measurements_list = []
        measurements_list_per_sensor = []
        measurements = self.database.get_average(request["sensor_id"],
                                                 request["timestamp_start"],
                                                 request["timestamp_end"])
        for measurement in measurements:
            dict_inside = {"sensor_id": request["sensor_id"], "data": measurement[0]}
        measurements_list_per_sensor.append(dict_inside)
        # Building response
        self.result["json_id"] = request["json_id"]
        self.result["timestamp_start"] = request["timestamp_start"]
        self.result["timestamp_end"] = request["timestamp_end"]
        self.result["result"] = measurements_list_per_sensor

    def get_name_and_unit(self, request):
        self.result = {}
        sensors_list = []
        sensor = self.database.get_sensor_and_measurement_types(request["sensor_id"])

        dict_inside = {"sensor_id": request["sensor_id"], "name": sensor[1],
                       "description": sensor[2], "status": sensor[3],
                       "limit_min": sensor[4], "limit_max": sensor[5],
                       "limit_exceeded": sensor[6], "location_x": sensor[7],
                       "location_y": sensor[8], "measurement_type": sensor[9],
                       "unit": sensor[10]}

        sensors_list.append(dict_inside)
        self.result["json_id"] = request["json_id"]
        self.result["result"] = sensors_list

    def get_sensors_by_status(self, request):
        self.result = {}
        sensors_list = []
        sensors = self.database.get_sensors_by_status(request["status"])

        for sensor in sensors:
            sensors_list.append(
                {"sensor_id": request["sensor_id"], "name": sensor[1], "description": sensor[2], "status": sensor[3],
                 "limit_min": sensor[4], "limit_max": sensor[5], "limit_exceeded": sensor[6], "location_x": sensor[7],
                 "location_y": sensor[8]})

        self.result["json_id"] = request["json_id"]
        self.result["result"] = sensors_list

    def update_sensor_limit_min(self, request):
        self.result = {}
        self.result["json_id"] = request["json_id"]
        try:
            self.database.update_sensor_min_limit(new_limit_value=request["new_limit_min"],
                                                  sensor_id=request["sensor_id"])
            self.result["result"] = "OK"
            data_processor.get_current_limit_values()
        except (Exception, psycopg2.DatabaseError):
            logger.error("Failed to update sensor limit min")
            self.result["result"] = "ERROR"

    def update_sensor_limit_max(self, request):
        self.result = {}
        self.result["json_id"] = request["json_id"]
        try:
            self.database.update_sensor_max_limit(new_limit_value=request["new_limit_max"],
                                                  sensor_id=request["sensor_id"])
            self.result["result"] = "OK"
            data_processor.get_current_limit_values()
        except (Exception, psycopg2.DatabaseError):
            logger.error("Failed to update sensor limit max")
            self.result["result"] = "ERROR"

    def update_sensor_location(self, request):
        self.result = {}
        self.result["json_id"] = request["json_id"]
        try:
            self.database.update_sensor_location(new_location_x=request["location_x"],
                                                 new_location_y=request["location_y"],
                                                 sensor_id=request["sensor_id"])
            self.result["result"] = "OK"
        except (Exception, psycopg2.DatabaseError):
            logger.error("Failed to update sensor location")
            self.result["result"] = "ERROR"

    def insert_measurements_into_database(self, request):
        self.result = {}
        for req in request["data"]:
            try:
                meas_type_id = self.database.get_measurement_type_id(req["sensor_id"])[0]
                # print meas_type_id
                sensor_id = req["sensor_id"]
                if not self.is_number(req['value']) or req["value"] == "NULL" or req["value"] == "null" or req[
                    'value'] == "Null" or req['value'] == "nan":
                    self.database.add_new_measurement(meas_type_id, sensor_id, req["timestamp"], None)
                    status_counter[sensor_id] += 1
                    if status_counter[sensor_id] >= 10:
                        self.database.update_sensor_status(sensor_id, 'false')
                        sensor_status[sensor_id] = False
                        logger.info("Sensor {} tango down!".format(sensor_id))

                else:
                    self.database.add_new_measurement(meas_type_id, sensor_id, req["timestamp"], req["value"])
                    status_counter[sensor_id] = 0
                    dp = data_processor.DataProcessor(req['sensor_id'], req['value'])
                    dp.check_if_measurement_exceed_limits()
                    if dp.is_alarm is True:
                        add_alarm_to_alarm_stack(dp.alarm_type, req["sensor_id"], req["timestamp"])
                        self.result["is_alarm"] = 1
                        if "alarms" not in self.result:
                            self.result["alarms"] = []

                        self.result["alarms"].append(dict({"alarm_type": dp.alarm_type,
                                                           "alarm_sensor_id": req["sensor_id"],
                                                           "alarm_timestamp": req["timestamp"]}))
                    if sensor_status[sensor_id] is False:
                        self.database.update_sensor_status(sensor_id, 'true')
                        sensor_status[sensor_id] = True
                        logger.info("Sensor {} changed state to active".format(sensor_id))
                        dp = data_processor.DataProcessor(req['sensor_id'], req['value'])
                        dp.check_if_measurement_exceed_limits()
                        if dp.is_alarm is True:
                            add_alarm_to_alarm_stack(dp.alarm_type, req["sensor_id"], req["timestamp"])
                            self.result["is_alarm"] = 1
                            if "alarms" not in self.result:
                                self.result["alarms"] = []

                            self.result["alarms"].append(dict({"alarm_type" : dp.alarm_type,
                                                                "alarm_sensor_id" : req["sensor_id"],
                                                                "alarm_timestamp" : req["timestamp"]}))
                    if alarm_stack:
                        for alarm in alarm_stack:
                            if alarm["alarm_type"] == "ALARM_TYPE_2" and alarm["sent_to_rpi"] is False:
                                self.result["is_alarm"] = 1
                                if "alarms" not in self.result:
                                    self.result["alarms"] = []

                                self.result["alarms"].append(dict({"alarm_type": dp.alarm_type,
                                                                   "alarm_sensor_id": req["sensor_id"],
                                                                   "alarm_timestamp": req["timestamp"]}))
                                alarm["sent_to_rpi"] = True
                            #self.result["alarm_sensor_id"] = req["sensor_id"]
                self.result["result"] = "OK"
            except (Exception, psycopg2.DatabaseError):
                self.result["result"] = "ERROR"
                logger.exception("Error inserting measurement into database")
        if "is_alarm" not in self.result:
            self.result["is_alarm"] = 0


    def handle_alarm_sending_to_application(self):
        if not alarm_stack:
            self.result["is_alarm"] = 0
        else:
            self.result["is_alarm"] = 1
            for alarm in alarm_stack:
                if "alarms" not in self.result:
                    self.result["alarms"] = []

                self.result["alarms"].append(dict({"alarm_type": alarm["alarm_type"],
                                                   "alarm_sensor_id": alarm["alarm_sensor_id"],
                                                   "alarm_timestamp": alarm["alarm_timestamp"]}))

                alarm_stack.remove(alarm)

    def is_number(self, s):
        try:
            float(s)
            return True
        except ValueError:
            return False

    def get_values_for_dynamic_plot(self, request):
        '''
        Get always maximum 300 data values using algorithm of min and max values
        from the elements interval.
        :param request:
        :return:
        '''
        self.result = {}
        measurements_list = []
        measurements_list_per_sensor = []
        measurements = self.database.get_sensor_measurements_from_time_period(request["sensor_id"],
                                                                              request["timestamp_start"],
                                                                              request["timestamp_end"])
        for measurement in measurements:
            value = measurement[0]
            timestamp = str(measurement[1])
            measurements_list.append({"value": value, "timestamp": timestamp})

        n_elements = len(measurements_list)
        window_size = 4
        max_elements = 300
        logger.debug("N elements: " + str(n_elements))
        if n_elements <= max_elements:
            dict_inside = {"sensor_id": request["sensor_id"], "data": measurements_list}
            measurements_list_per_sensor.append(dict_inside)
        else:
            level = math.ceil(math.log(n_elements / max_elements, window_size))
            level = int(level)
            logger.debug("Level: " + str(level))
            if level == 0:
                dict_inside = {"sensor_id": request["sensor_id"], "data": measurements_list}
                measurements_list_per_sensor.append(dict_inside)
            else:
                sorted_measurements_list = sorted(measurements_list, key=lambda k: k['timestamp'])
                new_meas_dict = {0: sorted_measurements_list}
                for lev in range(1, int(level) + 1):
                    element_start = 0
                    new_meas_dict[lev] = []
                    while element_start <= n_elements - window_size - 1:
                        element_end = element_start + window_size - 1
                        temp_min = new_meas_dict[lev-1][element_start]
                        temp_max = new_meas_dict[lev-1][element_end]
                        for it in new_meas_dict[lev-1][element_start + 1:element_end]:
                            if it['value'] < temp_min['value']:
                                temp_min = it
                            elif it['value'] > temp_max['value']:
                                temp_max = it
                        new_meas_dict[lev].append(temp_min)
                        new_meas_dict[lev].append(temp_max)
                        element_start += window_size + 1
                    n_elements = len(new_meas_dict[lev])
                    sorted_new_meas_dict = sorted(new_meas_dict[lev], key=lambda k: k['timestamp'])
                    new_meas_dict[lev] = sorted_new_meas_dict
                    logger.debug("N elements" + str(n_elements))
                dict_inside = {"sensor_id": request["sensor_id"], "data": new_meas_dict[level]}
                measurements_list_per_sensor.append(dict_inside)

        self.result["json_id"] = request["json_id"]
        self.result["timestamp_start"] = request["timestamp_start"]
        self.result["timestamp_end"] = request["timestamp_end"]
        self.result["result"] = measurements_list_per_sensor


json_data = '''{
    "json_id": "7",
    "data": [
        {
        "sensor_id": 5,
        "timestamp": "2020-01-20 18:32:57.100",
        "value": 36.6},
        {
        "sensor_id": 6,
        "timestamp": "2020-01-20 18:32:57.100",
        "value": 37.6},
        {
        "sensor_id": 7,
        "timestamp": "2020-01-20 18:32:57.100",
        "value": 38.6}],
    "timestamp_end": "2020-04-20 18:32:57.300",
    "measures": 3,
    "status": true,
    "location_x": 15,
    "location_y": 25,
    "new_limit_max": 16.6,
    "sensor_id": 1
     }'''

json_data2 = '''{"json_id": "5000", "data": [{"timestamp": "2020-04-01 21:33:41.00", "sensor_id": 5, "value": "NULL"}, {"timestamp": "2020-04-01 21:33:41.00", "sensor_id": 6, "value": "NULL"}]}'''

json_data3 = '''{"json_id": "7","timestamp_start": "2020-04-01 18:32:57","timestamp_end": "2020-04-03 18:32:57","sensor_id": 5}'''

#initialize_status_counter()
#rh = RequestHandler(json_data3)
#print(rh.result)
