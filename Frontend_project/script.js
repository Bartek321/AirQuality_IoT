var stations = [];
document.getElementById("button").addEventListener("click", onButtonClick);
document.getElementById("button1").addEventListener("click", onButtonClicktest);
document.getElementById("button2").addEventListener("click", onButtonClick2);
document.getElementById("buttona").addEventListener("click", onButtonClicka);
document.getElementById("buttonb").addEventListener("click", onButtonClickb);
document.getElementById("buttonc").addEventListener("click", onButtonClickc);
document.getElementById("buttonz").addEventListener("click", onButtonClickz);
document.getElementById("changeButton").addEventListener("click", onChangeClick);
document.getElementById("resetButton").addEventListener("click", onResetClick);
document.getElementById("combo").addEventListener("onChange", onChange);

var station = [{title:"Hala produkcyjnaa", sensors:[{name:"Temperatura", value:"20.2", unit:"*C", stat:"on"}, {name:"Cisninie", value:"20.2", unit:"*C", stat:"on"}, {name:"Metan", value:"20.2", unit:"*C", stat:"off"} ]}];

var stat = {title:"Hala produkcyjnaaa", sensors:[{name:"Temperatura", value:"20.2", unit:"*C", stat:"on"}, {name:"Cisninie", value:"20.2", unit:"*C", stat:"on"}]};
var stat1 = {title:"Hala produkcyjnaaa", sensors:[]};
var sensor = {name:"Temperatura", value:"20.2", unit:"*C", stat:"on"};

var isDrag = false;
var eleClick = false;
lst = ["a", "b"];

var stationID = null;
// IMAGE CHANGE
var fileTag = document.getElementById("filetag"),
    preview = document.getElementById("preview");

preview.setAttribute('src', "fl.jpg");
document.getElementById("combo").value = localStorage['size'];
fileTag.addEventListener("change", function() {
	changeImage(this);
});

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
			nameTag.appendChild(document.createTextNode(station[i].sensors[j].name));
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
	}
}

function onButtonClicka() {
	var searchbar = document.getElementById("page1");
	var searchbar1 = document.getElementById("page2");
	var searchbar2 = document.getElementById("page3");

    searchbar.style.display = "block";
	searchbar1.style.display = "none";
	searchbar2.style.display = "none";
}

function onButtonClickb() {
	var searchbar = document.getElementById("page1");
	var searchbar1 = document.getElementById("page2");
	var searchbar2 = document.getElementById("page3");

    searchbar.style.display = "none";
	searchbar1.style.display = "block";
	searchbar2.style.display = "none";
}

function onButtonClickc() {
	var searchbar = document.getElementById("page1");
	var searchbar1 = document.getElementById("page2");
	var searchbar2 = document.getElementById("page3");

    searchbar.style.display = "none";
	searchbar1.style.display = "none";
	searchbar2.style.display = "block";
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

var limits = [];
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
		labelTag1.appendChild(document.createTextNode(temp[i].name));
		labelTag1.classList.add("label");
		labelTag2.appendChild(document.createTextNode(temp[i].value));
		labelTag2.classList.add("label");
		//labelTag2.style.backgroundColor = "green";
		
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
		labelTag1.appendChild(document.createTextNode(temp[i].name));
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
		labelTag1.appendChild(document.createTextNode(temp[i].name));
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

function onButtonClicktest() {
	if(modal.style.display != "block") {
		var tlt = document.getElementById("popupTitle");
		var txt = document.getElementById("popupText");
		txt.innerHTML = "Wartość została przekroczona!";
		tlt.innerHTML = "Achtung!";
		modal.style.display = "block";
	}
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
		if(values[i] == null) {
			console.log("NUL");
			//console.log(values);
			values.push("NaN");
		}
		var sensor = {name:dat.measurement_type, sensorName:dat.name, value:values[i], unit:dat.unit, stat:dat.status, sensorID:dat.sensor_id, min:dat.limit_min, max:dat.limit_max, locX:dat.location_x, locY:dat.location_y};
			
		for(var j = 0; j < stations.length; j++) {
			if(stations[j].title == dat.location_x) {
				//console.log("DA" + j);
				stations[j].sensors.push(sensor);
			}
		}
	}
	console.log("AAAAAA");
	//console.log(stations);
	if(isDrag == false)
		createStations(stations);
}

var y = 0;
var values = [];
//var socket = new Object();
var socket = new WebSocket('ws://127.0.0.1:50093'); 
console.log(socket.readyState); 	 
var x = 0, x1 = 0, len = 0, e = 0, e1 = 0, c = 0;
var temp2 = [];
var size2 = 0;
socket.onopen = function () { 
		temp2 = [];   
		stations = [];	
		console.log('Connected!'); 	 		
	};  
	
	socket.onmessage = function (event) {  
		data = event.data;  
		console.log('Received data: ' + event.data)
		var data = JSON.parse(event.data);
		
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
					tlt.innerHTML = "Achtung!";
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
					tlt.innerHTML = "Achtung!";
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
				if(data.result[0].data[0] != null)
					values.push(data.result[0].data[0].value);
				else
					values.push("NaN");
		//	else
			//	values.push("NaN");
		}
		//console.log(x);
		//console.log("x: " + x + " y: " + y + " x1: " + x1 + " len: " + len + " e: " + e + " e1: " + e1);
		if(x == e && y == 0 && (x1 == e1 - 1 || x1 == e1)) {
			dataPack(temp2);
			console.log("raz");
			y = 0;
			x = 0;
			x1 = 0;
			e = 0;
			e1 = 0;
			c = 0;
			if(current == 1) {
				createData(nam);
			} else if(current == 2) {
				createData(nam);
			}
			//setTimeout(onButtonClick2, 10000);
		}
		   
	};   
	
	socket.onclose = function () {       
		console.log('Lost connection!');   
	};  
	
	socket.onerror = function () {       
		console.log('errro!');   
	};
function onButtonClick2() {
	//var socket = new WebSocket('ws://127.0.0.1:50093'); 
	//var x = 0, len = 0, e = 0, e1 = 0;
	//var temp = [];
	if (socket.readyState === WebSocket.OPEN && isDrag == false) {
		//stations = [];	
		console.log('go!'); 
		socket.send(' {"json_id": "1"} '); 
   // Do your stuff...
	}
	setTimeout(onButtonClick2, 10000);
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
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

/*function onButtonClick3() {
	fetch('http://127.0.0.1:5002/dat').then((response) => {
		return response.json();
	}).then((data) => {
		console.log(data.results);
		console.log(getSensorInfo("Hala 1"));
	});
}*/