class Sensor(object):

    def __init__(self, id, type):
        self.id = id
        self.type = type
        self.keepalive = 10

    # add new thread for a sensor to find if sensor is alive

    def is_alive(self):
        pass

