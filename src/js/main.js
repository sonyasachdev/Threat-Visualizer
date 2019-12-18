import * as map from "./map.js";
import "./threat-match.component.js";

const threatURL ="https://api.cybercure.ai/feed/get_ips"

//Firebase things
let firebaseConfig = {
    apiKey: "AIzaSyDf9HBaeVPbIDz-35whhCkR2_GWnr4g3DI",
    authDomain: "threat-visualizer.firebaseapp.com",
    databaseURL: "https://threat-visualizer.firebaseio.com",
    projectId: "threat-visualizer",
    storageBucket: "threat-visualizer.appspot.com",
    messagingSenderId: "967403307209",
    appId: "1:967403307209:web:622cc5a59323f1fe9b8d18",
    measurementId: "G-3JBWG13HKJ"
};

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

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
            border: '',
            marginBottom: '15px'
        },
        term: localStorage.getItem("searchTerm"),
        threatIPs:[],
        ipSearchCount:{}
        },
        methods: {
            checkIP()
            {
                this.status=`Checking if ${this.term} is a threat`;
                
                //Reduces the IP Address to just its numbers so that it can be used as a key.
                let regTerm =  this.term.trim().split('.').join("");
                let path = 'ipAddressSearchCount/' + regTerm;

                let searchCount = 0;

                //Keep track of how many times an IP was searched
                firebase.database().ref("ipAddressSearchCount").on("value", 
                function changeData(data){ 
                    let obj = data.val();
                    searchCount = obj[regTerm].timesSearched;
                    searchCount++;
                },
                function firebaseError(error){
                    this.status = error;
                });

                //Sets the IP Address and its search count
                firebase.database().ref(path).set({
                    ipAddress: this.term,
                    timesSearched: searchCount
                });

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
            showYourIP(){
                fetch('https://api.ipify.org?format=json')
                .then(response => {
                    if(!response.ok){
                        throw Error(`ERROR: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(({ ip }) => {
                    this.term = ip;
                });
            },
            localStore()
            {
                this.term;
                localStorage.setItem("searchTerm", this.term);
            }
        },
    created(){
        //Initalizes the Map
        map.initMap();
    }
    });
}

export {init};