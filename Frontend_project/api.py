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
		str = [
				{
				"description": "costam",
				"name": "Stacja 1",
				"location": "Hala 1",
				"status": "on"
				},
				{
				"description": "costam2",
				"name": "Stacja 2",
				"location": "Hala 2",
				"status": "on"
				}
			]
		print(str)
		return jsonify(results=str)
		
class dat(Resource):
	def get(self):
		str = [
				{
				"name": "Temperatura",
				"unit": "C",
				"value": "20.2",
				},
				{
				"name": "Wilgotnosc",
				"unit": "%",
				"value": "70.5",
				},
				{
				"name": "Metan",
				"unit": "mg/m3",
				"value": "33.11",
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
		print(str)
		if(randrange(2) == 0):
			return jsonify(results=str)
		return jsonify(results=str2)

api.add_resource(lst, "/list") # Route_2
api.add_resource(dat, "/dat") # Route_3

if __name__ == '__main__':
     app.run(port='5002')