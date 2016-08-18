'use strict';

'use strict';

class Shape {

    constructor(parent) {
        this.parent = parent;
        if (parent.root !== undefined) {
            this.parent = parent.root;
            parent.children.push(this);
        }
        this.children = new Array();
        this.root = this.parent.group();
        this._position = [0, 0];
    }

    position(x, y) {
        this._position = [x, y];
        this.root.move(x, y);
        return this;
    }

    rotate(angle) {
        this.shape.rotate(angle);
        this.children.forEach(function (child) {
            child.rotate(angle);
        }, this);
        return this;
    }

    scale(s) {
        this.root.scale(s);
        return this;
    }

    color(lineColor, fillColor) {
        this.shape.attr({
            stroke: lineColor.rgb,
            'stroke-opacity': lineColor.a,
        });
        if (fillColor !== undefined) {
            this.shape.attr({
                fill: fillColor.rgb,
                'fill-opacity': fillColor.a,
            });
        }
        return this;
    }

    stytle(lineWidth) {
        this.shape.attr({
            'stroke-width': lineWidth,
            'cursor': 'pointer',
        });
        return this;
    }

    onClick(callback) {
        this.shape.on('click', callback.bind(this));
        return this;
    }

    onMousedown(callback) {
        this.shape.on('mousedown', callback.bind(this));
        return this;
    }

    onMouseup(callback) {
        this.shape.on('mouseup', callback.bind(this));
        return this;
    }

    onMousemove(callback) {
        this.shape.on('mousemove', callback.bind(this));
        return this;
    }

    onMouseover(callback) {
        this.shape.on('mouseover', callback.bind(this));
        return this;
    }

    onMouseout(callback) {
        this.shape.on('mouseout', callback.bind(this));
        return this;
    }
}

class Circle extends Shape {

    constructor(parent) {
        super(parent);

        this._radius = 100;
        this.shape = this.root.circle(this._radius);
    }

    radius(radius) {
        this._radius = radius;
        this.shape.radius(radius);
        return this;
    }
}

class Rect extends Shape {

    constructor(parent) {
        super(parent);

        this._size = [100, 100];
        this.shape = this.root.rect(this._size[0], this._size[1]);
    }

    size(w, h) {
        this._size = [w, h];
        this.shape.width(w);
        this.shape.height(h);
        return this;
    }
}

class Polygon extends Shape {

    constructor(parent, close) {
        super(parent);

        this._vectors = '0,0 -50,50 50,50';
        this.shape = close ? this.root.polygon(this._vectors) : this.root.polyline(this._vectors).fill('none').stroke({ width: 1 });
    }

    vectors(v) {
        this._vectors = v;
        this.shape.plot(v);
        return this;
    }
}

class Path extends Shape {

    constructor(parent) {
        super(parent);

        this._path = 'M100,200L300,400';
        this.shape = this.root.path(this._path);
    }

    path(v) {
        this._path = v;
        this.shape.plot(v);
        return this;
    }
}


class TestGizmo extends Editor.Gizmo {
    init() {
        // 初始化一些参数
    }

    onCreateRoot() {
        // 创建 svg 根节点的回调，可以在这里创建你的 svg 工具
        // this._root 可以获取到 Editor.Gizmo 创建的 svg 根节点

        // 实例：

        // 创建一个 svg 工具
        // group 函数文档 : http://documentup.com/wout/svg.js#groups
        this._tool = this._root.group();

        // 画一个的圆
        // circle 函数文档 : http://documentup.com/wout/svg.js#circle
        let circle = this._tool.circle();

        // 为 tool 定义一个绘画函数，可以为其他名字
        this._tool.plot = (radius, position) => {
            this._tool.move(position.x, position.y);
            circle.radius(radius);
        };

        this._tool.c = new Circle(this._tool);
        this._tool.c.shape.fill( { color: 'rgba(0,128,255,0.2)' } );
    }

    onUpdate() {
        // 在这个函数内更新 svg 工具

        // 获取 gizmo 依附的组件
        let target = this.target;

        // 获取 gizmo 依附的节点
        let node = this.node;

        // 获取组件半径
        let radius = target.radius;

        // 获取节点世界坐标
        let worldPosition = node.convertToWorldSpaceAR(cc.p(0, 0));

        // 转换世界坐标到 svg view 上
        // svg view 的坐标体系和节点坐标体系不太一样，这里使用内置函数来转换坐标
        let viewPosition = this._view.worldToPixel(worldPosition);

        // 对齐坐标，防止 svg 因为精度问题产生抖动
        let p = Editor.GizmosUtils.snapPixelWihVec2(viewPosition);

        // 获取世界坐标下圆半径
        let worldPosition2 = node.convertToWorldSpaceAR(cc.p(radius, 0));
        let worldRadius = worldPosition.sub(worldPosition2).mag();
        worldRadius = Editor.GizmosUtils.snapPixel(worldRadius);

        // 移动 svg 工具到坐标
        this._tool.plot(worldRadius, p);

        this._tool.position(p)
    }

    // 如果需要自定义 Gizmo 显示的时机，重写 visible 函数即可
    visible() {
        return true;
    }

    // Gizmo 创建在哪个 Layer 中 : foreground, scene, background
    // 默认创建在 scene Layer
    layer() {
        return 'scene';
    }

    // 如果 Gizmo 需要参加 点击测试，重写 rectHitTest 函数即可
    //    rectHitTest (rect, testRectContains) {
    //        return false;
    //    }
}

module.exports = TestGizmo;