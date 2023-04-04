if (localStorage.getItem("table_rows") === null) {
	alert(
		"Warning: This is a MINIMUM VIABLE PRODUCT demonstration and is " +
			"NOT feature complete. If it breaks you get to keep both parts.\n\n" +
			"In other words, do NOT USE this in a real contest!\n\n\n" +
			"Consider yourself warned."
	);
}

function validate_callsignList(entry) {
	const rowCount = localStorage.getItem("table_rows");
	let status = false;
	if (rowCount) {
		// fixme: There is no error checking, this is fragile, don't use this in production.
		const rowData = Array();
		for (let i = 0; i < rowCount; i++) {
			//fixme: the callsign column is hard-coded here.
			rowData.push(
				JSON.parse(window.localStorage.getItem("row_" + (i + 1)))[2]
			);
		}
		const callsInLog = rowData.join("\n");
		const regEx = new RegExp("\\b" + entry.target.value + "\\b", "i");
		status = regEx.test(callsInLog);
	}
	if (status) {
		entry.target.setCustomValidity("Callsign In Log");
	} else {
		entry.target.setCustomValidity("");
	}
}

function add_log_entry(myForm) {
	//fixme: This needs to use the preferences that allows the logging of an invalid contact
	const invalid = !document.getElementById("logForm").checkValidity();
	const table = document.getElementById("current_log");
	const row = table.insertRow(1);
	row.insertCell(-1).textContent = table.rows.length - 1; // Assigned expression type number is not assignable to type string
	if (invalid) {
		row.className = "invalid";
		window.localStorage.setItem("status_" + (table.rows.length - 1), "invalid");
	}
	const rowData = Array();
	Array.from(myForm.elements).forEach((input) => {
		row.insertCell(-1).textContent = input.value;
		rowData.push(input.value);
	});
	window.localStorage.setItem(
		"row_" + (table.rows.length - 1),
		JSON.stringify(rowData)
	);
	window.localStorage.setItem("table_rows", table.rows.length - 1); // Assigned expression type number is not assignable to type string
}

function exportLog() { // Unused function exportLog
	let content;
// Source: https://www.tutorialspoint.com/how-to-create-and-save-text-file-in-javascript
	const link = document.createElement("a");
	const rowCount = localStorage.getItem("table_rows");
	if (rowCount) {
		// fixme: There is no error checking, this is fragile, don't use this in production.
		const rowData = Array();
		let status = "";
		content = "";
		for (let i = 0; i < rowCount; i++) {
			if (window.localStorage.getItem("status_" + (i + 1))) {
				status = "**Invalid**";
			} else {
				status = "";
			}
			rowData.push(
				window.localStorage.getItem("row_" + (i + 1)).slice(1, -1) +
					(status ? "," + status : "")
			);
		}
		content = rowData.join("\n") + "\n";
	} else {
		content = "";
	}

	const file = new Blob([content], { type: "text/csv" });
	link.href = URL.createObjectURL(file);
	link.download =
		document.getElementById("current_log").attributes.name.nodeValue + // Unresolved variable name
		"." +
		new Date().toISOString() +
		".csv";
	link.click();
	URL.revokeObjectURL(link.href);
}

function get_date() {
	return new Date().toISOString().split("T")[0];
}

function get_time() {
	return new Date().toISOString().split("T")[1].split(".")[0];
}

function init() {
	//fixme: need to have fields register themselves for default behaviour

	setInterval(() => {
		//fixme: This needs to detect if the user entered their own data
		//fixme: This needs to integrate into "default behaviour"
		document.getElementsByName("date")[0].value = get_date();
		document.getElementsByName("utc")[0].value = get_time();
	}, 1000);

	const rowCount = localStorage.getItem("table_rows");
	if (rowCount) {
		// fixme: There is no error checking, this is fragile, don't use this in production.
		const table = document.getElementById("current_log");
		for (let i = 0; i < rowCount; i++) {
			const row = table.insertRow(1);
			if (window.localStorage.getItem("status_" + (i + 1))) {
				row.className = "invalid";
			}
			row.insertCell(-1).textContent = i + 1; // Assigned expression type number is not assignable to type string
			const rowData = JSON.parse(window.localStorage.getItem("row_" + (i + 1)));
			rowData.forEach((value) => (row.insertCell(-1).textContent = value));
		}
	}

	document
		.getElementsByName("call")[0]
		.addEventListener("input", validate_callsignList);
}

init();
