
/**
 * topo 分析
 */
export const topoAnalysis = {

    //var topoAnalysis = function () {
}


topoAnalysis.prototype = {
    /**
    *  判断点是否在多边形内 射线法
    * @param {*} point  {x:0,y:0}
    * @param {*} poly  [{x:x1,y:y1},{}]
    */

    rayCasting: function (point, poly) {
        if (typeof (poly) == 'string') {
            let ps = [];
            let p = poly.split(',');
            p.map((t, i) => {
                if (i % 2 == 0) { 
                    ps.push({
                        x:parseFloat (p[i]),y:parseFloat (p[i+1])
                    });
                }
            }, this)
            poly=ps;
        }


        var px = parseFloat (point.x), py = parseFloat (point.y), flag = false;
        for (var i = 0, l = poly.length, j = l - 1; i < l; j = i, i++) {
            
            var sx = poly[i].x,
                sy = poly[i].y,
                tx = poly[j].x,
                ty = poly[j].y;

            //点在定点上
            if((sx === px && sy === py) || (tx === px && ty === py)) {
                return true;
            }
            //判断线段两端点是否在射线两侧
            if((sy < py && ty >= py) || (sy >= py && ty < py)) {
                //线段上与射线Y 坐标相同的点的X坐标 
                var x = sx + (py - sy) * (tx - sx) / (ty - sy);
                if (x === px) {
                    //return true;
                }
                if (x > px) {
                    //return false;
                    flag = !flag;
                }
            }
        }
        return flag;
    },

    /**
     * 判断点在是否在多边形内 回转数法
     * @param {Object} point  {x,y}
     * @param { array } poly 多边形顶点，数组成员的格式同 p
     */
    windingNumber: function (point, poly) {
        if (typeof (poly) == 'string') {
            let ps = [];
            let p = poly.split(',');
            p.map((t, i) => {
                if (i % 2 == 0) { 
                    ps.push({
                        x:parseFloat (p[i]),y:parseFloat (p[i+1])
                    });
                }
            }, this)
            poly=ps;
        }
        var px = parseFloat (point.x),
            py = parseFloat (point.y),
            sum = 0;
        for (var i = 0, l = poly.length, j = l - 1; i < l; j = i, i++) {
            var sx = poly[i].x,
                sy = poly[i].y,
                tx = poly[j].x,
                ty = poly[j].y
            // 点与多边形顶点重合或在多边形的边上
            if ((sx - px) * (px - tx) >= 0 && (sy - py) * (py - ty) >= 0 && (px - sx) * (ty - sy) == (py - sy) * (tx - sx)) {
                return true;
            }
            // 点与相邻顶点连线的夹角
            var angle = Math.atan2(sy - py, sx - px) - Math.atan2(ty - py, tx - px)
            // 确保夹角不超出取值范围（-π 到 π）
            if (angle >= Math.PI) {
                angle = angle - Math.PI * 2
            } else if (angle <= -Math.PI) {
                angle = angle + Math.PI * 2
            }
            sum += angle
        }
        return Math.round(sum / Math.PI) === 0 ? false : true;
    },
    /**
     *  判断是否在圆内、矩形内
     * @param {*} geoType 
     * @param {*} point 
     * @param {*} bounds 
     */
    contains: function (geoType, point, bounds, center) {
        if (geoType == "circle") {
            /**
             * 判断是否在圆内、判断点到圆心的距离
             */
            let maxYPoint = [center.x, bounds.yMax];
            let radius = Math.sqrt(Math.pow(center.x - center.x, 2) + Math.pow(bounds.yMax - center.y, 2));
            let distance = Math.sqrt(Math.pow(point.x - center.x, 2) + Math.pow(point.y - center.y, 2));
            if (distance <= radius) {
                return true;
            }
            else {
                return false;
            }
        }
        else if (geoType == "rect") {
            if (point.y <= bounds.yMax && point.y >= bounds.yMin && point.x >= bounds.xMin && point.x <= bounds.xMax) {
                return true;
            }
            else {
                return false;
            }

        }
    },
    /***
     * 经纬度获取距离
     */
    toDistance:function(lat1,lng1,lat2,lng2){
       var Rad=function(d){
           return d*Math.PI/180;
       };
       let Earth_radius=6381372;
       let a_lat=Rad(lat1);
       let a_lng= Rad(lng1);
       let b_lat=Rad(lat2);
       let b_lng=Rad(lng2);

       let a=a_lat-b_lat;
       let b=a_lng-b_lng;
       return 2*Math.asin(Math.sqrt(
           Math.pow(Math.sin(a/2),2)+Math.cos(a_lat)*Math.cos(b_lat)*Math.pow(Math.sin(b/2),2)
       ))*Earth_radius;

    },
   

}
