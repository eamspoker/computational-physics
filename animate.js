var N = 14;
var arr_global = Array(16).fill().map(() => Array(16).fill(0));
var u_global = Array(16).fill().map(() => Array(16).fill(0));
var v_global = Array(16).fill().map(() => Array(16).fill(0));
var fans = Array(16).fill().map(() => Array(16).fill(0));
var fans_u = Array(16).fill().map(() => Array(16).fill(0));
var fans_v = Array(16).fill().map(() => Array(16).fill(0));
var fan1 = document.getElementById("fan1");
var button1 = document.getElementById("start");
var canvas = document.getElementById("canvas");

var fan1_u = document.getElementById("fan1_u");
var fan1_v = document.getElementById("fan1_v");

var fan2_u = document.getElementById("fan2_u");
var fan2_v = document.getElementById("fan2_v");

const vel_div1 = document.getElementById("vel1");
const vel_div2 = document.getElementById("vel2");

var show = false;


fan1.addEventListener("click", function(){
    if (fan1.checked == true){
        vel_div1.style.opacity = 1;
      } else {
        vel_div1.style.opacity = 0;
      }
});

fan2.addEventListener("click", function(){
    if (fan2.checked == true){
        vel_div2.style.opacity = 1;
      } else {
        vel_div2.style.opacity = 0;
      }
});




button1.addEventListener("click", function(e){
    var vel2_u = fan2_u.value;
    var vel2_v = fan2_v.value;
    show = true;
    canvas.style.display = "inline";
    if(fan1.checked == true){
        fans[7][13] = 1;
        fans_v[7][13] = fan1_v.value*-1;
        fans_u[7][13] = 20;
    }
    
    if(fan2.checked == true){
        fans[13][2] = 1;
        fans_v[13][2] = -30;
        fans_u[13][2] = -30;
    }
    

});
for(var k = 1; k < N+1; k++){
    v_global[7][k] = -.07;
}
var fan = -20;
let dt = .001;

    for(var k = 1; k < N+1; k++){
        u_global[k][1] = -.07;
    }

function setup() {
    createCanvas(800, 1000);
    background(0,0,0);
}

let counter = 0;
function draw() {
    if(show){
    

        clear();

    textSize(32);
    fill(0, 102, 153);
    text('# of iterations: ' + counter, 10, 900);
    counter += 1;

    update_sources(arr_global[7][7]);

    vel_step(u_global, v_global, N);


    diffuse(arr_global, false, false);
    

    advect(arr_global, u_global, v_global, false, false);

    

    for(var i = 0; i < 16; i++){
        for(var j = 0; j < 16; j++){
            squareColor = color(100, 50, 100);
            squareColor.setAlpha(arr_global[i][j]);
            //stroke(255,255,255);
            fill(squareColor);
            let v0 = createVector(((i*50)+25), ((j*50)+25));
            let v1 = createVector(u_global[i][j], v_global[i][j]);
            let unit = createVector((u_global[i][j])/(v1.mag()),(v_global[i][j])/(v1.mag()))
            if(v1.mag() > .0000001){
            
                drawArrow(v0, unit, 'blue');
            }

            if(fans[i][j] == 1){
                stroke(255,0,0);
                circle((i*50)+50, (j*50)+50,30)
            }
            stroke(0,0,0);
            
            square((i*50)+25, (j*50)+25, 50);
            
        }
    }

    // for(var i = 0; i < 100000000; i++){
    //     var j = Math.pow(i, .5);
    // }



}
       
}

function update_sources(currDens){
    for(var i = 6; i < 9; i++){
        arr_global[i][7] = currDens + 10;
    }
    
}

function diffuse(arr, isU, isV){
    let arr0 = [...arr];
    let diff = .00001;
    if(isU || isV){
        diff = .01;
    }
    let a = diff*N*N*dt;
    for(var k = 0; k < 20; k++){
        for(var i = 1; i < 14; i++){
            for(var j = 1; j < 14; j++){
                if(fans[i][j] == 1){
                    if(isV && fans_v[i][j] != 0){
                        arr[i][j] = fans_v[i][j];
                    }
                    if(isU && fans_u[i][j] != 0){
                        arr[i][j] = fans_u[i][j];
                    }
                } else{
                arr[i][j] = (arr0[i][j] + a*(arr[i-1][j]+arr[i+1][j]+
                arr[i][j-1]+arr[i][j+1]))/(1+4*a);
                }
            }
        }
    }


    

    // if(isU){
    //     u_global = [...arr];
    //     set_bnd(N, 1, arr);
    // } else if(isV){
    //     v_global = [...arr];
    //     set_bnd(N, 2, arr);
    // } else{
    //     arr_global = [...arr];
    // }

    
}

