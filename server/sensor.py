class Sensor(object):

    _keepalive = 10

    def __init__(self, id, type):
        self.id = id
        self.type = type

    # add new thread for a sensor to find if sensor is alive

    def is_alive(self):
        pass

