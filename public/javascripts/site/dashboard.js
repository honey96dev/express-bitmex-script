// "use strict";
// Class definition

var Dashboard = function () {
    return {

        init: function () {
            var dataJSONArray = [
                {
                    "RecordID": 1,
                    "OrderID": "61715-075",
                    "Country": "China",
                    "ShipCountry": "CN",
                    "ShipCity": "Tieba",
                    "ShipName": "Collins, Dibbert and Hoeger",
                    "ShipAddress": "746 Pine View Junction",
                    "CompanyEmail": "nsailor0@livejournal.com",
                    "CompanyAgent": "Nixie Sailor",
                    "CompanyName": "Gleichner, Ziemann and Gutkowski",
                    "Currency": "CNY",
                    "Notes": "imperdiet nullam orci pede venenatis non sodales sed tincidunt eu felis fusce posuere felis sed lacus morbi",
                    "Department": "Outdoors",
                    "Website": "irs.gov",
                    "Latitude": 35.0032213,
                    "Longitude": 102.913526,
                    "ShipDate": "2\/12\/2018",
                    "PaymentDate": "2016-04-27 23:53:15",
                    "TimeZone": "Asia\/Chongqing",
                    "TotalPayment": "$246154.65",
                    "Status": 3,
                    "Type": 2,
                    "Actions": null
                },
                {
                    "RecordID": 2,
                    "OrderID": "63629-4697",
                    "Country": "Indonesia",
                    "ShipCountry": "ID",
                    "ShipCity": "Cihaur",
                    "ShipName": "Prosacco-Breitenberg",
                    "ShipAddress": "01652 Fulton Trail",
                    "CompanyEmail": "egiraldez1@seattletimes.com",
                    "CompanyAgent": "Emelita Giraldez",
                    "CompanyName": "Rosenbaum-Reichel",
                    "Currency": "IDR",
                    "Notes": "adipiscing elit proin risus praesent lectus vestibulum quam sapien varius ut blandit non interdum",
                    "Department": "Toys",
                    "Website": "ameblo.jp",
                    "Latitude": -7.1221059000000002,
                    "Longitude": 106.57019270000001,
                    "ShipDate": "8\/6\/2017",
                    "PaymentDate": "2017-11-13 14:37:22",
                    "TimeZone": "Asia\/Jakarta",
                    "TotalPayment": "$795849.41",
                    "Status": 6,
                    "Type": 3,
                    "Actions": null
                },
                {
                    "RecordID": 3,
                    "OrderID": "68084-123",
                    "Country": "Argentina",
                    "ShipCountry": "AR",
                    "ShipCity": "Puerto Iguaz\u00fa",
                    "ShipName": "Lebsack-Emard",
                    "ShipAddress": "2 Pine View Park",
                    "CompanyEmail": "uluckin2@state.gov",
                    "CompanyAgent": "Ula Luckin",
                    "CompanyName": "Kulas, Cassin and Batz",
                    "Currency": "ARS",
                    "Notes": "blandit ultrices enim lorem ipsum dolor sit amet consectetuer adipiscing elit proin",
                    "Department": "Electronics",
                    "Website": "pbs.org",
                    "Latitude": -25.611233899999998,
                    "Longitude": -54.551566200000003,
                    "ShipDate": "5\/26\/2016",
                    "PaymentDate": "2018-01-22 12:01:51",
                    "TimeZone": "America\/Argentina\/Cordoba",
                    "TotalPayment": "$830764.07",
                    "Status": 1,
                    "Type": 2,
                    "Actions": null
                },
                {
                    "RecordID": 4,
                    "OrderID": "67457-428",
                    "Country": "Indonesia",
                    "ShipCountry": "ID",
                    "ShipCity": "Talok",
                    "ShipName": "O'Conner, Lebsack and Romaguera",
                    "ShipAddress": "3050 Buell Terrace",
                    "CompanyEmail": "ecure3@trellian.com",
                    "CompanyAgent": "Evangeline Cure",
                    "CompanyName": "Pfannerstill-Treutel",
                    "Currency": "IDR",
                    "Notes": "erat curabitur gravida nisi at nibh in hac habitasse platea",
                    "Department": "Automotive",
                    "Website": "fastcompany.com",
                    "Latitude": 1.05,
                    "Longitude": 118.8,
                    "ShipDate": "7\/2\/2016",
                    "PaymentDate": "2017-05-26 08:31:15",
                    "TimeZone": "Asia\/Jakarta",
                    "TotalPayment": "$777892.92",
                    "Status": 1,
                    "Type": 3,
                    "Actions": null
                },
                {
                    "RecordID": 5,
                    "OrderID": "31722-529",
                    "Country": "Austria",
                    "ShipCountry": "AT",
                    "ShipCity": "Sankt Andr\u00e4-H\u00f6ch",
                    "ShipName": "Stehr-Kunde",
                    "ShipAddress": "3038 Trailsway Junction",
                    "CompanyEmail": "tst4@msn.com",
                    "CompanyAgent": "Tierney St. Louis",
                    "CompanyName": "Dicki-Kling",
                    "Currency": "EUR",
                    "Notes": "felis fusce posuere felis sed lacus morbi sem mauris laoreet ut rhoncus aliquet pulvinar sed nisl nunc rhoncus dui",
                    "Department": "Health",
                    "Website": "jimdo.com",
                    "Latitude": 46.791555000000002,
                    "Longitude": 15.379192,
                    "ShipDate": "5\/20\/2017",
                    "PaymentDate": "2016-02-17 10:53:48",
                    "TimeZone": "Europe\/Vienna",
                    "TotalPayment": "$516467.41",
                    "Status": 2,
                    "Type": 3,
                    "Actions": null
                },
                {
                    "RecordID": 6,
                    "OrderID": "64117-168",
                    "Country": "China",
                    "ShipCountry": "CN",
                    "ShipCity": "Rongkou",
                    "ShipName": "O'Hara LLC",
                    "ShipAddress": "023 South Way",
                    "CompanyEmail": "greinhard5@instagram.com",
                    "CompanyAgent": "Gerhard Reinhard",
                    "CompanyName": "Gleason, Kub and Marquardt",
                    "Currency": "CNY",
                    "Notes": "tempus sit amet sem fusce consequat nulla nisl nunc nisl duis bibendum felis sed interdum venenatis turpis enim blandit mi",
                    "Department": "Electronics",
                    "Website": "cocolog-nifty.com",
                    "Latitude": 37.646107999999998,
                    "Longitude": 120.477813,
                    "ShipDate": "11\/26\/2016",
                    "PaymentDate": "2018-02-08 07:09:18",
                    "TimeZone": "Asia\/Shanghai",
                    "TotalPayment": "$410062.16",
                    "Status": 5,
                    "Type": 3,
                    "Actions": null
                }
            ];
            $('table.display').DataTable();
        },

        addRow: function () {

        },
    }
};


jQuery(document).ready(function () {
    let dashboard = new Dashboard();
    dashboard.init();
    // dashboard.addRow();
});
