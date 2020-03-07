import time
import sensors_connection

class Server:


    def __init__(self):
        self.start_listening_sensors()

    def start_listening_sensors(self):
        sensors_connection.SensorConnectionHandler()

    def start_listening_application(self):
        pass

Server()


