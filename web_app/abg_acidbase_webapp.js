function HHIsoPleth(minPH, maxPH, PCO2) {
  var isoPleth = [];
  for (var i = minPH; i < maxPH; i += 0.01) {
    HCOmm = 0.03 * PCO2 * Math.pow(10, i - 6.1);
    isoPleth.push([i, HCOmm]);
  }
  return isoPleth;
}

function generate_isopleth(minPH, maxPH, PCO2) {
  var isoPleth = [];
  for (var i = minPH; i < maxPH; i += 0.01) {
    HCOmm = 0.03 * PCO2 * Math.pow(10, i - 6.1);
    isoPleth.push(HCOmm);
  }
  return isoPleth;
}

function HHIsoPleth2(minHCOmm, maxHCOmm, PCO2) {
  var isoPleth = [];
  for (var i = minHCOmm; i < maxHCOmm; i += 0.1) {
    pH = 6.1 + Math.log10(i / (0.03 * PCO2));
    isoPleth.push([pH, i]);
  }
  return isoPleth;
}

function isopleth_calc_ph(hco3, pco2) {
    return ( 6.1 + Math.log10(hco3 / (0.03 * pco2)) );
}

function process_abg(ph, hco3, pco2) {
    console.log("Processing ABG. pH = " + ph +
		" HCO3 = " + hco3 +
		" pCO2 = " + pco2 + "mmHg ");
    
    console.log( conditions[ abg(ph, pco2, hco3) ] );

    return abg(ph, pco2, hco3);
}

function abg(ph, co2, hco3) {
    if ((ph < 7.35) && (co2 > 45) && (hco3 >= 22 && hco3 <= 26)) return 0;
    else if (((co2 - 35) < (hco3 - 22)) && (ph >= 7.35 && ph <= 7.45) && (co2 < 35) && (hco3 < 22)) return 1;
    else if (((co2 - 35) > (hco3 - 22)) && (ph >= 7.35 && ph <= 7.45) && (co2 < 35) && (hco3 < 22)) return 2;
    else if (((co2 - 35) == (hco3 - 22)) && (ph >= 7.35 && ph <= 7.45) && (co2 < 35) && (hco3 < 22)) return 3;
    else if ((ph > 7.45) && (co2 < 35) && (hco3 >= 22 && hco3 <= 26)) return 4;
    else if (((co2 - 45) < (hco3 - 26)) && (ph >= 7.35 && ph <= 7.45) && (co2 > 45) && (hco3 > 26)) return 5;
    else if (((co2 - 45) > (hco3 - 26)) && (ph >= 7.35 && ph <= 7.45) && (co2 > 45) && (hco3 > 26)) return 6;
    else if (((co2 - 45) == (hco3 - 26)) && (ph >= 7.35 && ph <= 7.45) && (co2 > 45) && (hco3 > 26)) return 7;
    else if ((ph < 7.35) && (co2 >= 35 && co2 <= 45) && (hco3 < 22)) return 8;
    else if ((ph < 7.35) && !(ph == 0) && (co2 < 35) && (hco3 < 22)) return 9;
    else if ((ph > 7.45) && (co2 >= 35 && co2 <= 45) && (hco3 > 26)) return 10;
    else if ((ph > 7.45) && (co2 > 45) && (hco3 > 26)) return 11;
    else if ((ph >= 7.35 && ph <= 7.45) && (co2 >= 35 && co2 <= 45) && (hco3 >= 22 && hco3 <= 26)) return 12;
    else if ((ph < 7.35) && (co2 > 45) && (hco3 > 26)) return 13;
    else if ((ph > 7.45) && (co2 < 35) && (hco3 < 22)) return 14;
    else return 15;
}

var conditions = ["Acute respiratory Acidosis",
		  "Compensated Respiratory Alkalosis",
		  "Compensated Metabolic Acidosis",
		  "Compensated Metabolic Acidosis or Compensated Respiratory Alkalosis",
		  "Acute Respiratory Alkalosis",
		  "Compensated Metabolic Alkalosis",
		  "Compensated Respiratory Acidosis",
		  "Compensated Respiratory Acidosis or Compensated Metabolic Alkalosis",
		  "Acute Metabolic Acidosis",
		  "Partly Compensated Metabolic Acidosis",
		  "Acute Metabolic Alkalosis",
		  "Partly Compensated Metabolic Alkalosis",
		  "Normal ABG",
		  "Partly Compensated Respiratory Acidosis",
		  "Partly Compensated Respiratory Alkalosis",
		  "Unable to determine. Mixed Disorders"]

var isopleths_data = [];
var placeholder = $("#placeholder");

var options = {
    xaxis: {
	axisLabel: "pH",
	axisLabelUseCanvas: true,
	axisLabelFontSizePixels: 12,
	axisLabelFontFamily: "Verdana, Arial, Helvetica, Tahoma, sans-serif",
	axisLabelPadding: 5,
	min: 7.0,
	max: 7.8
    },
    yaxis: {
	axisLabel: "HCO3",
	axisLabelUseCanvas: true,
	axisLabelFontSizePixels: 12,
	axisLabelFontFamily: "Verdana, Arial, Helvetica, Tahoma, sans-serif",
	axisLabelPadding: 5,
	min: 0,
	max: 60
    },
    legend: {
	show: true,
	labelBoxBorderColor: "#000000",
	position: "left",
	container: $("#chartLegend"),
	nocolumns: 4,
	labelFormatter: function(label, series) {
	    // series is the series object for the label
	    if ( label.substring(0,9) != 'isopleths' ) {
		return '<div ' +
		    'style="font-size:12pt;text-align:left;padding:2px;">' +
		    '<a href="#' + label + '">' + label + '</a>' + '</div>';
	    } else {
		return null;
	    }
	}
    },
    series: {
	    },
    grid:{
//	backgroundColor: { colors: ["#969696", "#5C5C5C"] }
    }
    
};

