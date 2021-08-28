function abg_constraint_test(ph, hco3, pco2) {
    
    var error = Math.abs( 0.03 * pco2 * Math.pow(10, ph - 6.1) - hco3 );

    console.log("Computed error is: " + error);
    
    if ( error < 1 )
	return true;
    else {
	return false;
    }
}

function checkABG() {

    // Read pH, HCO3, pCO2
    var ph = document.getElementById("pH").value;
    var hco3 = document.getElementById("HCO3").value;
    var pco2 = document.getElementById("pCO2").value;
    
    // Check it!
    if ( abg_constraint_test(ph,hco3,pco2 * 7.50061561303) ) {
	// Constraint passed

	var result = process_abg(ph, hco3, pco2 * 7.50061561303);

	highlight_abg(data, ph, hco3, pco2, result);

	document.getElementById('resultbox').innerHTML =
	    "Valid Measure. Outcome: " + conditions[result];
    }
    else {
	// Constraint failed
	console.log("INFO: INVALID ABG? ABG will still be processed")
	var result = process_abg(ph, hco3, pco2 * 7.50061561303);

	document.getElementById('resultbox').innerHTML =
	    "Invalid Measure? Outcome: " + conditions[result];
    }
}

window.onload = function () {
    document.getElementById("submit").onclick = checkABG_and_plot;
}

function highlight_abg(data, ph, hco3, pco2, result) {
    console.log("Highlighting ABG");

    data.push(
	{
	    label: "Selected point",
	    data: { x: ph, y: hco3},
	    lines: { show: false, fill: false},
	    points: { show: true, radius: 1 },
	    color: 123
	}
    )
}

function checkABG_and_plot() {
    console.log("Check ABG and Plot");
    
    checkABG();
    plotAccordingToChoices(choiceContainer, data);
}
