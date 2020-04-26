document.getElementById("editButton").addEventListener("click", onEditButtonClick);
document.getElementById("buttonPage4").addEventListener("click", onPage4Click);
document.getElementById("buttonPage1").addEventListener("click", onPage1Click);
document.getElementById("buttonPage2").addEventListener("click", onPage2Click);
document.getElementById("buttonPage3").addEventListener("click", onPage3Click);
document.getElementById("positionButton").addEventListener("click", onPositionButtonClick);
document.getElementById("changeButton").addEventListener("click", onChangeButtonClick);
document.getElementById("resetButton").addEventListener("click", onResetButtonClick);
document.getElementById("optionButton").addEventListener("click", onOptionButtonClicck);

var idDict = {
  1: "Temperatura",
  2: "Temperatura",
  3: "Tlenek węgla",
  4: "Tlenek węgla",
  5: "Pył PM2.5",
  6: "Pył PM2.5",
  7: "Wibracje",
  8: "Wibracje",
  9: "Wilgotność",
  10: "Wilgotność",
  11: "Pył P1",
  12: "Pył PM1",
  13: "Pył PM10",
  14: "Pył PM10"
};

var namesDict = {
  "temperature": "Temperatura",
  "carbon monoxide": "Tlenek węgla",
  "PM2.5": "Pył PM 2.5",
  "PM1": "Pył PM 1",
  "PM10": "Pył PM 10",
  "humidity": "Wilgotność",
  "vibration": "Wibracje"
};

var alarmDict = {
	"LOW": "Wartość jest za niska",
	"HIGH": "Wartość jest za wysoka",
	"ALARM_TYPE_2": "Przekroczono dopuszczalne odchylenie od normy"
}

var alarmsDict = {
	"LOW": "Za niska",
	"HIGH": "Za wysoka",
	"ALARM_TYPE_2": "Przekroczono odchylenie"
}

var isDrag = false;
var isElement = false;
var socket = null;
var size1 = 0;

var alarms = [];
var alarmsV = [];
var oldAlarms = [];
var stations = [];

var nam = '';
var tout = false;

setUpOptionCombobox();
openSocket();

function onOptionButtonClicck() {
	var val = document.getElementById("timeInput").value;
	if(val > 0 && val != undefined && val != null && val != NaN)
		localStorage['time'] = document.getElementById("timeInput").value;
	changeOptions();
}

