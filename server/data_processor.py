from database import Database
import datetime as dt
import statistics as stat
import logging
from logging.handlers import RotatingFileHandler
import request_handler
import time

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
file_handler = RotatingFileHandler('logfile.log', mode='a', maxBytes=50 * 1024 * 1024)
formatter = logging.Formatter('%(asctime)s :: %(levelname)s :: %(message)s')
file_handler.setFormatter(formatter)

logger.addHandler(file_handler)

sensor_limit_min = {}
sensor_limit_max = {}


def get_current_limit_values():
    db = Database()
    sensors_list = db.get_sensors_limit_values()
    for sensor in sensors_list:
        sensor_limit_min[sensor[0]] = sensor[2]
        sensor_limit_max[sensor[0]] = sensor[3]
    logger.info("Sensor limit min: {}".format(sensor_limit_min))
    logger.info("Sensor limit max: {}".format(sensor_limit_max))


class DataProcessor(object):

    def __init__(self, sensor_id, value):
        self.sensor_id = sensor_id
        self.value = float(value)
        self.is_alarm = False
        self.alarm_type = None

    def do_statistics(self, sensor_id, measurement_type_id):
        pm_2_5_max_threshold = 1000
        pm_2_5_min_threshold = 0
        temp_max_threshold = 1000
        temp_min_threshold = 0
        humi_max_threshold = 1000
        humi_min_threshold = 0
        c0_max_threshold = 1000
        c0_min_threshold = 0
        vibr_max_threshold = 1000
        vibr_min_threshold = 0

        #       consider case when sensor is temporarly unavailable
        current_time = dt.datetime.now()
        last_hour = dt.datetime.now() - dt.timedelta(hours=1)
        #       FORMAT: 2020-03-17 18:38:32.674248
        #        result = database.get_measurement(self, sensor_id, measurement_type_id, start_time = last_hour, stop_time = current_time):
        #        i expect result = [1, 2, 3, 4, 5, 4, 6, 4, 5]

        #       PM2.5
        if measurement_type_id == 1:
            if result[-1] > pm_2_5_max_threshold:
                self.raise_alarm()

        if measurement_type_id == 1:
            if result[-1] < pm_2_5_min_threshold:
                self.raise_alarm()

        #       Temprature
        if measurement_type_id == 2:
            if result[-1] > temp_max_threshold:
                self.raise_alarm()

        if measurement_type_id == 2:
            if result[-1] < temp_min_threshold:
                self.raise_alarm()

        #       Humidity
        if measurement_type_id == 3:
            if result[-1] > humi_max_threshold:
                self.raise_alarm()

        if measurement_type_id == 3:
            if result[-1] < humi_min_threshold:
                self.raise_alarm()

        #       Carbon monoxide
        if measurement_type_id == 4:
            if result[-1] > c0_max_threshold:
                self.raise_alarm()

        if measurement_type_id == 4:
            if result[-1] < c0_min_threshold:
                self.raise_alarm()

        #       Vibration
        if measurement_type_id == 5:
            if result[-1] > vibr_max_threshold:
                self.raise_alarm()

        if measurement_type_id == 5:
            if result[-1] < vibr_min_threshold:
                self.raise_alarm()

        if len(result) > 10:
            #           standard deviation
            st_dev = statistics.stdev(result[:-1])
            upper_threshold = fmean(result[:-1]) + st_dev
            lower_threshold = fmean(result[:-1]) - st_dev
            if result[-1] > upper_threshold or result[-1] < lower_threshold:
                raise_alarm(self)
                # customize alarm for each metric

    def check_if_measurement_exceed_limits(self):
        if self.value < sensor_limit_min[self.sensor_id]:
            self.raise_alarm("LOW")
        elif self.value > sensor_limit_max[self.sensor_id]:
            self.raise_alarm("HIGH")

    def count_the_average(self):
        pass

    def count_the_variance(self):
        pass

    def raise_alarm(self, alarm_t):
        self.is_alarm = True
        if alarm_t == "LOW":
            self.alarm_type = "LOW"
        elif alarm_t == "HIGH":
            self.alarm_type = "HIGH"