function generate_and_push_isopleths(data, phmin, phmax, pco2min, pco2max, pco2_gran = 5) {
    
    for (var i = pco2min; i <= pco2max; i += pco2_gran) {
	data.push(
	    {
		label: "isopleths_data_co2 = " + i,
		data: HHIsoPleth(phmin,phmax, i),
		lines: { show: true, fill: false, lineWidth: 0.5 },
		points: { show: false },
		legend: { show: false }
	    }
	)
    }
}

function add_isopleths_markings(plot, pco2min, pco2max, pco2_gran = 5) {
    
    for (var i = pco2min; i <= pco2max; i += pco2_gran) {
	ph = plot.getOptions().xaxis.max;
	hco3 = Math.max(...generate_isopleth( plot.getOptions().xaxis.min, plot.getOptions().xaxis.max, i));

	if( hco3 > plot.getOptions().yaxis.max ) {
	    hco3 = plot.getOptions().yaxis.max;
	    ph = isopleth_calc_ph ( hco3, i );
	}
	
	var o = plot.pointOffset(
	    { x: ph, y: hco3}
	);
	
	// Append it to the placeholder that Flot already uses for positioning
	placeholder.append("<div style='position:absolute;left:" + (o.left - 50) + "px;top:" + ( o.top - 20 ) + "px;color:#666;font-size:smaller'>pco2=" + i + "</div>");
    }
}

function generate_normogram_subset(condition, phmin, phmax, pco2min, pco2max, ph_gran = 0.05, pco2_gran = 1) {
    var data_subset = [];

    for (var ph = phmin; ph <= phmax; ph += ph_gran) {

	for(var pco2 = pco2min; pco2 <= pco2max; pco2 += pco2_gran) {
	    
	    hco3 = 0.03 * pco2 * Math.pow(10, ph - 6.1);
	    
	    if( abg(ph, pco2, hco3) == condition) {
		data_subset.push( [ph, hco3] );
	    }
	}
    }

    return data_subset;
}

function generate_and_push_normogram(data, phmin, phmax, pco2min, pco2max, ph_gran = 0.05, pco2_gran = 1) {

    for (var i = 0; i <= 15; i++) {
	data.push(
	    {
		label: conditions[i],
		data: generate_normogram_subset(i, phmin, phmax, pco2min, pco2max, ph_gran, pco2_gran),
		lines: { show: false, fill: false },
		points: { show: true, radius: 0.1 }
	    }
	)
    }
}

function plotAccordingToChoices(choiceContainer, datasets) {
    console.log("plotAccordingToChoices");

    var local_data = [];
    var isopleths_on = false;
        
    choiceContainer.find("input:checked").each(function () {
	var key = $(this).attr("name");
	
	if( key == "isoplethscheck" ) {
	    generate_and_push_isopleths(local_data, 6.5, 7.9, 10, 120);
	    isopleths_on = true;
	}
	else if (key && datasets[key]) {
	    console.log("Pushind data[key=" + key + "]");
	    local_data.push(datasets[key]);
	}
    });

    if ( datasets[datasets.length - 1].label == "Selected point" ) {
	local_data.push( datasets[datasets.length - 1] )
    }

    if (local_data.length > 0) {
	var plot = $.plot(placeholder, local_data, options);

	if( isopleths_on ) {
	    add_isopleths_markings(plot, 10, 120);
	}
	
	return plot;
    }
}

var hco3 = 0;
var data = [];

generate_and_push_isopleths(data, 6.5, 7.9, 10, 120);
generate_and_push_normogram(data, 6.5, 7.9, 10, 150, 0.01, 0.5)

// insert checkboxes 
var choiceContainer = $("#choiceContainer");

choiceContainer.append("<br/><input type='checkbox' name='isoplethscheck' checked='checked' id='id1'></input><label for='id1'>Activate Isopleths</label>")

$.each(data, function(key, val) {
    if( val.label.substring(0,9) != "isopleths") {
	if ( val.label == "Normal ABG" ) {
	    choiceContainer.append("<br/><input type='checkbox' name='" + key +
				   "' checked='checked' id='id" + key + "'></input>" +
				   "<label for='id" + key + "'>"
				   + val.label + "</label>");
	}
	else {
	    choiceContainer.append("<br/><input type='checkbox' name='" + key +
				   "' id='id" + key + "'></input>" +
				   "<label for='id" + key + "'>"
				   + val.label + "</label>");
	}
    }
});

var i = 0;
$.each(data, function(key, val) {
    val.color = i;
    ++i;
});

// plot (initially all series)
plot = plotAccordingToChoices(choiceContainer, data);

// Anchor check list to series plotting
$(document).ready(function() {
    choiceContainer.find("input").click(function() {
	plotAccordingToChoices(choiceContainer, data)
    });
});
