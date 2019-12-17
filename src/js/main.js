import {POI} from  "./POI.js";
import * as map from "./map.js";

//const threatURL = "https://www.autoshun.org/download/?api_key=b7b6c9f82a42625a5ece1d299f464&format=csv";
const threatURL ="https://api.cybercure.ai/feed/get_ips"
//const countriesDB = "./json/countries.json"
//data.ip is an array that contains all of the threat ips

let access_key = "f0ad8f096ba0a4ce3045ce3c0f838824";

function init(){
    let app = new Vue({
        el: '#app',
        data: {
        titleText: 'Threat Visualizer',
        status: "Click Button to Search",
        term: "",
        threatIPs:[],
        ipLocation:[],
        rows: [],
        sortColumn: ''
        },
        methods: {
            showThreats(){
                fetch(threatURL)
                .then(response => {
                    if(!response.ok){
                        throw Error(`ERROR: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(threatJson => {
                    this.threatIPs = threatJson.data.ip;
                    this.createPOIS();
                });
            },
            searchCountry()
            {
                this.status=`Showing ${this.term}...`;

                //console.log(countriesDB);
            },
            createPOIS(threatJson)
            {
                //Clears array
                this.ipLocation = [];

                //Loops through the ips in the array
                for(let i =0; i<2; i++)
                {   
                    //Pulling Location data from this API
                    let url = 'http://api.ipstack.com/' + this.threatIPs[i] + '?access_key=' + access_key;
                    // console.log(url);
                    fetch(url)
                    .then(response => {
                        if(!response.ok){
                            throw Error(`ERROR: ${response.statusText}`);
                        }
                        return response.json();
                    })
                    .then(json => {
                        this.ipLocation.push(new POI(json.latitude, json.longitude, this.threatIPs[i]));
                        this.rows.push({
                            IPAddress:this.threatIPs[i],
                            Location: "("+ json.latitude +", "+ json.longitude +")"
                        })
                        // console.log(json.latitude,json.longitude);
                        // console.log(this.ipLocation[0].latitude);
                        //Adds Markers
                        map.addMarkers(this.ipLocation); 
                    });
                }
                
            },
        "sortTable": function sortTable(col) {
            if (this.sortColumn === col) {
                this.ascending = !this.ascending;
            } else {
                this.ascending = true;
                this.sortColumn = col;
            }
        
            var ascending = this.ascending;
        
            this.rows.sort(function(a, b) {
                if (a[col] > b[col]) {
                return ascending ? 1 : -1
                } else if (a[col] < b[col]) {
                return ascending ? -1 : 1
                }
                return 0;
            })
        }        
    },

        computed:
        {
            "columns": function columns() {
              if (this.rows.length == 0) {
                return [];
              }
              return Object.keys(this.rows[0])
            }
          },
        created(){
            //Initalizes the Map
            map.initMap();
            //Initializes the Markers
            this.showThreats();
        }
    });
}

export {init};
