import time
import sensors_connection
import application_connection
import thread
from threading import Timer
import data_processor

class Server:


    def __init__(self):
        thread.start_new_thread(self.start_listening_sensors,())
        thread.start_new_thread(self.start_listening_alarm,())
        #self.start_listening_sensors()
        self.start_listening_application()

    def start_listening_sensors(self):
        sensors_connection.SensorConnectionHandler()

    def start_listening_application(self):
        application_connection.ApplicationConnectionHandler()

    def start_listening_alarm(self):
        data_processor.DataProcessor()

Server()


