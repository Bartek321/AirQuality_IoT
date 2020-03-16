import psycopg2


class Database:

    def __init__(self, name):
        self.name = name
        self.host = "localhost"
        self.user = "grupa04"
        self.password = "grupa04"
        #self.cur = self.connect()  # object to react with database
        # connection to database

    def connect(self):
        """ Connect to the PostgreSQL server """
        conn = None
        try:

            conn = psycopg2.connect(host=self.host,
                                    database=self.name,
                                    user=self.user,
                                    password=self.password)
            # create a cursor to refer to database
            cur = conn.cursor()
            return cur
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)

    def close_connection(self, cur):
        try:
            cur.close()
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)

    def query(self):
        self.cur.execute('SELECT version()')

    def get_rows(self):
        pass

    def insert_measurement(self, sensor_id, measurement_type_id, start_time, stop_time, value):
        '''Insert new measurement result into database
            Arguments:
                sensor_id - ID of the sensor in databse
                measurement_type_id - ID of the measured parameter
                start_time - measurement start time
                stop_time - measurement stop time
                value - value of the measured parameter
            Returns:
                measurement_id
        '''
        cur = self.connect()
        sql = """INSERT INTO measurement VALUES(%s, %s, %s, %s, %s) RETURNING  measurementid;"""
        cur.execute(sql, (sensor_id, measurement_type_id, start_time, stop_time, value,))
        measurement_id = cur.fetchone()[0]
        cur.commit()
        self.close_connection(cur)
        return measurement_id

    def insert_sensor(self, name, description, location, status):
        '''Insert new sensor into database
            Arguments:
               name - name of the sensor
               description - description of the sensor
               location - location of the sensor
               status - status of the sensor
            Returns:
               sensor_id'''
        cur = self.connect()
        sql = """INSERT INTO sensor VALUES(%s, %s, %s, %s) RETURNING sensorid;"""
        cur.execute(sql, (name, description, location, status,))
        sensor_id = cur.fetchone()[0]
        cur.commit()
        self.close_connection(cur)
        return sensor_id

    def insert_measurement_type(self, sensor_id, name, unit):
        '''Insert new sensor into database
            Arguments:
            sensor_id
            name - name of measurement
            unit - unit of the measurement
            Returns:
            measurement_type_id
         '''
        cur = self.connect()
        sql = """INSERT INTO measurementtype VALUES(%s, %s, %s) RETURNING measurementtypeid;"""
        cur.execute(sql, (sensor_id, name, unit,))

        measurement_type_id = cur.fetchone()[0]
        cur.commit()
        return measurement_type_id

    def get_measurement(self, sensor_id, measurement_type_id, start_time, stop_time):
        '''
        Get measurement results stored in database
        :param sensor_id: ID of sensor
        :param measurement_type_id: Measurement type
        :param start_time:
        :param stop_time:
        :return:
        '''
        cur = self.connect()
        query = "SELECT value FROM measurement WHERE sensorid=%s AND measurement..."
        cur.execute(query, (sensor_id))
        result = cur.fetchall()
        self.close_connection(cur)
        return result

    def get_sensors_by_sensor_id(self, sensor_id):
        '''

        :param sensor_id:
        :return: Returns measurement_id, location and status of requested sensor
        '''

    def write_to_database(self):
        pass
