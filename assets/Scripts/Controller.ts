import { _decorator, Canvas, CanvasComponent, CCFloat, clamp, Component, debug, director, Input, input, instantiate, Node, ParticleSystem2D, Prefab, Screen, UITransform, Vec3 } from 'cc';
import { InputManager } from './InputManager';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Controller')
export class Controller extends Component {

    @property(CCFloat)
    speedHorizontal=10;
    
    @property(CCFloat)
    speedVertical=7;   

    @property(Prefab)
    bullet : Prefab = null!;

    @property(CCFloat) 
    shootWaitTime=0.5;
      
    @property(ParticleSystem2D)
    muzzleFlash : ParticleSystem2D =null!;
    
    @property(ParticleSystem2D)
    shieldParticle : ParticleSystem2D =null!;
    
    @property(ParticleSystem2D)
    powerParticle : ParticleSystem2D =null!;

    private currWaitTime : number = 0.35;
    private powerUpTime:number=0;
    private isDead:boolean=false;
    private haveShield:boolean=false;

  
//#region Engine lifecycle
    start() {
        this.haveShield=false;
        this.powerUpTime=-1;
        this.currWaitTime=this.shootWaitTime;       
    }

    update(deltaTime: number) {
        if(this.isDead) return;
        this.handleMovement(deltaTime); 
        this.shootBullets(deltaTime);   
        if(this.powerUpTime>=0)
        {
            this.powerUpTime-=deltaTime; 
            if(this.powerUpTime<=0) 
            this.powerParticle.stopSystem();
        }   
    }
//#endregion


//#region movement and shooting functions
    handleMovement(deltaTime: number)
    {
        if(InputManager.Instance.isHoldingLMB) // if there is a touch or mouse down detected by input manager then move the player and clamp its position according to the boundary
        {
            this.node.translate(new Vec3(InputManager.Instance.deltaMouse.x*deltaTime*100*this.speedHorizontal,
                InputManager.Instance.deltaMouse.y*deltaTime*100*this.speedVertical,
                0)
                .multiplyScalar(this.powerUpTime>0?2:1)
                );

            this.node.position= new Vec3(clamp(this.node.position.x,GameManager.Instance.getMinX(),GameManager.Instance.getMaxX()),
                clamp(this.node.position.y,GameManager.Instance.getMinY(),GameManager.Instance.getMaxY()),
                this.node.position.z);
        }
    }

    shootBullets(deltaTime: number)
    {
        if(InputManager.Instance.isHoldingLMB)
        {
            if(this.currWaitTime<0) // shoots bullets after specified time
            {
                this.muzzleFlash.resetSystem()
                let parent = GameManager.Instance.canvasNode;
                let bullet = instantiate(this.bullet);                
                bullet.position= this.node.position;
                bullet.translate(new Vec3(0,2,0));
                bullet.parent = parent;
                this.currWaitTime=this.shootWaitTime;
            }
            else 
            {
                this.currWaitTime-= deltaTime;                
                if(this.powerUpTime>0)this.currWaitTime-= deltaTime*3
            } 
        }
    }
    //#endregion


    
    //#region other getter setters and properties functions
    dead()
    {
        return this.isDead;
    }
    setAlive()
    {
        this.isDead=false;
        this.node.setScale(new Vec3(1,1,1)); 
    }
    setDead()
    {
        this.isDead=true;
        this.node.setScale(new Vec3(0,0,0));
    }
    givePowerUp()
    {
        this.powerUpTime=4;
        this.powerParticle.resetSystem();
    }
    isShielded()
    {
        return this.haveShield;
    }
    giveShield()
    {
        this.haveShield=true;
        this.shieldParticle.resetSystem()
    }
    useShield()
    {        
        this.haveShield=false;
        this.shieldParticle.stopSystem()
    }

//#endregion

}


