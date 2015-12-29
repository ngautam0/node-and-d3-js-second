(function mainFunction() {

    var fileName = "Table1.3_g20_2013.csv"; // file name to be read...
    var fileSystem = require("fs"); // import "fs" module

    fileSystem.readFile(fileName, {
            encoding: "utf8"
        }, function(error, data) {

            fileName = "continent-lookup.csv";
            // read continent-country look up
            fileSystem.readFile(fileName, {
                    encoding: "utf8"
                }, function(error, data1) {

                    var allTextLinesAsString = data.split(/\r\n|\n/); // split all lines
                    var allContriesContinentList = data1.split(/\r\n|\n/);
                    var header = allTextLinesAsString[0].split(","); // get header
                    var notCountry = ["European Union", "World"]; // not a country list
                    var highPopulation = ["India", "China"]; //list of Country with high Population
                    var highGdp = ["USA", "China", "Japan"]; // list of country with high GDP
                    var requiredColumns; // required Columns for array of objects..
                    var sortByIndex; // by what index it should be sorted
                    var countryContinent = {};
                    var continents = ["Africa", "America", "Asia", "Europe", "Oceania"]

                    requiredColumns = ["Country Name", "Population (Millions) - 2013"];
                    sortByIndex = 1;
                    fileSystem.writeFile('./jsonfiles/graphDataPopulationByCountry.json',
                        JSON.stringify(
                            createGraphJsonData(allTextLinesAsString, header, notCountry, requiredColumns, sortByIndex)));

                    requiredColumns = ["Country Name", "GDP Billions (US$) - 2013"];
                    sortByIndex = 1;
                    fileSystem.writeFile('./jsonfiles/graphDataGdpByCountry.json',
                        JSON.stringify(
                            createGraphJsonData(allTextLinesAsString, header, notCountry, requiredColumns, sortByIndex)));

                    requiredColumns = ["Country Name", "Purchasing Power in Billions ( Current International Dollar) - 2013"];
                    sortByIndex = 1;
                    fileSystem.writeFile('./jsonfiles/graphDataPurchasePowerByCountry.json',
                        JSON.stringify(
                            createGraphJsonData(allTextLinesAsString, header, notCountry, requiredColumns, sortByIndex)));

                    requiredColumns = ["Country Name",
                        "Population (Millions) - 2010",
                        "Population (Millions) - 2011",
                        "Population (Millions) - 2012",
                        "Population (Millions) - 2013"
                    ];
                    sortByIndex = -1;
                    fileSystem.writeFile('./jsonfiles/graphDataPopulationOverPeriod.json',
                        JSON.stringify(
                            createGraphJsonData(allTextLinesAsString, header, notCountry, requiredColumns, sortByIndex)));

                    splitHighLowPopulation(fileSystem, highPopulation); // split high and low populus contries

                    requiredColumns = ["Country Name",
                        "GDP Billions (US$) - 2010",
                        "GDP Billions (US$) - 2011",
                        "GDP Billions (US$) - 2012",
                        "GDP Billions (US$) - 2013"
                    ];
                    sortByIndex = -1;
                    fileSystem.writeFile('./jsonfiles/graphDataGdpOverPeriod.json',
                        JSON.stringify(
                            createGraphJsonData(allTextLinesAsString, header, notCountry, requiredColumns, sortByIndex)));

                    splitHighLowGdp(fileSystem, highGdp); // split high and low gdp countries

                    // creating country continent-lookup
                    // split each line individually by ,
                    for (var i = 1; i < allTextLinesAsString.length; i++) { //pick up each name from the file
                        eachRow = allTextLinesAsString[i].split(",");
                        // if its a country
                        if (notCountry.indexOf(eachRow[0]) < 0) {
                            for (var z = 0; z < allContriesContinentList.length; z++) { // iterate for all contries
                                var countryTempForMatching = allContriesContinentList[z].split(",");
                                if (countryTempForMatching[0] == eachRow[0]) { // match the name with lookup
                                    countryContinent[eachRow[0]] = countryTempForMatching[1]; // if name is matched assign continent
                                    break;
                                }
                            }
                        }
                    } // end of for -- countryContinent lookup

                    requiredColumns = ["Country Name",
                        "Population (Millions) - 2013"
                    ];
                    fileSystem.writeFile('./jsonfiles/graphDataContinentPopulation.json',
                        JSON.stringify(
                            createContinentGraphJsonData(allTextLinesAsString, notCountry, requiredColumns,
                                countryContinent, header, continents)));

                    requiredColumns = ["Country Name",
                        "GDP Billions (US$) - 2013"
                    ];
                    fileSystem.writeFile('./jsonfiles/graphDataContinentGdp.json',
                        JSON.stringify(
                            createContinentGraphJsonData(allTextLinesAsString, notCountry, requiredColumns,
                                countryContinent, header, continents)));

                }) // end of file read for country continent-lookup
        }) // end of file read main
})(); // end of main function

