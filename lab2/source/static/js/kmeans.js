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
    return centroids;

}

function assignCluster(data, centroids){

    var dim = Object.keys(data[1]);

    data.forEach(function(d){
        var nearestIndex = -1;
        var dist = Infinity;    
        centroids.forEach(function(c,i){
            var nearestDist = Math.sqrt(euclideanSum(c, d,dim));
            if(nearestDist < dist){
                dist = nearestDist;
                nearestIndex = i;
            }
        });
        d.assignments = nearestIndex;
    });

}

function euclideanSum(a, b, dim) {    

    var euclideanDistance = 0;
    for(let i = 0; i < dim.length; i++){
        //euclideanDistance = Math.pow((a.A - b.A),2) + Math.pow((a.B - b.B),2) + Math.pow((a.C - b.C),2);   
        euclideanDistance += Math.pow(a[dim[i]] - b[dim[i]],2);
    }
    return euclideanDistance;    
}

function calculateAverage(data, centroid, n){   
    var averageA,averageB,averageC,amount;
    var cluster = [];
    for(let i = 0; i<n; i++){
        averageA = 0;
        averageB = 0;
        averageC = 0;
        amount = 0; 
        data.forEach(function(d){
            if(d.assignments == i){
                averageA += d.A;
                averageB += d.B;
                averageC += d.C;
                amount += 1;
            }
        });
        averageA = averageA/amount;
        averageB = averageB/amount;
        averageC = averageC/amount;
        cluster.push({
            'A': averageA,
            'B': averageB,
            'C': averageC
        });   
    }

    return cluster;    

}

function checkQuality(data,average,n){
    
    var quality;
    var qualityArray = [];

    for(let i = 0; i<n; i++){
        quality = 0;
        data.forEach(function(d){
            if(d.assignments == i){
                quality += Math.pow(d.A - average[i].A,2) + Math.pow(d.B - average[i].B,2) + Math.pow(d.C - average[i].C,2); 
            }
        })          
        qualityArray[i] = quality;
    }

    return qualityArray;

}


function kmeans(data, k) {

    var quality = [Infinity, Infinity];

    /* STEP 1
    Randomly place K points into the space represented by the items that 
    are being clustered. These points represent the initial cluster centroids.
    */
    var centroids = calculateRandomCentroids(data, k);

    /* STEP 2
    Assign each item to the cluster that has the closest centroid, using the 
    Euclidean distance.
    */
    var count = 0;
    while(quality[0] > 0.05 || quality[1] > 0.05){
        
        count++;

        assignCluster(data, centroids);

        /* STEP 3
        When all objects have been assigned, recalculate the positions of the K 
        centroids to be in the centre of the cluster. (Averaging values in all dimensions)
        */
        centroids = calculateAverage(data, centroids, k);

        /* STEP 4
        Check the quality of the cluster using the sum of the squared distances 
        within each cluster.
        */
        quality = checkQuality(data, centroids, k);
        console.log(quality);
        
    }
    console.log(count);
    return data;
};


