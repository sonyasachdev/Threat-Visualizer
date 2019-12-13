import "./datavis-footer.component.js";
import {POI} from  "./POI.js";
import {initMap} from "./map.js";

//const threatURL = "https://www.autoshun.org/download/?api_key=b7b6c9f82a42625a5ece1d299f464&format=csv";
const threatURL ="https://api.cybercure.ai/feed/get_ips"
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
        ipLocation:[]
        },
        methods: {
            search(){
                this.status=`Searching for ${this.term}...`;

                fetch(threatURL)
                .then(response => {
                    if(!response.ok){
                        throw Error(`ERROR: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(threatJson => {
                    console.log(threatJson.data.ip[0]);
                    this.threatIPs = threatJson.data.ip;
                   // this.results.push(new POI(json.latitude, json.longitude, threatJson.data.ip[0]));
                    this.createPOIS();
                });
            },
            createPOIS(threatJson)
            {
                //this.results = [];
                //Loops through the ips in the array
                for(let i =0; i<1; i++)
                {   
                    let url = 'http://api.ipstack.com/' + this.threatIPs[i] + '?access_key=' + access_key;
                    console.log(url);
                    fetch(url)
                    .then(response => {
                        if(!response.ok){
                            throw Error(`ERROR: ${response.statusText}`);
                        }
                        return response.json();
                    })
                    .then(json => {
                        this.ipLocation.push(new POI(json.latitude, json.longitude, this.threatIPs[i]));
                        console.log(json.latitude,json.longitude);
                        console.log(ipLocation[0]); 
                    });
                }
                
            }
        },
            created(){
                initMap();
            }
    });
}

export {init};
