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



function findPatterns(bin1, bin2){

  var arr1 = bin1.split("");
  var arr2 = bin2.split("");

  var diff = '{"array1": "","array2": ""}';
  var obj = JSON.parse(diff);

  for (var i = 0; i < arr1.length; i++) {
      if (arr1[i] != arr2[i]) {
        obj.array1 += arr1[i];
        obj.array2 += arr2[i];
      }
  }

  var arr = JSON.stringify(obj);

  var wtd = "";

  if (arr == '{"array1":"0","array2":"1"}') { wtd = "X sotto"; };
  if (arr == '{"array1":"1","array2":"0"}') { wtd = "X sopra"; };
  if (arr == '{"array1":"11","array2":"00"}') { wtd = "H sotto, CNOT"; };
  if (arr == '{"array1":"00","array2":"11"}') { wtd = "H sopra, CNOT"; };
  if (arr == '{"array1":"01","array2":"10"}') { wtd = "H sopra, CNOT, X sotto"; };
  if (arr == '{"array1":"10","array2":"01"}') { wtd = "H sotto, CNOT, X sopra"; };

  console.log(wtd);

}
