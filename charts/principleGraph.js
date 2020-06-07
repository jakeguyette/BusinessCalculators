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
        let winterest = totalD / n

        //console.log(nointerest)


        let margin = {
                top: 15,
                right: 70,
                bottom: 80,
                left: 50
            },
            w = 800 - margin.left - margin.right,
            h = 490 - margin.top - margin.bottom;

        var svgContainer = d3.select('#chart3');
        //set size of svg
        let svg = svgContainer.append("svg")
            .attr("width", w + margin.left + margin.right)
            .attr("height", h + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        //append axes
        //add initially hidden tool tip to svg
        var tooltip = svgContainer.append('div');

        //----------------------------tool tip-------------------------------------------
        //add initially hidden tool tip to svg
        //var tooltip = svgContainer.append('div');
        // tooltip mouseover event handler
        var onMouseOver = function (d) {
            //console.log(d.data.Date)
            //console.log(d[1])
            var Date = (d.data.Date).toDateString()
            var P = (d[1]).toFixed(2)
            var I = (d[1] - d[0]).toFixed(2)
            var debt = (d[1]).toFixed(2);
            //console.log(d[1])
            //console.log("here"+d[0])
            var html = "";
            if (d[0] == 0) {
                //html code principle tooltip
                html = "<span class='column is-one-fourth is-flex'><span class='notification is-link has-text'><p class='subtitle is-5'>" + Date + "<br>Remaining Principle: $" + P +
                    "</p><span><span>"

                ;
            } else {
                //html code interest tooltip
                html = "<span class='column is-one-fourth is-flex'><span class='notification is-danger has-text'><p class='subtitle is-5'>" + Date + "<br>Remaining Interest: $" + I + "<br>Remaining Debt: $" +
                    debt + "</p><span><span>"

                ;
            }
            //get html code above into tooltip
            tooltip.html(html)
                //postion tooltip
                .style("left", (d3.event.pageX + 6) + "px")
                .style("top", (d3.event.pageY) + "px")
                .transition()
                .duration(1) // instant
                .style("opacity", 1) // now visable

        };
        // tooltip mouseout event handler
        var onMouseOut = function () {
            tooltip.transition()
                .duration(2000) // 12 seconds until hidden
                .style("opacity", 0); // now hidden
        };

        //----------------------------create x and y axes----------------------------------
        //set x and y scales
        let yScale = d3.scaleLinear()
            //find min and max of stock prices
            .domain([0, totalD])

            .range([h, 0]).nice();

        //console.log("__here__")
        var today = new Date();
        var start = new Date(today.getFullYear(), (today.getMonth()), (today.getDate()));
        var myData = []

        let i = 0
        let count = n
        //console.log(n);
        for (i = 0; i <= n; i++) {
            let money = principle - (parseFloat(nointerest) * (i));
            let moneyi = totalD - (parseFloat(winterest) * (i))
            let interest = ((totalD / n) - (principle / n)).toFixed(2);
            let Tinterest = interest * count
            if (i == n) {
                moneyi = 0
            }
            //console.log(interest);
            myData.push({
                Date: (new Date(start)),
                Money: parseFloat(money),
                Interest: parseFloat(interest),
                Moneyi: moneyi,
                Tinterest: Tinterest
            });
            start.setMonth(start.getMonth() + 1);
            count--;
        }

        console.log(myData)


        var xScale = d3.scaleBand()
            .domain(d3.values(myData).map(function (d) {
                return d.Date;

            }))
            .range([margin.left, w])
            .padding(0.1);

        let yAxis = d3.axisLeft(yScale).ticks(10, "$,f");
        //----------------------------append x and y axes----------------------------------
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
                .tickValues(xScale.domain().filter(function (d, i) {
                    if (years > 1 && years <= 3) {
                        return !(i % 2)
                    }
                    if (years > 3 && years <= 8) {
                        return !(i % 3)
                    }
                    if (years > 8 && years <= 15) {
                        return !(i % 6)
                    }
                    if (years > 15) {
                        return !(i % 12)
                    } else {
                        return true
                    }


                }))
                .tickFormat(d3.timeFormat("%b %Y"))

            )

            //rotate labels for better readability
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(70)")
            .style("text-anchor", "start");

        console.log(myData)
        //----------------------------draw principle and interest bars----------------------------------       
        //console.log(d3.keys(myData));
        //colors for bars
        var z = d3.scaleOrdinal()
            .range(['hsl(217, 71%, 53%)', 'hsl(348, 100%, 61%)']);

        var keys = ["Money", "Tinterest"];

        //console.log(d3.stack().keys(keys)(myData));

        myData.forEach(function (d) {
            d.total = 0;
            keys.forEach(function (k) {
                d.total += d[k];
            })
        });

        z.domain(keys);

        svg.append("g")
            .selectAll("g")
            .data(d3.stack().keys(keys)(myData))
            .enter().append("g")
            .attr("fill", function (d) {
                return z(d.key);
            })
            .selectAll("rect")
            .data(function (d) {
                return d;
            })
            .enter().append("rect")
            .attr("x", function (d) {
                return xScale(d.data.Date);
            })
            .attr("y", function (d) {
                //console.log(yScale(d[1]));
                return yScale((d[1]));
            })
            .attr("height", function (d) {
                //console.log(yScale(d[0]))
                //console.log(parseFloat(yScale(d[1]))+":");
                //console.log(yScale(d[0]) - yScale(parseFloat(d[1])));
                return yScale(d[0]) - yScale(parseFloat(d[1]));
            })
            .attr("width", xScale.bandwidth())

            .on("mouseover", onMouseOver)
            .on("mouseout", onMouseOut);


        //----------------------------Add color Legend----------------------------------       
        var legend = svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(keys.slice().reverse())
            .enter().append("g")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });

        legend.append("rect")
            .attr("x", w - 30)
            .attr("width", 21)
            .attr("height", 21)
            .attr("fill", z);

        legend.append("text")
            .attr("x", w - 35)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function (d, i) {
                if (i == 0) {
                    return "Total Interest"
                } else {
                    return "Principle"
                }
            });

        //----------------------------set graph title----------------------------------        

        //set headers for charts
        document.getElementById("titleip").innerHTML = years + " Year" + " Loan Summary(" +
            interest + "% APR)";

    });


}
Principle();

