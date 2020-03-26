var stations = [];
document.getElementById("button").addEventListener("click", onButtonClick);
//document.getElementById("button1").addEventListener("click", onButtonClick1);
document.getElementById("button2").addEventListener("click", onButtonClick2);
document.getElementById("buttona").addEventListener("click", onButtonClicka);
document.getElementById("buttonb").addEventListener("click", onButtonClickb);
document.getElementById("buttonc").addEventListener("click", onButtonClickc);
document.getElementById("buttonz").addEventListener("click", onButtonClickz);

//create();
//setTimeout(change, 5000);

var station = [{title:"Hala produkcyjnaa", sensors:[{name:"Temperatura", value:"20.2", unit:"*C", stat:"on"}, {name:"Cisninie", value:"20.2", unit:"*C", stat:"on"}, {name:"Metan", value:"20.2", unit:"*C", stat:"off"} ]}];

var stat = {title:"Hala produkcyjnaaa", sensors:[{name:"Temperatura", value:"20.2", unit:"*C", stat:"on"}, {name:"Cisninie", value:"20.2", unit:"*C", stat:"on"}]};
var stat1 = {title:"Hala produkcyjnaaa", sensors:[]};
var sensor = {name:"Temperatura", value:"20.2", unit:"*C", stat:"on"};
//var stations = [];
//var stations1 = [];

var isDrag = false;
lst = ["a", "b"];

var fileTag = document.getElementById("filetag"),
    preview = document.getElementById("preview");