function createGraphJsonData(allTextLinesAsString, header, notCountry, requiredColumns, sortByIndex) {
    var indexForRequiredColumns = [];
    var eachRow = [];
    var graphData = [];

    // data structure
    function graphDataStructure(valuesForKey) {
        for (var k = 0; k < valuesForKey.length; k++) {
            this[requiredColumns[k]] = valuesForKey[k];
        }
    }

    // get index of required columns
    for (var i = 0; i < requiredColumns.length; i++) {
        indexForRequiredColumns[i] = header.indexOf(requiredColumns[i]);
    }

    // split each line individually by ,
    for (var i = 1, j = 0; i < allTextLinesAsString.length; i++) {
        eachRow = allTextLinesAsString[i].split(",");

        // if its a country
        if (notCountry.indexOf(eachRow[indexForRequiredColumns[0]]) < 0) {
            var valuesForKey = [];
            // generate values for key
            for (var l = 0; l < requiredColumns.length; l++) {
                valuesForKey[l] = eachRow[indexForRequiredColumns[l]];
            }
            // add values in object to array of objects
            graphData[j] = new graphDataStructure(valuesForKey);
            j++;
        }
    }

    // if sorting is required.. sort function
    if (sortByIndex >= 0) {
        graphData.sort(function(a, b) {
            if (parseFloat(a[requiredColumns[sortByIndex]]) > parseFloat(b[requiredColumns[sortByIndex]]))
                return -1;
            else if (parseFloat(a[requiredColumns[sortByIndex]]) < parseFloat(b[requiredColumns[sortByIndex]]))
                return 1;
            else
                return 0;
        })
    }
    // return array of objects
    return graphData;

} //end of function createGraphJsonData


function createContinentGraphJsonData(allTextLinesAsString, notCountry, requiredColumns, countryContinent, header, continents) {
    var indexForRequiredColumns = [];
    var eachRow = [];
    var graphData = {};

    // data structure


    // get index of required columns
    for (var i = 0; i < requiredColumns.length; i++) {
        indexForRequiredColumns[i] = header.indexOf(requiredColumns[i]);
    }

    //   // split each line individually by ,
    for (var i = 1, j = 0; i < allTextLinesAsString.length; i++) {
        eachRow = allTextLinesAsString[i].split(",");

        // if its a country
        if (notCountry.indexOf(eachRow[indexForRequiredColumns[0]]) < 0) {
            var valuesForKey = [];
            if (Number(isNaN(graphData[countryContinent[eachRow[indexForRequiredColumns[0]]]])))
                graphData[countryContinent[eachRow[indexForRequiredColumns[0]]]] = 0;

            graphData[countryContinent[eachRow[indexForRequiredColumns[0]]]] =
                parseFloat(graphData[countryContinent[eachRow[indexForRequiredColumns[0]]]]) +
                parseFloat(eachRow[indexForRequiredColumns[1]]);
        }
    }

    var finalGraphData = [];

    // data structure
    function graphDataStructureContinent(continent, variable) {
        this.Continent = continent;
        this[requiredColumns[1]] = variable;
    }


    for (var i = 0; i < continents.length; i++) {
        finalGraphData[i] = new graphDataStructureContinent(continents[i], graphData[continents[i]])
    }
    // return object

    return finalGraphData;

} //end of function createGraphJsonData


function splitHighLowPopulation(fileSystem, highPopulation) {

    fileSystem.readFile('./jsonfiles/graphDataPopulationOverPeriod.json', {
        encoding: "utf8"
    }, function(error, data) {
        var tempArrayForPopulation = JSON.parse(data);
        var graphDataHighPopulation = [];
        var graphDataLowPopulation = [];

        for (var m = 0; m < tempArrayForPopulation.length; m++) {
            if (highPopulation.indexOf(tempArrayForPopulation[m]["Country Name"]) > -1) {
                graphDataHighPopulation.push(tempArrayForPopulation[m]);
            } else {
                graphDataLowPopulation.push(tempArrayForPopulation[m]);
            }
        }
        fileSystem.writeFile('./jsonfiles/graphDataHighPopulation.json',
            JSON.stringify(graphDataHighPopulation));
        fileSystem.writeFile('./jsonfiles/graphDataLowPopulation.json',
            JSON.stringify(graphDataLowPopulation));
    })
} // end of function splitHighLowPopulation

function splitHighLowGdp(fileSystem, highGdp) {
    fileSystem.readFile('./jsonfiles/graphDataGdpOverPeriod.json', {
        encoding: "utf8"
    }, function(error, data) {
        var tempArrayForGdp = JSON.parse(data);
        var graphDataHighGdp = [];
        var graphDataLowGdp = [];

        for (var m = 0; m < tempArrayForGdp.length; m++) {
            if (highGdp.indexOf(tempArrayForGdp[m]["Country Name"]) > -1) {
                graphDataHighGdp.push(tempArrayForGdp[m]);
            } else {
                graphDataLowGdp.push(tempArrayForGdp[m]);
            }
        }
        fileSystem.writeFile('./jsonfiles/graphDataHighGdp.json',
            JSON.stringify(graphDataHighGdp));
        fileSystem.writeFile('./jsonfiles/graphDataLowGdp.json',
            JSON.stringify(graphDataLowGdp));

    })
}
