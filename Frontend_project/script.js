var stations = [];
document.getElementById("button").addEventListener("click", onButtonClick);
document.getElementById("dataButton").addEventListener("click", onDataClick);
document.getElementById("button1").addEventListener("click", onButtonClicktest);
document.getElementById("button2").addEventListener("click", onButtonClick2);
document.getElementById("buttona").addEventListener("click", onButtonClicka);
document.getElementById("buttonb").addEventListener("click", onButtonClickb);
document.getElementById("buttonc").addEventListener("click", onButtonClickc);
document.getElementById("buttonz").addEventListener("click", onButtonClickz);
document.getElementById("changeButton").addEventListener("click", onChangeClick);
document.getElementById("resetButton").addEventListener("click", onResetClick);
document.getElementById("combo").addEventListener("onChange", onChange);
document.getElementById("timeButton").addEventListener("click", onTimeClick);

var station = [{title:"Hala produkcyjnaa", sensors:[{name:"Temperatura", value:"20.2", unit:"*C", stat:"on"}, {name:"Cisninie", value:"20.2", unit:"*C", stat:"on"}, {name:"Metan", value:"20.2", unit:"*C", stat:"off"} ]}];

var stat = {title:"Hala produkcyjnaaa", sensors:[{name:"Temperatura", value:"20.2", unit:"*C", stat:"on"}, {name:"Cisninie", value:"20.2", unit:"*C", stat:"on"}]};
var stat1 = {title:"Hala produkcyjnaaa", sensors:[]};
var sensor = {name:"Temperatura", value:"20.2", unit:"*C", stat:"on"};

var isDrag = false;
var isData = false;
var eleClick = false;
lst = ["a", "b"];

//var oldAlarms = [{station: "Hala 1", alarm_type: "LOW", name: "Temperatura", alarm_sensor_id: 1, timestamp: "2020-04-22 10:05:09"}, {station: "Hala 2", alarm_type: "ALARM_TYPE_2", name: "Temperatura", alarm_sensor_id: 2, timestamp: "2020-04-22 10:05:09"}, {station: "Hala 1", alarm_type: "HIGH", alarm_sensor_id: 3, name: "Wilgotność", timestamp: "2020-04-22 10:05:09"}];
var alarms = [];
var alarmsV = [];
var oldAlarms = [];
var stationID = null;
// IMAGE CHANGE
var fileTag = document.getElementById("filetag"),
    preview = document.getElementById("preview");

preview.setAttribute('src', "fl.jpg");
if(localStorage['size'] == 20)
	document.getElementById("combo").value = "Mała";
if(localStorage['size'] == 30)
	document.getElementById("combo").value = "Średnia";
if(localStorage['size'] == 40)
	document.getElementById("combo").value = "Duża";
fileTag.addEventListener("change", function() {
	changeImage(this);
});

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

//document.getElementById("combo").value = localStorage['size'] || "Średnia";
document.getElementById("timeInput").value = localStorage['time'] || 60000;

function onTimeClick() {
	var val = document.getElementById("timeInput").value;
	if(val > 0 && val != undefined && val != null && val != NaN)
		localStorage['time'] = document.getElementById("timeInput").value;
	onChange();
}

function changeImage(input) {
	var reader;

	if (input.files && input.files[0]) {
		reader = new FileReader();

		reader.onload = function(e) {
		preview.setAttribute('src', e.target.result);
		}

		reader.readAsDataURL(input.files[0]);
	}
}
// #####

