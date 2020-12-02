function functionName(){
	var theta = [];
	var phi = [];
	var omega = [];
	var voices = [];
	var exclusivities = [];
	var genders = [];
	
	var theta0 = []
	var phi0 = []
	var omega0 = []
	
	var n, scale, exclusivity, retention, m_voice, f_voice, minority;
	m_fraction = document.getElementById("minority").value
	n = 100 - m_fraction;
	scale = 0.05;
	exclusivity = document.getElementById("exclusivity").value;
	retention = 0.05;
	m_voice = document.getElementById("malevoice").value/100;
	f_voice = document.getElementById("femalevoice").value/100;
	minority = m_fraction/100;
	
	// Majority Males
	var number = Math.floor(n/2);
	var i;
	var t, p, o;
	
	for (i=0; i < number; i++){
		t = normalRandomScaled(0, scale);
		theta.push(t);
		theta0.push(t);
		p = normalRandomScaled(0, scale);
		phi.push(p);
		phi0.push(p);
		o = normalRandomScaled(Math.PI/4, scale);
		omega.push(o);
		omega0.push(o);
		voices.push(m_voice);
		exclusivities.push(exclusivity);
		genders.push("#0000ff");
	}
	
	// Majority Females
	var number = Math.floor(n/2);
	var i;
	for (i=0; i < number; i++){
		t = normalRandomScaled(0, scale);
		theta.push(t);
		theta0.push(t);
		p = normalRandomScaled(Math.PI/2, scale);
		phi.push(p);
		phi0.push(p);
		o = normalRandomScaled(Math.PI/4, scale);
		omega.push(o);
		omega0.push(o);
		voices.push(f_voice);
		exclusivities.push(exclusivity);
		genders.push("#ff0000");
	}
	
	var m = Math.round(minority*100);
	
	// Minority Males
	var number = Math.floor(m/2);
	var i;
	for (i=0; i < number; i++){
		t = normalRandomScaled(Math.PI/2, scale);
		theta.push(t);
		theta0.push(t);
		p = normalRandomScaled(0, scale);
		phi.push(p);
		phi0.push(p);
		o = normalRandomScaled(Math.PI/4, scale);
		omega.push(o);
		omega0.push(o);
		voices.push(m_voice);
		exclusivities.push(exclusivity);
		genders.push("#0000ff");
	}
	
	// Minority Females
	var number = Math.floor(m/2);
	var i;
	for (i=0; i < number; i++){
		t = normalRandomScaled(Math.PI/2, scale);
		theta.push(t);
		theta0.push(t);
		p = normalRandomScaled(Math.PI/2, scale);
		phi.push(p);
		phi0.push(p);
		o = normalRandomScaled(Math.PI/4, scale);
		omega.push(o);
		omega0.push(o);
		voices.push(f_voice);
		exclusivities.push(exclusivity);
		genders.push("#ff0000");
	}
	
	var N = theta.length;
	
	var open_minded = document.getElementById("openminded").value / 100;
	var om_exclusivity = document.getElementById("omexclusivity").value;
	
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
	
	var generations = 20;
	var g, i, j, diff1, diff2, diff3, dot;
	for (g=0; g < generations; g++){
		for (var i = 0; i < N; i++){
			for (var j=i + 1; j < N; j++){
				dot = getDot(theta[i], phi[i], omega[i], theta[j], phi[j], omega[j]);
				diff1 = theta[i] - theta[j];
				diff2 = phi[i] - phi[j];
				diff3 = omega[i] - omega[j];
				if (Math.random() < dot ** exclusivities[i]){
					theta[i] -= diff1 * voices[j] * retention;
					phi[i] -= diff2 * voices[j] * retention;
					omega[i] -= diff3 * voices[j] * retention;
				}
				if (Math.random() < dot ** exclusivities[j]){
					theta[j] += diff1 * voices[i] * retention;
					phi[j] += diff2 * voices[i] * retention;
					omega[j] += diff3 * voices[i] * retention;
				}
			}
		}
	}
	var data = [];
	
	var male_majority = {
		x:theta.slice(0, Math.floor(n/2)).reduce(function(arr, v, i){
			return arr.concat(v, theta0.slice(0,Math.floor(n/2))[i], Math.NaN);
		},[]),
		y:phi.slice(0, Math.floor(n/2)).reduce(function(arr, v, i){
			return arr.concat(v, phi0.slice(0,Math.floor(n/2))[i], Math.NaN);
		},[]),
		z:omega.slice(0, Math.floor(n/2)).reduce(function(arr, v, i){
			return arr.concat(v, omega0.slice(0,Math.floor(n/2))[i], Math.NaN);
		},[]),
		mode: "lines",
		name: "Male, Majority",
		type: "scatter3d",
		line:{
			color: "rgba(0,0,255,0.3)",
			width: 2,
		},
	}
	
	var female_majority = {
		x:theta.slice(Math.floor(n/2), Math.floor(n/2)*2).reduce(function(arr, v, i){
			return arr.concat(v, theta0.slice(Math.floor(n/2),Math.floor(n/2)*2)[i], Math.NaN);
		},[]),
		y:phi.slice(Math.floor(n/2), Math.floor(n/2)*2).reduce(function(arr, v, i){
			return arr.concat(v, phi0.slice(Math.floor(n/2),Math.floor(n/2)*2)[i], Math.NaN);
		},[]),
		z:omega.slice(Math.floor(n/2), Math.floor(n/2)*2).reduce(function(arr, v, i){
			return arr.concat(v, omega0.slice(Math.floor(n/2),Math.floor(n/2)*2)[i], Math.NaN);
		},[]),
		mode: "lines",
		name: "Female, Majority",
		type: "scatter3d",
		line:{
			color: "rgba(255,0,0,0.3)",
			width: 2,
		},
	}
	
	var male_minority = {
		x:theta.slice(Math.floor(n/2)*2, Math.floor(n/2)*2+Math.floor(m/2)).reduce(function(arr, v, i){
			return arr.concat(v, theta0.slice(Math.floor(n/2)*2, Math.floor(n/2)*2+Math.floor(m/2))[i], Math.NaN);
		},[]),
		y:phi.slice(Math.floor(n/2)*2, Math.floor(n/2)*2+Math.floor(m/2)).reduce(function(arr, v, i){
			return arr.concat(v, phi0.slice(Math.floor(n/2)*2, Math.floor(n/2)*2+Math.floor(m/2))[i], Math.NaN);
		},[]),
		z:omega.slice(Math.floor(n/2)*2, Math.floor(n/2)*2+Math.floor(m/2)).reduce(function(arr, v, i){
			return arr.concat(v, omega0.slice(Math.floor(n/2)*2, Math.floor(n/2)*2+Math.floor(m/2))[i], Math.NaN);
		},[]),
		mode: "lines",
		name: "Male, Minority",
		type: "scatter3d",
		line:{
			color: "rgba(0,0,255,0.3)",
			width: 2,
		},
	}
	
	var female_minority = {
		x:theta.slice(Math.floor(n/2)*2+Math.floor(m/2), N).reduce(function(arr, v, i){
			return arr.concat(v, theta0.slice(Math.floor(n/2)*2+Math.floor(m/2), N)[i], Math.NaN);
		},[]),
		y:phi.slice(Math.floor(n/2)*2+Math.floor(m/2), N).reduce(function(arr, v, i){
			return arr.concat(v, phi0.slice(Math.floor(n/2)*2+Math.floor(m/2), N)[i], Math.NaN);
		},[]),
		z:omega.slice(Math.floor(n/2)*2+Math.floor(m/2), N).reduce(function(arr, v, i){
			return arr.concat(v, omega0.slice(Math.floor(n/2)*2+Math.floor(m/2), N)[i], Math.NaN);
		},[]),
		mode: "lines",
		name: "Female, Minority",
		type: "scatter3d",
		line:{
			color: "rgba(255,0,0,0.3)",
			width: 2,
		},
	}
	
		
	data = [male_majority, female_majority, male_minority, female_minority]
	
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
