function functionName(){
	var theta = [];
	var phi = [];
	var omega = [];
	var exclusivities = [];
	var genders = [];
	var names = [];
	
	var theta0 = [];
	var phi0 = [];
	var omega0 = [];
	
	var N = 500;
	var branching = document.getElementById("omexclusivity").value;
	var imbalance = document.getElementById("malevoice").value/100;
	var minority = document.getElementById("minority").value / 100;
	
	var scale = 0.05;
	var o_scale = 0.05;
	
	var exclusivity = document.getElementById("exclusivity").value;
	var retention = 0.05
	
	
	
	// Populate community
	var i;
	var t, p, o;
	var imb;
	
	var approxGender, approxRace, approxOmega;
	
	approxOmega = Math.PI / 4;
	
	for (i=0; i < N; i++){
		
		if (i < N/2) {
			imb = imbalance;
		} else {
			imb = 1 - imbalance;
		}
		
		var name = "";
		
		if (Math.random() < imb){
			approxGender = 0;
			genders.push("rgba(0,0,255,0.1)");
			genders.push("rgba(0,0,255,0.1)");
			genders.push("rgba(0,0,255,0.1)");
			name += "Male, "; 
		} else {
			approxGender = Math.PI/2;
			genders.push("rgba(255,0,0,0.1)");
			genders.push("rgba(255,0,0,0.1)");
			genders.push("rgba(255,0,0,0.1)");
			name += "Female, ";
		}			
		
		if (Math.random() < minority) {
			approxRace = Math.PI/2;
			name += "Minority";
		} else {
			approxRace = 0;
			name += "Majority";
		}
		
		names.push(name)
		names.push(name)
		names.push(name)
		t = normalRandomScaled(approxRace, scale);
		theta.push(t);
		theta0.push(t);
		p = normalRandomScaled(approxGender, scale);
		phi.push(p);
		phi0.push(p);
		o = normalRandomScaled(approxOmega, o_scale);
		omega.push(o);
		omega0.push(o);
		exclusivities.push(exclusivity);
	}
	
	
	var open_minded = document.getElementById("openminded").value/100;
	var om_exclusivity = 0;
	
	var bucket = [];
	for (var i=0;i<=N;i++) {
		bucket.push(i);
	}
	
	var i;
	for (i=0; i < Math.round(N * open_minded); i++){
		var randomIndex = Math.floor(Math.random() * bucket.length);
		var specialIndex = bucket.splice(randomIndex, 1)[0];
		exclusivities[specialIndex] = om_exclusivity;
	}
	
	var generations = 100;
	var interactions = 10;
	var power_dynamics = document.getElementById("femalevoice").value/50;
	var power_decay = 2-power_dynamics;
	var r = 0.9;
	var count = 0
	
	var g, i, j, k, diff1, diff2, diff3, dot, upper, lower, relatedness, decay, difference;
	for (g=0; g < generations; g++){
		for (var i = 0; i < N; i++){
			for (var j=0; j < interactions; j++){
				k = Math.floor(Math.random() * N)
				if (k == i){
					continue;
				}
				
				relatedness = r ** connect(i, k, branching);
				if (Math.random() > relatedness) {
					continue;
				}
				
				upper = Math.min(i, k);
				lower = Math.max(i, k);
				
				
				difference = level(lower, branching) - level(upper, branching);
				decay = Math.exp(-1 * power_decay * difference);
				
				dot = getDot(theta[i], phi[i], omega[i], theta[k], phi[k], omega[k]);
				diff1 = theta[lower] - theta[upper];
				diff2 = phi[lower] - phi[upper];
				diff3 = omega[lower] - omega[upper];
				
				if (Math.random() < dot ** exclusivities[lower]){
					count += 1
					theta[lower] -= diff1 * retention;
					phi[lower] -= diff2 * retention;
					omega[lower] -= diff3 * retention;
				}
				if (Math.random() < dot ** exclusivities[upper]){
					theta[upper] += diff1 * retention * decay;
					phi[upper] += diff2 * retention * decay;
					omega[upper] += diff3 * retention * decay;
				}
			}
		}
	}
	var data = [];
	var n = 75
	var m = 25
	var male_majority = {
		x:theta.reduce(function(arr, v, i){
			return arr.concat(v, theta0[i], Math.NaN);
		},[]),
		y:phi.reduce(function(arr, v, i){
			return arr.concat(v, phi0[i], Math.NaN);
		},[]),
		z:omega.reduce(function(arr, v, i){
			return arr.concat(v, omega0[i], Math.NaN);
		},[]),
		mode: "lines",
		hovertemplate: "%{text}",
		name: "Knowledge Vectors",
		type: "scatter3d",
		text: names,
		line:{
			color: genders,
			width: 2,
		},
	}
	
	data = [male_majority]
	
	var layout = {
		autosize: false,
		width:750,
		height: 750,
		showlegend: false,
		scene:{
			aspectmode:"manual",
			aspectratio: {
				x:1, y:1, z:1
			},
		xaxis:{
			range:[-Math.PI/4,Math.PI * 3/4],
			showgrid:false,
			nticks:0,
			showticklabels:false,
			zeroline:false,
			title:{
				text:"Race"
			}
		},
		yaxis:{
			range:[-Math.PI/4,Math.PI * 3/4],
			showgrid:false,
			showline:false,
			nticks:0,
			showticklabels:false,
			zeroline:false,
			title:{
				text:"Gender"
			}
		},
		zaxis:{
			range:[-Math.PI/4,Math.PI * 3/4],
			showgrid:false,
			nticks:0,
			showticklabels:false,
			zeroline:false,
			title:{
				text:"Omega"
			}
		},
		}
	};
	TESTER = document.getElementById("tester")
	Plotly.newPlot("tester", data, layout)
	console.log(count)
}