// ELEMENT DRAG
var locations = [];
var locationsy = [];
var current = 0;
var size1 = 0;
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
		
		/*titleTag = document.getElementById(station[i].title + "X");
		titleTag.setAttribute("id", station[i].title + "X");
		elmnt.setAttribute("id", stations[i].title);*/

		var x = 100, y = 100;
		if(e.clientY + document.getElementById("map").scrollTop - top < 0 || e.clientX + document.getElementById("map").scrollLeft - left < 0) {
			pos1 = x;
			pos2 = y;
			elmnt.style.top = document.getElementById("map").scrollTop - top + oPosY + "px";
			elmnt.style.left = document.getElementById("map").scrollLeft - left + oPosX + "px";
		}
	
		var a = document.getElementsByClassName("ele")[1];
		var b = document.getElementsByClassName("ele")[0];
	
		var str1 = a.style.left.slice(0,-2);
		var str2 = a.style.top.slice(0,-2);
	
		var str1a = b.style.left.slice(0,-2);
		var str2b = b.style.top.slice(0,-2);
	
		/*for(var z = 0; z < stations[0].length * 2; z++) {
			if(z % 2 == 0) {
				locations.push(parseInt(str1) - left + document.getElementById("map").scrollLeft);
				locationsy.push(parseInt(str2) - top + document.getElementById("map").scrollTop);
			} else {
				locations.push(parseInt(str1a) - left + document.getElementById("map").scrollLeft);
				locationsy.push(parseInt(str2b) - top + document.getElementById("map").scrollTop);
			}
		}*/
		locations = [];
		locationsy = [];
		for(var z = 0; z < 14; z++) {
			if(z % 2 == 0) {
				locations.push(parseInt(str1a));
				locationsy.push(parseInt(str2b));
			} else {
				locations.push(parseInt(str1));
				locationsy.push(parseInt(str2));
			}
		}
		console.log(rect.left + " " + window.pageXOffset + " " + parseInt(str1) + " " + left + " " + document.getElementById("map").scrollLeft);
		console.log(parseInt(str1) - left + document.getElementById("map").scrollLeft);
		console.log(parseInt(str2) - top + document.getElementById("map").scrollTop);
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
// ####

var names = ["name", "unit", "value"];

function onEleClick(){
	if(isDrag == false) {
		eleClick = true;
		current = 0;
		onButtonClickd(this.id);
		stationID = this.id;
		console.log("SSD: " + this.id);
		
		if(this.id == document.querySelector('[src="0"]').id) {
			current = 1;
			nam = stations[0].title;
		} else if(this.id == document.querySelector('[src="1"]').id) {
			current = 2;
			nam = stations[1].title;
		}
	}
}

var names = ["Hala 1", "Hala 2"];
names[0] = localStorage['name1'] || "Hala 1";
names[1] = localStorage['name2'] || "Hala 2";

function createStations(station) {
	console.log("create!!");
	var mapTag = document.getElementById("mapC");
	mapTag.innerHTML = '';
	//console.log(station);
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
		
		var text = document.createTextNode(names[i]);
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
				//valueTag.style.color = "yellow";
			}
			if(station[i].sensors[j].value > station[i].sensors[j].max || station[i].sensors[j].value < station[i].sensors[j].min)
				tag.style.backgroundColor = "red";
		
			var rowTag = document.createElement("div");
			rowTag.classList.add("toolRow");
			
			var nameTag = document.createElement("div");
			nameTag.classList.add("toolName");
			nameTag.appendChild(document.createTextNode(namesDict[station[i].sensors[j].name]));
			//var valueTag = document.createElement("div");
			//valueTag.classList.add("toolValue");
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
		
		/*if(res == 1)
			values = [];*/
	}
}

function onButtonClicka() {
	var searchbar = document.getElementById("page1");
	var searchbar1 = document.getElementById("page2");
	var searchbar2 = document.getElementById("page3");

    searchbar.style.display = "block";
	searchbar1.style.display = "none";
	searchbar2.style.display = "none";
	
	var searchbar3 = document.getElementById("page4");
	searchbar3.style.display = "none";
	
	isData = false;
}

function onButtonClickb() {
	var searchbar = document.getElementById("page1");
	var searchbar1 = document.getElementById("page2");
	var searchbar2 = document.getElementById("page3");

    searchbar.style.display = "none";
	searchbar1.style.display = "block";
	searchbar2.style.display = "none";
	
	var searchbar3 = document.getElementById("page4");
	searchbar3.style.display = "none";
	
	isData = false;
}

function onButtonClickc() {
	var searchbar = document.getElementById("page1");
	var searchbar1 = document.getElementById("page2");
	var searchbar2 = document.getElementById("page3");

    searchbar.style.display = "none";
	searchbar1.style.display = "none";
	searchbar2.style.display = "block";
	
	var searchbar3 = document.getElementById("page4");
	searchbar3.style.display = "none";
	
	isData = false;
}

