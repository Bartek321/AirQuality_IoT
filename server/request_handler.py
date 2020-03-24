import json
from  database import Database
from datetime import datetime

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

    def handle_request(self, request):
        if request["json_id"] == "1":
            self.list_of_sensors_with_limit_value(request)
        elif request["json_id"] == "2":
            self.time_based_measurements(request)
        elif request["json_id"] == "3":
            self.n_last_measurements(request)
        elif request["json_id"] == "4":
            self.time_based_average_measurements(request)
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
            sensors_list.append({"sensor_id": sensor[0], "name": sensor[1], "limit": sensor[2]})

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

json_data = '''{
	"json_id": "4",
	"timestamp_start": "2020-01-20 18:32:57.100",
	"timestamp_end": "2020-04-20 18:32:57.300",
    "sensor_id": 1
     }'''

rh = RequestHandler(json_data)
print(rh.result)