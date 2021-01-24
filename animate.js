function setup() {
    createCanvas(800, 800);
    background(0,0,0);
}
  
function draw() {
    for(var i = 0; i < 15; i++){
        for(var j = 0; j < 15; j++){
            square((j*50)+25, (i*50)+25, 50);
        }
    }   
}

function add_sources(){
    var arr = new Array(15);
    for(var i = 0; i < 15; i++){
        arr[i] = new Array(15);
        if(i == 13){
            arr[i][7] = 1;
        }
    }
}