function stringToBinary(str, spaceSeparatedOctets) {
    function zeroPad(num) {
        return "00000000".slice(String(num).length) + num;
    }
    return str.replace(/[\s\S]/g, function(str) {
        str = zeroPad(str.charCodeAt().toString(2));
        // return !1 == spaceSeparatedOctets ? str : str + " " // separated octets
        return !1 == spaceSeparatedOctets ? str : str + "" // not separated octets
    });
};



function findQGates(bin1, bin2){

  // Split binary into arrays
  var arr1 = bin1.split("");
  var arr2 = bin2.split("");
  // Create structure to analyze
  var dif_str = '{"array1": "","array2": "", "positions": ""}';
  var dif = JSON.parse(dif_str);
  // Create array for Q instructions
  var instructions = [];

  // Loop on binary arrays
  for (var i = 0; i < arr1.length; i++) {
      // If bits are equal each other and equal to 1, invert them by adding X gate
      if ( (arr1[i] == arr2[i])&&(arr1[i] == 1) ){
        instructions.push("qc.x(qr["+(arr1.length-i-1)+"])");
      }
      // If bits are different, store them and record their position
      if (arr1[i] != arr2[i]) {
        dif.array1 += arr1[i];
        dif.array2 += arr2[i];
        dif.positions += i+" ";
      }
  }

  var dif_str2 = JSON.stringify(dif);

  var wtd = "";

  // Extract differences positions
  var pos0 = dif.positions[0];
  console.log(pos0);
  var pos1 = dif.positions[1];
  console.log(pos1);
  // Invert from right to left 0-based
  pos0 = arr1.length-parseInt(pos0)-1;
  pos1 = arr1.length-parseInt(pos1)-1;


  // Check cases
  if (dif_str2.includes('"array1":"0","array2":"1"')) {
    instructions.push("qc.h(qr["+pos0+"])");
    wtd = "H sotto";
  };
  if (dif_str2.includes('"array1":"1","array2":"0"')) {
    instructions.push("qc.h(qr["+pos0+"])");
    wtd = "H sopra";
  };
  if (dif_str2.includes('"array1":"11","array2":"00"')) {
    instructions.push("qc.h(qr["+pos1+"])");
    instructions.push("qc.cx(qr["+pos1+"],qr["+pos0+"])");
    wtd = "H sotto, CNOT";
  };
  if (dif_str2.includes('"array1":"00","array2":"11"')) {
    instructions.push("qc.h(qr["+pos0+"])");
    instructions.push("qc.cx(qr["+pos0+"],qr["+pos1+"])");
    wtd = "H sopra, CNOT";
  };
  if (dif_str2.includes('"array1":"01","array2":"10"')) {
    instructions.push("qc.h(qr["+pos0+"])");
    instructions.push("qc.cx(qr["+pos0+"],qr["+pos1+"])");
    instructions.push("qc.x(qr["+pos1+"])");
    wtd = "H sopra, CNOT, X sotto";
  };
  if (dif_str2.includes('"array1":"10","array2":"01"')) {
    instructions.push("qc.h(qr["+pos1+"])");
    instructions.push("qc.cx(qr["+pos1+"],qr["+pos0+"])");
    instructions.push("qc.x(qr["+pos0+"])");
    wtd = "H sotto, CNOT, X sopra";
  };

  console.log(dif);
  console.log(wtd);
  console.log(instructions);

}