function advect(arr, u, v, isU, isV){
    
    let arr0 = [...arr];
    let dt0 = dt*N;
    for(var i = 1; i < 13; i++){
        for(var j = 1; j < 13; j++){
            var x = i-dt0*u[i][j];
            var y = j-dt0*v[i][j];
           
            

            if(x<0.5){
                x = 0.5;
            } else if (x>N+.05){
                x = N + 0.5;
            }

            if(y<0.5){
                y = 0.5;
            } else if (y>N+.05){
                y = N + 0.5;
            }

            var i0= Math.trunc(x); 
            var i1= i0 + 1;
            var j0= Math.trunc(y); 
            var j1= j0 + 1;

            var s1 = x-i0; 
            var s0 = 1-s1; 
            var t1 = y-j0; 
            var t0 = 1-t1;

            if(i0 >= 13 || j0 >= 13){
                break;
            } else{
               
                if(fans[i][j] == 1){
                    if(isV && fans_v[i][j] != 0){
                        arr[i][j] = fans_v[i][j];
                    }
                    if(isU && fans_u[i][j] != 0){
                        arr[i][j] = fans_u[i][j];
                        // console.log(fans_u[i][j]);
                    }
                } else{
                arr[i][j] = s0*(
                    t0*arr0[i0][j0]+
                    t1*arr[i0][j1])+ s1*(t0*arr0[i1][j0]+
                    t1*arr0[i1][j1]);
                }
            }
        }
    }
 

    // if(isU){
    //     u_global = [...arr];
    //     set_bnd(N, 1, arr);
    // } else if(isV){
    //     v_global = [...arr];
    //     set_bnd(N, 2, arr);
    // } else{
    //     arr_global = [...arr];
    // }

   

    
}

function vel_step(u, v, N){
    diffuse(u, true, false);
    diffuse(v, false, true);

    project(u,v);
    
    advect(u, u, v_global, true, false);
    advect(u, u, v, false, true);
    project(u,v);

}

function project(u, v){
    let h = 1.0/N;
    var div = Array(16).fill().map(() => Array(16).fill(0));
    var p = Array(16).fill().map(() => Array(16).fill(0));
    for(var i = 1; i <= N; i++){
        for(j=1; j <=N; j++){
            div[i][j] = -0.5*(h)*(u[i+1][j]-u[i-1][j]+v[i][j+1]-v[i][j-1]);

        }
    }
    for(var k = 0; k <20; k++){
        for(var i = 1; i <= N; i++){
            for(j=1; j <=N; j++){
                p[i][j] = (div[i][j]+p[i-1][j]+p[i+1][j]+p[i][j-1]+p[i][j+1])/4;

            }
        }
    }
    for(var i = 1; i <= N; i++){
        for(j=1; j <=N; j++){
           u[i][j] -= 0.5*(p[i+1][j]-p[i-1][j])/h;
        if(fans[i][j] == 1){
            if(fans_v[i][j]!= 0){
                v[i][j] = fans_v[i][j];
            }
            if(fans_u[i][j]!= 0){
                u[i][j] = fans_u[i][j];
            }
        } else{
           v[i][j] -= 0.5*(p[i][j+1]-p[i][j-1])/h;
        }

        }
    }

    u_global = [...u];
    v_global = [...v];
    
    

}

function set_bnd(N, b, arr, isU=false, isV=false){
    for(var i = 2; i < N; i++){
            arr[0][i] = arr[1][i];
            arr[N+1][i] = b==1 ? -arr[N][i] : arr[N][i];
            arr[i][0] = b==2 ? -arr[i][1] : arr[i][1];
            arr[i][N+1] = b==2 ? -arr[i][N] : arr[i][N];


    }
    arr[1][1] = 0.5*(arr[0][0]*arr[0][1]);
    arr[1][N] = 0.5*(arr[1][N+1]*arr[0][N]);
    arr[N][1] = 0.5*(arr[N][0]*arr[N+1][1]);
    arr[N][N] = 0.5*(arr[N][N+1]*arr[N+1][N]);

    // if(isU){
    //     u_global = [...arr];
    // } else if(isV){
    //     v_global = [...arr];
    // } else{
    //     arr_global = [...arr];
    // }
}

function drawArrow(base, vec, myColor) {
    push();
    stroke(myColor);
    strokeWeight(3);
    fill(myColor);
    translate(base.x, base.y);
    line(0, 0, vec.x, vec.y);
    rotate(vec.heading());
    let arrowSize = 7;
    translate(vec.mag() - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
  }