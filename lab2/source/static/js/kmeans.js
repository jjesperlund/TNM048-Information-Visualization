/**
* k means algorithm
* @param data
* @param k
* @return {Object}
*/

function calculateRandomCentroids(data, k){

    var centroids = [];

    //Maximum data values (A,B,C)
    const maxA = Math.max.apply(Math, data.map(o => o.A)),
          minA = Math.min.apply(Math, data.map(o => o.A)),
          maxB = Math.max.apply(Math, data.map(o => o.B)),
          minB = Math.min.apply(Math, data.map(o => o.A)),
          maxC = Math.max.apply(Math, data.map(o => o.C)),
          minC = Math.min.apply(Math, data.map(o => o.A));

    //Calculating K random centroids in data space
    for(let i = 0; i < k; i++) {
        centroids.push({
            'A': Math.random() * (maxA - minA) + minA,
            'B': Math.random() * (maxB - minB) + minB,
            'C': Math.random() * (maxC - minC) + minC
        });      
    }
    console.log(centroids);
    return centroids;

}

function distance(a, b, dim) {
    return Math.sqrt(euclideanSum(a,b,dim));
}

function euclideanSum(a, b, dim) {    

    if(dim<300){
        var euclideanDistance = Math.pow((a.A - b.A),2) + Math.pow((a.B - b.B),2) + Math.pow((a.C - b.C),2);   
    }

    return euclideanDistance;
    
}


function kmeans(data, k) {

    /* STEP 1
    Randomly place K points into the space represented by the items that 
    are being clustered. These points represent the initial cluster centroids.
    */
    var centroids = calculateRandomCentroids(data, k);


    /* STEP 2
    Assign each item to the cluster that has the closest centroid, using the 
    Euclidean distance.
    */
    var dim = Object.keys(data[1]).length;
    
    data.forEach(function(d){
        var nearestIndex = -1;
        var dist = Infinity;    
        centroids.forEach(function(c,i){
            var nearestDist = distance(c, d,dim);
            console.log(nearestDist); 
            if(nearestDist < dist){
                dist = nearestDist;
                nearestIndex = i;
            }
        });

        d.assignments = nearestIndex;
        return d;
     });
     


    /* STEP 3
    When all objects have been assigned, recalculate the positions of the K 
    centroids to be in the centre of the cluster. (Averaging values in all dimensions)
    */

    /* STEP 4
    Check the quality of the cluster using the sum of the squared distances 
    within each cluster.
    */

    return data;

};


