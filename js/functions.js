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



function findQGates(emo1, emo2){

  if ((emo1 == "")||(emo2 == "")) { return; }

  var bin1 = stringToBinary(emo1);
  var bin2 = stringToBinary(emo2);
  console.log(emo1+" "+bin1);
  console.log(emo2+" "+bin2);

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
        dif.array1 += arr1[i]+",";
        dif.array2 += arr2[i]+",";
        dif.positions += i+",";
      }
  }

  dif.array1 = dif.array1.substring(0, dif.array1.length - 1);
  dif.array2 = dif.array2.substring(0, dif.array2.length - 1);
  dif.positions = dif.positions.substring(0, dif.positions.length - 1);

  var dif_str2 = JSON.stringify(dif);

  var wtd = "";

  // Extract differences positions
  var arr_pos = dif.positions.split(",");
  var pos0 = arr_pos[0];
  var pos1 = arr_pos[1];
  var pos2 = arr_pos[2];
  // Invert from right to left 0-based
  pos0 = arr1.length-parseInt(pos0)-1;
  pos1 = arr1.length-parseInt(pos1)-1;
  pos2 = arr1.length-parseInt(pos2)-1;

  console.log(pos0);
  console.log(pos1);
  console.log(pos2);

  // Check cases
  if (dif_str2.includes('"array1":"0","array2":"1"')) {
    instructions.push("qc.h(qr["+pos0+"])");
    // wtd = "H sotto";
  };
  if (dif_str2.includes('"array1":"1","array2":"0"')) {
    instructions.push("qc.h(qr["+pos0+"])");
    // wtd = "H sopra";
  };
  if (dif_str2.includes('"array1":"1,1","array2":"0,0"')) {
    instructions.push("qc.h(qr["+pos1+"])");
    instructions.push("qc.cx(qr["+pos1+"],qr["+pos0+"])");
    // wtd = "H sotto, CNOT";
  };
  if (dif_str2.includes('"array1":"0,0","array2":"1,1"')) {
    instructions.push("qc.h(qr["+pos0+"])");
    instructions.push("qc.cx(qr["+pos0+"],qr["+pos1+"])");
    // wtd = "H sopra, CNOT";
  };
  if (dif_str2.includes('"array1":"0,1","array2":"1,0"')) {
    instructions.push("qc.h(qr["+pos0+"])");
    instructions.push("qc.cx(qr["+pos0+"],qr["+pos1+"])");
    instructions.push("qc.x(qr["+pos1+"])");
    // wtd = "H sopra, CNOT, X sotto";
  };
  if (dif_str2.includes('"array1":"1,0","array2":"0,1"')) {
    instructions.push("qc.h(qr["+pos1+"])");
    instructions.push("qc.cx(qr["+pos1+"],qr["+pos0+"])");
    instructions.push("qc.x(qr["+pos0+"])");
    // wtd = "H sotto, CNOT, X sopra";
  };
  if (dif_str2.includes('"array1":"1,0,0","array2":"0,1,1"')) {
    instructions.push("qc.h(qr["+pos0+"])");
    instructions.push("qc.cx(qr["+pos0+"],qr["+pos1+"])");
    instructions.push("qc.x(qr["+pos1+"])");
    instructions.push("qc.cx(qr["+pos0+"],qr["+pos2+"])");
    instructions.push("qc.x(qr["+pos2+"])");
    // wtd = "H sotto, CNOT, X sopra";
  };

  console.log("Differences:");
  console.log(dif);
  console.log("Logic to apply: "+wtd);
  console.log("Quantum Gates:");
  console.log(instructions);

  $("#bin-emo1").html(emo1+"&ensp; is &ensp;"+bin1+"<br>");
  $("#bin-emo2").html(emo2+"&ensp; is &ensp;"+bin2+"<br>");

  for (var k = 0; k < instructions.length; k++) {

    $("#quantized").append(instructions[k]+"<br>");

  }

}
