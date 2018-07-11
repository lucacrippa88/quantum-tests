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

  // Extract differences positions
  var arr_pos = dif.positions.split(",");
  var arr_emo1 = dif.array1.split(",");
  var arr_emo2 = dif.array2.split(",");

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

// qc.cx(qr[6],qr[0])

  // Check cases

  // console.log("Differences:");
  // console.log(dif);
  // console.log("Logic to apply: "+wtd);
  // console.log("Quantum Gates:");
  console.log(instructions);

  $("#bin-emo1").html(emo1+"&ensp; is &ensp;"+bin1+"<br>");
  $("#bin-emo2").html(emo2+"&ensp; is &ensp;"+bin2+"<br>");

  for (var k = 0; k < instructions.length; k++) {

    $("#quantized").append(instructions[k]+"<br>");

  }

}