//GRAPHS NOT INCLUDED IN FINAL VERSION
// //append axes
//        // add Y axis 
//        svg.append("g")
//            .attr("class", "axis")
//            //position yaxis
//            .attr("transform", "translate(50,0)")
//            //creates yaxis
//            .call(yAxis);
//
//        // add X axis with ticks every 6 business days
//        svg.append("g")
//            .attr("class", "axis")
//            //position xaxis
//            .attr("transform", "translate(0," + h + ")")
//            //creates xaxis
//            .call(d3.axisBottom(xScale)
//                .tickValues(xScale.domain().filter(function (d, i) {
//                    if(years > 1 && years<=3){
//                      return !(i % 2)  
//                    }
//                    if(years > 3){
//                      return !(i % 4)  
//                    }
//                    else{
//                        return true
//                    }
//                    
//                    
//                }))
//                .tickFormat(d3.timeFormat("%b %Y"))
//
//            )
//
//            //rotate labels for better readability
//            .selectAll("text")
//            .attr("y", 0)
//            .attr("x", 9)
//            .attr("dy", ".35em")
//            .attr("transform", "rotate(70)")
//            .style("text-anchor", "start");
//
//        //draw principle
//        svg.selectAll(".bar")
//            .data(myData).enter()
//            .append("rect")
//            .attr("class", "bar")
//            .attr("x", function (d) {
//                //console.log(xScale(d.Date))
//                let xx = xScale(d.Date);
//                //console.log(xx);
//                //console.log("here");
//
//                return xx
//                //return xScale(d.Date)+51;
//            })
//            .attr("y", function (d) {
//                //console.log(yScale(d.Money))
//                //                    console.log("start")
//                //                    console.log((w/n)-2)
//                //                    console.log("end")
//                return yScale(d.Money);
//            })
//            .attr("width", xScale.bandwidth())
//
//            .attr("height", function (d) {
//                if (d.Money <= 0) {
//                    return 0.1;
//                } else {
//                    //console.log( h - yScale(d.Money))
//                    return h - yScale(d.Money);
//                }
//
//            })
//            .on("mouseover", onMouseOver)
//            .on("mouseout", onMouseOut);
//        
////---------------------------------GRAPH 2-------------------------------------------
//        var svgContainer2 = d3.select('#chart2');
//        //set size of svg
//        let svg2 = svgContainer2.append("svg")
//            .attr("width", w + margin.left + margin.right)
//            .attr("height", h + margin.top + margin.bottom)
//            .append("g")
//            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//        
//        //add initially hidden tool tip to svg
//        var tooltip2 = svgContainer2.append('div');
//        // tooltip mouseover event handler
//        var onMouseOver2 = function (d) {
//            console.log("candle has been selected!")
//            //html code for custom tool tip
//            var html2 = "<span class='column is-one-fourth is-flex'><span class='notification is-danger has-text'><p class='subtitle is-5'>" + d.Date.toDateString() + "<br>Monthly Payment: $"+payments+"<br>Remaining Debt: $"+(parseFloat(d.Moneyi)).toFixed(2)+"</p><span><span>" 
//                
//            ;
//            //get html code above into tooltip
//            tooltip2.html(html2)
//                //postion tooltip
//                .style("left", (d3.event.pageX +6) + "px")
//                .style("top", (d3.event.pageY) + "px")
//                .transition()
//                .duration(1) // instant
//                .style("opacity", 1) // now visable
//
//        };
//        // tooltip mouseout event handler
//        var onMouseOut2 = function () {
//            tooltip.transition()
//                .duration(2000) // 12 seconds until hidden
//                .style("opacity", 0); // now hidden
//        };
//
//
//        //append axes
//        // add Y axis 
//        svg2.append("g")
//            .attr("class", "axis")
//            //position yaxis
//            .attr("transform", "translate(50,0)")
//            //creates yaxis
//            .call(yAxis);
//
//        // add X axis with ticks every 6 business days
//        svg2.append("g")
//            .attr("class", "axis")
//            //position xaxis
//            .attr("transform", "translate(0," + h + ")")
//            //creates xaxis
//            .call(d3.axisBottom(xScale)
//                .tickValues(xScale.domain().filter(function (d, i) {
//                    if(years > 1 && years<=3){
//                      return !(i % 2)  
//                    }
//                    if(years > 3){
//                      return !(i % 4)  
//                    }
//                    else{
//                        return true
//                    }
//                    
//                    
//                }))
//                .tickFormat(d3.timeFormat("%b %Y"))
//
//            )
//
//            //rotate labels for better readability
//            .selectAll("text")
//            .attr("y", 0)
//            .attr("x", 9)
//            .attr("dy", ".35em")
//            .attr("transform", "rotate(70)")
//            .style("text-anchor", "start");
//
//        //draw interest +principle
//        svg2.selectAll(".bar2")
//            .data(myData).enter()
//            .append("rect")
//            .attr("class", "bar2")
//            .attr("x", function (d) {
//                //console.log(xScale(d.Date))
//                let xx = xScale(d.Date);
//                //console.log(xx);
//                //console.log("here");
//
//                return xx
//                //return xScale(d.Date)+51;
//            })
//            .attr("y", function (d) {
//                //console.log(yScale(d.Money))
//                //                    console.log("start")
//                //                    console.log((w/n)-2)
//                //                    console.log("end")
//                return yScale(d.Moneyi);
//            })
//            .attr("width", xScale.bandwidth())
//
//            .attr("height", function (d) {
//                if (d.Moneyi <= 0) {
//                    return 0.1;
//                } else {
//                    //let m = d.Moneyi;
//                    //                        console.log(m);
//                    //                      console.log(d.Interest);
//                    //                        console.log(d.Money);
//
//                    return h - yScale(d.Moneyi);
//
//                }
//
//            })
//            .on("mouseover", onMouseOver2)
//            .on("mouseout", onMouseOut2);
