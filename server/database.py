import psycopg2


class Database(object):

    def __init__(self):
        self.name = "iot_new"
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

#
    def get_sensors_by_status(self, status):
       '''
        :param status: true if sensor is turned on or false if sensor is turned off 
         Returns list of turned on/off sensors
       '''
       conn, cur = self.connect()
       query="SELECT * FROM sensor WHERE status=%s;"
       cur.execute(query,[status])
       result=cur.fetchall()
       self.close_connection(conn,cur)
       return result
 
    
    def get_sensors_by_location(self, location_x,location_y):
       '''
         Returns list of sensors mounted in one place
       '''
       conn, cur = self.connect()
       query="SELECT * FROM sensor WHERE location_x=%s and location_y=%s;"
       cur.execute(query,[location_x,location_y])
       result=cur.fetchall()
       self.close_connection(conn,cur)
       return result

    
    def get_sensors_limit_values(self):
       '''
        Returns list of sensors and their limit values
       '''
       conn, cur = self.connect()
       query="SELECT id,name,limit_min,limit_max FROM sensor;"
       cur.execute(query)
       result=cur.fetchall()
       self.close_connection(conn,cur)
       return result

    def get_sensor_status(self, sensor_id):
       '''
        Returns status of the sensor
       '''
       conn, cur = self.connect()
       query="SELECT status FROM sensor WHERE id=%s;"
       cur.execute(query,[sensor_id])
       result=cur.fetchall()
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
       self.close_connection(conn,cur)
       return result

    
    def get_sensor_measurements_from_time_period(self,sensor_id,startTime,stopTime):
       '''
        Returns list of measurements from one sensor and defined period of time
       '''
       conn, cur = self.connect()
       query="SELECT value, time FROM measurement WHERE sensor_id=%s AND time>= timestamp %s AND time<= timestamp %s;"
       cur.execute(query,[sensor_id,startTime,stopTime])
       result=cur.fetchall()
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
      self.close_connection(conn,cur)
      return result


    
    def get_sensor_and_measurement_types(self,sensor_id):
      '''
      Returns information about sensor and its measurement types
      '''
      conn, cur=self.connect()
      conn, cur2=self.connect()
      query="SELECT name,unit FROM measurement_type WHERE id IN (SELECT measurement_type_id FROM sensor_measurement_type WHERE sensor_id=%s);"
      query2="SELECT id,name,description,status,limit_min,limit_max,limit_exceeded,location_x,location_y FROM sensor WHERE id=%s;"
      cur.execute(query,[sensor_id])
      cur2.execute(query2,[sensor_id])
      measurement_types=cur.fetchall()
      sensor_info=cur2.fetchall()
      sensor_info=tuple(sensor_info)
      temp=sensor_info
      complex_info=temp[0]
      for i in range(len(measurement_types)):
        temp+=measurement_types[i]
      for i in range(1,len(temp)):
          complex_info+=(temp[i],)
      self.close_connection(conn,cur)
      self.close_connection(conn,cur2)
      return complex_info
    
    def get_n_measurements_from_sensor(self,sensor_id,n):
      '''
      Returns last n measurements from sensor
      '''
      conn, cur=self.connect()
      query="SELECT value, time FROM measurement WHERE sensor_id=%s ORDER BY time DESC LIMIT %s;"
      cur.execute(query,[sensor_id,n])
      result=cur.fetchall()
      self.close_connection(conn,cur)
      return result


    def get_measurement_types(self,sensor_id):
      '''
      Get measurement types for sensor
      '''
      conn, cur=self.connect()
      query="SELECT name,unit FROM measurement_type WHERE id IN (SELECT measurement_type_id FROM sensor_measurement_type WHERE sensor_id=%s);"
      cur.execute(query,[sensor_id])
      result=cur.fetchall()
      self.close_connection(conn,cur)
      return result

    def get_measurement_type_id(self,sensor_id):
      '''
      Get measurement type id for sensor
      '''
      conn, cur=self.connect()
      query="SELECT measurement_type_id FROM sensor_measurement_type WHERE sensor_id=%s;"
      cur.execute(query,[sensor_id])
      result=cur.fetchall()
      self.close_connection(conn,cur)
      return result

    

    def update_sensor_max_limit(self,new_limit_value,sensor_id):
      '''
      Update max limit value for the sensor
      '''
      conn, cur=self.connect()
      query="UPDATE sensor SET limit_max=%s WHERE id=%s;"
      cur.execute(query,[new_limit_value,sensor_id])
      conn.commit()
      self.close_connection(conn,cur)


    def update_sensor_min_limit(self,new_limit_value,sensor_id):
      '''
      Update min limit value for the sensor
      '''
      conn, cur=self.connect()
      query="UPDATE sensor SET limit_min=%s WHERE id=%s;"
      cur.execute(query,[new_limit_value,sensor_id])
      conn.commit()
      self.close_connection(conn,cur)

    def update_sensor_location(self,new_location_x,new_location_y,sensor_id):
      '''
      Update location of the sensor
      '''
      conn, cur=self.connect()
      query="UPDATE sensor SET location_x=%s, location_y=%s WHERE id=%s;"
      cur.execute(query,[new_location_x,new_location_y,sensor_id])
      conn.commit()
      self.close_connection(conn,cur)

    def update_sensor_status(self, sensor_id, status):
      '''
      Update location of the sensor
      '''
      conn, cur=self.connect()
      query="UPDATE sensor SET status=%s WHERE id=%s;"
      cur.execute(query,[status,sensor_id])
      conn.commit()
      self.close_connection(conn,cur)

    def add_new_measurement(self,measurement_type_id,sensor_id,time,value):
      '''
      Add new measurement from sensor
      '''
      conn, cur = self.connect()
      query="INSERT INTO MEASUREMENT (measurement_type_id,sensor_id,time,value) VALUES (%s,%s,%s,%s);" 
      cur.execute(query,[measurement_type_id,sensor_id,time,value])
      conn.commit()
      self.close_connection(conn,cur)

    
    
    def write_to_database(self):
        pass

#database = Database()
#database.query()
#database.get_measurement_type_id(11);
#database.get_measurement_types(3)
#database.add_new_measurement(5,8,'2020-03-28 15:15:00',100)
#database.get_n_measurements_from_sensor(1,2)
#database.update_sensor_location(33.45,65.45,1)
#database.update_sensor_min_limit(100,1)
#database.update_sensor_max_limit(100,1)
#database.get_sensor_and_measurement_types(1)
#database.get_average(1,'2020-03-14 13:00:00','2020-03-14 15:15:00')
#database.get_sensor_measurements_from_time_period(1,'2020-03-14 13:00:00','2020-03-14 15:15:00')
#database.get_sensor_measurements(1)
#database.get_sensors_limit_values()
#database.get_sensors_by_status('true')
#database.get_sensors_by_location(10.1,20.2)

#database.get_rows()
