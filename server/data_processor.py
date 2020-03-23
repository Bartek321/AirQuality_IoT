import database
import datetime as dt
import statistics


class DataProcessor(object):
    """ TO DO: Customize alarms """

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

    def count_the_average(self):
        pass

    def count_the_variance(self):
        pass

    def raise_alarm(self):
        print ("Alarm")

    def parse_received_data(self, txt):
        #        self.save_parsed_data_in_database()
        #        do_statistics on newest set of data from database just after save
        #        do_statistics(self, sensor_id, measurement_type_id)

        pass

    def save_parsed_data_in_database(self, data):
        pass

    def send_results_to_application(self, results):
        pass