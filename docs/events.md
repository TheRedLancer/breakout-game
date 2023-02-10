# All Events and payloads

## gameStart
    {
        
    }

## gameOver
    {
        message: string
    }

## scorePoints
    {
        points: int
    }

## inputListener
    {
        keyCode: int,
        isPressed: bool,
        inputs[keyCode]: bool
    }

## hitBottomWall
    {

    }

## takeDamage
    {
        damage: int
    }

## ballCollision
    {
        ball: Ball,
        other: {
            distance: float, 
            point: Vector3, 
            face: Object, 
            faceIndex: int, 
            object: Object3D
        }
    }