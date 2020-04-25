# Zapytania obsługiwane przez serwer:
## Otrzymywanie informacji z bazy danych:
#### Lista wszystkich sensorów wraz z jednostką i limitami
Przykładowe zapytanie:
```json
{
    "json_id": "1",
    }
```
Przykładowa odpowiedź:
```json
{
    "json_id": "1", 
    "result": [
    {
        "limit_min": 100.0, 
        "sensor_id": 1, 
        "name": "DHT22", 
        "limit_max": 100.0}, 
    {
        "limit_min": 10.0,
        "sensor_id": 2,
        "name": "DHT22",
        "limit_max": 20.0},
    {
        "limit_min": 10.0,
        "sensor_id": 3, 
        "name": "MQ7", 
        "limit_max": 20.0}]
}
```

#### Pomiary dla danego sensora w konkretnym okresie - wszystkie pomiary 
Przykładowe zapytanie:
```json
{
    "json_id": "2",
    "timestamp_start": "2020-01-20 18:32:57.100",
    "timestamp_end": "2020-04-20 18:32:57.300",
    "sensor_id": 1
     }
```

Przykładowa odpowiedź:
```json
{
    "json_id": "2", 
    "timestamp_start": "2020-01-20 18:32:57.100", 
    "timestamp_end": "2020-04-20 18:32:57.300",
    "is_alarm": 0,
    "result": [{
        "sensor_id": 1, "data": [
            {
                "timestamp": "2020-03-14 13:00:00", 
                "value": 23.0
            }, 
            {
                "timestamp": "2020-03-14 13:15:00", 
                "value": 25.0
            }, 
            {
                "timestamp": "2020-03-14 13:15:00",
                "value": 60.0
            }]
    }]
}
``` 
#### N ostatnich pomiarów danego sensora
Przykładowe zapytanie(3 ostatnie próbki):
```json
{
    "json_id": "3",
    "measures": 3,
    "sensor_id": 1
    }
```
Przykładowa odpowiedź (do odpowiedzi może być dołączona informacja o alarmie dotyczącym innego sensora):
```json
{
    "json_id": "3", 
    "measures": 3,
    "is_alarm": 1,
    "alarms": [{
    	"alarm_type": "HIGH", 
	"alarm_timestamp": "2020-04-23 10:35:08.00", 
	"alarm_sensor_id": 2
	}],
    "result": [{
        "sensor_id": 1, "data": [
            {
                "timestamp": "2020-03-14 13:00:00", 
                "value": 23.0
            }, 
            {
                "timestamp": "2020-03-14 13:15:00", 
                "value": 25.0
            }, 
            {
                "timestamp": "2020-03-14 13:15:00",
                "value": 60.0
            }]
    }]
}
``` 
#### Średnia wartość próbek dla danego sensora z danego okresu 
Przykładowe zapytanie:
```json
{
    "json_id": "4",
	"timestamp_start": "2020-01-20 18:32:57.100",
	"timestamp_end": "2020-04-20 18:32:57.300",
    "sensor_id": 1
     }
```
Przykładowa odpowiedź:
```json
{
    "json_id": "4", 
    "timestamp_start": "2020-01-20 18:32:57.100", 
    "timestamp_end": "2020-04-20 18:32:57.300",
    "is_alarm" : 0,
    "result": [
        {
            "sensor_id": 1, 
            "data": 36.0
        }]
}
```

#### Wszystkie informacje o danym czujniku
Przykładowe zapytanie:
```json
{
    "json_id": "5",
    "sensor_id": 1
    }
```

Przykładowa odpowiedź:
```json
{
    "json_id": "5",
    "result": [
        {
            "status": true, 
            "sensor_id": 1, 
            "description": "measurement of temperature and humidity",
            "location_x": 33.45,
            "location_y": 65.54, 
            "measurement_type": "humidity", 
            "unit": "%RH",
            "limit_max": 100.0,
            "name": "DHT22",
            "limit_min": 100.0,
            "limit_exceeded": false
        }]
}
```
#### Wszystkie czujniki o danym statusie:
Przykładowe zapytanie:
```json
{
    "json_id": "6",
    "status": true
}
```

