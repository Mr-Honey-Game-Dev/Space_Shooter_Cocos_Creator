import { _decorator,IPhysics2DContact,Contact2DType,PhysicsSystem2D, Component, RigidBody2D, Vec2, Collider2D, Prefab, instantiate } from 'cc';

import { Asteroid } from './Asteroid';
import { GameManager } from './GameManager';

const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {

    @property(Prefab)
    explosionParticle : Prefab =null!;
    @property
    autoDestroyTime : number =2.5;

    private collider:Collider2D=null;
    private rg : RigidBody2D = null;
    private bullet : number = 35;
    private destroyed : boolean=false;
    private curLifeTime=0;


    //#region Engine lifecycle
    start() {
        GameManager
        this.curLifeTime=0;
        this.rg=this.node.getComponent(RigidBody2D);
        this.collider=this.node.getComponent(Collider2D);
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);            
        }

     if (PhysicsSystem2D.instance) {
            PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }     
        
        this.node.getComponent(Collider2D).tag=0;
        
    }
    
    update(deltaTime: number) {
        
        this.curLifeTime+=deltaTime;
        
        if(this.curLifeTime>this.autoDestroyTime)// automatic destroy after defined seconds
            this.destroyed=true;

        if(this.destroyed && this.node.isValid)// destroyed node if it is bullet is destroyed
            this.node.destroy()

        if(this.rg!=null && this.node.isValid)// sets velocity for rigidbody
            this.rg.linearVelocity=new Vec2(0,this.bullet);
    }
    //#endregion


    // contact begin callback
    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
           

        if(otherCollider.tag==1) //1 represents asteroid tag
         {
            
             
             if(otherCollider.node.isValid)
             {
                 let asteroid=otherCollider.node.getComponent(Asteroid);
                 if(asteroid && !asteroid.isDestroyed()){
                     
                    GameManager.Instance.spawnCollectable(asteroid.node.position.clone());
                    GameManager.Instance.addPoints();
 
                     asteroid.destroyAsteroid();                   
 
                     let explosion= instantiate(this.explosionParticle);
                     explosion.parent=this.node.parent;
                     explosion.position=otherCollider.node.position;
                     this.destroyed=true;
                     if(GameManager.Instance.cameraShake)
                     GameManager.Instance.cameraShake.startShake(0.1,1.5);
                 }
             }
 
            
             
         }
     }
 
}


