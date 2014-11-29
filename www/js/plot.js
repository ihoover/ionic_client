

function plot(canvas, x, y){
  /*
   * Canvas: a canvas DOM element
   * x,y: X.data a numeric array
   *      X.string function for how to draw a data point (eg units etc)
   */

  var x_label_height = 35;
  var y_label_width = 50;
  
  var origin = {
    x: y_label_width,
    y: canvas.height - x_label_height
  };
  
  var plot_size = {
    x: canvas.width - y_label_width,
    y: canvas.height - x_label_height
  };
  
  // determine ranges
  var x_accuracy = compute_accuracy(x.data);
  var y_accuracy = compute_accuracy(y.data);
  
  // determine endpoints
  var x_range = compute_range(x_accuracy, x.data);
  var y_range = compute_range(y_accuracy, y.data);
    
  // determine scales (conversion from units of x and y to pixels)
  var x_scale = compute_scale(plot_size.x, x_range);
  var y_scale = compute_scale(plot_size.y, y_range);
  
  // draw axes
  draw_axes(canvas, y_label_width, x_label_height);
  
  // draw and label tickmarks along each axis
  draw_ticks(canvas, origin, plot_size,
             x_range, x_scale,
             y_range, y_scale, x, y);
  
  // now do the actual plotting woo!
  var ctx = canvas.getContext('2d');
  ctx.strokeStyle = '#000000';
  
  var x_pixel = -1;
  var y_pixel = -1;
  var old_x = -1;
  var old_y = -1;
  for( var i = 0; i < x.data.length; i++){
    // remember lsat point
    old_x = x_pixel;
    old_y = y_pixel;
    
    x_pixel = origin.x + (x.data[i] - x_range[0])*x_scale;
    y_pixel = origin.y - (y.data[i] - y_range[0])*y_scale;
    // draw line from last point if there was a last point
    if(old_x > 0){
      draw_line(ctx, [old_x, old_y], [x_pixel, y_pixel]);
    }
    
    // draw a circle around it
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.arc(x_pixel, y_pixel, 2, 0, Math.PI*2);
    ctx.stroke();
  }
}

function compute_accuracy(data){
  // how far apart to put markers on the plot
  
  // how the resolution scales with the number of digits (lowe = higher resolution)
  var res = 5;
  
  var max_value = Math.max.apply(null, data);
  var min_value = Math.min.apply(null, data);
  var digits = Math.ceil(Math.log(max_value - min_value)/Math.log(10));
  
  // the accuracy should scale with the number of digits
  var accuracy = 1;
  if(digits != 1)
    accuracy = res*Math.pow(10,Math.ceil(digits - 2));
  else
    accuracy = 1;
  
  return accuracy;
}

function compute_range(accuracy, data){
  // finds endpoints that are nearest multiples of the accuracy
  
  var end_data = Math.max.apply(null, data);
  var first_data = Math.min.apply(null, data);
  
  var end_point = end_data + mod(-end_data, accuracy);
  var first_point = first_data - mod(first_data, accuracy);
  
  return [first_point, end_point];
}

function compute_scale(pixels, range){
  return Math.abs(pixels/(range[1] - range[0]))
}

function draw_axes(canvas, x_offset, y_offset){
  var ctx = canvas.getContext("2d");
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#555555';
  
  //draw x_axis  
  draw_line(ctx,
            [x_offset, canvas.height - y_offset],
            [canvas.width, canvas.height - y_offset]);
  
  // draw y-axis
  draw_line(ctx,
            [x_offset, canvas.height - y_offset + ctx.lineWidth/2],
            [x_offset, 0]);
}

function draw_ticks(canvas, origin, plot_size,
                    x_range, x_scale,
                    y_range, y_scale, x, y){
  
  var ctx = canvas.getContext("2d");
  var num_ticks = 20;
  var label_freq = 5; //label 1 in every 
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#555555';
  
  // set font size
  ctx.font = "17px Helvetica";
  
  //draw x-ticks
  var tick_length = 8;
  var begin = [];
  var end = [];
  var x_pixel = 0;
  for(var i = 0; i <= num_ticks; i++){
    
    // copmute the x value
    x_pixel = origin.x + i*plot_size.x/num_ticks;
    
    // draw label (and make stroke bigger) if appropriate
    if(mod(i,label_freq) == 0){
      ctx.lineWidth = 4;
      
      //draw label
      var value = (x_pixel - origin.x)/x_scale;
      value = x.string(value);
      ctx.fillText(value, x_pixel, canvas.height - 5);
    }
    else
      ctx.lineWidth = 2;
    
    begin = [x_pixel, origin.y];
    end = [x_pixel, origin.y + tick_length];
    draw_line(ctx, begin, end);
    
  }
  
  //draw y-ticks
  var y_pixel = 0;
  num_ticks = 12;
  label_freq = 4;
  for(var i = 0; i <= num_ticks; i++){
    
    // copmute the x value
    y_pixel = origin.y - i*plot_size.y/num_ticks;
    
    // draw label (and make stroke bigger) if appropriate
    if(mod(i,label_freq) == 0){
      ctx.lineWidth = 4;
      
      //draw label
      var value = ( -y_pixel + origin.y)/y_scale + y_range[0];
      value = y.string(value);
      ctx.fillText(value, 0, y_pixel);
    }
    else
      ctx.lineWidth = 2;
    
    begin = [origin.x, y_pixel];
    end = [origin.x - tick_length, y_pixel];
    draw_line(ctx, begin, end);
  }
}

function draw_line(ctx, begin, end){
  // just a small utility to reduce typing
  ctx.beginPath();
  ctx.moveTo(begin[0], begin[1]);
  ctx.lineTo(end[0], end[1]);
  ctx.stroke();
}

function mod(x,y){
  // computes x%y the way it should be, because javascript be dumb
  var rem = x % y;
  if (rem < 0){
    rem = y + rem;
  }
  return rem;
}

function range(start, edge, step) {
  // Credit of Chris West: http://cwestblog.com/2013/12/16/javascript-range-array-function/
  // If only one number was passed in make it the edge and 0 the start.
  if (arguments.length == 1) {
    edge = start;
    start = 0;
  }
 
  // Validate the edge and step numbers.
  edge = edge || 0;
  step = step || 1;
 
  // Create the array of numbers, stopping befor the edge.
  for (var ret = []; (edge - start) * step > 0; start += step) {
    ret.push(start);
  }
  return ret;
}
