import json
from  database import Database
from datetime import datetime
import psycopg2

class RequestHandler(object):

    def __init__(self, request):
        self.request = request
        self.result = None
        self.database = Database()
        deserialized_data = self.deserialize_data(request)
        if deserialized_data is  "NOT_JSON":
            self.result =  "NOT_JSON"
        else:
            self.handle_request(deserialized_data)



    def deserialize_data(self, request):
        try:
            deserialized_data = json.loads(request)
            return deserialized_data
        except ValueError:
            return "NOT_JSON"

    def serialize_result(self):
        try:
            self.result = json.dumps(self.result)
        except ValueError:
            return "REQUEST_UNHANDLABLE"

    def handle_request(self, request):
        if request["json_id"] == "1":
            self.list_of_sensors_with_limit_value(request)
            self.serialize_result()
        elif request["json_id"] == "2":
            self.time_based_measurements(request)
            self.serialize_result()
        elif request["json_id"] == "3":
            self.n_last_measurements(request)
            self.serialize_result()
        elif request["json_id"] == "4":
            self.time_based_average_measurements(request)
            self.serialize_result()
        elif request["json_id"] == "5":
            self.get_name_and_unit(request)
            self.serialize_result()
        elif request["json_id"] == "6":
            self.get_sensors_by_status(request)
            self.serialize_result()
        elif request["json_id"] == "101":
            self.update_sensor_limit_min(request)
            self.serialize_result()
        elif request["json_id"] == "102":
            self.update_sensor_limit_max(request)
            self.serialize_result()
        elif request["json_id"] == "103":
            self.update_sensor_location(request)
            self.serialize_result()
        elif request["json_id"] == "5000":
            self.insert_measurements_into_database(request)
            self.serialize_result()
        else:
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
            sensors_list.append({"sensor_id": request["sensor_id"], "name": sensor[1], "description": sensor[2], "status": sensor[3], "limit_min": sensor[4], "limit_max": sensor[5], "limit_exceeded": sensor[6], "location_x": sensor[7], "location_y": sensor[8]})

        self.result["json_id"] = request["json_id"]
        self.result["result"] = sensors_list

    def update_sensor_limit_min(self, request):
        self.result = {}
        self.result["json_id"] = request["json_id"]
        try:
            self.database.update_sensor_min_limit(new_limit_value = request["new_limit_min"],
                                              sensor_id = request["sensor_id"])
            self.result["result"] = "OK"
        except (Exception, psycopg2.DatabaseError):
            self.result["result"] = "ERROR"

    def update_sensor_limit_max(self, request):
        self.result = {}
        self.result["json_id"] = request["json_id"]
        try:
            self.database.update_sensor_max_limit(new_limit_value = request["new_limit_max"],
                                              sensor_id = request["sensor_id"])
            self.result["result"] = "OK"
        except (Exception, psycopg2.DatabaseError):
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
            self.result["result"] = "ERROR"

    def insert_measurements_into_database(self, request):
        self.result = {}
        for req in request["data"]:
            try:
                meas_type_id = self.database.get_measurement_type_id(req["sensor_id"])[0]
                print meas_type_id
                self.database.add_new_measurement(meas_type_id, req["sensor_id"], req["timestamp"], req["value"])
                self.result["result"] = "OK"
            except (Exception, psycopg2.DatabaseError):
                self.result["result"] = "ERROR"
                raise

json_data = '''{
    "json_id": "5000",
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


#rh = RequestHandler(json_data)
#print(rh.result)
