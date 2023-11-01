import { _decorator, Component, instantiate, Node, Prefab, randomRangeInt } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('AsteroidSpawner')
export class AsteroidSpawner extends Component {

    @property([Node])
    spawnPoints : Node[]=[];

    @property([Prefab])
    asteroidPrefabs : Prefab[]=[];

    @property()
    spawnRate :number=2;

    @property()
    autoStart:boolean=false;

    private isSpawning : boolean=false;
    private spawnTime: number =0;

    start() {
        if(this.autoStart) this.startSpawning();
    }   

    update(deltaTime: number) {
        // spawns asteroid randomly in specified intervals and at a random point among spawnpoints
        if(this.isSpawning)
        {
            this.spawnTime+=deltaTime;

            if(this.asteroidPrefabs.length<=0 || this,this.spawnPoints.length<=0)
                return;

            if(this.spawnTime>1/this.spawnRate )
            {
                let enemy= instantiate(this.asteroidPrefabs[randomRangeInt(0,this.asteroidPrefabs.length)]);
                enemy.parent=GameManager.Instance.canvasNode;
                enemy.position=this.spawnPoints[randomRangeInt(0,this.spawnPoints.length)].position;
                this.spawnTime=0;
            }
        }
    }

    startSpawning()
    {
        this.isSpawning=true;        
        this.spawnTime=0;
    }
    stopSpawning()
    {
        this.isSpawning=false;
    }


}