function onButtonClickz(){
	console.log("GI");
	//var socket = new WebSocket('ws://127.0.0.1:50093'); 
	//socket.onopen = function () {       
//		console.log('Connected!'); 	 	
	size1 = 0;
	for(var i = 1; i < locationsy.length + 1; i++) {	
		size1++;
		console.log("i");	
		socket.send(' {"json_id": "103","sensor_id":' + i.toString() + ',"location_x":' + locations[i - 1].toString() + ',"location_y":' +  locationsy[i - 1].toString()  + '} ');   
	}
//	};  
	
//	socket.onmessage = function (event) {  
//		data = event.data;  
//		console.log('Received data: ' + event.data)
		//socket.close();
//	};   
	
//	socket.onclose = function () {       
//		console.log('Lost connection!');   
//	}
//	socket.onerror = function () {       
//		
//	};
	
}

function onChange() {
	var x = document.getElementsByClassName("ele");
	//console.log(x);
	//console.log(x.length);
	d = document.getElementById("combo").value;
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
		console.log(d);
	}
	localStorage['size'] = h;
	console.log("CHANGEE")
}

function onTitleClick() {
	/*var titleTag = document.getElementById("title2");
	var d = document.createElement('input');
	d.setAttribute("type", "text");
	d.innerHTML = titleTag.innerHTML;
	d.classList.add("editTitle");
	titleTag.classList.add("editTitle");
	titleTag.parentNode.replaceChild(d, titleTag);*/

}

var limits = [1, 10, 1, 10, 1, 10, 1, 10, 1, 10, 1, 10, 1, 10, 1, 10, 1, 10, 1, 10, 1, 10, 1, 10, 1, 10, 1, 10];
function createData(title) {
	console.log("datacreate");
	var temp = getSensorInfo(title);
	//console.log(temp);
	var tag = document.getElementById("info");
	console.log("DDD: " + nam);
	var tit1 = document.getElementById(title + "X").innerText;
	
	var titleTag = document.getElementById("title2");
	titleTag.value = tit1;
	titleTag.innerHTML = '';
	titleTag.appendChild(document.createTextNode(tit1));
	
	titleTag.addEventListener("click", onTitleClick);
	
	tag.innerHTML = '';
	document.getElementById('info').innerHTML = '<div class="inforow"> <div class="label">Nazwa</div><div class="label">Wartość</div><div class="label">Jednostka</div></div>';
	
	for(var i = 0; i < temp.length; i++) {
		var info = getSensorInfo1(title, temp[i].sensorID);
		var rowTag = document.createElement("div");
		rowTag.classList.add("inforow");
		//rowTag.setAttribute("id", stations[i].title);
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
		labelTag3.appendChild(document.createTextNode(info.max));
		labelTag3.classList.add("label");
		labelTag4.appendChild(document.createTextNode(temp[i].unit));
		labelTag4.classList.add("label");
		rowTag.appendChild(labelTag1);
		rowTag.appendChild(labelTag2);
		rowTag.appendChild(labelTag3);
		rowTag.appendChild(labelTag4);
		tag1.appendChild(rowTag);
	}
	if(document.getElementById(0) == null || eleClick == true){
		limits = [];
	var tag1 = document.getElementById("change1");
	tag1.innerHTML = '';
	document.getElementById('change1').innerHTML = '<div class="inforow"> <div class="label">Nazwa</div><div class="label">Minimum</div><div class="label"></div><div class="label">Maksimum</div></div>';
	eleClick = false;
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
		//labelTag2.appendChild(document.createTextNode("min: "));
		//labelTag2.classList.add("label");
		var inputTag1 = document.createElement("input");
		inputTag1.classList.add("input");
		inputTag1.value = info.min;
		limits.push(info.min);
		inputTag1.setAttribute("id", i);
		labelTag3.appendChild(document.createTextNode(""));
		labelTag3.classList.add("label");
		var inputTag2 = document.createElement("input");
		inputTag2.classList.add("input");
		inputTag2.setAttribute("id", i + 1);
		inputTag2.value = info.max;
		limits.push(info.max);
		rowTag.appendChild(labelTag1);
		//rowTag.appendChild(labelTag2);
		rowTag.appendChild(inputTag1);
		rowTag.appendChild(labelTag3);
		rowTag.appendChild(inputTag2);
		tag1.appendChild(rowTag);
	}
	}
	var tag1 = document.getElementById("change2");
	tag1.innerHTML = '';
	document.getElementById('change2').innerHTML = '<div class="inforow"> <div class="label">Stacja</div><div class="label">Czujnik</div><div class="label">Typ</div><div class="label">Czas</div></div>';
	
	for(var i = 0; i < oldAlarms.length; i++) {
		//var info = getSensorInfo1(title, temp[i].sensorID);
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
	
	/*if(res == 2)
		values = [];*/
}

