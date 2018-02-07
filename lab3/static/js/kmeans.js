/**
* k means algorithm
* @param data
* @param k
* @return {Object}
*/

function calculateRandomCentroids(data, k){
    /* 
     * Randomly place K points into the space represented by the items that 
     * are being clustered. These points represent the initial cluster centroids.
     */
        var centroids = [];
        
        for(let i = 0; i < k; i++){
            var randomObject = Math.floor(Math.random() * data.length);
            centroids.push(data[randomObject]);
        }
    
        return centroids;
    
    }
    
    function assignCluster(data, centroids){
    /*
     * Assign each item to the cluster that has the closest centroid, using the 
     * Euclidean distance.
     */
        data.forEach(function(d){
            var nearestIndex = -1;
            var dist = Infinity;    
            centroids.forEach(function(c,i){
                var nearestDist = Math.sqrt(euclideanSum(c, d));
                if(nearestDist < dist){
                    dist = nearestDist;
                    nearestIndex = i;
                }
            });
            d.assignments = nearestIndex;
        });
    
    }
    
    function euclideanSum(a, b) {    
    /*
     * Calculate Euclidean distance between 2 points
     * in the data space
     */
        return ( Math.pow(a.depth - b.depth,2) + Math.pow(a.mag - b.mag, 2) );  
    }
    
    function calculateAverage(data, n){  
    /* 
     * When all objects have been assigned, recalculate the positions of the K 
     * centroids to be in the centre of the cluster. (Averaging values in all dimensions)
     */
        
        var averageDepth, averageMag, amount, cluster = [];

        for(let i = 0; i<n; i++){

            averageDepth = 0;
            averageMag = 0;
            amount = 0; 

            data.forEach(function(d){
                if(d.assignments == i){
                    averageDepth += d.depth;
                    averageMag += d.mag;
                    amount++;
                }
            });
            averageDepth = averageDepth/amount;
            averageMag /= amount;
            //console.log(averageDepth)

            cluster.push({
                'depth': averageDepth,
                'mag': averageMag
            });   
        }
           
        return cluster;    
    
    }
    
    function checkQuality(data, average, n){
    /*  
     * Check the quality of the cluster using the sum of the squared distances 
     * within each cluster.
     */
            
        var quality;
        var qualityArray = [];
    
        for(let i = 0; i < n; i++){
            quality = 0;
            data.forEach(function(d){
                if(d.assignments == i)
                    quality += euclideanSum(d, average[i]);
            }) 
            
            qualityArray[i] = quality;
        }
    
        return qualityArray;
    
    }
    
    function getSum(total, num) {
        return total + num;
    }

    function parseData(data){
        var parsedData = [];

        data.forEach(function(d){
            parsedData.push({
                "depth": +d.depth,
                "mag": +d.mag
            });
        })

        return parsedData;
    }
    
    function kmeans(data, k) {
    
        var quality = [],
            totQuality = 0,
            oldQuality,
            iterations = 0;

        data = parseData(data);
        
        var centroids = calculateRandomCentroids(data, k);
           
        // Iterate while the the cluster centroids change more than a set threshold value
        do {
            oldQuality = totQuality;
    
            assignCluster(data, centroids);
            centroids = calculateAverage(data, k);
            quality = checkQuality(data, centroids, k);
            iterations++;
            
            //Get sum of quality vector
            totQuality = quality.reduce(getSum);
            
            
        } while(Math.abs(totQuality - oldQuality) > 0.001)
            
        console.log('Algorithm stopped after ' + iterations + ' iterations');
       
        return data;
    };
    
    
    