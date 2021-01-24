let arr = Array(15).fill().map(() => Array(15).fill(0));
let dt = 0;
function setup() {
    createCanvas(800, 800);
    background(0,0,0);
}
  
function draw() {
    clear();

    update_sources(arr[7][7]);
    //diffuse(); 

    for(var i = 0; i < 15; i++){
        for(var j = 0; j < 15; j++){
            squareColor = color(100, 50, 100);
            squareColor.setAlpha(arr[i][j]);
            fill(squareColor);
            square((j*50)+25, (i*50)+25, 50);
        }
    }   
}

function update_sources(currDens){
    arr[7][7] = currDens + .3;
}

function diffuse(){
    let arr0 = [...arr];
    let diff = .1;
    let a = diff*15*15;
    for(var k = 0; k < 20; k++){
        for(var i = 1; i < 15; i++){
            for(var j = 1; j < 15; j++){
                arr[i][j] = (arr0[i,j] + a*(arr[i-1,j]+arr[i+1,j]+
                arr[i,j-1]+arr[i,j+1]))/(1+4*a);
            }
        }
    }
    console.log(arr);
}