function onButtonClickd(title) {	
	console.log("oneleclikc");
	var searchbar = document.getElementById("page1");
	var searchbar1 = document.getElementById("page2");
	var searchbar2 = document.getElementById("page3");

    searchbar.style.display = "none";
	searchbar1.style.display = "block";
	searchbar2.style.display = "none";
	createData(title);
}

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

function onButtonClicktest() {
	var names = [];
	var s = "    ";
	var pop = document.getElementById("popupText");
	//var box = document.getElementById("buttBox");
	var box = document.createElement("buttBox");
	box.classList.add("buttonBox3");
	pop.innerHTML = '';
	box.innerHTML = '';
	console.log("TTT");
	console.log(alarmsV);
	for(var i = 0; i < alarmsV.length; i++) {
		console.log(names.indexOf(alarmsV[i].station));
		if(names.indexOf(alarmsV[i].station) < 0)
			names.push(alarmsV[i].station);
		console.log(names);
		//console.log(names.indexOf(alarms[i].station));
	}
	
	//if(modal.style.display != "block") {
		if(true){
		var x = document.getElementById("alarmPop");
		//var x = document.createElement("div");
		//x.setAttribute("id", "alarmPop");
		//x.classList.add("modal-content");
		var tlt = document.getElementById("popupTitle");
		//var txt = document.getElementById("popupText");
		for(var i = 0; i < names.length; i++) {
			var stationTxt = document.createElement("p");
			var txt = document.createElement("p");
			//txt.classList.add("label");
			txt.setAttribute("id", "txt" + i);
			
			stationTxt.innerHTML = names[i] + ":";
			pop.appendChild(stationTxt);
			pop.appendChild(txt);
		}
		
		for(var i = 0; i < alarmsV.length; i++) {
			if(alarmsV[i].station == names[0]) {
				var txt = document.getElementById("txt0");
				txt.innerHTML += "<b>" + alarmsV[i].name + "</b>" + ":  &ensp; " + alarmDict[alarmsV[i].alarm_type] + " &ensp; Data: " + alarmsV[i].timestamp + "<br>";
				//pop.appendChild(stationTxt);
			}
			if(alarmsV[i].station == names[1]) {
				var txt = document.getElementById("txt1");
				txt.innerHTML += "<b>" + alarmsV[i].name + "</b>" + ":  &ensp; " + alarmDict[alarmsV[i].alarm_type] + " &ensp; Data: " + alarmsV[i].timestamp + "<br>";
				//pop.appendChild(stationTxt);
			}
		}
		
		//for(var i = 0; i < names.length; i++) {
			var b = document.createElement("a");
			b.classList.add("button2");
			b.innerHTML = localStorage['name1'];
			b.addEventListener("click", onButtonAlarm1);
			box.appendChild(b);
			//if(names[i] != undefined) {
			var b1 = document.createElement("a");
			b1.classList.add("button2");
			b1.innerHTML = localStorage['name2'];
			b1.addEventListener("click", onButtonAlarm2);
			box.appendChild(b1);
		
		//}
		pop.appendChild(box);
		x.appendChild(pop);
		//modal.appendChild(x);
		//pop.appendChild(box);
		tlt.innerHTML = "Wykryto alarm!";
		modal.style.display = "block";
		//setTimeout(alarmTime, 2000);
		
	}
	alarmsV = [];
		alarmsV.length = 0;
}
var alNum = 0;
function onButtonAlarm1(i) {
	//onEleClick();
	onButtonClickd(stations[0].title);
	nam = stations[0].title;
	console.log("DT " + i);
	current = 1;
	modal.style.display = "none";
}
function onButtonAlarm2(i) {
	//onEleClick();
	onButtonClickd(stations[1].title);
	console.log("DT " + i);
	current = 2;
	modal.style.display = "none";
	nam  =stations[1].title;
}

