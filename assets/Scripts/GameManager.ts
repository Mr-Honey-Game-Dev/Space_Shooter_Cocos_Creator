import { _decorator, Button, CCFloat, Component, director, instantiate, Node, Prefab, randomRangeInt, RichText, Vec3 } from 'cc';
import { CameraShake } from './CameraShake';
import { AsteroidSpawner } from './AsteroidSpawner';
import { Controller } from './Controller';
const { ccclass, property } = _decorator;

export enum GameState
{
    Objective,GameStart,GameRunning,GameWin,GameLose
}

@ccclass('GameManager')
export class GameManager extends Component {
    
    public static Instance : GameManager;

    @property(Node)
    canvasNode : Node =null!;

    // boundary walls for scene
    @property(Node)
    wallRight : Node = null!;    
    @property(Node)
    wallLeft : Node = null!;
    @property(Node)
    wallUp : Node = null!;    
    @property(Node)
    wallDown : Node = null!;

    @property(Controller)
    playerController : Controller=null!;

    @property(AsteroidSpawner)
    asteroidSpawner:AsteroidSpawner=null!;

    @property(CameraShake)
    cameraShake:CameraShake=null!;

    @property(RichText)
    displayText:RichText=null!;
    
    @property(RichText)
    scoreText:RichText=null!;

    @property(Button)
    homeButton:Button=null!;

    @property(Prefab)
    coinPrefab:Prefab=null!;
    
    @property(Prefab)
    shieldPrefab:Prefab=null!;
    
    @property(Prefab)
    upgradePrefab:Prefab=null!;
    
    @property(CCFloat)
    totalPoints=100;
    
    private gamestate:GameState =GameState.Objective;
    private objectiveStr:string="Destroy Asteroids and Collect coins  ";
    private textTimer :number=0;
    private objectiveIndex:number=0;
    private curPoints=0;

    //#region these functions return maximum and minimum position that ship can go according to specified boundary
    getMinX()
    {        
        if(this.wallLeft==null) return -100;
        return this.wallLeft.position.x;
    }
    getMaxX()
    {
        if(this.wallRight==null) return 100;
        return this.wallRight.position.x;
    }
    getMinY()
    {        
        if(this.wallDown==null) return -100;
        return this.wallDown.position.y;
    }
    getMaxY()
    {
        if(this.wallUp==null) return 100;
        return this.wallUp.position.y;
    }
    //#endregion

    //#region Engine lifeCycle
    onLoad() 
    {
        if(GameManager.Instance==null || !GameManager.Instance.isValid)
            GameManager.Instance=this;
    }
    start() {
        this.playerController.setDead();
        this.gamestate=GameState.Objective;
        this.textTimer=0;
        this.homeButton.node.active=false;
        this.homeButton.node.on(Button.EventType.CLICK, this.goToMainMenu, this);
    }

    update(deltaTime: number) {
        
        this.checkAndSpawnCollectable();

        // handles game states using finite state machine
        switch(this.gamestate)
        {
            case GameState.Objective:
                // shows initial objective text using typing effect. when typing effect is finished change game state to game start
                this.textTimer++;
                if(this.textTimer==5)
                {
                    this.displayText.string+=this.objectiveStr[this.objectiveIndex];
                    this.objectiveIndex++;
                    this.textTimer=0;
                    if(this.objectiveIndex>=this.objectiveStr.length)
                        this.gamestate=GameState.GameStart;
                }
                break;
            case GameState.GameStart:
                // set player alive and trigger asteroid spawner to start spawning asteroid
                this.playerController.setAlive();
                this.displayText.string="";
                this.asteroidSpawner.startSpawning();
                this.gamestate=GameState.GameRunning
                break;                
            case GameState.GameRunning:
                // shows updated score every frame and checks if the game is over or not
                this.scoreText.string=this.curPoints.toString()+"/"+this.totalPoints.toString();
                if(this.playerController.dead())
                {
                    this.gamestate=GameState.GameLose;
                    this.asteroidSpawner.stopSpawning();
                }
                if(this.curPoints>=this.totalPoints)
                {
                    this.gamestate=GameState.GameWin;
                    this.asteroidSpawner.stopSpawning();
                }
                break;
            case GameState.GameLose:                
                this.homeButton.node.active=true;
                this.displayText.string="You lost";
                break;                
            case GameState.GameWin:   
                this.homeButton.node.active=true;
                this.displayText.string="You win";
                break;
                

        }
    }
    //#endregion


    toSpawn:boolean=false;
    spawnPos:Vec3=null;
    spawnCollectable(pos:Vec3)
    {
        this.toSpawn=true;
        this.spawnPos=pos;
    }

    // spawns collectables according to pre-defined probablity of coins, shields, power-ups
    checkAndSpawnCollectable()
    {
        if(this.toSpawn)
        {   
            let ran=randomRangeInt(0,30);
            var collectable;
            if(ran<2)
            {    
                collectable=instantiate(this.shieldPrefab);
            }
            else if(ran<4)
            {    
                collectable=instantiate(this.upgradePrefab);
            }
            else if(ran<12)
            {    
                collectable=instantiate(this.coinPrefab);
            }

            if(collectable!=null)
            {
                collectable.parent=this.canvasNode;
                collectable.position=this.spawnPos;
                this.toSpawn=false;            
            }
            else
            {
                this.toSpawn=false;
            }
        }

    }



//#region other functions
    // kill player
    destroyPlayer()
    {
          if(this.playerController.isShielded())
          {
              this.playerController.useShield();
          }
          else
          {
              this.playerController.setDead();
          }
    }
    isPlayerAlive(){
        return !this.playerController.dead()
    }
    giveShield()
    {
        this.playerController.giveShield();
    }
    givePowerUp()
    {
        this.playerController.givePowerUp();
    }
    addPoints()
    {
        this.curPoints+=10;
    }
    goToMainMenu()
    {
        director.loadScene("menu");
    }
    //#endregion
}


