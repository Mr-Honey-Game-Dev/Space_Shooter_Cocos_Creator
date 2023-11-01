import { _decorator, Component, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RotatePlanet')
export class RotatePlanet extends Component {
   
    @property
    rotationSpeed:number=5;

    private rotation:number=0;
    protected start(): void {
        this.rotation=0;
    }
    // rotation a node on its z axis according to defined rotationSpeed
    update(deltaTime: number) {
        this.rotation+=deltaTime*this.rotationSpeed;
        this.node.setRotationFromEuler(new Vec3(0,0,this.rotation));   
    }
}