function myTimer(socket) {
	console.log("closes");
    socket.close();
}

function dataPack(temp1) {
	var temp = [];
	stations = new Array();
	stations = null;
	stations = [];
	stations.length = 0;
	//console.log("sttt");
	//console.log(stations.length);
	//console.log(temp1);
	//console.log(stations);
	//console.log("sttt11");
	var values1 = values;
	console.log("RA:");
	console.log(values);
	for(var i = 0; i < temp1.length; i++) {
		var dat = temp1[i][0];
		if(temp.indexOf(dat.location_x) < 0) {
			var stat1 = {title:"Hala produkcyjnaaa", sensors:[]};
			stat1.title = dat.location_x;
			stations.push(stat1);
			//console.log(temp);
			var x = dat.location_x;
			temp.push(x);
		}
		console.log("LALA");
		//console.log(values);
		if(values1[i] == null) {
			console.log("NUL");
			//console.log(values);
			values.push("NaN");
		}
		var sensor = {name:dat.measurement_type, sensorName:dat.name, value:values1[i], unit:dat.unit, stat:dat.status, sensorID:dat.sensor_id, min:dat.limit_min, max:dat.limit_max, locX:dat.location_x, locY:dat.location_y};
			
		for(var j = 0; j < stations.length; j++) {
			if(stations[j].title == dat.location_x) {
				//console.log("DA" + j);
				stations[j].sensors.push(sensor);
			}
		}
	}
	values.length = 0;
	console.log("AAAAAA");
	//console.log(stations);
	if(isDrag == false && isData == false)
		createStations(stations);
}

//setTimeout(alarmTime, 5000);

