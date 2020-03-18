document.addEventListener('DOMContentLoaded', function () {
    console.log('Hello')
    //chrome.storage.sync.set({country: 'USA'}, function() {
    // })

    getDataForCountry('USA')
    getDataForCountry('Ethiopia')
    getGraphDataForAllCountries('cases')
    writeData()

});


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
            cases_list = []
            
            labels = []
            BG_COLOR = 'rgba(100, 190, 100, 0.5)'
            for (var i = 0; i < 20; i++) {
                labels.push(data[i].country)
                backgroundColor.push(BG_COLOR)
                borderColor.push(BG_COLOR)
                cases_list.push(data[i][type])
            }

            var ctx = document.getElementById('myChart');
            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '# cases',
                        data: cases_list,
                        backgroundColor: backgroundColor,
                        borderColor: borderColor,
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

function writeData() {
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
            board.innerHTML += 'Cases: ' + cases + ' ['+ cases_today + ']' + '<br>'
            board.innerHTML += 'Deaths: ' + deaths + ' ['+ deaths_today + ']' + '<br>'
            board.innerHTML += 'Active Cases: ' + active_cases + '<br>'
            board.innerHTML += 'MR: ' + mortality_rate + '<br>'
            board.innerHTML += 'Percent cases today: ' + percent_cases_today
        });
}
