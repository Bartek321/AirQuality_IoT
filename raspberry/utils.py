import RPi.GPIO as GPIO
from time import *

class SensorsWatch:
    def __init__(self):
        self._sensors = dict()

    def add_sensor(self, sensor):
        self._sensors[sensor.id] = sensor

    def remove_sensor(self, sensor):
        try:
            del self._sensors[sensor.id]
        except KeyError:
            pass

    def get_sensor(self, sensor_id):
        try:
            return self._sensors[sensor_id]
        except KeyError:
            return None

    def get_sensors(self):
        return list(self._sensors.values())


class Sensor:
    def __init__(self, topic):
        self.id = self.get_id(topic)
        self.measure_type = self.get_measure_type(topic)
        self.alarm = None

    def add_alarm(self, mapper):
        for key in mapper.keys():
            if self.measure_type in key:
                self.alarm = mapper[key]

    @staticmethod
    def get_id(topic):
        return int(topic.rsplit('/')[-1])

    @staticmethod
    def get_measure_type(topic):
        return topic.rsplit('/')[-2]


class GasConcentrationAlarm:
    def __init__(self):
#       self.m = MediumMotor(OUTPUT_A)
        self.control_pins = [7,11,13,15]
        self.halfstep_seq = [
                  [1,0,0,0],
                  [1,1,0,0],
                  [0,1,0,0],
                  [0,1,1,0],
                  [0,0,1,0],
                  [0,0,1,1],
                  [0,0,0,1],
                  [1,0,0,1]]

    def start_motor():
        for pin in control_pins:
            GPIO.setup(pin, GPIO.OUT)
            GPIO.output(pin, 0)
        for i in range(512):
          for self.halfstep in range(8):
            for pin in range(4):
              GPIO.output(control_pins[pin], halfstep_seq[halfstep][pin])
            time.sleep(0.001)
        GPIO.cleanup()

    def start_counteraction(self):
        print("TURN MOTOR ON")

    def stop_counteraction(self):
        print("TURN MOTOR OFF")


class TemperatureAlarm:
    def __init__(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        GPIO.setup(21, GPIO.OUT)

    @staticmethod
    def turn_led_on():
        GPIO.output(21, GPIO.HIGH)

    @staticmethod
    def turn_led_off():
        GPIO.output(21, GPIO.LOW)

    def start_counteraction(self):
        print("LED ON")
        self.turn_led_on()

    def stop_counteraction(self):
        print("LED OFF")
        self.turn_led_off()
