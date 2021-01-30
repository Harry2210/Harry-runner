var PLAY = 1;
var END = 0;
var gameState = PLAY;

var hero, hero_running,hero_collided;
var ground, invisibleGround, groundImage;
var BG

var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  hero_running =   loadAnimation("Run (1).png","Run (2).png","Run (3).png","Run (4).png","Run (5).png","Run (6).png","Run (7).png","Run (8).png","Run (9).png","Run (10).png");
  hero_collided= loadAnimation("Dead.png")
  
  groundImage = loadImage("ground2.png");
  
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  bgi=loadImage("BG.png");

  jumpsound=loadSound("jump.wav");
  diesound=loadSound("die.flac");
}

function setup() {
  createCanvas(1365, 580);
   BG =createSprite(200,200);
  BG.addImage("BG",bgi);
  BG.x = BG.width /2;
  BG.velocityX = -2 
  
  harry = createSprite(50,320,20,50);
  
  harry.addAnimation("running", hero_running);
  harry.addAnimation("collided",hero_collided);
  harry.scale = 0.15;
  
  ground = createSprite(200,574,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);

  
  
  gameOver = createSprite(650,160);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(650,380);
  restart.addImage(restartImg);
  
  gameOver.scale = 1;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,580,400,10);
  invisibleGround.visible = false;
  
  obstaclesGroup = new Group();
  score=0
  
}

function draw() {
  background("black");
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && harry.y >= 520) {
      harry.velocityY = -30;
      jumpsound.play();
    }
  
    harry.velocityY = harry.velocityY + 2
  
    if (ground.x < 200){
      ground.x = ground.width/2;
    }
    if (BG.x<300){
      BG.x=BG.width/2;
    }
  
    harry.collide(invisibleGround);
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(harry)){
        gameState = END;
        diesound.play();
    }
  }
  
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    harry.changeAnimation("collided",hero_collided);
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    harry.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0); 
    BG.velocityX=0;
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
  text("Score: "+ score, 1200,20);
  
}




function spawnObstacles() {
  if(frameCount % 100 === 0) {
    var obstacle = createSprite(1400,560,10,40);
    
    //obstacle.debug = true;
    obstacle.velocityX = -(8 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.8;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  
  harry.changeAnimation("running",hero_running);
  harry.scale =0.13;
  
  score=0
  BG.x = BG.width /2;
  BG.velocityX = -2 
  
}
