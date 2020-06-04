/*eslint-env es6*/
/*eslint-env browser*/
/*eslint no-console: 0*/
/*global d3 */

//Jacob Guyette



function Principle() {


    // create Principle chart 
    // when the input range changes update value 
    d3.select("#calc").on("click", function () {
        //get input
        var principle = document.getElementById("principle").value
        var interest = document.getElementById("interest").value
        var years = document.getElementById("years").value
        //console.log("__here__")
        //console.log(principle+" "+interest+" "+years);
        //calculate
        //values to return
        let payments = 0;
        let totalD = 0;
        let totalI = 0;
        let a = principle;
        //monthly rate
        let r = (interest / 100) / 12;
        //years
        let n = 12 * years;
        //input validation

        //console.log("a: " + a + " r: " + r + " n: " + n);
        let output = a / (((Math.pow((1 + r), n)) - 1) / (r * (Math.pow((1 + r), n))))

        payments = output.toFixed(2);
        totalD = (output * n).toFixed(2);
        let I = ((((output * n).toFixed(2)) - a) / a) * 100;
        totalI = I.toFixed(2);

        //console.log(payments+" "+totalD+" "+totalI);
        //send back computed
        document.getElementById("monthlyPayment").innerHTML = "$" + payments;
        document.getElementById("totalInterest").innerHTML = totalI + "%";
        document.getElementById("totalPayment").innerHTML = "$" + totalD;

        let nointerest = principle / n
        //console.log(nointerest)


        let margin = {
                top: 15,
                right: 70,
                bottom: 80,
                left: 50
            },
            w = 800 - margin.left - margin.right,
            h = 490 - margin.top - margin.bottom;


        //set size of svg
        let svg = d3.select("#chart1").append("svg")
            .attr("width", w + margin.left + margin.right)
            .attr("height", h + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        //set x and y scales
        let yScale = d3.scaleLinear()
            //find min and max of stock prices
            .domain([0, totalD])

            .range([h, 0]).nice();

        //console.log("__here__")
        var today = new Date();
        var start = new Date(today.getFullYear(), (today.getMonth()), 1);
        var myData = []

        let i = 0
        //console.log(n);
        for (i = 0; i <= n; i++) {
            let money = principle - (parseFloat(nointerest) * (i));
            let interest = ((parseFloat(payments)) - (parseFloat(nointerest))).toFixed(2);
            //console.log(interest);
            myData.push({
                Date: (new Date(start)),
                Money: parseFloat(money),
                Interest: parseFloat(interest)
            });
            start.setMonth(start.getMonth() + 1);
        }

        console.log(myData)


        var xScale = d3.scaleBand()
            .domain(d3.values(myData).map(function (d) {
                return d.Date;

            }))
            .range([margin.left, w])
            .padding(0.1);

        let yAxis = d3.axisLeft(yScale).ticks(10, "$,f");
//----------------------------tool tip-------------------------------------------
        //add initially hidden tool tip to svg
//        var tooltip = d3.select('#char1').append('div')
//            .attr('class', 'hidden tooltip')
//            .style("opacity", 0);
//        // tooltip mouseover event handler
//        var onMouseOver = function () {
//            console.log("bar has been selected!")
//            //html code for custom tool tip
//            var html = "<p> hello world </p>";
//
//            //get html code above into tooltip
//            tooltip.html(html)
//                //postion tooltip
//                .style("left", (d3.event.pageX + 6) + "px")
//                .style("top", (d3.event.pageY) + "px")
//                .transition()
//                .duration(1) // instant
//                .style("opacity", 1) // now visable
//          console.log("done")
//        };
//        // tooltip mouseout event handler
//        var onMouseOut = function () {
//            tooltip.transition()
//                .duration(10000) // 12 seconds until hidden
//                .style("opacity", 0); // now hidden
//        };

//----------------------------create x and y axes----------------------------------------



        //append axes
        // add Y axis 
        svg.append("g")
            .attr("class", "axis")
            //position yaxis
            .attr("transform", "translate(50,0)")
            //creates yaxis
            .call(yAxis);

        // add X axis with ticks every 6 business days
        svg.append("g")
            .attr("class", "axis")
            //position xaxis
            .attr("transform", "translate(0," + h + ")")
            //creates xaxis
            .call(d3.axisBottom(xScale)
                .ticks(n)
                .tickFormat(d3.timeFormat("%b %Y"))

            )

            //rotate labels for better readability
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(70)")
            .style("text-anchor", "start");

        //draw principle
        svg.selectAll(".bar")
            .data(myData).enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function (d) {
                //console.log(xScale(d.Date))
                let xx = xScale(d.Date);
                //console.log(xx);
                //console.log("here");

                return xx
                //return xScale(d.Date)+51;
            })
            .attr("y", function (d) {
                //console.log(yScale(d.Money))
                //                    console.log("start")
                //                    console.log((w/n)-2)
                //                    console.log("end")
                return yScale(d.Money);
            })
            .attr("width", xScale.bandwidth())

            .attr("height", function (d) {
                if (d.Money <= 0) {
                    return 0.1;
                } else {
                    //console.log( h - yScale(d.Money))
                    return h - yScale(d.Money);
                }

            });
//            .on("mouseover", onMouseOver)
//            .on("mouseout", onMouseOut);
        
//---------------------------------GRAPH 2-------------------------------------------
        //set size of svg
        let svg2 = d3.select("#chart2").append("svg")
            .attr("width", w + margin.left + margin.right)
            .attr("height", h + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        //append axes
        // add Y axis 
        svg2.append("g")
            .attr("class", "axis")
            //position yaxis
            .attr("transform", "translate(50,0)")
            //creates yaxis
            .call(yAxis);

        // add X axis with ticks every 6 business days
        svg2.append("g")
            .attr("class", "axis")
            //position xaxis
            .attr("transform", "translate(0," + h + ")")
            //creates xaxis
            .call(d3.axisBottom(xScale)
                .ticks(n)
                .tickFormat(d3.timeFormat("%b %Y"))

            )

            //rotate labels for better readability
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(70)")
            .style("text-anchor", "start");

        //draw interest +principle
        svg2.selectAll(".bar2")
            .data(myData).enter()
            .append("rect")
            .attr("class", "bar2")
            .attr("x", function (d) {
                //console.log(xScale(d.Date))
                let xx = xScale(d.Date);
                //console.log(xx);
                //console.log("here");

                return xx
                //return xScale(d.Date)+51;
            })
            .attr("y", function (d) {
                //console.log(yScale(d.Money))
                //                    console.log("start")
                //                    console.log((w/n)-2)
                //                    console.log("end")
                return yScale(d.Money + d.Interest);
            })
            .attr("width", xScale.bandwidth())

            .attr("height", function (d) {
                if (d.Money <= 0) {
                    return 0.1;
                } else {
                    let m = d.Interest + d.Money;
                    //                        console.log(m);
                    //                      console.log(d.Interest);
                    //                        console.log(d.Money);

                    return h - yScale(m);

                }

            });





        //set headers for charts
        document.getElementById("titlei").innerHTML = "Interest + Principle";
        document.getElementById("titlep").innerHTML = "Principle";
    });


}
Principle();
