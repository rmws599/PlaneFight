import { _decorator, Animation, AudioClip, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, Sprite } from 'cc';
import { Bullet } from './Bullet';
import { GameManager } from './GameManager';
import { EnemyManager } from './EnemyManager';
import { AudioMgr } from './AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {
    @property
    speed:number=500;
    @property(Animation)
    anim:Animation=null;
    @property
    hp:number=1; 

    @property
    score:number=100;

    @property
    animHit:string="";
    @property
    animDown:string="";
    @property(AudioClip)
    enemyDownAudio:AudioClip=null;
    collider:Collider2D=null;

    start() {
       
        this.collider=this.getComponent(Collider2D);
        if(this.collider){
            this.collider.on(Contact2DType.BEGIN_CONTACT,this.onBeginContact,this);
        }
    }
    

    update(deltaTime: number) {
        if(this.hp>0){
            const p=this.node.position;
            this.node.setPosition(p.x,p.y-this.speed*deltaTime,p.z);
        }
        if(this.node.position.y<-580){
            this.node.destroy();
        }
        
    }
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        
        if(otherCollider.getComponent(Bullet)){
            otherCollider.enabled=false;
            otherCollider.getComponent(Sprite).enabled=false;
        }//判断是否collider碰撞到自身，是的话就禁用

        this.hp-=1;
        if(this.hp>0){
            this.anim.play(this.animHit);
        }else{
            this.anim.play(this.animDown);
        }//血量减少
         
        
         
         if(this.hp<=0){
           this.dead();
         }//血量减少到为0就销毁
         
    }
    protected onDestroy(): void {
       
        if(this.collider){
            this.collider.off(Contact2DType.BEGIN_CONTACT,this.onBeginContact,this);
        }
       EnemyManager.getInstance().removeEnemy(this.node);
    }
    haveDead:boolean=false;
    dead(){
        if(this.haveDead)return;
       AudioMgr.inst.playOneShot(this.enemyDownAudio);
        GameManager.getInstance().addScore(this.score);//添加到面板？
        if(this.collider){
            this.collider.enabled=false;
         }
        this.scheduleOnce(function(){
            this.node.destroy();
        },1);
        this.haveDead=true;
    }
    killNow(){
        if(this.hp<=0)return;
        this.hp=0;
        this.anim.play(this.animDown); 
        this.dead();
    }
}


