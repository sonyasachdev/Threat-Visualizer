import {POI} from  "./POI.js";
import * as map from "./map.js";

const threatURL ="https://api.cybercure.ai/feed/get_ips"

function initTable(){
    let tableVue = new Vue({
        el: '#tableVue',
        data: {
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
                createPOIS(threatJson)
                {
                    //Clears array
                    this.ipLocation = [];
    
                    //Loops through the ips in the array
                    for(let i =0; i<this.threatIPs.length; i++)
                    {   
                        //Pulling Location data from this API
                        let url = 'https://json.geoiplookup.io/' + this.threatIPs[i];
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
                            //Adds Markers
                            map.addMarkers(this.ipLocation); 
                        });
                    }
                },
                //Table Creation Helper Function
                "sortTable": function sortTable(col) {
                    if (this.sortColumn === col) {
                        this.ascending = !this.ascending;
                    } 
                    else {
                        this.ascending = true;
                        this.sortColumn = col;
                    }
                    let ascending = this.ascending;
                    this.rows.sort(function(a, b) {
                        if (a[col] > b[col]) {
                            return ascending ? 1 : -1
                        } 
                        else if (a[col] < b[col]) {
                            return ascending ? -1 : 1
                        }
                        return 0;
                    })}
            },    
        computed:
        {
            //Table Function
            "columns": function columns() {
              if (this.rows.length == 0) {
                return [];
              }
              return Object.keys(this.rows[0])
            }
          },
        created()
        {
            //Initializes the Markers on the Map
            this.showThreats();
        }
    });
}

export {initTable};