Przykładowa odpowiedź:
```json
{
    "json_id": "6",
    "result": [
    {
        "status": true, 
        "limit_min": 100.0,
        "sensor_id": 1,
        "location_y": 65.54,
        "name": "DHT22",
        "limit_exceeded": false,
        "location_x": 33.45,
        "limit_max": 100.0,
        "description": "measurement of temperature and humidity"},
    {
        "status": true, 
        "limit_min": 10.0,
        "sensor_id": 1,
        "location_y": 20.2,
        "name": "DHT22",
        "limit_exceeded": false,
        "location_x": 10.1,
        "limit_max": 20.0,
        "description": "measurement of temperature and humidity"}]
}
```
#### Pomiary dla danego sensora w konkretnym okresie - dane do dynamicznego generowania wykresów
Przykładowe zapytanie:
```json
{
    "json_id": "7",
    "timestamp_start": "2020-01-20 18:32:57.100",
    "timestamp_end": "2020-04-20 18:32:57.300",
    "sensor_id": 1
     }
```

Przykładowa odpowiedź:
```json
{
    "json_id": "7", 
    "timestamp_start": "2020-01-20 18:32:57.100", 
    "timestamp_end": "2020-04-20 18:32:57.300",
    "is_alarm": 0,
    "result": [{
        "sensor_id": 1, "data": [
            {
                "timestamp": "2020-03-14 13:00:00", 
                "value": 23.0
            }, 
            {
                "timestamp": "2020-03-14 13:15:00", 
                "value": 25.0
            }, 
            {
                "timestamp": "2020-03-14 13:15:00",
                "value": 60.0
            }]
    }]
}
``` 

## Zapisywanie informacji do bazy danych:
#### Aktualizacja limitu minimalnego czujnika
Przykładowe zapytanie:
```json
{
    "json_id": "101",
    "sensor_id": 1,
    "new_limit_min": 10
}
```
Spodziewana odpowiedź:
```json
{
    "json_id": "101",
    "result": "OK",
    "is_alarm": 0
}
```
W przypadku niepowodzenia:
```json
{
    "json_id": "101",
    "result": "NOK",
    "is_alarm": 0
}
```

#### Aktualizacja limitu maksymalnego czujnika
Przykładowe zapytanie:
```json
{
    "json_id": "102",
    "sensor_id": 1,
    "new_limit_max": 10
}
```
Spodziewana odpowiedź:
```json
{
    "json_id": "102",
    "result": "OK",
    "is_alarm": 0
}
```

#### Aktualizacja lokalizacji sensora
Przykładowe zapytanie:
```json
{
    "json_id": "103",
    "sensor_id": 1,
    "location_x": 10,
    "location_y": 25
}
```
Spodziewana odpowiedź:
```json
{
    "json_id": "103",
    "result": "OK",
    "is_alarm": 0
}
```
#### Zapisanie danych pomiarowych z sensorów do bazy danych
Przykładowe zapytanie:
```json
{
    "json_id": "5000", 
    "data": [
        {
	    "timestamp": "2020-04-23 10:35:05.00", 
	    "sensor_id": 8,
	    "value": "9.00"},
	{
	    "timestamp": "2020-04-23 10:35:05.00",
	    "sensor_id": 1,
	    "value": "17.80"},
	{
	    "timestamp": "2020-04-23 10:35:05.00",
	    "sensor_id": 9,
	    "value": "34.60"}]
}
```

Przykładowa odpowiedź (brak alarmów do przetworzenia przez RasbperryPI):
```json
{
    "result": "OK",
    "is_alarm": 0
}
```

Przykładowa odpowiedź (występują alarmy do przetworzenia przez RasbperryPI):
```json
{
    "result": "OK",
    "is_alarm": 1,
    "alarms": [{
    	"alarm_type": "HIGH", 
	"alarm_timestamp": "2020-04-23 10:35:08.00", 
	"alarm_sensor_id": 2
	}]
}
