import time
import sensors_connection
import application_connection
import thread

class Server:


    def __init__(self):
        thread.start_new_thread(self.start_listening_sensors,())
        #self.start_listening_sensors()
        self.start_listening_application()

    def start_listening_sensors(self):
        sensors_connection.SensorConnectionHandler()

    def start_listening_application(self):
        application_connection.ApplicationConnectionHandler()

Server()


