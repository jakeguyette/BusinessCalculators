/*eslint-env es6*/
/*eslint-env browser*/
/*eslint no-console: 0*/
/*global d3 */

//Jacob Guyette

   

// when calc is clicked find ytm
d3.select("#calc").on("click", function () {
    
    var dropdown = document.getElementById("numPayments")
    
    var option = dropdown.options[dropdown.selectedIndex].value;
    
    //default annual
    var numPay = 1
    
    if (option == "Semiannually"){
        numPay = 2
    }
    if (option == "Quarterly"){
        numPay = 4
    }
    if (option == "Quarterly"){
        numPay = 4
    }
    if (option == "Monthly"){
        numPay = 12
    }
    
    //get/ format input
    
    var fv = parseFloat(document.getElementById("face_value").value)
    var pv = parseFloat(document.getElementById("price").value) * -1
    var nper = parseFloat(document.getElementById("years").value) * numPay
    
    var pmt = (fv * (parseFloat(document.getElementById("coupon_rate").value) / 100))/numPay
   
    
    var YTM = RATE(nper, pmt, pv, fv, undefined, undefined)
 
    // convert to annual rate
    YTM = (YTM * numPay) * 100
    //return calculated value to html
    document.getElementById("YTM").innerHTML = YTM.toFixed(3) + "%";

});

// javascript implementation of excels RATE function
// source: Burak Arslan @kucukharf http://www.github.com/kucukharf
var RATE = function(periods, payment, present, future, type, guess) {
    guess = (guess === undefined) ? 0.01 : guess;
    future = (future === undefined) ? 0 : future;
    type = (type === undefined) ? 0 : type;
  
    // Set maximum epsilon for end of iteration
    var epsMax = 1e-10;
  
    // Set maximum number of iterations
    var iterMax = 10;
  
    // Implement Newton's method
    var y, y0, y1, x0, x1 = 0,
      f = 0,
      i = 0;
    var rate = guess;
    if (Math.abs(rate) < epsMax) {
      y = present * (1 + periods * rate) + payment * (1 + rate * type) * periods + future;
    } else {
      f = Math.exp(periods * Math.log(1 + rate));
      y = present * f + payment * (1 / rate + type) * (f - 1) + future;
    }
    y0 = present + payment * periods + future;
    y1 = present * f + payment * (1 / rate + type) * (f - 1) + future;
    i = x0 = 0;
    x1 = rate;
    while ((Math.abs(y0 - y1) > epsMax) && (i < iterMax)) {
      rate = (y1 * x0 - y0 * x1) / (y1 - y0);
      x0 = x1;
      x1 = rate;
        if (Math.abs(rate) < epsMax) {
          y = present * (1 + periods * rate) + payment * (1 + rate * type) * periods + future;
        } else {
          f = Math.exp(periods * Math.log(1 + rate));
          y = present * f + payment * (1 / rate + type) * (f - 1) + future;
        }
      y0 = y1;
      y1 = y;
      ++i;
    }
    return rate;
};