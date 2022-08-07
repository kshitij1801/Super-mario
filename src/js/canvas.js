import platform from '../img/platform.png'
import hills from '../img/hills.png'
import background from '../img/background.png'
import platformSmallTall from '../img/platformSmallTall.png'
import spriteRunLeft from '../img/spriteRunLeft.png'
import spriteRunRight from '../img/spriteRunRight.png'
import spriteStandLeft from '../img/spriteStandLeft.png'
import spriteStandRight from '../img/spriteStandRight.png'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

console.log(canvas)



canvas.width = 1024
canvas.height = 576

const gravity = 0.5

class Player {
    constructor(){
        this.speed = 7
        this.position = {
            x: 200,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 1,
        }
        this.width = 66
        this.height = 150
        this.frames = 0
        this.sprites = {
            stand: {
                cropWidth: 177,
                right: createImage(spriteStandRight),
                left: createImage(spriteStandLeft),
                width: 66
            },
            run: {
                cropWidth: 341,
                width: 127.875,
                right: createImage(spriteRunRight),
                left: createImage(spriteRunLeft)
            }
        }
        this.currentSprite = this.sprites.stand.right
        this.currentCropWidth = 177
    }
    draw(){
        c.drawImage(this.currentSprite,
            this.currentCropWidth*this.frames,0,this.currentCropWidth,400,this.position.x,this.position.y,this.width,this.height)
    } 
    update(){
        this.frames++
        if(this.frames>59&& (this.currentSprite == this.sprites.stand.right|| 
            this.currentSprite == this.sprites.stand.left)
            )
            this.frames = 0 
        else if(this.frames>29&&
            (this.currentSprite == this.sprites.run.right||
            this.currentSprite == this.sprites.run.left)
            )
            this.frames = 0
        this.draw()
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x
        if(this.position.y + this.velocity.y + this.height <= canvas.height)
        this.velocity.y += gravity
        

    }
}

class Platform {
    constructor({x,y,image}) { 
        this.position = { 
            x: x,
            y: y,
        }
        this.height = image.height
        this.width = image.width
        //this.width = 80
        this.image = image
    }
    draw() { 
        c.drawImage(this.image,this.position.x,this.position.y)
    }
}

class GenericObject {
    constructor({x,y,image}) { 
        this.position = { 
            x: x,
            y: y,
        }
        this.height = image.height
        this.width = image.width
        this.image = image
    }
    draw() { 
        c.drawImage(this.image,this.position.x,this.position.y)
    }
}

function createImage(imageSrc){
    const image = new Image()
    image.src = imageSrc
    return image
}


function init(){
 
 player = new Player()
 platforms = [new Platform({x:3*(platformImage.width)-190,y:300,image: platformSmallTallImage}),
    new Platform({x:0, y:470, image:platformImage}),
    new Platform({x:platformImage.width-3, y: 470, image:platformImage}),
    new Platform({x:2*(platformImage.width)+100, y: 470, image:platformImage}),
    new Platform({x:4*(platformImage.width)+600,y:470,image:platformImage}),
    new Platform({x: 3*(platformImage.width)+400, y: 150, image: platformImage}),
    new Platform({x:5*(platformImage.width)+450,y: 180, image:platformImage})
    

]

 genericObjects = [new GenericObject({x: -1, y: -1,image:backgroundImage}),
    new GenericObject({x: -1, y: -1,image:hillsImage})]

 scrollOffSet = 0
}

// declaration for images 
 let platformImage = createImage(platform)
 let hillsImage = createImage(hills)
 let backgroundImage = createImage(background)
 let platformSmallTallImage = createImage(platformSmallTall)

//creating objects for game
 let player = new Player()
 let platforms = []
 let genericObjects = []
 
 //variables
 let lastKey
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}
let scrollOffSet = 0

function animate(){
    requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0,0,canvas.width,canvas.height)
    
    genericObjects.forEach(genericObject => {
        genericObject.draw()
    })
    platforms.forEach(platform => {
        platform.draw()
    })
    player.update()

    if(keys.right.pressed && player.position.x < 450)
            player.velocity.x = player.speed
        else if ((keys.left.pressed && player.position.x > 100) || (keys.left.pressed)&&scrollOffSet==0&&player.position.x>0 )
            player.velocity.x = -1*player.speed
        else {
            player.velocity.x = 0
            if(keys.right.pressed){
                scrollOffSet += player.speed
                platforms.forEach(platform => (
                    platform.position.x -= player.speed
                ))
                genericObjects.forEach(genericObject => {
                    genericObject.position.x -= player.speed * 0.66
                })
                
            }
            else if( keys.left.pressed && scrollOffSet>0){
                scrollOffSet -= player.speed
                platforms.forEach(platform => (
                    platform.position.x += player.speed
            ))
                genericObjects.forEach(genericObject => {
                    genericObject.position.x += player.speed* 0.66
            })
            }
        }
    // platform collision 
    platforms.forEach(platform => {
        if( player.position.y + player.height <= platform.position.y &&
            player.position.y + player.height + player.velocity.y>= platform.position.y
            && player.position.x + player.width >= platform.position.x 
            && player.position.x <= platform.position.x +platform.width)
           player.velocity.y = 0
    })

    //sprite switching condition
    if (
        keys.right.pressed &&
        lastKey === 'right' &&
        player.currentSprite !== player.sprites.run.right
      ) {
        player.currentSprite = player.sprites.run.right
        player.currentCropWidth = player.sprites.run.cropWidth
        player.width = player.sprites.run.width
      } else if (
        keys.left.pressed &&
        lastKey === 'left' &&
        player.currentSprite !== player.sprites.run.left
        
      ) {
        player.currentSprite = player.sprites.run.left
        player.currentCropWidth = player.sprites.run.cropWidth
        player.width = player.sprites.run.width
        
      } else if (
        !keys.left.pressed &&
        lastKey === 'left' &&
        player.currentSprite !== player.sprites.stand.left
      ) {
        player.currentSprite = player.sprites.stand.left
        player.currentCropWidth = player.sprites.stand.cropWidth
        player.width = player.sprites.stand.width
      } else if (
        !keys.right.pressed &&
        lastKey === 'right' &&
        player.currentSprite !== player.sprites.stand.right
      ) {
        player.currentSprite = player.sprites.stand.right
        player.currentCropWidth = player.sprites.stand.cropWidth
        player.width = player.sprites.stand.width
      }


    //lose condition (i.e we will restart the game)
    if(player.position.y > canvas.height)
        init()

    //win condition 
    if(scrollOffSet>2000)
    console.log('you win')
    
}

init()
animate()

addEventListener('keydown', ({keyCode}) => {
    switch ( keyCode) {
        case 38:
            console.log('up')
            player.velocity.y -= 14 
            break
        case 40:
            console.log('down')
            break
        case 37:
            console.log('left')
            keys.left.pressed = true
            lastKey = 'left'
            break
        case 39:
            console.log('right')
            keys.right.pressed = true
            lastKey = 'right'
            break
            
    }

})

addEventListener('keyup', ({keyCode}) => {
    console.log(keyCode)
    switch ( keyCode) {
        case 38:
            console.log('up')
            break
        case 40:
            console.log('down')
            break
        case 37:
            console.log('left')
            keys.left.pressed = false
            break
        case 39:
            console.log('right')
            keys.right.pressed = false
            break
            
    }

})