// ELEMENT DRAG
function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, oPosX = 0, oPosY = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {	//on click - get position, link functions
	    if(isDrag == true) {
		    oPosX = e.clientX;
		    oPosY = e.clientY;
		    e = e || window.event;
		    e.preventDefault();
		    pos3 = e.clientX;
		    pos4 = e.clientY;
		    document.onmouseup = closeDragElement;
		    document.onmousemove = elementDrag;
	    }
    }

    function elementDrag(e) { //on moving - set position
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement(e) { //on mouse up
	    var rect = document.getElementById("map").getBoundingClientRect();
	    var top = rect.top + window.pageYOffset;
	    var left = rect.left + window.pageXOffset;
		
		var x = 100, y = 100;
		if(e.clientY + document.getElementById("map").scrollTop - top < 0 || e.clientX + document.getElementById("map").scrollLeft - left < 0) {
			pos1 = x;
			pos2 = y;
			elmnt.style.top = document.getElementById("map").scrollTop - top + oPosY + "px";
			elmnt.style.left = document.getElementById("map").scrollLeft - left + oPosX + "px";
		}

    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function onEleClick(){
	if(isDrag == false) {
		isElement = true;
		//current = 0;
		//setPanel(this.id);
		//stationID = this.id;
		
		if(this.id == document.querySelector('[src="0"]').id) {
			//current = 1;
			setPanel(this.id, 1);
			nam = stations[0].title;
		} else if(this.id == document.querySelector('[src="1"]').id) {
			//current = 2;
			setPanel(this.id, 2);
			nam = stations[1].title;
		}
	}
}

function createStations(station) {
	var mapTag = document.getElementById("mapC");
	mapTag.innerHTML = '';
	for(var i = 0; i < station.length; i++) {
		var tag = document.createElement("div");
		tag.setAttribute("id", stations[i].title);
		tag.setAttribute("src", i.toString());
		tag.classList.add("ele");
		tag.addEventListener("click", onEleClick);
		
		var d = localStorage['size'] || 20;
		
		tag.style.height = d + "px";
		tag.style.width = d + "px";
		
		var X = document.createElement("div");
		X.classList.add("X");
		
		X.innerHTML = '<div class="toolRow"> <div class="toolUnit">Nazwa</div><div class="toolValue">Wartość</div><div class="toolUnit">Jednostka</div></div>';
		
		var tooltipTag = document.createElement("div");
		tooltipTag.classList.add("tooltiptext");
		
		var titleTag = document.createElement("span");
		titleTag.classList.add("toolTitle");
		titleTag.setAttribute("id", station[i].title + "X");
		
		var text = document.createTextNode(localStorage['name' + (i + 1).toString()] || "Hala " + (i + 1).toString());
		titleTag.appendChild(text);
		tooltipTag.appendChild(titleTag);
		
		var titleTag1 = document.createElement("span");
		titleTag1.classList.add("toolTitleId");
		
		var text = document.createTextNode("Id: " + (i + 1));
		titleTag1.appendChild(text);
		tooltipTag.appendChild(titleTag1);
		
		for(var j = 0; j < station[i].sensors.length; j++) {
			var valueTag = document.createElement("div");
			valueTag.classList.add("toolValue");
			if(station[i].sensors[j].value == "NaN") {
				if(tag.style.backgroundColor != "red")
					tag.style.backgroundColor = "yellow";
			}
			if(station[i].sensors[j].value > station[i].sensors[j].max || station[i].sensors[j].value < station[i].sensors[j].min)
				tag.style.backgroundColor = "red";
		
			var rowTag = document.createElement("div");
			rowTag.classList.add("toolRow");
			
			var nameTag = document.createElement("div");
			nameTag.classList.add("toolName");
			nameTag.appendChild(document.createTextNode(namesDict[station[i].sensors[j].name]));
			var text = document.createTextNode(station[i].sensors[j].value);
			if(station[i].sensors[j].value > station[i].sensors[j].max || station[i].sensors[j].value < station[i].sensors[j].min)
				valueTag.style.color = "red";
			if(station[i].sensors[j].stat == "off") {
				tag.style.backgroundColor = "yellow";
				text = document.createTextNode("NaN");
			}

			valueTag.appendChild(text);
			var unitTag = document.createElement("div");
			unitTag.classList.add("toolUnit");
			unitTag.appendChild(document.createTextNode(station[i].sensors[j].unit));

			rowTag.appendChild(nameTag);
			rowTag.appendChild(valueTag);
			rowTag.appendChild(unitTag);
			X.appendChild(rowTag);
		}
		tooltipTag.appendChild(X);
		dragElement(tag);
		tag.appendChild(tooltipTag);
		
		var rect = document.getElementById("map").getBoundingClientRect();
		
		tag.style.left = stations[i].sensors[0].locX + "px";
		tag.style.top = stations[i].sensors[0].locY + "px";
		mapTag.appendChild(tag);
	}
}

function changeOptions() {
	var x = document.getElementsByClassName("ele");
	d = document.getElementById("sizeCombobox").value;
	var h = 20;
	if(d == "Mała") {
		h = 20;
	} else if(d == "Średnia"){
		h = 30;
	} else {
		h = 40;
	}
	for(var i = 0; i < x.length; i++) {
		x[i].style.height = h + "px";
		x[i].style.width = h + "px";
	}
	localStorage['size'] = h;
}

function createData(title, id) {
	//alarmsV = [{alarm_sensor_id: 1, station: "Hala 1", name: "Temperatura", timestamp: "2020-04-23 17:05:04", alarm_type: "HIGH"},{alarm_sensor_id: 3, station: "Hala 2", name: "Wilgotność", timestamp: "2020-04-23 17:05:04", alarm_type: "LOW"}];
	//oldAlarms = alarmsV;
	var temp = getSensorInfo(title);
	var tag = document.getElementById("info");
	var tit1 = document.getElementById(title + "X").innerText;
	
	var titleTag = document.getElementById("title2");
	if(id != 0) {
		tit1 = localStorage['name' + id.toString()];
		titleTag.value = tit1;
		titleTag.innerHTML = '';
		titleTag.appendChild(document.createTextNode(tit1));
	}
	
	tag.innerHTML = '';
	document.getElementById('info').innerHTML = '<div class="inforow"> <div class="label">Nazwa</div><div class="label">Wartość</div><div class="label">Jednostka</div></div>';
	
	var inv = document.createElement("div");
	inv.setAttribute("id", "inv");
	inv.innerHTML = title;
	inv.classList.add("inv");
	titleTag.appendChild(inv);
	
	for(var i = 0; i < temp.length; i++) {
		var info = getSensorInfo1(title, temp[i].sensorID);
		var rowTag = document.createElement("div");
		rowTag.classList.add("inforow");
		var labelTag1 = document.createElement("div");
		var labelTag2 = document.createElement("div");
		var labelTag3 = document.createElement("div");
		labelTag1.appendChild(document.createTextNode(namesDict[temp[i].name]));
		labelTag1.classList.add("labelt");
		
		var tooltipTag = document.createElement("div");
		tooltipTag.classList.add("tooltiptext");
		tooltipTag.innerHTML = "Nazwa: " + temp[i].sensorName + "<br>" + "Id: " + temp[i].sensorID;
		labelTag1.appendChild(tooltipTag);
		
		labelTag2.appendChild(document.createTextNode(temp[i].value));
		labelTag2.classList.add("label");
		
		if(temp[i].value > temp[i].max || temp[i].value < temp[i].min )
			labelTag2.style.backgroundColor = "red";

		labelTag3.appendChild(document.createTextNode(temp[i].unit));
		labelTag3.classList.add("label");
		rowTag.appendChild(labelTag1);
		rowTag.appendChild(labelTag2);
		rowTag.appendChild(labelTag3);
		tag.appendChild(rowTag);
	}
	
	var tag1 = document.getElementById("change");
	tag1.innerHTML = '';
	document.getElementById('change').innerHTML = '<div class="inforow"> <div class="label">Nazwa</div><div class="label">Minimum</div><div class="label">Maksimum</div><div class="label">Jednostka</div></div>';
	var j = 0;
	for(var i = 0; i < temp.length; i++) {
		var info = getSensorInfo1(title, temp[i].sensorID);
		var rowTag = document.createElement("div");
		rowTag.classList.add("inforow");
		var labelTag1 = document.createElement("div");
		var labelTag2 = document.createElement("div");
		var labelTag3 = document.createElement("div");
		var labelTag4 = document.createElement("div");
		labelTag1.appendChild(document.createTextNode(namesDict[temp[i].name]));
		labelTag1.classList.add("label");
		labelTag2.appendChild(document.createTextNode(info.min));
		labelTag2.classList.add("label");
		labelTag2.setAttribute("id", "limitValue" + j.toString());
		labelTag3.appendChild(document.createTextNode(info.max));
		labelTag3.classList.add("label");
		labelTag3.setAttribute("id", "limitValue" + (j + 1).toString());
		labelTag4.appendChild(document.createTextNode(temp[i].unit));
		labelTag4.classList.add("label");
		rowTag.appendChild(labelTag1);
		rowTag.appendChild(labelTag2);
		rowTag.appendChild(labelTag3);
		rowTag.appendChild(labelTag4);
		tag1.appendChild(rowTag);
		j += 2;
	}
	//if(document.getElementById(0) == null || isElement == true){
		//limits = [];
	var tag1 = document.getElementById("change1");
	tag1.innerHTML = '';
	document.getElementById('change1').innerHTML = '<div class="inforow"> <div class="label">Nazwa</div><div class="label">Minimum</div><div class="label"></div><div class="label">Maksimum</div></div>';
	//isElement = false;
	for(var i = 0; i < temp.length; i++) {
		var info = getSensorInfo1(title, temp[i].sensorID);
		var rowTag = document.createElement("div");
		rowTag.classList.add("inforow");
		var labelTag1 = document.createElement("div");
		var labelTag2 = document.createElement("div");
		var labelTag3 = document.createElement("div");
		var labelTag4 = document.createElement("div");
		labelTag1.appendChild(document.createTextNode(namesDict[temp[i].name]));
		labelTag1.classList.add("label");
		var inputTag1 = document.createElement("input");
		inputTag1.classList.add("input");
		inputTag1.value = info.min;
		//limits.push(info.min);
		inputTag1.setAttribute("id", i);
		labelTag3.appendChild(document.createTextNode(""));
		labelTag3.classList.add("label");
		var inputTag2 = document.createElement("input");
		inputTag2.classList.add("input");
		inputTag2.setAttribute("id", i + 1);
		inputTag2.value = info.max;
		//limits.push(info.max);
		rowTag.appendChild(labelTag1);
		rowTag.appendChild(inputTag1);
		rowTag.appendChild(labelTag3);
		rowTag.appendChild(inputTag2);
		tag1.appendChild(rowTag);
	}
	
	var tag1 = document.getElementById("change2");
	tag1.innerHTML = '';
	document.getElementById('change2').innerHTML = '<div class="inforow"> <div class="label">Stacja</div><div class="label">Czujnik</div><div class="label">Typ</div><div class="label">Czas</div></div>';
	
	for(var i = 0; i < oldAlarms.length; i++) {
		var rowTag = document.createElement("div");
		rowTag.classList.add("inforow");
		var labelTag1 = document.createElement("div");
		var labelTag2 = document.createElement("div");
		var labelTag3 = document.createElement("div");
		var labelTag4 = document.createElement("div");
		labelTag1.appendChild(document.createTextNode(oldAlarms[i].station));
		labelTag1.classList.add("label");
		labelTag2.appendChild(document.createTextNode(oldAlarms[i].name));
		labelTag2.classList.add("label");
		labelTag3.appendChild(document.createTextNode(alarmsDict[oldAlarms[i].alarm_type]));
		labelTag3.classList.add("label");
		labelTag4.appendChild(document.createTextNode(oldAlarms[i].timestamp));
		labelTag4.classList.add("label");
		rowTag.appendChild(labelTag1);
		rowTag.appendChild(labelTag2);
		rowTag.appendChild(labelTag3);
		rowTag.appendChild(labelTag4);
		tag1.appendChild(rowTag);
	}
}

function setPanel(title, id) {	
	changePage(2);
	createData(title, id);
}
//alarmsV = [{alarm_sensor_id: 1, station: "Hala 1", name: "Temperatura", timestamp: "2020-04-23 17:05:04", alarm_type: "Wartość jest za wysoka"},{alarm_sensor_id: 3, station: "Hala 2", name: "Wilgotność", timestamp: "2020-04-23 17:05:04", alarm_type: "Wartość jest za niska"}];
//createAlarmWindow();
//oldAlarms = alarmsV;

function createAlarmWindow() {
	var names = [];
	var s = "    ";
	//alarmsV = [{alarm_sensor_id: 1, station: "Hala 1", name: "Temperatura", timestamp: "2020-04-23 17:05:04", alarm_type: "HIGH"},{alarm_sensor_id: 3, station: "Hala 2", name: "Wilgotność", timestamp: "2020-04-23 17:05:04", alarm_type: "LOW"}];
	var pop = document.getElementById("popupText");
	var box = document.createElement("buttBox");
	box.classList.add("buttonBox3");
	pop.innerHTML = '';
	box.innerHTML = '';
	
	for(var i = 0; i < alarmsV.length; i++) {
		if(names.indexOf(alarmsV[i].station) < 0)
			names.push(alarmsV[i].station);
	}
	
	var x = document.getElementById("alarmPop");
	var tlt = document.getElementById("popupTitle");
	for(var i = 0; i < names.length; i++) {
		var stationTxt = document.createElement("p");
		var txt = document.createElement("p");
		txt.setAttribute("id", "txt" + i);
			
		stationTxt.innerHTML = names[i] + ":";
		pop.appendChild(stationTxt);
		pop.appendChild(txt);
	}
		
	for(var i = 0; i < alarmsV.length; i++) {
		if(alarmsV[i].station == names[0]) {
			var txt = document.getElementById("txt0");
			txt.innerHTML += "<b>" + alarmsV[i].name + "</b>" + ":  &ensp; " + alarmDict[alarmsV[i].alarm_type] + " &ensp; Data: " + alarmsV[i].timestamp + "<br>";
		}
		if(alarmsV[i].station == names[1]) {
			var txt = document.getElementById("txt1");
			txt.innerHTML += "<b>" + alarmsV[i].name + "</b>" + ":  &ensp; " + alarmDict[alarmsV[i].alarm_type] + " &ensp; Data: " + alarmsV[i].timestamp + "<br>";
		}
	}
		
	var b = document.createElement("a");
	b.classList.add("button2");
	b.innerHTML = localStorage['name1'];
	b.addEventListener("click", onButtonAlarm1);
	box.appendChild(b);
	var b1 = document.createElement("a");
	b1.classList.add("button2");
	b1.innerHTML = localStorage['name2'];
	b1.addEventListener("click", onButtonAlarm2);
	box.appendChild(b1);
	pop.appendChild(box);
	x.appendChild(pop);
	tlt.innerHTML = "Wykryto alarm!";
	var modal = document.getElementById("myModal");
	modal.style.display = "block";		
	
	alarmsV = [];
}

function dataPack(data, values) {
	var temp = [];
	stations = [];
	var value = values;
	for(var i = 0; i < data.length; i++) {
		var dat = data[i][0];
		if(temp.indexOf(dat.location_x) < 0) {
			var stat1 = {title:"Hala produkcyjnaaa", sensors:[]};
			stat1.title = dat.location_x;
			stations.push(stat1);
			var x = dat.location_x;
			temp.push(x);
		}
		if(value[i] == null) {
			values.push("NaN");
		}
		var sensor = {name:dat.measurement_type, sensorName:dat.name, value:value[i], unit:dat.unit, stat:dat.status, sensorID:dat.sensor_id, min:dat.limit_min, max:dat.limit_max, locX:dat.location_x, locY:dat.location_y};
			
		for(var j = 0; j < stations.length; j++) {
			if(stations[j].title == dat.location_x) {
				stations[j].sensors.push(sensor);
			}
		}
	}
	values.length = 0;
	if(isDrag == false)
		createStations(stations);
}

function alarmTime() {
	tout = false;
}

function openSocket() {
	socket = new WebSocket('ws://127.0.0.1:50093'); 
	var x = 0, x1 = 0, e = 0, e1 = 0;
	var temp2 = [];
	var values = [];
	var size2 = 0;
	var modal = document.getElementById("myModal");
	
	socket.onopen = function() { 
		temp2 = [];   
		stations = [];	
		//if(start == true) {
		startConnection();
		//start = false;
		//}
	};  
	
	socket.onmessage = function(event) {  
	console.log(x);
		data = event.data;  
		console.log('Received data: ' + event.data)
		var data = JSON.parse(event.data);
		
		if(data.is_alarm == 1) {
			var alarm = data.alarms;
			var oldNul = false;
			for(var i = 0; i < alarm.length; i++) {
				oldNul = false;
				for(var j = 0; j < oldAlarms.length; j++) {
					var alarmValue = new Date(alarm[i].alarm_timestamp).valueOf();
					var oldAlarmValue = new Date(oldAlarms[j].timestamp).valueOf();
					if(alarm[i].alarm_sensor_id == oldAlarms[j].alarm_sensor_id && ((alarmValue - oldAlarmValue) > (localStorage['time'] || 60000))) {
						oldNul = false;
					} else if(alarm[i].alarm_sensor_id == oldAlarms[j].alarm_sensor_id) {
						oldNul = true;
					} 
				}
				if(oldNul == false) {
					var stationName = '';
					if(alarm[i].alarm_sensor_id % 2 == 0)
						stationName = localStorage['name2'];
					else 
						stationName = localStorage['name1'] 
					var alarmValue = new Date(alarm[i].alarm_timestamp).valueOf();
					var oldAlarmValue = Date.now().valueOf();
					if(oldAlarmValue - alarmValue < 1500) {
					oldAlarms.push({alarm_sensor_id: alarm[i].alarm_sensor_id, station: stationName, name: idDict[alarm[i].alarm_sensor_id], timestamp: alarm[i].alarm_timestamp, alarm_type: alarm[i].alarm_type});
					}
				}
			}
			if(oldAlarms.length > 9) {
				for(var i = 0; i < oldAlarms.length - 9; i++) {
					oldAlarms.shift();
				}
			}
			
			var oldNul = false;
			for(var i = 0; i < alarm.length; i++) {
				oldNul = false;
				for(var j = 0; j < alarms.length; j++) {
					var alarmValue = new Date(alarm[i].alarm_timestamp).valueOf();
					var oldAlarmValue = new Date(alarms[j].timestamp).valueOf();
					if(alarm[i].alarm_sensor_id == alarms[j].alarm_sensor_id && ((alarmValue - oldAlarmValue) > (localStorage['time'] || 60000))) {
						oldNul = false;
					} else if(alarm[i].alarm_sensor_id == alarms[j].alarm_sensor_id) {
						oldNul = true;
					} 
				}
				if(oldNul == false) {
					var stationName = '';
					if(alarm[i].alarm_sensor_id % 2 == 0)
						stationName = localStorage['name2'];
					else 
						stationName = localStorage['name1'] 
					var alarmValue = new Date(alarm[i].alarm_timestamp).valueOf();
					var oldAlarmValue = Date.now().valueOf();
					if(oldAlarmValue - alarmValue < 1500) {
						alarms.push({alarm_sensor_id: alarm[i].alarm_sensor_id, station: stationName, name: idDict[alarm[i].alarm_sensor_id], timestamp: alarm[i].alarm_timestamp, alarm_type: alarm[i].alarm_type});
						alarmsV.push({alarm_sensor_id: alarm[i].alarm_sensor_id, station: stationName, name: idDict[alarm[i].alarm_sensor_id], timestamp: alarm[i].alarm_timestamp, alarm_type: alarm[i].alarm_type});
					}
				}
			}
			for(var k = 0; k < alarms.length; k++) {
				for(var l = 0; l < alarm.length; l++) {
					var alarmValue = new Date(alarm[l].alarm_timestamp).valueOf();
					var oldAlarmValue = new Date(alarms[k].timestamp).valueOf();
					if((alarmValue - oldAlarmValue) > (localStorage['time'] || 60000)) {
						alarms.splice(k, 1);
					}
				}
			}
			
			if(alarmsV.length > 0) {
				if(tout == false) {
					tout = true;
					createAlarmWindow();
					setTimeout(alarmTime, 2000);
				}
			}
		}
		
		if(data.json_id == 101)
			return;
		
		if(data.json_id == 103) {
			size2++;
			if(modal.style.display != "block") {
				if(size2 == size1) {
					size2 = 0;
					var txt = document.getElementById("popupText");
					var tlt = document.getElementById("popupTitle");
					txt.innerHTML = "Zmiany zostały zapisane!";
					tlt.innerHTML = "Uwaga!!";
					modal.style.display = "block";
				}
			}
			return;
		}
		
		if(data.json_id == 102) {
			size2++;
			if(size2 == size1) {
				size2 = 0;
				if(modal.style.display != "block") {
					var txt = document.getElementById("popupText");
					var tlt = document.getElementById("popupTitle");
					txt.innerHTML = "Zmiany zostały zapisane!";
					tlt.innerHTML = "Uwaga!";
					modal.style.display = "block";
				}
			}
			
			return;
		}
		
		/*if(c == 0) {
			temp2 = []; 
			c = 1;
		}*/
		
		if(data.json_id == 5) {
			temp2.push(data.result);
			x++;
		}
		
		if(data.json_id == 1) {
			//len = data.result.length;
			for(var i = 1; i < data.result.length + 1; i++) {
				var request = ' {"json_id": "5", "sensor_id": '+  i.toString() + '} ';
				socket.send(request); 
				e++;
			}
			
			for(var i = 1; i < data.result.length + 1; i++) {		
				socket.send(' {"json_id": "3","measures": 1,"sensor_id":' + i.toString() + '} ');  
				e1++;
			}
			
		}
		
		if(data.json_id == 3) {
			x1++;
			if(data.result[0].data[0] != null) {
				values.push(data.result[0].data[0].value);
			} else {
				values.push("NaN");
			}
		}
		
		if(x == e && ( x1 == e1)) {
			dataPack(temp2, values);
			temp2 = [];
			//res = 1;
			//y = 0;
			x = 0;
			x1 = 0;
			e = 0;
			e1 = 0;
			//c = 0;
			//res = 0;
			//if(current == 1) {
			//	createData(nam);
				//res = 2;
			//} else if(current == 2) {
				if(isElement == true)
					createData(nam, 0);
				//res = 2;
			//}
		}	   
	};   
	
	socket.onclose = function () {        
	};  
	
	socket.onerror = function () {       
	};
}

function getSensorInfo(name) {
	var result = [];
	for(var i = 0; i < stations.length; i++) {
		if(stations[i].title == name) {
			result = stations[i].sensors;
		}
	}
	return result;
}

function getSensorInfo1(title, id) {
	var result = [];
	for(var i = 0; i < stations.length; i++) {
		if(stations[i].title == title) {
			for(var j = 0; j < stations[i].sensors.length; j++) {
				if(stations[i].sensors[j].sensorID == id) {
					result = stations[i].sensors[j];
				}
			}	
		}
	}
	return result;
}

function onChangeButtonClick() {
	var inputs = document.getElementsByClassName("input");
	for(var i = 0; i < inputs.length; i++) {
	}
	var j = 1;
	var staId = document.getElementById("inv").innerHTML;
	if(staId == document.querySelector('[src="0"]').id) {
		localStorage['name1'] = document.getElementById("title2").value;
		j = 1;
		nam = stations[0].title;
		console.log("AA1");
		//current = 1;
	}
	if(staId == document.querySelector('[src="1"]').id) {
		localStorage['name2'] = document.getElementById("title2").value;
		j = 2;
		nam = stations[1].title;
		console.log("AA2");
		//current = 2;
	}
	
	//names[0] = localStorage['name1'] || "Hala 1";
	//names[1] = localStorage['name2'] || "Hala 2";
	size1 = 0;
	for(var i = 0; i < inputs.length - 1; i += 2) {		
		socket.send(' {"json_id": "101", "sensor_id":' + j.toString() + ' ,"new_limit_min":' + inputs[i].value + '} ');  		
		socket.send(' {"json_id": "102", "sensor_id":' + j.toString() + ' ,"new_limit_max":' + inputs[i + 1].value + '} '); 
		j += 2;
		size1++;
	}
	createStations(stations);
}

function onResetButtonClick() {
	var inputs = document.getElementsByClassName("input");
	for(var i = 0; i < inputs.length; i++) {
		inputs[i].value = document.getElementById("limitValue" + i.toString()).innerHTML;
	}
}

function changePage(page) {
	for(var i = 1; i < 5; i++) {
		if(i != page)
			document.getElementById("page" + i.toString()).style.display = "none";
		else
			document.getElementById("page" + i.toString()).style.display = "block";
	}
}

function onPage4Click() {
	changePage(4);
	var svg = document.getElementById("svg1");
	svg.innerHTML = '';
	isDrag = true;
	document.getElementById("chartLabel1").innerHTML = localStorage['name1'];
	document.getElementById("chartLabel2").innerHTML = localStorage['name2'];
	startPlot();
}

function onPage1Click() {
	changePage(1);
	isDrag = false;
}

function onPage2Click() {
	changePage(2);
	isDrag = false;
}

function onPage3Click() {
	changePage(3);
	isDrag = false;
}

function onPositionButtonClick(){ 	
	size1 = 0;
	
	var a = document.getElementsByClassName("ele")[1];
	var b = document.getElementsByClassName("ele")[0];
	
	var str1 = a.style.left.slice(0,-2);
	var str2 = a.style.top.slice(0,-2);
	
	var str1a = b.style.left.slice(0,-2);
	var str2b = b.style.top.slice(0,-2);
	
	var locations = [];
	var locationsy = [];
	for(var z = 0; z < 14; z++) {
		if(z % 2 == 0) {
			locations.push(parseInt(str1a));
			locationsy.push(parseInt(str2b));
		} else {
			locations.push(parseInt(str1));
			locationsy.push(parseInt(str2));
		}
	}
	
	for(var i = 1; i < locationsy.length + 1; i++) {	
		size1++;
		socket.send(' {"json_id": "103","sensor_id":' + i.toString() + ',"location_x":' + locations[i - 1].toString() + ',"location_y":' +  locationsy[i - 1].toString()  + '} ');   
	}
}

function startConnection() {
	if (socket.readyState == WebSocket.OPEN && isDrag == false) {	
		socket.send(' {"json_id": "1"} '); 
		setTimeout(startConnection, 5000);
	} else if (socket.readyState != WebSocket.OPEN && isDrag == false) {
		openSocket();
		setTimeout(startConnection, 2000);
	} else {
		setTimeout(startConnection, 2000);
	}
}

function onEditButtonClick() {
	if(isDrag == false) {
		this.style.backgroundColor = "rgb(250, 150, 150)";
	} else {
		this.style.backgroundColor = "rgb(200, 200, 200)";
	}
	isDrag = !isDrag;		
}

function startAlarm(id) {
	var modal = document.getElementById("myModal");
	setPanel(stations[id - 1].title, id);
	nam = stations[id - 1].title;
	//current = id;
	modal.style.display = "none";
	isElement = true;
	id -= 1;
	var str = '[src="' + id.toString() + '"]';
	//stationID = document.querySelector(str).id;
}

function onButtonAlarm1(i) {
	startAlarm(1);
}

function onButtonAlarm2(i) {
	startAlarm(2);
}

function setUpOptionCombobox() {
	var preview = document.getElementById("preview");
	preview.setAttribute('src', "fl.jpg");
	
	document.getElementById("timeInput").value = localStorage['time'] || 60000;

	if(localStorage['size'] == 20)
		document.getElementById("sizeCombobox").value = "Mała";
	if(localStorage['size'] == 30)
		document.getElementById("sizeCombobox").value = "Średnia";
	if(localStorage['size'] == 40)
		document.getElementById("sizeCombobox").value = "Duża";
	
	var modal = document.getElementById("myModal");
	var span = document.getElementsByClassName("close")[0];

	span.onclick = function() {
		modal.style.display = "none";
		var tlt = document.getElementById("popupTitle");
		if(tlt.innerHTML == "Wykryto alarm!")
			alarmsV = [];
	}

	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = "none";
			var tlt = document.getElementById("popupTitle");
			if(tlt.innerHTML == "Wykryto alarm!")
			alarmsV = [];
		}
	}
	
	//names[0] = localStorage['name1'] || "Hala 1";
	//names[1] = localStorage['name2'] || "Hala 2";
}

