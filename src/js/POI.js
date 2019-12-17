
class POI{
    constructor(latitude, longitude, ipAddress)
    {
        Object.assign(this, {latitude, longitude, ipAddress});
    }
}

// function findLocation(threatJson, results){
//     let where = new POI(json.latitude, json.longitude, results[i]);
//     Object.assign(where, {

//     })
// }

export {POI};