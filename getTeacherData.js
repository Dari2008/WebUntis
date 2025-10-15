DATA = [];
for(const row of rows){
	const short = row.cells[0].innerText;
	const longName = row.cells[1].innerText;
	const subjects = row.cells[2].innerText;

	let firstName = longName.split(",")[1];
	let surname = longName.split(",")[0];
	if(!longName.includes(",")){
		firstName = longName;
		surname = undefined;
	}



	DATA.push({
    short: short.trim(),
		name: {
			firstName: firstName?.trim(),
			surname: surname?.trim()
		},
		subjects: subjects.split(",").map(e=>e.trim())
  });
}


// 


DATA = [];
for(const row of rows){
	const short = row.cells[1].innerText;
	const longName = row.cells[0].innerText;
	const subjects = row.cells[3].innerText;

	let firstName = longName.split(" ")[1];
	let surname = longName.split(" ")[0];
	if(!longName.includes(" ")){
		firstName = longName;
		surname = undefined;
	}



	DATA.push({
    short: short.trim(),
		name: {
			firstName: firstName?.trim(),
			surname: surname?.trim()
		},
		subjects: subjects.split(",").map(e=>e.trim())
  });
}