import { __private, _decorator, Component, Event, EventMouse, EventTouch, input, Input, Node, Vec2,View } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('InputManager')
export class InputManager extends Component {
    
    public static Instance : InputManager;


//#region  variables and properties
    @property 
    isHoldingLMB=false;   // tells if there is touch or a mouse down currently
    
    private mousePos : Vec2 = new Vec2();
    
    private prevMousePos : Vec2 = new Vec2();
    
    deltaMouse : Vec2 = new Vec2(); // return change in mouse position
//#endregion



//#region  Engine Lifecycle


    protected onLoad(): void {
        InputManager.Instance=this;
    }
    
    start() {
        this.mousePos=Vec2.ZERO;
        this.deltaMouse=Vec2.ZERO;
        this.prevMousePos=Vec2.ZERO;       
    }

    update(deltaTime: number) {
        
        // touch input callback registrations
        input.on(Input.EventType.TOUCH_START,this.onTouchDown,this);      
        input.on(Input.EventType.TOUCH_END,this.onTouchUp,this); 
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);

        // mouse input callback registrations
        input.on(Input.EventType.MOUSE_DOWN,this.onMouseDown,this);        
        input.on(Input.EventType.MOUSE_UP,this.onMouseUp,this); 
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);

        // calculate change in mouse position
        this.deltaMouse= new Vec2(this.mousePos.x-this.prevMousePos.x,this.mousePos.y-this.prevMousePos.y); 
        this.deltaMouse.normalize();  
        this.prevMousePos=this.mousePos;

    }

//#endregion



//#region  Input callbacks

    onTouchDown(event: EventTouch)
    {       
        if(event.touch.getID() ==0)
        this.isHoldingLMB=true;
    }

    onTouchUp(event:EventTouch)
    {
        if(event.touch.getID() ==0)       
        this.isHoldingLMB=false;        
    }
    onTouchMove(event : EventTouch)
    {        
        if(event.touch.getID() ==0)   
        this.mousePos= event.getLocation();
    }


    onMouseMove(event : EventMouse)
    {
        this.mousePos= event.getLocation();
    }
    onMouseDown(event: EventMouse)
    {
        if(event.getButton()==0)
        {
            this.isHoldingLMB=true;
        }
    }
    onMouseUp(event:EventMouse)
    {
        if(event.getButton()==0)
        {
            this.isHoldingLMB=false;
        }        
    }
//#endregion

}


