//helper functions

//MEHTODS TO PROCESS DATA FROM CatalogAPI.getCategories();

//takes object type and stat name from the array of arrays
function concatStatString(obj_type,stat_name){
  var string;
  string = 'extrahop' + '.' + obj_type + '.' + stat_name;
  return string;
}
//processes the response from CatalogAPI.getCategories()

function processCategoriesByRes(arrayOfArrays){
  var categories = {};
  var len = arrayOfArrays.length;
  var i;
  for(i = 0; i < len; i++){
    //safes categories by id num
    categories[arrayOfArrays[i][0]] = processRecord(arr[i]);
    //safes categories by stat string ('extrahop.obj_type.stat_name')
    categories[concatStatString(arrayOfArrays[i][1],arrayOfArrays[i][2])] = processRecord(arr[i]);
  }
  return categories;
} 

//processRecord to pass into processCategoriesByRes
//takes an array and re-formats into an object

function processRecord(arr){
  return {
    id: arr[0],
    object_type: arr[1],
    stat_name: arr[2],
    display_name: arr[3]
  }
};

//METHODS TO PROCESS DATA FOM CatalogAPI.getMetrics()

function processCategoriesMetrics(arrOfArr){
  var categories = {};
  var len = arrOfArr.length;
  var i;
  for(i = 0; i < len; i ++){
    //save categories by id
    categories[arrOfArr[i][0]] = processRecordM(arrOfArr[i]);
  }
}

//formats the data returnred from CatalogAPI()
function processRecordM(arr){
  return {
    id: arr[0],
    category_id: arr[1],
    field_name: arr[2],
    display_name: arr[3]
  }
}

//helper function to slice fieldname out 
function subString(statString) {
  var string;
  string = statString.substring(0, statString.indexOf(':'));
  return string; 
}

//helper function to find category in CatalogAPI.getCategories
//grab the id and plug it into getMetricById
function helper(statString){
  var string = subString(statString);
  var category = Catalog.getCategoryByStatString(string);
  var id = category.id;
  return Catalog.getMetricById(id);
}


var CatalogAPI = function(){
  //returns a promise
  return new Promise(function(resolve){
  })
  this.getCategories= function(){
    return new Promise(function(resolve,){
      console.log("sending a req to get data")
      resolve(data)        
    })  
  },
  this.getMetrics= function(){
    return new Promise(function(resolve){
      console.log("sending a req to get data")
      resolve(data)
    })
  } 
  
}



var Catalog = function() {
  
  this.initialize = function(){
    var responseCategories;
    var responseMetrics;

    if (responseCategories === undefined && responseMetrics === undefined){
      return new Promise(function(resolve){
        
          //calls Catalog API function  
         responseCategories = CatalogAPI.getCategories(); 
         //returns an arrayOfArrays
         responseMetrics = CatalogAPI.getMetrics();  
         //if we get data back then process the data

        if(responseCategories && responseMetrics){
          resolve(responseCategories).then(
            processCategoriesByRes(responseCategories);  
            ).then(
            processCategoriesMetrics(responseMetrics);  
            )  
        }
      })
    } else {
      return {
        responseCategories: responseCategories,
        responseMetrics: responseMetrics
      }
    }
  }, 
  this.getCategoryById = function(id){
    //returns Category obj (id, object_type, stat_name, display_name)
    return categories[id]
  },
  this.getCategoryByStatString =  function(statString){
    //"extrahop.%s.%s" - > object_type and stat_name
    return categories[statString]
  },
  this.getMetricById = function(id){
    return metricCategories[id]
  },
  this.getMetricByStatString = function(statString){
    //statString = extrahop.device.dns:req
    //object_type, stat_name, field_name
    return metricCategories[helper(statString)]
  }
};

