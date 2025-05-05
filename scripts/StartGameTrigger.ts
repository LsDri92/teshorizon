import * as hz from 'horizon/core';
import { setGameState, GameState } from 'GameManager';

class StartGameTrigger extends hz.Component<typeof StartGameTrigger> {
  static propsDefinition = {};

  start() {
    this.connectCodeBlockEvent(
      this.entity,
      hz.CodeBlockEvents.OnPlayerEnterTrigger,
      (enteredBy: hz.Player) => {
        this.handleOnPlayerEnter();
      }
    );
  }

  private handleOnPlayerEnter(): void {
    this.sendLocalBroadcastEvent(setGameState, { state: GameState.Playing });
  }
}
hz.Component.register(StartGameTrigger);
