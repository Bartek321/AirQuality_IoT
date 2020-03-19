document.getElementById("button").addEventListener("click", onButtonClick);
create();
setTimeout(change, 5000);

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

function change() {
	const myNode = document.getElementById("map");
    myNode.innerHTML = '';
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
	setTimeout(change, 5000);
}

function onButtonClick() {
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
}

function addTooltip(elementName, data){
	
}

function create() {
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
	

}