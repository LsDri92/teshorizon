import * as hz from 'horizon/core';
import { spawnSomethingEvent } from 'SpawnController_Iago';

class Button_Iago extends hz.Component<typeof Button_Iago> {
  static propsDefinition = {};

  start() {

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      console.log(`GAME STARTED FOR: ${player.name.get()}`);
      this.sendLocalBroadcastEvent(spawnSomethingEvent, {position: new hz.Vec3(0,0,0)})
    });

    
  }
}
hz.Component.register(Button_Iago);