import * as hz from 'horizon/core';
import { moveGemToCourse, collectGem } from 'GameManager';
import { ParticleGizmo } from 'horizon/core';

class GemController extends hz.Component<typeof GemController> {
  static propsDefinition = {
    coursePositionRef: { type: hz.PropTypes.Entity },
    myEffect: { type: hz.PropTypes.Entity },
  };
  private part: hz.ParticleGizmo | undefined;
  private hiddenLocation = new hz.Vec3(0, -100, 0);

  start() {
    this.entity.position.set(this.hiddenLocation);
    this.part = new hz.ParticleGizmo(this.props.myEffect!.id);
    this.connectLocalEvent(this.entity, moveGemToCourse, () => {
      this.onMoveGemToCourseEvent();
    });

    this.connectCodeBlockEvent(
      this.entity,
      hz.CodeBlockEvents.OnPlayerCollision,
      (collidedWith: hz.Player) => {
        this.handleCollision();
      }
    );
  }

  private handleCollision(): void {
    this.entity.position.set(this.hiddenLocation);
    this.part!.play();
    this.sendLocalBroadcastEvent(collectGem, { gem: this.entity });
  }

  private onMoveGemToCourseEvent(): void {
    this.entity.position.set(this.props.coursePositionRef!.position.get());
    this.part!.position.set(this.props.coursePositionRef!.position.get());
  }
}
hz.Component.register(GemController);