function startPlot() {
	var b1 = d3.select("#sensor_1")
    var b2 = d3.select("#sensor_2")
    var b3 = d3.select("#sensor_3")
    var b4 = d3.select("#sensor_4")
    var b5 = d3.select("#sensor_5")
    var b6 = d3.select("#sensor_6")
    var b7 = d3.select("#sensor_7")
    var b8 = d3.select("#sensor_8")
    var b9 = d3.select("#sensor_9")
    var b10 = d3.select("#sensor_10")
    var b11 = d3.select("#sensor_11")
    var b12 = d3.select("#sensor_12")
    var b13 = d3.select("#sensor_13")
    var b14 = d3.select("#sensor_14")

    var socket = new WebSocket('ws://127.0.0.1:50093');
    socket.onopen = function() {
        console.log('Connected!');
	var now = new Date();
    
	timestamp_now = now.getFullYear() +"-"+ pad(now.getMonth()+1) +"-"+ pad(now.getDate()) +" "+ pad(now.getHours()) +":"+ pad(now.getMinutes()) +":"+ pad(now.getSeconds())
	var starting_json = {"json_id": "7","timestamp_start": "2020-04-07 09:00:00","timestamp_end":timestamp_now ,"sensor_id": 1} 
    	first_json = JSON.stringify(starting_json)
        socket.send(first_json);
	console.log(first_json)
    };
    socket.onmessage = function(event) {
	var obj = JSON.parse(event.data.replace(/\bNaN\b/g, "null"));
        //var obj = JSON.parse(event.data);
        records = obj.result[0].data

	for (r in records)
	{ 	
		
 		records[r].timestamp = Date.parse(records[r].timestamp)
	}
	first = records[0].timestamp
	fr = new Date(first)
	fr = fr.toLocaleDateString();	    	    
	last = records[records.length - 1].timestamp
	lr = new Date(last)
	lr = lr.toLocaleDateString();

	bottom_text = d3.select("#bottom_axis_text")
	bottom_text.text("Zakres dat: "+fr+" - "+lr)

        main(records);
        socket.close();
    };
    socket.onclose = function() {
        console.log('Lost connection!');
    };
    socket.onerror = function() {
        console.log('Error!');
    };
      // set the dimensions and margins of the graph
      var margin = {top: 30, right: 30, bottom: 60, left: 60},
          width = 740 - margin.left - margin.right,
          height = 480 - margin.top - margin.bottom;
      
      // append the svg object to the body of the page
      var svga = d3.select("#svg1")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

      svga.append("text").attr('id', 'bottom_axis_text')             
        .attr("transform", "translate(" + (width/2) + " ," +  (height + margin.top + 25) + ")")
        .style("text-anchor", "middle").style("font-size","20px")
        .text("Zakres dat: ");


      svga.append("text").attr('id', 'left_axis_text')
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle").style("font-size","20px")
        .text("Temperatura [ C]"); 
    function pad(n){return n<10 ? '0'+n : n}
    function main(data) {

    	var current_sensor = 1;
	b1.on("click", function () {buttonX(1); });
	b8.on("click", function () {buttonX(2); });

	b2.on("click", function () {buttonX(9); });
	b9.on("click", function () {buttonX(10); });

	b3.on("click", function () {buttonX(3); });
	b10.on("click", function () {buttonX(4); });

	b4.on("click", function () {buttonX(7); });
	b11.on("click", function () {buttonX(8); });

	b5.on("click", function () {buttonX(5); });
	b12.on("click", function () {buttonX(6); });

	b6.on("click", function () {buttonX(11); });
	b13.on("click", function () {buttonX(12); });

	b7.on("click", function () {buttonX(13); });	
	b14.on("click", function () {buttonX(14); });



      var x = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d.timestamp; }))
        .range([ 0, width ]);
      xAxis = svga.append("g").style("font-size","16px")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
  
      // Add Y axis
      var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.value; })])
        .range([ height, 0 ]);
      yAxis = svga.append("g").style("font-size","16px")
        .call(d3.axisLeft(y));
  
      // Add a clipPath: everything out of this area won't be drawn.
      var clip = svga.append("defs").append("svga:clipPath")
          .attr("id", "clipa")
          .append("svga:rect")
          .attr("width", width )
          .attr("height", height )
          .attr("x", 0)
          .attr("y", 0);
  
      // Add brushing
      var brush = d3.brushX()                   // Add the brush feature using the d3.brush function
          .extent( [ [0,0], [width,height] ] )  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
          .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function
  
      // Create the line variable: where both the line and the brush take place
      var line = svga.append('g')
        .attr("clip-path", "url(#clipa)")

  
      // Add the line
      line.append("path")
        .data([data])
        .attr("class", "line")  // I add the class line to be able to modify this line later on.
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .x(function(d) { return x(+d.timestamp) })
          .y(function(d) { return y(+d.value) })
          )


  
      // Add the brushing
      line
        .append("g")
          .attr("class", "brush")
          .call(brush);
  
      // A function that set idleTimeOut to null
      var idleTimeout
      function idled() { idleTimeout = null; }

      function buttonX(button_id) {
	current_sensor = button_id
	var now = new Date();  
	timestamp_now = now.getFullYear() +"-"+ pad(now.getMonth()+1) +"-"+ pad(now.getDate()) +" "+ pad(now.getHours()) +":"+ pad(now.getMinutes()) +":"+ pad(now.getSeconds())

	new_json = JSON.stringify({"json_id": "7","timestamp_start": "2020-04-07 09:00:00","timestamp_end":timestamp_now, "sensor_id": current_sensor})

        var socket = new WebSocket('ws://127.0.0.1:50093');
        socket.onopen = function() {console.log('Connected!');
        socket.send(new_json);};

        socket.onmessage = function(event) {
            var button_obj = JSON.parse(event.data.replace(/\bNaN\b/g, "null"));
	    console.log(button_obj)
            var button_records = button_obj.result[0].data
	if (button_records.length <= 1) {
  	    alert("Brak danych dla tego czujnika");
	} else {
	    console.log(button_records.length)
            for (r in button_records)
            { 	
				
                button_records[r].timestamp = Date.parse(button_records[r].timestamp)
            }
	    first_record = button_records[0].timestamp
	    fd = new Date(first_record)
	    fd = fd.toLocaleDateString();	    	    
	    last_record = button_records[button_records.length - 1].timestamp
	    ld = new Date(last_record)
	    ld = ld.toLocaleDateString();

	axis_text = d3.select("#left_axis_text")
	bottom_text = d3.select("#bottom_axis_text")
	bottom_text.text("Zakres dat: "+fd+" - "+ld)
        switch (current_sensor) {
        case 1:
            axis_text.text("Temperatura [ C]");
            break;

        case 2:
            axis_text.text("Temperatura [ C]")
            break;

        case 3:
            axis_text.text("Tlenek wegla [ppm]")
            break;

        case 4:
            axis_text.text("Tlenek wegla [ppm]")
            break;

        case 9:
            axis_text.text("Wilgotnosc [%RH]")
            break;

        case 10:
            axis_text.text("Wilgotnosc [%RH]")
            break;

        case 7:
            axis_text.text("Wibracje [Hz]")
            break;

        case 8:
            axis_text.text("Wibracje [Hz]")
            break;

        case 5:
            axis_text.text("PM 2.5 [ug/m3]")
            break;

        case 6:
            axis_text.text("PM 2.5 [ug/m3]")
            break;

        case 11:
            axis_text.text("PM 1 [ug/m3]")
            break;

        case 12:
            axis_text.text("PM 1 [ug/m3]")
            break;

        case 13:
            axis_text.text("PM 10 [ug/m3]")
            break;

        case 14:
            axis_text.text("PM 10 [ug/m3]")
            break;
           
        default:
            axis_text.text("Nie obslugiwana jednostka")
        }


        var button_data = svga.selectAll(".line")
            .data([button_records], function(d){ return d.value });

        button_data
            .enter()
            .append("path")
            .attr("class","line")
            .merge(button_data)
            .transition()
            .duration(600)
            .attr("d", d3.line()
            .x(function(d) { return x(d.timestamp); })
            .y(function(d) { return y(d.value); }))
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 1.5)

        x.domain(d3.extent(button_records, function(d) { return d.timestamp; }))
          .range([ 0, width ]);
	
        // Add Y axis
        y.domain([0, d3.max(button_records, function(d) { return +d.value; })])
          .range([ height, 0 ]);

        xAxis.transition().call(d3.axisBottom(x))
        yAxis.transition().call(d3.axisLeft(y))

        socket.close();
	}
        };
        socket.onclose = function() {
            console.log('Lost connection!');
        };
        socket.onerror = function() {
            console.log('Error!');
        };
             
        }
          
  
      // A function that update the chart for given boundaries
    function updateChart() {
  
        extent = d3.event.selection


    if(!extent){
        if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
        x.domain([ 4,8])
    }else{
        l = x.invert(extent[0])
        r = x.invert(extent[1])

        x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])

        console.log(l+"	"+r);

        timestamp_left = l.getFullYear() +"-"+ pad(l.getMonth()+1) +"-"+ pad(l.getDate()) +" "+ pad(l.getHours()) +":"+ pad(l.getMinutes()) +":"+ pad(l.getSeconds())
        timestamp_right = r.getFullYear() +"-"+ pad(r.getMonth()+1) +"-"+ pad(r.getDate()) +" "+ pad(r.getHours()) +":"+ pad(r.getMinutes()) +":"+ pad(r.getSeconds())


        var json_builder = {"json_id": "7","timestamp_start": timestamp_left,"timestamp_end": timestamp_right,"sensor_id": current_sensor} 
        new_json = JSON.stringify(json_builder)
        console.log(new_json)
        var socket = new WebSocket('ws://127.0.0.1:50093');
        socket.onopen = function() {console.log('Connected!');
        socket.send(new_json);};
        socket.onmessage = function(event) {
            var new_obj = JSON.parse(event.data.replace(/\bNaN\b/g, "null"));
            var new_records = new_obj.result[0].data

            for (r in new_records)
            { 	
				
                new_records[r].timestamp = Date.parse(new_records[r].timestamp)
	    }

	y.domain([d3.min(new_records, function(d) { return +d.value; }), d3.max(new_records, function(d) { return +d.value; })])
	    .range([ height, 0 ]);


    var u = svga.selectAll(".line")
        .data([new_records], function(d){ return d.value });

    u
        .enter()
        .append("path")
        .attr("class","line")
        .merge(u)
        .transition()
        .duration(600)
        .attr("d", d3.line()
        .x(function(d) { return x(d.timestamp); })
        .y(function(d) { return y(d.value); }))
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2.0)
        xAxis.transition().call(d3.axisBottom(x))
	yAxis.transition().call(d3.axisLeft(y))

                socket.close();
        };
        socket.onclose = function() {
            console.log('Lost connection!');
        };
        socket.onerror = function() {
            console.log('Error!');
        };
        line.select(".brush").call(brush.move, null)        
        }
    }      
        svga.on("dblclick",function(){
        var socket = new WebSocket('ws://127.0.0.1:50093');
        socket.onopen = function() {
            console.log('Connected!');
        var now = new Date();
            timestamp_now = now.getFullYear() +"-"+ pad(now.getMonth()+1) +"-"+ pad(now.getDate()) +" "+ pad(now.getHours()) +":"+ pad(now.getMinutes()) +":"+ pad(now.getSeconds())
        var db_click_json = {"json_id": "7","timestamp_start": "2020-04-08 00:00:00","timestamp_end": timestamp_now,"sensor_id": current_sensor}
            db_json = JSON.stringify(db_click_json)
            console.log(db_json);

            socket.send(db_json);
        };
        socket.onmessage = function(event) {
            var obj = JSON.parse(event.data.replace(/\bNaN\b/g, "null"));
            records = obj.result[0].data
            
        for (r in records)
        {	
            records[r].timestamp = Date.parse(records[r].timestamp)
        }
        x.domain(d3.extent(records, function(d) { return d.timestamp; }))
            .range([ 0, width ]);
	y.domain([0, d3.max(records, function(d) { return +d.value; })])
	    .range([ height, 0 ]);


    var z = svga.selectAll(".line")
        .data([records], function(d){ return d.value });

    z
        .enter()
        .append("path")
        .attr("class","line")
        .merge(z)
        .transition()
        .duration(600)
        .attr("d", d3.line()
        .x(function(d) { return x(d.timestamp); })
        .y(function(d) { return y(d.value); }))
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        xAxis.transition().call(d3.axisBottom(x))
	yAxis.transition().call(d3.axisLeft(y))

        socket.close();


        };
        socket.onclose = function() {
            console.log('Lost connection!');
        };
        socket.onerror = function() {
            console.log('Error!');
        };


        });  
    }
}