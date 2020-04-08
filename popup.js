document.addEventListener('DOMContentLoaded', function () {
    console.log('Hello')
    //chrome.storage.sync.set({country: 'USA'}, function() {
    // })

    //getDataForCountry('USA')
    //getDataForCountry('Ethiopia')
    getGraphDataForAllCountries('cases')
    writeData()
    getDataFromJH()
    

});

function fill(arr, el, num) {
    for (var i = 0; i < num; i++) {
        arr.push(el)
    }
}

function getDataFromJH() {
    fetch('https://corona.lmao.ninja/v2/historical?lastdays=60')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            

            BG_COLOR_CASE= 'rgba(10, 10, 210, 0.4)'
            BG_COLOR_DEATH= 'rgba(210, 10, 10, 0.4)'
            BG_COLOR_REC= 'rgba(30, 210, 50, 0.4)'

            labels = Object.keys(data[0]['timeline']['cases'])
            backgroundColor = new Array(labels.length).fill(BG_COLOR_CASE);
            borderColor = new Array(labels.length).fill(BG_COLOR_CASE);
            backgroundColorD = new Array(labels.length).fill(BG_COLOR_DEATH);
            borderColorD = new Array(labels.length).fill(BG_COLOR_DEATH);
            backgroundColorR = new Array(labels.length).fill(BG_COLOR_REC);
            borderColorR = new Array(labels.length).fill(BG_COLOR_REC);

            cases_tot = new Array(labels.length).fill(0);
            deaths_tot = new Array(labels.length).fill(0);
            recs_tot = new Array(labels.length).fill(0);


            for (var i = 0; i < data.length; i++) {
                country_data = data[i]['timeline']
                for (var j = 0; j < labels.length; j++) {
                    cases_tot[j] = cases_tot[j] + country_data['cases'][labels[j]]
                    deaths_tot[j] = deaths_tot[j] + country_data['deaths'][labels[j]]
                    recs_tot[j] = recs_tot[j] + country_data['recovered'][labels[j]]

                }
            }

            var ctx = document.getElementById('total_chart');
            var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '# cases',
                        data: cases_tot,
                        backgroundColor: backgroundColor,
                        borderColor: borderColor,
                        borderWidth: 1
                    }, {
                        label: '# deaths',
                        data: deaths_tot,
                        backgroundColor: backgroundColorD,
                        borderColor: borderColorD,
                        borderWidth: 1
                    }, {
                        label: '# recoveries',
                        data: recs_tot,
                        backgroundColor: backgroundColorR,
                        borderColor: borderColorR,
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });

        });
}
function getTotal() {
    fetch('https://corona.lmao.ninja/countries')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            //console.log(data)
            var sum = 0
            for (var i = 0; i < data.length; i++) {
                var cases = data[i].cases
                sum = sum + cases
            }
            return sum;
        });
    return 0
}

function getDataForCountry(country) {
    fetch('https://corona.lmao.ninja/countries')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data)
            for (var i = 0; i < data.length; i++) {
                if (data[i].country === country) {
                    document.getElementById('regions_div').innerHTML += country + ': ' + (data[i].cases + '<br>')
                }
            }
            return 'Hello'
        });
}

function getGraphDataForAllCountries(type) {
    fetch('https://corona.lmao.ninja/countries')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            backgroundColor = []
            borderColor = []
            backgroundColorD = []
            backgroundColorT = []
            borderColorD = []
            borderColorT = []
            cases_list = []
            death_list = []
            test_list = []
            
            labels = []
            BG_COLOR_CASE= 'rgba(50, 140, 10, 0.6)'
            BG_COLOR_DEATH= 'rgba(200, 0, 30, 0.4)'
            BG_COLOR_TEST= 'rgba(20, 100, 230, 0.5)'

            for (var i = 0; i < 20; i++) {
                labels.push(data[i].country)
                backgroundColor.push(BG_COLOR_CASE)
                borderColor.push(BG_COLOR_CASE)
                backgroundColorD.push(BG_COLOR_DEATH)
                borderColorD.push(BG_COLOR_DEATH)
                backgroundColorT.push(BG_COLOR_TEST)
                borderColorT.push(BG_COLOR_TEST)

                cases_list.push(data[i]['cases'])
                death_list.push(data[i]['deaths'])
                test_list.push(data[i]['tests'])
            }

            var ctx = document.getElementById('countries_chart');
            var myChart = new Chart(ctx, {
                type: 'horizontalBar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '# cases',
                        data: cases_list,
                        backgroundColor: backgroundColor,
                        borderColor: borderColor,
                        borderWidth: 1
                    }, {
                        label: '# deaths',
                        data: death_list,
                        backgroundColor: backgroundColorD,
                        borderColor: borderColorD,
                        borderWidth: 1
                    }, {
                        label: '# tests',
                        data: test_list,
                        backgroundColor: backgroundColorT,
                        borderColor: borderColorT,
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });

        });
}

var written = 0
function writeData() {
    if (written != 0) {
        return;
    }
    deaths = 0
    cases = 0
    active_cases = 0
    mortality_rate = 0

    deaths_today = 0
    cases_today = 0

    fetch('https://corona.lmao.ninja/countries')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            for(var i = 0; i < data.length; i++) {
                deaths += data[i].deaths
                cases += data[i].cases
                cases_today += data[i].todayCases
                deaths_today += data[i].todayDeaths
                active_cases += data[i].cases - (data[i].deaths + data[i].recovered)
            }
            mortality_rate = 100.0 * deaths/cases
            percent_cases_today = 100.0 * cases_today/cases

            board = document.getElementById('regions_div')
            board.innerHTML = ''
            board.innerHTML += '<b>Cases:</b> ' + cases + ' ['+ cases_today + ']' + '<br>'
            board.innerHTML += '<b>Deaths:</b> ' + deaths + ' ['+ deaths_today + ']' + '<br>'
            board.innerHTML += '<b>Active Cases:</b> ' + active_cases + '<br>'
            board.innerHTML += '<b>MR:</b> ' + mortality_rate.toFixed(3) + '%<br>'
            board.innerHTML += '<b>Percent cases today:</b> ' + percent_cases_today.toFixed(3) + '%<br>'
            written = 1
        });
}
