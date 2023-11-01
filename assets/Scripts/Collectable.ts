import { _decorator,IPhysics2DContact,Contact2DType,PhysicsSystem2D, Component, RigidBody2D, Vec2, Collider2D, Prefab, instantiate, Enum  } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

export enum CollectableType
{
    coin,shield,upgrade
}

@ccclass('Collectable')
export class Collectable extends Component {


//#region  variables and properties
    @property(Prefab)
    explosionParticle : Prefab =null!;
    @property
    autoDestroyTime : number =3.5;

    @property({type:Enum(CollectableType)})
    type:CollectableType=CollectableType.coin;

    private collider:Collider2D=null;
    private rg : RigidBody2D = null;
    private speed : number = 5;
    private collected : boolean=false;
    private curLifeTime=0;
//#endregion
    
//#region Engine lifecycle
    start() {

        this.curLifeTime=0;
        this.rg=this.node.getComponent(RigidBody2D);
        this.collider=this.node.getComponent(Collider2D);

        // register for contact begin callbacks
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);            
        }

        if (PhysicsSystem2D.instance) {
            PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }       
        
    }

    // callback triggered when contact start
    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
           
        if(this.node!=selfCollider.node) return; // check if the callback if for correct node 
       if(otherCollider.tag==2) //2 represents player tag
        {
            if(!GameManager.Instance.isPlayerAlive()) return;

            switch(this.type) // checks which type of collectable it is and execute accordingly
            {
                case CollectableType.coin:
                    GameManager.Instance.addPoints();
                    break;
                case CollectableType.shield:
                    GameManager.Instance.giveShield();
                    break;
                case CollectableType.upgrade:                    
                    GameManager.Instance.givePowerUp();
                    break;
            }

            let explosion= instantiate(this.explosionParticle);
            explosion.parent=this.node.parent;
            explosion.position=this.node.position;

            this.collected=true; // marks collectable as collectable so that it can be destroyed in the next frame

            if(GameManager.Instance.cameraShake) // shakes camera with specified time and intersity
            GameManager.Instance.cameraShake.startShake(0.1,1);
        }
    }
 
    update(deltaTime: number) {
        
        this.curLifeTime+=deltaTime;
        
        if(this.curLifeTime>this.autoDestroyTime) // automatic destroy after defined seconds
            this.collected=true;

        
        if(this.collected && this.node.isValid) // destroyed node if it is collected
            this.node.destroy()

        if(this.rg!=null && this.node.isValid) // sets velocity for rigidbody
            this.rg.linearVelocity=new Vec2(0,-this.speed);
    }
    //#endregion

    //#region  getter and setter
    collectCoin()
    {
        this.collected=true;
    }
    isCollected()
    {
        return this.collected;
    }
    //#endregion
}


