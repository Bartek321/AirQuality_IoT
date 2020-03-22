import psycopg2


class Database:

    def __init__(self):
        self.name = "iot"
        self.host = "localhost"
        self.user = "postgres"
        self.password = "grupa_4"
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
            return conn, cur
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)

    def close_connection(self, conn, cur):
        try:
            cur.close()
            conn.close()
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)

    def query(self):
        conn, cur = self.connect()
        cur.execute('SELECT version()')
        version = cur.fetchone()[0]
        print(version)
        self.close_connection(conn, cur)

    def get_rows(self):
        conn, cur = self.connect()
        cur.execute('SELECT * FROM sensor;')
        result = cur.fetchone()
        while result is not None:
            print(result)
            result = cur.fetchone()
        self.close_connection(conn, cur)

    def insert_example_row(self):
        conn, cur = self.connect()
        cur.execute("insert into sensor (id,name,description,location,status) values (101,'test','test101','krakow',false);")
        conn.commit()
        self.close_connection(conn, cur)
        

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

#jm
    def get_sensors_by_status(self, status):
       '''
        :param status: true if sensor is turned on or false if sensor is turned off 
         Returns list of turned on/off sensors
       '''
       conn, cur = self.connect()
       query="SELECT * FROM sensor WHERE status=%s;"
       cur.execute(query,[status])
       result=cur.fetchall()
       for row in result:
         print(row)
       self.close_connection(conn,cur)
       return result
 
    
    def get_sensors_by_location(self, location):
       '''
         Returns list of sensors mounted in one place
       '''
       conn, cur = self.connect()
       query="SELECT * FROM sensor WHERE location=%s;"
       cur.execute(query,[location])
       result=cur.fetchall()
       for row in result:
          print(row)
       self.close_connection(conn,cur)
       return result

    
    def get_sensors_limit_values(self):
       '''
        Returns list of sensors and their limit values
       '''
       conn, cur = self.connect()
       query="SELECT (id,name,limit_value) FROM sensor;"
       cur.execute(query)
       result=cur.fetchall()
       for row in result:
          print(row)
       self.close_connection(conn,cur)
       return result

    
    def get_sensor_measurements(self,sensor_id):
       '''
       Returns list of measurements from one sensor with defined sensor_id
       '''
       conn, cur = self.connect()
       query="SELECT value FROM measurement WHERE sensor_id=%s;"
       cur.execute(query,[sensor_id])
       result=cur.fetchall()
       for row in result:
          print(row)
       self.close_connection(conn,cur)
       return result

    
    def get_sensor_measurements_from_time_period(self,sensor_id,startTime,stopTime):
       '''
        Returns list of measurements from one sensor and defined period of time
       '''
       conn, cur = self.connect()
       query="SELECT value FROM measurement WHERE sensor_id=%s AND time>= timestamp %s AND time<= timestamp %s;"
       cur.execute(query,[sensor_id,startTime,stopTime])
       result=cur.fetchall()
       for row in result:
          print(row)
       self.close_connection(conn,cur)
       return result

    
    def get_average(self,sensor_id,startTime,stopTime):
      '''
      Returns average from measurements gathered from startTime to stopTime from one sensor
      '''
      conn, cur = self.connect()
      query="SELECT avg(value) FROM measurement WHERE sensor_id=%s AND time>= timestamp %s AND time<= timestamp %s;"
      cur.execute(query,[sensor_id,startTime,stopTime])
      result=cur.fetchall()
      for row in result:
         print(row)
      self.close_connection(conn,cur)
      return result


    
    def get_sensor_and_measurement_types(self,sensor_id):
      '''
      Returns sensor_id with its measurement types
      '''
      conn, cur=self.connect()
      conn, cur2=self.connect()
      query="SELECT (name,unit) FROM measurement_type WHERE id IN (SELECT measurement_type_id FROM sensor_measurement_type WHERE sensor_id=%s);"
      cur.execute(query,[sensor_id])
      result=cur.fetchall()
      for row in result:
         print(sensor_id,row)
      self.close_connection(conn,cur)
      return result
    

    def update_sensor_limit(self,new_limit_value,sensor_id):
      '''
      Update limit value for the sensor
      '''
      conn, cur=self.connect()
      query="UPDATE sensor SET limit_value=%s WHERE id=%s;"
      cur.execute(query,[new_limit_value,sensor_id])
      conn.commit()
      self.close_connection(conn,cur)

    
    def write_to_database(self):
        pass

database = Database()
database.query()
#database.update_sensor_limit(30,1)
#database.get_sensor_and_measurement_types(1)
#database.get_average(1,'2020-03-14 13:00:00','2020-03-14 15:15:00')
#database.get_sensor_measurements_from_time_period(1,'2020-03-14 13:00:00','2020-03-14 15:15:00')
#database.get_sensor_measurements(1)
#database.get_sensors_limit_values()
#database.get_sensors_by_status('true')
#database.get_sensors_by_location('ZPL14 2.12')

#database.get_rows()
#database.insert_example_row()
#database.get_rows()
