/*************************************************
 * Create   : 2016/1/30
 * Update   : 2016/1/30
 * Author   : Jeason1997
 * FileName : Box2D_DistanceJoint.js
 * Describe : 
 *************************************************/

window.DistanceJoint = cc.Class({

    extends: Joint,

    properties: {
        autoConfigureLength: {
            default: false,
        },
        jointLength: {
            default: 1,
            notify: function () {
            },
        },
        frequencyHz: {
            default: 4,
            notify: function () {
            },
        },
        dampingRation: {
            default: 0.5,
            notify: function () {
            },
        },
    },

    start: function () {
        this.initJoint();

        var jointDef = new b2DistanceJointDef();
        jointDef.bodyA = this.localBody;
        jointDef.bodyB = this.targetBody;
        jointDef.localAnchorA = new b2Vec2(this.localAnchor.x / PTM_RATIO, this.localAnchor.y / PTM_RATIO);
        jointDef.localAnchorB = new b2Vec2(this.targetAnchor.x / PTM_RATIO, this.targetAnchor.y / PTM_RATIO);
        if (this.autoConfigureLength) {
            this.jointLength = cc.pDistance(this.localBody.GetPosition(), 
                this.targetBody.GetPosition());
        }
        jointDef.length = this.jointLength;
        jointDef.dampingRation = this.dampingRation;
        jointDef.frequencyHz = this.frequencyHz;
        jointDef.collideConnected = this.enableCollision;
        this.joint = Engine.instance.world.CreateJoint(jointDef);
    },
});
