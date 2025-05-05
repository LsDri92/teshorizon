import * as hz from 'horizon/core';

export const spawnSomethingEvent = new hz.LocalEvent<{position: hz.Vec3}>("SPAWN_SOMETHING_EVENT");

class SpawnController_Iago extends hz.Component<typeof SpawnController_Iago> {
  static propsDefinition = {
    assetObj: {type: hz.PropTypes.Asset}
  };

  start() {

    this.connectLocalEvent(this.entity, spawnSomethingEvent, (data: {position: hz.Vec3}) => {
      console.log("SPAWN SOMETHING");
      this.spawnAsset(data.position);
    })

  }

  private spawnAsset(position: hz.Vec3): void {

    const sc = new hz.SpawnController(this.props.assetObj!, position, hz.Quaternion.fromEuler(new hz.Vec3(0,0,0)), new hz.Vec3(5,5,5))
    sc.spawn();

  }
}
hz.Component.register(SpawnController_Iago);