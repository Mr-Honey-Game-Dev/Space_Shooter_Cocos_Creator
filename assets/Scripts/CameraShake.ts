import { _decorator, Component, Node, Vec3,math, randomRangeInt } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraShake')
export class CameraShake extends Component {
    
    private shakeTime:number=1;
    private curShakeTime:number=1;
    private intensity:number=1;
    private originalPos:Vec3;

    start()
    {
        this.shakeTime=0;
        this.curShakeTime=this.shakeTime;
        this.originalPos=this.node.position.clone();
    }

    startShake(shakeTime:number,intensity:number)
    {
        this.curShakeTime=0;
        this.shakeTime=shakeTime;
        this.intensity=intensity;
    }

    update(deltaTime: number) 
    {
        // generates a random position near camera actual position according to the intensity if shaking else set camera to original position
        if(this.curShakeTime<this.shakeTime)
        {    
            this.curShakeTime+=deltaTime;      
            this.node.translate(new Vec3(randomRangeInt(-1,2),randomRangeInt(-1,2),0).multiplyScalar(this.intensity*randomRangeInt(-2,2)));              
        }
        else
        {
            this.node.position=this.originalPos;
        }

    }
}


