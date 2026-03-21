$(function () { 

// Highcharts
    Highcharts.setOptions({
        chart: {
            height: 250,
            backgroundColor: "transparent",
            style: {
                fontFamily: "Lato",
            },
        },
        title: {
            text: ""
        },
        legend: {
            enabled: false,
        },
        credits: {
            enabled: false,
        },
        yAxis: {
            min: 0,
            labels: {
                enabled: false
            },
            title: {
                text: ""
            },
            gridLineColor: "transparent",
        },
    });

    plot_options_timeline = {
        chart: {
            type: "line",
            renderTo: "timeline",
            zoomType: "x",
        },
        colors:  ["#d35400", "#2980b9", "#2ecc71", "#f1c40f", "#2c3e50", "#7f8c8d"],
        xAxis: {
            labels: {
                enabled: true
            },
            type: "datetime",
            min: Date.UTC(2003,  10, 1),
            max: Date.UTC(new Date().getFullYear(),  new Date().getMonth() + 3, 29)
        },
        plotOptions: {
          line: {
            lineWidth: 10
          }
        },
        tooltip: {
            formatter: function() {
                    info = {
                        "Studies I": "Biomolecular Sciences degree at CCSU",
                        "Studies II": "Master in Biomolecular Sciences at CCSU",
                        "Data Science Fellow": "NYC Data Science Academy",
                        "Teaching Assistant": "NYC Data Science Academy",
                        "Senior Business Data Analyst": "The New York Times Company"
                        
                    };
                    
                    date_format = Highcharts.dateFormat('%Y - %B', new Date(this.x));
                    
                    return "<b>"+this.series.name+"</b><br/><em>"+date_format+"</em><br/>"+info[this.series.name];
            }
        },
        series: [
            { name: "Studies I",              data: [ [Date.UTC(2007, 8, 1), 1], [Date.UTC(2011,8, 1), 1], ] },
            { name: "Studies II",             data: [ [Date.UTC(2012, 7, 1), 2], [Date.UTC(2013,12, 1), 2], ] },
            { name: "Data Science Fellow", data: [ [Date.UTC(2018, 4, 1), 6], [Date.UTC(2018, 7, 1), 6], ] },
            { name: "Teaching Assistant", data: [ [Date.UTC(2018, 8, 1), 6], [Date.UTC(2018, 10, 1), 6], ] },
            { name: "Senior Business Data Analyst", data: [ [Date.UTC(2019, 1, 1), 6], [Date.UTC(2026, 1, 1), 6], ] }
            // { name: "Data Science Fellow",  data: [ [Date.UTC(2018, 4, 1), 7], [Date.UTC(new Date().getFullYear(),  new Date().getMonth(), 1), 7], ]}
            
        ]
    };

    chart = new Highcharts.Chart(plot_options_timeline);

});