var spareRandom = null;

function normalRandom()
{
	var val, u, v, s, mul;

	if(spareRandom !== null)
	{
		val = spareRandom;
		spareRandom = null;
	}
	else
	{
		do
		{
			u = Math.random()*2-1;
			v = Math.random()*2-1;

			s = u*u+v*v;
		} while(s === 0 || s >= 1);

		mul = Math.sqrt(-2 * Math.log(s) / s);

		val = u * mul;
		spareRandom = v * mul;
	}
	
	return val;
}

function normalRandomScaled(mean, stddev)
{
	var r = normalRandom();

	r = r * stddev + mean;

	return r;
}


function getRandomFromBucket() {
   var randomIndex = Math.floor(Math.random()*bucket.length);
   return bucket.splice(randomIndex, 1)[0];
}

function getDot(theta1, phi1, omega1, theta2, phi2, omega2){
	var a1 = Math.cos(theta1) * Math.cos(omega1);
	var b1 = Math.sin(theta1) * Math.cos(omega1);
	var c1 = Math.cos(phi1) * Math.sin(omega1);
	var d1 = Math.sin(phi1) * Math.sin(omega1);
	
	var a2 = Math.cos(theta2) * Math.cos(omega2);
	var b2 = Math.sin(theta2) * Math.cos(omega2);
	var c2 = Math.cos(phi2) * Math.sin(omega2);
	var d2 = Math.sin(phi2) * Math.sin(omega2);
	
	return Math.abs(a1 * a2 + b1 * b2 + c1 * c2 + d1 * d2);

}

function level(index, base){
	return Math.floor(Math.log(index+1) / Math.log(base))
}

function connect(x,y, base){
	if (x==y){
		return 0
	}
	if (Math.min(x,y) < 0){
		return 0
	}
	var leaf = Math.max(x,y)
	var retain = Math.min(x,y)
	var leaf2 = Math.floor((leaf - 1) / base)
	
	return 1 + connect(leaf2, retain, base)
}
