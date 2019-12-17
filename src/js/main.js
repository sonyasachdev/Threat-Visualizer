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
        status: "Check if IP Address is a Threat Below",
        matchFound: "",
        matchColor: "",
        matchStyle: {
            backgroundColor: '',
            border: ''
        },
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
            checkIP()
            {
                this.status=`Status: Checking if ${this.term} is a threat`;

                fetch(threatURL)
                .then(response => {
                    if(!response.ok){
                        throw Error(`ERROR: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(threatJson => {
                    this.threatIPs = threatJson.data.ip;
                    if(this.term == '')
                    {
                        this.status=`Please enter an IP Address to be Checked`;
                    }
                    else
                    {
                        this.status=`Checked whether [${this.term}] is a threat`;
                        for(let i = 0; i<this.threatIPs.length; i++)
                        {
                            if(this.term == this.threatIPs[i])
                            {
                                this.matchFound = "This IP Address is a Threat";
                                this.matchStyle.backgroundColor = "rgb(255, 0, 106)";
                                this.matchStyle.border = "2px solid rgb(119, 0, 50)";
                                break;
                            }
                            else
                            {
                                this.matchFound = "This IP Address is not a Threat";
                                this.matchStyle.backgroundColor = "rgb(0, 194, 87)";
                                this.matchStyle.border = "2px solid rgb(0, 117, 53)";
                            }
                        }
                    }                    
                });
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
