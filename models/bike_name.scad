
bike_size = 5;
//bike_height= 0.6267*bike_size*10;
bike_depth = 0.05 * bike_size* 10 +1.5;

echo(bike_depth);
//bike_file = str("bike",bike_size,".svg");
//font_size=5+(bike_size-3)*2;
t = "Timo";
scl = bike_size/5;
scale([scl,scl,1]) {
    color("darkcyan")
    linear_extrude(height=bike_depth) 
        import(file="bike5.svg",center=true,dpi=300);
    color("white")
    translate([0,0,bike_depth])
    linear_extrude(height=0.6)  
    translate([0,-28.4/2-9*0.8,0]) 
        text(t,halign="center",font="Poppins:style=ExtraBold",size=9);
    
    color("darkcyan") 
    linear_extrude(bike_depth) 
    offset(2) 
    fill() 
    translate([0,-28.4/2-9*0.8,0]) 
        text(t,halign="center",font="Poppins:style=ExtraBold",size=9);     
}
