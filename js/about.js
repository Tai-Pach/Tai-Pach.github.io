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
                        "Research Assistant": "Simpson Healthcare Executives",
                        "Quality Control Technician": "Scapa Tapes North America",
                        "Microbiology Laboratory Technician": "Northeast Labs",
                        "Quality Control/Assurance": "Carla's Pasta",
                        "Data Science Fellow": "NYC Data Science Academy"
                        
                    };
                    
                    date_format = Highcharts.dateFormat('%Y - %B', new Date(this.x));
                    
                    return "<b>"+this.series.name+"</b><br/><em>"+date_format+"</em><br/>"+info[this.series.name];
            }
        },
        series: [
            { name: "Studies I",              data: [ [Date.UTC(2007, 8, 1), 1], [Date.UTC(2011,8, 1), 1], ] },
            { name: "Studies II",             data: [ [Date.UTC(2012, 7, 1), 2], [Date.UTC(2013,12, 1), 2], ] },
            { name: "Research Assistant",     data: [ [Date.UTC(2014, 9, 1), 3], [Date.UTC(2015, 12, 1), 3], ] },
            { name: "Quality Control Technician",           data: [ [Date.UTC(2015, 12, 1), 4], [Date.UTC(2016, 8, 1), 4], ] },
            { name: "Microbiology Laboratory Technician",data: [ [Date.UTC(2016, 8, 1), 5], [Date.UTC(2017, 8, 1), 5], ] },
            { name: "Quality Control/Assurance", data: [ [Date.UTC(2017, 8, 1), 6], [Date.UTC(2018, 1, 1), 6], ] },
            { name: "Data Science Fellow",  data: [ [Date.UTC(2018, 4, 1), 7], [Date.UTC(new Date().getFullYear(),  new Date().getMonth(), 1), 7], ]}
            
        ]
    };

    chart = new Highcharts.Chart(plot_options_timeline);

});
