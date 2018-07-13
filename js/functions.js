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






// 2 SMILES
function findQGates2(emo1, emo2){

  // Exit if emoticons aren't found
  if ((emo1 == "")||(emo2 == "")) { return; }

  var bin1 = stringToBinary(emo1);
  var bin2 = stringToBinary(emo2);

  // Define input
  var arr1 = bin1.split("");
  var arr2 = bin2.split("");
  // Define ancilla structure
  var dif = JSON.parse('{"array1": "","array2": "", "positions": ""}');
  // Define output
  var instructions = [];

  // CASE 1 - EQUAL BITS
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

  // Remove last comma
  dif.array1 = dif.array1.substring(0, dif.array1.length - 1);
  dif.array2 = dif.array2.substring(0, dif.array2.length - 1);
  dif.positions = dif.positions.substring(0, dif.positions.length - 1);

  // Extract values
  var arr_emo1 = dif.array1.split(",");
  var arr_emo2 = dif.array2.split(",");
  var arr_pos = dif.positions.split(",");

  // Convert into numbers
  for (var i = 0; i < arr_pos.length; i++) {
    arr_pos[i] = 16-arr_pos[i]-1;
    arr_emo1[i] = parseInt(arr_emo1[i]);
    arr_emo2[i] = parseInt(arr_emo2[i]);
  }

  // CASE 2 - DIFFERENT BITS
  // 1) Apply H to first different qubit
  instructions.push("qc.h(qr["+arr_pos[0]+"])");

  for(var i = 1; i < arr_pos.length; i++){
    if (arr_emo1[i] == arr_emo1[0]) {
      // 2) All qubits equal to first different will have a CNOT (first qubit as control)
      instructions.push("qc.cx(qr["+arr_pos[0]+"],qr["+arr_pos[i]+"])");
    } else {
      // 3) All qubits inverted to first different will have a CNOT (first qubit as control) and a X
      instructions.push("qc.cx(qr["+arr_pos[0]+"],qr["+arr_pos[i]+"])");
      instructions.push("qc.x(qr["+arr_pos[i]+"])");
    }
  }

  // Display results
  $("#bin-emo1").val(bin1);
  $("#bin-emo2").val(bin2);
  $("#bin-emo1").css("display", "block");
  $("#bin-emo2").css("display", "block");

  for (var k = 0; k < instructions.length; k++) {
    $("#quantized").append(instructions[k]+"<br>");
  }

  $("#quantized-card").css("display", "block");
  $("#quantized-result").css("display", "block");

}




// 3 SMILES
function findQGates3(emo1, emo2, emo3){

  if ((emo1 == "")||(emo2 == "")||(emo3 == "")) { return; }

  var bin1 = stringToBinary(emo1);
  var bin2 = stringToBinary(emo2);
  var bin3 = stringToBinary(emo3);

  // Split binary into arrays
  var arr1 = bin1.split("");
  var arr2 = bin2.split("");
  var arr3 = bin3.split("");
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

  // Extract differences positions
  var arr_pos = dif.positions.split(",");
  var arr_emo1 = dif.array1.split(",");
  var arr_emo2 = dif.array2.split(",");
  var arr_emo3 = dif.array3.split(",");

  for (var i = 0; i < arr_pos.length; i++) {
    arr_pos[i] = 16-arr_pos[i]-1;
    arr_emo1[i] = parseInt(arr_emo1[i]);
    arr_emo2[i] = parseInt(arr_emo2[i]);
  }

  console.log(arr_pos);
  console.log(arr_emo1);
  console.log(arr_emo2);

  instructions.push("qc.h(qr["+arr_pos[0]+"])");

  for(var i = 1; i < arr_pos.length; i++){

    if (arr_emo1[i] == arr_emo1[0]) {
      instructions.push("qc.cx(qr["+arr_pos[0]+"],qr["+arr_pos[i]+"])");
    }
    else {
      instructions.push("qc.cx(qr["+arr_pos[0]+"],qr["+arr_pos[i]+"])");
      instructions.push("qc.x(qr["+arr_pos[i]+"])");
    }

  }

  console.log(instructions);

  $("#bin-emo1").html(emo1+"&ensp; is &ensp;"+bin1+"<br>");
  $("#bin-emo2").html(emo2+"&ensp; is &ensp;"+bin2+"<br>");

  for (var k = 0; k < instructions.length; k++) {

    $("#quantized").append(instructions[k]+"<br>");

  }

}
