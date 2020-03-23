import json
from  database import Database
from datetime import datetime

class RequestHandler(object):

    def __init__(self, request):
        self.request = request
        self.result = None
        self.database = Database()
        deserialized_data = self.deserialize_data(request)
        if deserialized_data is not "NOT_JSON":
            self.result =  "NOT_JSON"
        else:
             self.result = self.handle_request(request)



    def deserialize_data(self, request):
        try:
            deserialized_data = json.loads(request)
            return deserialized_data
        except ValueError:
            return "NOT_JSON"

    def handle_request(self, request):
        if request["json_id"] == "1":
            pass
        elif request["json_id"] == "2":
            self.time_based_measurements(request)
        elif request["json_id"] == "3":
            pass
        else:
            self.result = "UNKNOWN_REQUEST_TYPE"

    def time_based_measurements(self, request):
        self.result = {}
        measurements_list = []
        measurements = self.database.get_sensor_measurements_from_time_period(request["sensor_id"],
                                                               datetime.strptime(request["timestamp_start"]),
                                                               datetime.strptime(request["timestamp_end"]))
        for measurement in measurements:
            value = measurement[0]
            timestamp = measurement[1]
            measurements_list.append(dict({"value": value, "timestamp": timestamp}))

        #Building response
        self.result["json_id"] = request["json_id"]
        self.result["timestamp_start"] = request["timestamp_start"]
        self.result["timestamp_end"] = request["timestamp_end"]
        self.result["result"] = list(dict({"sensor_id": request["sensor_id"], "data": measurements_list}))



json_data = '''{
	"json_id": "2",
	"timestamp_start": "2019-08-20T18:32:57.100Z",
	"timestamp_end": "2019-08-20T18:32:57.300Z",
    "sensor_id"": 1
     }'''

rh = RequestHandler(json_data)
print(rh.result)