function alarmTime() {
	tout = false;
}
var tout = false;
var y = 0;
var values = [];
//var socket = new Object();
var socket = null;
//console.log(socket.readyState); 	 
var x = 0, x1 = 0, len = 0, e = 0, e1 = 0, c = 0;
var temp2 = [];
var size2 = 0;
var res = 0;
function openSocket() {
	socket = new WebSocket('ws://127.0.0.1:50093'); 
socket.onopen = function () { 
		temp2 = [];   
		stations = [];	
		console.log('Connected!'); 	 
		if(start == true) {
			onButtonClick2();
			start = false;
		}
	};  
	
	socket.onmessage = function (event) {  
		data = event.data;  
		console.log('Received data: ' + event.data)
		var data = JSON.parse(event.data);
		
		console.log("SID: " + values.length);
		console.log(values);
		/*if(values.length == 14) {
			values.length = 0;
		}*/
		if(data.is_alarm == 1) {
			var alarm = data.alarms;
			var oldNul = false;
			for(var i = 0; i < alarm.length; i++) {
				oldNul = false;
				for(var j = 0; j < oldAlarms.length; j++) {
					//console.log("for j: " + j)
					//if()
					var alarmValue = new Date(alarm[i].alarm_timestamp).valueOf();
					var oldAlarmValue = new Date(oldAlarms[j].timestamp).valueOf();
					if(alarm[i].alarm_sensor_id == oldAlarms[j].alarm_sensor_id && ((alarmValue - oldAlarmValue) > (localStorage['time'] || 60000))) {
						oldNul = false;
						//console.log("SRY");
					} else if(alarm[i].alarm_sensor_id == oldAlarms[j].alarm_sensor_id) {
						oldNul = true;
						//console.log("for ij: " + i+ " " + j)
					} 
				}
				if(oldNul == false) {
					//console.log("wpis i: " + i);
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
					//console.log("for j: " + j)
					//if()
					var alarmValue = new Date(alarm[i].alarm_timestamp).valueOf();
					var oldAlarmValue = new Date(alarms[j].timestamp).valueOf();
					if(alarm[i].alarm_sensor_id == alarms[j].alarm_sensor_id && ((alarmValue - oldAlarmValue) > (localStorage['time'] || 60000))) {
						console.log("hak:" + alarmValue - oldAlarmValue);
						oldNul = false;
					} else if(alarm[i].alarm_sensor_id == alarms[j].alarm_sensor_id) {
						oldNul = true;
						//console.log("for ij: " + i+ " " + j)
					} 
				}
				if(oldNul == false) {
					//console.log("wpis i: " + i);
					var stationName = '';
					if(alarm[i].alarm_sensor_id % 2 == 0)
						stationName = localStorage['name2'];
					else 
						stationName = localStorage['name1'] 
					console.log
					var alarmValue = new Date(alarm[i].alarm_timestamp).valueOf();
					var oldAlarmValue = Date.now().valueOf();
					console.log("krab");
					console.log(alarmValue);
					console.log(oldAlarmValue);
					console.log(oldAlarmValue - alarmValue);
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
				//setTimeout(alarmTime, 2000);
				if(tout == false) {
					tout = true;
					onButtonClicktest();
					setTimeout(alarmTime, 2000);
				}
				//onButtonClicktest();
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
					//onButtonClick2();
				}
			}
			return;
		}
		
		if(data.json_id == 102) {
			size2++;
			console.log("ok");
			if(size2 == size1) {
				size2 = 0;
				if(modal.style.display != "block") {
					var txt = document.getElementById("popupText");
					var tlt = document.getElementById("popupTitle");
					txt.innerHTML = "Zmiany zostały zapisane!";
					tlt.innerHTML = "Uwaga!";
					modal.style.display = "block";
				}
				//onButtonClick2();
			}
			
			return;
		}
		
		if(c == 0) {
			temp2 = []; 
			c = 1;
		}
		/*for(var i = 1; i < 11; i++) {		
			socket.send(' {"json_id": "3","measures": 1,"sensor_id":' + i.toString() + '} ');   
		}*/
		
		if(data.json_id == 5) {
			temp2.push(data.result);
			x++;
			//console.log(x);
			//console.log(len);
		}
		
		if(data.json_id == 1) {
			len = data.result.length;
			
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
			//console.log("aaaa");
			//console.log(x1);
			//console.log(len);
			//if(data.result[0].data[0] != null)
				if(data.result[0].data[0] != null) {
					values.push(data.result[0].data[0].value);
				} else {
					console.log("NAB")
					values.push("NaN");
				}
		//	else
			//	values.push("NaN");
		}
		//console.log(x);
		//console.log("x: " + x + " y: " + y + " x1: " + x1 + " len: " + len + " e: " + e + " e1: " + e1);
		if(x == e && y == 0 && ( x1 == e1)) {
			dataPack(temp2);
			res = 1;
			console.log("raz");
			y = 0;
			x = 0;
			x1 = 0;
			e = 0;
			e1 = 0;
			c = 0;
			if(current == 1) {
				createData(nam);
				res = 2;
			} else if(current == 2) {
				createData(nam);
				res = 2;
			}
			//values = [];
			//setTimeout(onButtonClick2, 10000);
		}
		   
	};   
	
	socket.onclose = function () {       
		console.log('Lost connection!');   
	};  
	
	socket.onerror = function () {       
		console.log('errro!');   
	};
}
openSocket();
	
	
function onButtonClick2() {
	//var socket = new WebSocket('ws://127.0.0.1:50093'); 
	//var x = 0, len = 0, e = 0, e1 = 0;
	//var temp = [];
	if (socket.readyState == WebSocket.OPEN && isDrag == false && isData == false) {
		//stations = [];	
		console.log('go!'); 
		socket.send(' {"json_id": "1"} '); 
		setTimeout(onButtonClick2, 5000);
   // Do your stuff...
	} else if (socket.readyState != WebSocket.OPEN && isDrag == false && isData == false) {
		openSocket();
		console.log("open");
		setTimeout(onButtonClick2, 2000);
	} else {
		console.log("nic");
		setTimeout(onButtonClick2, 2000);
	}
	//setTimeout(onButtonClick2, 10000);
	//var temp = [];
	//stations = [];
	console.log('bu!'); 
	/*socket.onopen = function () {    
		//var temp = [];
		stations = [];	
		console.log('Connected!'); 	 		
		//socket.send(' {"json_id": "1"} ');   
	};  
	
	socket.onmessage = function (event) {  
		data = event.data;  
		console.log('Received data: ' + event.data)
		var data = JSON.parse(event.data);
		//console.log(data);
		
		for(var i = 1; i < 11; i++) {		
			socket.send(' {"json_id": "3","measures": 1,"sensor_id":' + i.toString() + '} ');   
		}
		
		if(data.json_id == 5) {
			temp.push(data.result);
			x++;
			//console.log(x);
		}
		
		if(data.json_id == 1) {
			len = data.result.length;
			for(var i = 1; i < data.result.length + 1; i++) {
				var request = ' {"json_id": "5", "sensor_id": '+  i.toString() + '} ';
				//console.log(request);
				socket.send(request); 
			}
			
			//var myVar = setInterval(myTimer, 5000, socket);
			//socket.close();
		}
		
		if(data.json_id == 3) {
			//console.log(data.result[0].data[0].value);
			values.push(data.result[0].data[0].value);
		}
		//console.log(x);
		if(x == len && y == 0) {
			dataPack(temp);
			console.log("raz");
			y = 1;
			//socket.close();
			//var myVar = setTimeout(myTimer, 5000, socket);
		}
		   
	};   
	
	socket.onclose = function () {       
		console.log('Lost connection!');   
	};  
	
	socket.onerror = function () {       
		console.log('errro!');   
	};*/
}

