from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from json import dumps
from flask_cors import CORS
import random
from random import randrange

app = Flask(__name__)
api = Api(app)
CORS(app)
			
class lst(Resource):
	def get(self):
		str = {
			"json_id" : "1",
			"sensors" :[ {
				"sensor_id" : 1,
				"name" : "Temperatura",
				"description" : "Czujnik temperatury",
				"location" : "Hala 1", 
				"status" : "on",
				"unit" : "celcius",
				"limitMin" : -20,
				"limitMax" : 5,
				"locationX": 100,
				"locationY": 100
			 },
			 {
				"sensor_id" : 2,
				"name" : "Wilgotnosc",
				"description" : "Czujnik wilgotnosci",
				"location" : "Hala 1", 
				"status" : "on",
				"unit" : "%",
				"limitMin" : 10,
				"limitMax" : 80,
				"locationX": 100,
				"locationY": 100
			 },
			 {
				"sensor_id" : 8,
				"name" : "PM10",
				"description" : "Czujnik wilgotnosci",
				"location" : "Hala 1", 
				"status" : "on",
				"unit" : "mg/m3",
				"limitMin" : 20,
				"limitMax" : 100,
				"locationX": 100,
				"locationY": 100
			 },
			 {
				"sensor_id" : 4,
				"name" : "Metan",
				"description" : "Czujnik metanu",
				"location" : "Hala 1", 
				"status" : "on",
				"unit" : "mg/m3",
				"limitMin" : 1000,
				"limitMax" : 50000,
				"locationX": 330,
				"locationY": 140
			 },
			 {
				"sensor_id" : 5,
				"name" : "Metan",
				"description" : "Czujnik metanu",
				"location" : "Hala 2", 
				"status" : "on",
				"unit" : "mg/m3",
				"limitMin" : 1000,
				"limitMax" : 50000,
				"locationX": 330,
				"locationY": 140
			 },
			 {
				"sensor_id" : 5,
				"name" : "Wilgotnosc",
				"description" : "Czujnik wilgotnosci",
				"location" : "Hala 2", 
				"status" : "off",
				"unit" : "%",
				"limitMin" : 10,
				"limitMax" : 80,
				"locationX": 100,
				"locationY": 100
			 }
			 
			 ]
		}
		print(str)
		return jsonify(results=str)
		
class dat(Resource):
	def get(self):
		str1 = [

				{
				"id": 1,
				"value": "20.2",
				"min": "18.2",
				"max": "22.3"
				},
				{
				"id": 2,
				"value": "20.2",
				"min": "18.2",
				"max": "22.3"
				},
				{
				"id": 3,
				"value": "20.2",
				"min": "18.2",
				"max": "22.3"
				}	
			]
		str2 = [
			{
			"name": "Temperatura",
			"unit": "C",
			"value": "23.2",
			},
			{
			"name": "Wilgotnosc",
			"unit": "%",
			"value": "75.5",
			},
			{
			"name": "Metan",
			"unit": "mg/m3",
			"value": "34.11",
			}
				
		]

		return jsonify(results=str1)

api.add_resource(lst, "/list") # Route_2
api.add_resource(dat, "/dat") # Route_3

if __name__ == '__main__':
     app.run(port='5002')
	 