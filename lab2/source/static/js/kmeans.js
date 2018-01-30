/**
* k means algorithm
* @param data
* @param k
* @return {Object}
*/

function calculateRandomCentroids(data, k, dim){
/* 
 * Randomly place K points into the space represented by the items that 
 * are being clustered. These points represent the initial cluster centroids.
 */
    var centroids = [];
	
	if(dim.length == 3){
		//Maximum data values for 3 dimensions
		const maxA = Math.max.apply(Math, data.map(o => o.A)),
			  minA = Math.min.apply(Math, data.map(o => o.A)),
			  maxB = Math.max.apply(Math, data.map(o => o.B)),
			  minB = Math.min.apply(Math, data.map(o => o.B)),
			  maxC = Math.max.apply(Math, data.map(o => o.C)),
			  minC = Math.min.apply(Math, data.map(o => o.C));

		//Calculating K random centroids in data space
		for(let i = 0; i < k; i++) {
			centroids.push({
				'A': Math.random() * (maxA - minA) + minA,
				'B': Math.random() * (maxB - minB) + minB,
				'C': Math.random() * (maxC - minC) + minC
			});      
		}
	} else {
		//Maximum data values for 5 dimensions
		const maxA = Math.max.apply(Math, data.map(o => o.A)),
			  minA = Math.min.apply(Math, data.map(o => o.A)),
			  maxB = Math.max.apply(Math, data.map(o => o.B)),
			  minB = Math.min.apply(Math, data.map(o => o.B)),
			  maxC = Math.max.apply(Math, data.map(o => o.C)),
			  minC = Math.min.apply(Math, data.map(o => o.C));
			  maxD = Math.max.apply(Math, data.map(o => o.D)),
			  minD = Math.min.apply(Math, data.map(o => o.D));
			  maxE = Math.max.apply(Math, data.map(o => o.E)),
			  minE = Math.min.apply(Math, data.map(o => o.E));


		//Calculating K random centroids in data space
		for(let i = 0; i < k; i++) {
			centroids.push({
				'A': Math.random() * (maxA - minA) + minA,
				'B': Math.random() * (maxB - minB) + minB,
				'C': Math.random() * (maxC - minC) + minC,
				'D': Math.random() * (maxD - minD) + minD,
				'E': Math.random() * (maxE - minE) + minE

			});      
		}
	}

    return centroids;

}

function assignCluster(data, centroids,dim){
/*
 * Assign each item to the cluster that has the closest centroid, using the 
 * Euclidean distance.
 */
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
/*
 * Calculate Euclidean distance between 2 points
 * in the data space
 */
    var euclideanDistance = 0;
    for(let i = 0; i < dim.length; i++){
        euclideanDistance += Math.pow(a[dim[i]] - b[dim[i]],2);
    }
    return euclideanDistance;    
}

function calculateAverage(data, centroid, n, dim){  
/* 
 * When all objects have been assigned, recalculate the positions of the K 
 * centroids to be in the centre of the cluster. (Averaging values in all dimensions)
 */

	//Data set 1 or 2
    if(dim.length == 3){

		var averageA, averageB, averageC, amount, cluster = [];

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
	} else { //Data set 3
		var averageA, averageB, averageC, averageD, averageE, amount;
		var cluster = [];
		for(let i = 0; i < n; i++ ){
			averageA = 0;
			averageB = 0;
			averageC = 0;
			averageD = 0;
			averageE = 0;
			amount = 0; 
			data.forEach(function(d){
				if(d.assignments == i){
					averageA += d.A;
					averageB += d.B;
					averageC += d.C;
					averageD += d.D;
					averageE += d.E;
					amount += 1;
				}
			});
			averageA = averageA/amount;
			averageB = averageB/amount;
			averageC = averageC/amount;
			averageD = averageD/amount;
			averageE = averageE/amount;
			cluster.push({
				'A': averageA,
				'B': averageB,
				'C': averageC,
				'D': averageD,
				'E': averageE
			});   
		}
	}
	
    return cluster;    

}

function checkQuality(data,average,n,dim){
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
				quality += euclideanSum(d, average[i], dim);
        }) 
		
        qualityArray[i] = quality;
    }

    return qualityArray;

}

function getSum(total, num) {
    return total + num;
}

function kmeans(data, k) {

    var quality = [],
		totQuality = 0,
		dim = Object.keys(data[1]),
		oldQuality,
		iterations = 0;
	
    var centroids = calculateRandomCentroids(data, k, dim);
	   
	// Iterate while the the cluster centroids change more than a set threshold value
    do {
		oldQuality = totQuality;

        assignCluster(data, centroids, dim);
		centroids = calculateAverage(data, centroids, k, dim);
		quality = checkQuality(data, centroids, k, dim);
		
		iterations++;
		
		//Get sum of quality vector
		totQuality = quality.reduce(getSum);
		
	} while(Math.abs(totQuality - oldQuality) > 0.001)
        
	console.log('Algorithm stopped after ' + iterations + ' iterations');
   
    return data;
};