preview.setAttribute('src', "fl.jpg");
	
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

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, oPosX = 0, oPosY = 0;
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
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

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement(e) {
	var rect = document.getElementById("map").getBoundingClientRect();
	var top = rect.top + window.pageYOffset;
	var left = rect.left + window.pageXOffset;

	console.log(e.clientX + " " + e.clientY + " " + document.getElementById("map").scrollTop + " " + top + " " + (e.clientY + document.getElementById("map").scrollTop - top));
	var x = 100, y = 100;
	if(e.clientY + document.getElementById("map").scrollTop - top < 0 || e.clientX + document.getElementById("map").scrollLeft - left < 0) {
		console.log("A");
		pos1 = x;
		pos2 = y;
		elmnt.style.top = document.getElementById("map").scrollTop - top + oPosY + "px";
		elmnt.style.left = document.getElementById("map").scrollLeft - left + oPosX + "px";
	}
	console.log(e.clientY - top + document.getElementById("map").scrollTop);
	console.log(e.clientX - left + document.getElementById("map").scrollLeft);
	console.log("B");
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

var dict = {
  "location": "Lokacja: ",
  "name": "Nazwa: ",
  "description": "Opis: ",
  "status": "Status: "
};

var dict1 = {
  "name": "Nazwa: ",
  "unit": "Jednostka: ",
  "value": "Wartosc: "
};

var names = ["name", "unit", "value"];

function update() {
	var mapTag = document.getElementById("map");
	
	for(var i = 0; i < station.length; i++) {
		var tag = document.createElement("ele" + i.toString());
		tag.classList.add("ele");
		
		var tooltipTag = document.createElement("div");
		tooltipTag.classList.add("tooltiptext");
		
		var titleTag = document.createElement("span");
		titleTag.classList.add("toolTitle");
		
		var text = document.createTextNode(station[i].title);
		titleTag.appendChild(text);
		tooltipTag.appendChild(titleTag);
		
		for(var j = 0; j < 3; j++) {
			var rowTag = document.createElement("div");
			rowTag.classList.add("toolRow");
			
			var nameTag = document.createElement("div");
			nameTag.classList.add("toolName");
			nameTag.appendChild(document.createTextNode(station[i].sensors[j].name));
			var valueTag = document.createElement("div");
			valueTag.classList.add("toolValue");
			valueTag.appendChild(document.createTextNode(station[i].sensors[j].value));
			var unitTag = document.createElement("div");
			unitTag.classList.add("toolUnit");
			unitTag.appendChild(document.createTextNode(station[i].sensors[j].unit));

			rowTag.appendChild(nameTag);
			rowTag.appendChild(unitTag);
			rowTag.appendChild(valueTag);
			tooltipTag.appendChild(rowTag);
		}
		
		dragElement(tag);
		tag.appendChild(tooltipTag);
		mapTag.appendChild(tag);
	}
}

function onEleClick(){
	if(isDrag == false) {
		console.log(this.id);
		onButtonClickd(this.id);
	}
}

function onButtonClick1(station) {
	var mapTag = document.getElementById("mapC");
	//var mapTagC = document.getElementById("map");
	mapTag.innerHTML = '';
	console.log("FHFGH");
	console.log(stations);
	
	for(var i = 0; i < station.length; i++) {
		var tag = document.createElement("div");
		tag.setAttribute("id", stations[i].title);
		tag.classList.add("ele");
		tag.addEventListener("click", onEleClick);
		
		console.log("SDF");
		console.log(station[i].value);
		console.log(station[i].limitMax);
		
		var X = document.createElement("div");
		X.classList.add("X");
		
		X.innerHTML = '<div class="toolRow"> <div class="toolUnit">Nazwa</div><div class="toolValue">Wartość</div><div class="toolUnit">Jednostka</div></div>';
		
		var tooltipTag = document.createElement("div");
		tooltipTag.classList.add("tooltiptext");
		
		var titleTag = document.createElement("span");
		titleTag.classList.add("toolTitle");
		
		var text = document.createTextNode(station[i].title);
		titleTag.appendChild(text);
		tooltipTag.appendChild(titleTag);
		
		for(var j = 0; j < station[i].sensors.length; j++) {
			if(station[i].sensors[j].value > station[i].sensors[j].max)
				tag.style.backgroundColor = "red";
		
			var rowTag = document.createElement("div");
			rowTag.classList.add("toolRow");
			
			var nameTag = document.createElement("div");
			nameTag.classList.add("toolName");
			nameTag.appendChild(document.createTextNode(station[i].sensors[j].name));
			var valueTag = document.createElement("div");
			valueTag.classList.add("toolValue");
			var text = document.createTextNode(station[i].sensors[j].value);
			if(station[i].sensors[j].value > station[i].sensors[j].max || station[i].sensors[j].value < station[i].sensors[j].min)
				valueTag.style.color = "red";
			if(station[i].sensors[j].stat == "off") {
				tag.style.backgroundColor = "orange";
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
		tag.style.top = stations[i].sensors[0].locX + "px";
		tag.style.left = stations[i].sensors[0].locY + "px";
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
	var searchbar = document.getElementById("filetag");
	if(searchbar.style.display == "block")
		searchbar.style.display = "none";
	else
		searchbar.style.display = "block";
}

function createData(title) {
	var temp = getSensorInfo(title);
	
	var tag = document.getElementById("info");
	
	var titleTag = document.getElementById("title2");
	titleTag.innerHTML = '';
	titleTag.appendChild(document.createTextNode(title));
	
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
		labelTag2.style.backgroundColor = "green";
		
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
	
	var tag1 = document.getElementById("change1");
	tag1.innerHTML = '';
	document.getElementById('change1').innerHTML = '<div class="inforow"> <div class="label">Nazwa</div><div class="label">Minimum</div><div class="label"></div><div class="label">Maksimum</div></div>';
	
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
		labelTag3.appendChild(document.createTextNode(""));
		labelTag3.classList.add("label");
		var inputTag2 = document.createElement("input");
		inputTag2.classList.add("input");
		rowTag.appendChild(labelTag1);
		//rowTag.appendChild(labelTag2);
		rowTag.appendChild(inputTag1);
		rowTag.appendChild(labelTag3);
		rowTag.appendChild(inputTag2);
		tag1.appendChild(rowTag);
	}
}

function onButtonClickd(title) {
	fetch('http://127.0.0.1:5002/dat').then((response) => {
		return response.json();
	}).then((data) => {
		console.log(data.results);
		console.log(getSensorInfo(title));
	});
	
	var searchbar = document.getElementById("page1");
	var searchbar1 = document.getElementById("page2");
	var searchbar2 = document.getElementById("page3");

    searchbar.style.display = "none";
	searchbar1.style.display = "block";
	searchbar2.style.display = "none";
	console.log("d");
	console.log(getSensorInfo1(title, 3));
	createData(title);
}

function onButtonClick2() {
	
	fetch('http://127.0.0.1:5002/list').then((response) => {
		return response.json();
	}).then((data) => {
		console.log(data.results);
		var temp = [];
		stations = [];
		console.log("A");
		console.log(stations);
		console.log("B");
		//console.log(data.results.sensors.length);
		for(var i = 0; i < data.results.sensors.length; i++) {
			//console.log(i);
			var dat = data.results.sensors[i];
			if(temp.indexOf(dat.location) < 0) {
				var stat1 = {title:"Hala produkcyjnaaa", sensors:[]};
				console.log(dat.location);
				stat1.title = dat.location;
				stations.push(stat1);
				temp.push(dat.location);
			}
			
			var sensor = {name:dat.name, value:"20.2 ", unit:dat.unit, stat:dat.status, sensorID:dat.sensor_id, min:dat.limitMin, max:dat.limitMax, locX:dat.locationX, locY:dat.locationY};
			
			for(var j = 0; j < stations.length; j++) {
				if(stations[j].title == dat.location) {
					console.log(sensor);
					stations[j].sensors.push(sensor);
				}
			}
		}
		console.log(temp);
		console.log(stations);
		onButtonClick1(stations);
	});
}

function onButtonClick() {
	console.log(isDrag);
	isDrag = !isDrag;		
}

function change() {
}


//document.getElementById("button3").addEventListener("click", onButtonClick3);

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


function onButtonClick3() {
	fetch('http://127.0.0.1:5002/dat').then((response) => {
		return response.json();
	}).then((data) => {
		console.log(data.results);
		console.log(getSensorInfo("Hala 1"));
	});
}

/*function addTooltip(elementName, data){
	
}*/

/*function create() {
	var dat = []
	fetch('http://127.0.0.1:5002/list').then((response) => {
		return response.json();
	}).then((data) => {
		console.log(data);
		
	fetch('http://127.0.0.1:5002/dat').then((response) => {
		return response.json();
	}).then((data1) => {
		dat = data1;
		console.log(dat);
	
		console.log(dat);
		for(var i = 0; i < data.results.length; i++) {
			var tag = document.createElement("element" + i.toString());
			tag.classList.add("tooltip");
			
			var tag1 = document.createElement("span");
			tag1.classList.add("tooltiptext");
			
			keys = Object.keys(data.results[i]);
			
			for(var j = 0; j < Object.keys(data.results[i]).length; j++) {				
				var text = document.createTextNode(dict[keys[j]] + data.results[i][keys[j]]);
				tag1.appendChild(text);
				var tag2 = document.createElement("br");
				tag1.appendChild(tag2);

				tag.appendChild(tag1);
			}
			
			for(var j = 0; j < Object.keys(dat.results[i]).length; j++) {				
				var text = document.createTextNode(dat.results[j].name + ": " + dat.results[j].value + " " + dat.results[j].unit);
				tag1.appendChild(text);
				var tag2 = document.createElement("br");
				tag1.appendChild(tag2);

				tag.appendChild(tag1);
			}
			
			var element = document.getElementById("map");
			element.appendChild(tag);
		}
		});
	});
	

}*/