function onButtonClick() {
	console.log(isDrag);
	if(isDrag == false) {
		this.style.backgroundColor = "rgb(250, 150, 150)";
	} else {
		this.style.backgroundColor = "rgb(200, 200, 200)";
	}
	isDrag = !isDrag;		
}

function change() {
}
var start = true;
var stations1 = [];

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
var nam = '';
function onChangeClick() {
	var inputs = document.getElementsByClassName("input");
	console.log("in");
	console.log(inputs.length);
	for(var i = 0; i < inputs.length; i++) {
		//console.log(inputs[i].value);
	}
	var j = 1;
	//var nam = '';
	if(stationID == document.querySelector('[src="0"]').id) {
		localStorage['name1'] = document.getElementById("title2").value;
		j = 1;
		nam = stations[0].title;
		current = 1;
	}
	if(stationID == document.querySelector('[src="1"]').id) {
		localStorage['name2'] = document.getElementById("title2").value;
		j = 2;
		nam = stations[1].title;
		current = 2;
	}
	
	names[0] = localStorage['name1'] || "Hala 1";
	names[1] = localStorage['name2'] || "Hala 2";
	size1 = 0;
	for(var i = 0; i < inputs.length - 1; i += 2) {		
	console.log(i);
		socket.send(' {"json_id": "101", "sensor_id":' + j.toString() + ' ,"new_limit_min":' + inputs[i].value + '} ');  		
		socket.send(' {"json_id": "102", "sensor_id":' + j.toString() + ' ,"new_limit_max":' + inputs[i + 1].value + '} '); 
		j += 2;
		size1++;
	}
	createStations(stations);
	//createData(nam);
}

function onResetClick() {
	var inputs = document.getElementsByClassName("input");
	for(var i = 0; i < inputs.length; i++) {
		inputs[i].value = limits[i];
	}
}

var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];

span.onclick = function() {
  modal.style.display = "none";
  var tlt = document.getElementById("popupTitle");
  if(tlt.innerHTML == "Wykryto alarm!")
	alarmsV = [];
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
	var tlt = document.getElementById("popupTitle");
	if(tlt.innerHTML == "Wykryto alarm!")
		alarmsV = [];
  }
}

function onDataClick() {
	var svg = document.getElementById("svg1");
	svg.innerHTML = '';
	isData = !isData;
	
	var searchbar = document.getElementById("page1");
	var searchbar1 = document.getElementById("page2");
	var searchbar2 = document.getElementById("page3");

    searchbar.style.display = "none";
	searchbar1.style.display = "none";
	searchbar2.style.display = "none";
	
	var searchbar3 = document.getElementById("page4");
	searchbar3.style.display = "block";
	test();
}

/*function onButtonClick3() {
	fetch('http://127.0.0.1:5002/dat').then((response) => {
		return response.json();
	}).then((data) => {
		console.log(data.results);
		console.log(getSensorInfo("Hala 1"));
	});
}*/







function test() {
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


    console.log("Socket");
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



      var x = d3.scaleUtc()
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