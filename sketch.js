var deck = [];
var table = [];
var selected = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  for(var shape = 0; shape < 3; shape++) {
    for(var number = 0; number < 3; number++) {
      for(var color = 0; color < 3; color++) {
        for(var pattern = 0; pattern < 3; pattern++) {
          deck.push(new Card(shape, number, color, pattern));
        }
      }
    }
  }

  dealMore(9);
}

function draw() {
  background(255);
  for(var i = 0; i < table.length; i++) {
    var y = height/7+i%3*(table[i].h*1.3);
    var x = height/7+floor(i/3)*(table[i].w*1.3);
    table[i].display(x, y);
  }
}

function mousePressed() {
  for(i in table) {
    if(table[i].isInside(mouseX, mouseY)) {
      if(!table[i].selected) {
        selected.push(i);
        table[i].selected = true;
      } else {
        table[i].selected = false;
        for(j in selected) {
          if(selected[j] == i) {
            selected.splice(j, 1);
          }
        }
      }
    }
  }
  if(selected.length == 3) {
    if(checkSet()) {
      console.log("SET");
      replace();
    } else {
      console.log("WRONG");
      unselect();
    }
  }
}

function replace() {
  var temp = []
  for(var i = 0; i < 3; i++) {
    if(deck.length > 0) {
      var rand = floor(random(deck.length));
      temp.push(deck[rand]);
      deck.splice(rand, 1);
    }
  }
  for(i in selected) {
    table[selected[i]] = temp[i];
  }
  selected = [];
}

function dealMore(num) {
  for(var i = 0; i < num; i++) {
    if(deck.length > 0) {
      var rand = floor(random(deck.length));
      table.push(deck[rand]);
      deck.splice(rand, 1);
    }
  }
}

function unselect() {
  for(i in selected)
    table[selected[i]].selected = false;
  selected = [];
}

function keyPressed() {
  if(key == ' ') {
    dealMore(3);
  }
}

function checkSet() {
  var a = table[selected[0]];
  var b = table[selected[1]];
  var c = table[selected[2]];
  var isSet = true;
  if(!(a.number == b.number && b.number == c.number || a.number + b.number + c.number == 3)) {
    isSet = false;
    console.log("Number issue");
  }
  if(!(a.shape == b.shape && b.shape == c.shape || a.shape + b.shape + c.shape == 3)) {
    isSet = false;
    console.log("shape issue");
  }
  if(!(a.pattern == b.pattern && b.pattern == c.pattern || a.pattern + b.pattern + c.pattern == 3)) {
    isSet = false;
    console.log("pattern issue");
  }
  if(!(a.color == b.color && b.color == c.color || a.color + b.color + c.color == 3)) {
    isSet = false;
    console.log("color issue");
  }
  return isSet;
}

function Card(shape, number, color, pattern) {
  this.shape = shape,       //0=oval, 1=diamond, 2=zigzag
  this.number = number,     //0=1, 1=2, 2=3
  this.color = color,       //0=red, 1=green, 2=purple
  this.pattern = pattern,   //0=solid, 1=empty, 2=stripe
  this.x = 0,
  this.y = 0,
  this.h = height/5,
  this.w = this.h*5/7,
  this.selected = false,
  this.display = function(x, y) {
    this.x = x;
    this.y = y;
    stroke(0);
    if(this.selected)
      fill(240);
    else
      fill(255);
    strokeWeight(1);
    rectMode(CORNER);
    rect(x, y, this.w, this.h, this.w/7);

    setColor(this.color); 

    //Set no fill if it's supposed to be empty
    if(this.pattern == 1) {
      noFill();
    }

    //Draw the shapes
    drawShapes(this.number, this.shape, x, y, this.w, this.h);

    //Draw the stripes
    if(this.pattern == 2)
    {
      if(this.selected)
        stroke(240);
      else
        stroke(255);
      strokeWeight(3);
      var o = 15;
      var xpos = x + o;
      while(xpos < x + this.w - o){
        line(xpos, y + o, xpos, y + this.h - o);
        xpos += 6;
      } 
      //Draw the shapes
      setColor(this.color);
      noFill();
      drawShapes(this.number, this.shape, x, y, this.w, this.h);
    }
  },
  this.isInside = function(x, y) {
    if(x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h)
      return true;
    return false;
  }
}

function drawShapes(number, shape, x, y, w, h) {
  rectMode(CENTER);
  for(var i = 0; i <= number; i++) {
    if(shape == 0) {
      rect(x+w/2, y+h/2 - number*h/8 + i*h/4, w/2, h/6, h/6);
    } else if(shape == 1) {
      quad(x+w/2, y+h/2 - number*h/8 + i*h/4 - h/12, x+w/2 + h/6, y+h/2 - number*h/8 + i*h/4, x+w/2, y+h/2 - number*h/8 + i*h/4 + h/12, x+w/2 - h/6, y+h/2 - number*h/8 + i*h/4);
    } else if(shape == 2) {
      beginShape();
        for(j = 0; j <= 7; j++) {
          vertex(x+w/2 - w/4 + j*w/14, y+h/2 - number*h/8 + i*h/4 - (j%2+1)*h/24);
        }
        for(j = 7; j >= 0; j--) {
          vertex(x+w/2 - w/4 + j*w/14, y+h/2 - number*h/8 + i*h/4 + ((j+1)%2+1)*h/24);
        }
      endShape(CLOSE);
    }
  }
}

function setColor(color) {
  //Set the color of the shapes
  strokeWeight(3);
  if(color == 0) {
    fill(250, 0, 0);
    stroke(250, 0, 0);
  } else if (color == 1) {
    fill(0, 200, 0);
    stroke(0, 200, 0);
  } else if (color == 2) {
    fill(167, 66, 244);
    stroke(167, 66, 244);
  }
}