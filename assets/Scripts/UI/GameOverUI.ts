import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameOverUI')
export class GameOverUI extends Component {
    @property(Label)
    heighestScoreLabel:Label=null;
    @property(Label)
    currentScoreLabel:Label=null;
  
   showGameOverUI(heighestScore:number,currentScore:number){
    this.node.active=true;
    this.heighestScoreLabel.string=heighestScore.toString();
    this.currentScoreLabel.string=currentScore.toString();
   }
}


