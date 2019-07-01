/**
 * 地图上点工具js文件
 * 使用：var menu = new MapToolMenuPlugin(ajax)
 *      menu.addPoints(type, mapInstance)
 *      menu.removePoints(type, mapInstance)
 *      具体类型参见const TUNNEL 的 key，const TOOL_PLUGIN_TYPE 的 key
 */
const td_host = "http://80.2.30.24:9090/td";
//卡点详情
const pointDetail = td_host + "/examinePoint/pointDetail";
//通道上图
const addPoint = td_host + "/examinePoint/examinePointMap";
//关注人员列表
const focusedPeople = td_host + "/focusedPeople/focusedPeopleList";
//重点车辆
const getFocusedCar = td_host + "/focusedPeople/focusedCarList";
//通道上图
const channelMap = td_host + "/examinePoint/chunnelMap";
//警力
const pliceForces = "http://80.2.30.20:10086/pgis/getPkg"
//感知源
const wifi = "http://80.2.30.20:10086/wifi/getList"

const detail = "http://80.2.30.24:9090/static/img/tunnel/detail.png"

const loading = "http://80.2.30.24:9090/static/img/tunnel/loading.gif"

const defaultImg = "http://80.2.30.24:9090/static/img/tunnel/img-default.png"
//警力详情
const policeDetail = "http://80.2.30.21:8110/jlbb/getBBInfo"

const allDrawPoints = new Set();

export const TUNNEL = {
    chuan: "环川", 
    rong: "环蓉", 
    firstClass: "一级",
     secondClass: "二级", 
     thirdClass:"三级", 
     automobile: "汽车站", 
     train: "火车站",
      airport: "机场", 
      dock:"码头", 
      toll:"收费站",
       other:"其他"
}
// const MEDIATYPE = ["netbar", "hotel" ,"camera", "safe", "trafficPolice", "wifi", "specialWifi", "police", "person", "car", "circle", "rect", "poly", "line", "lineTunnel"]
//////////////////////////////////////聚合功能/////////////////////////////////////////////
function getPointsInWindow(maxLon, minLon, maxLat, minLat){
    for(var i = 0; i < this.points.length; i++){
        if(this.points[i].lon <= maxLon && this.points[i].lon >= minLon && this.points[i].lat > minLat && this.points[i].lat < maxLat){
            this.pointsInWindow.push(this.points[i])
        }
    }
}
function isCoverEachOther(point1, point2){
    if(point1.lon - this.rectRadius > point2.lon + this.rectRadius || point2.lon - this.rectRadius > point1.lon + this.rectRadius || point1.lat - this.rectRadius > point2.lat + this.rectRadius || point2.lat - this.rectRadius > point1.lat + this.rectRadius){
        return false;
    }
    return true;
}
function getMinDistanceClusterPoint(point){
    var distance = 0;
    var index = 0;
    for(var i = 0; i < this.clusterPoints.length; i++){
        var xx = (this.clusterPoints[i].lon - point.lon) * (this.clusterPoints[i].lon - point.lon);
        var yy = (this.clusterPoints[i].lat - point.lat) * (this.clusterPoints[i].lat - point.lat);
        var dist = xx + yy;
        if(i == 0){
            distance = dist;
        }else{
            if(dist < distance){
                distance = dist;
                index = i;
            }
        }
    }
  
    return index;
}
function getClusterPoints(){
    for(var i = 0; i < this.pointsInWindow.length; i++){
        if(this.clusterPoints.length == 0){
           this.clusterPoints.push({
                size: 1,
                lon:this.pointsInWindow[i].lon,
                lat:this.pointsInWindow[i].lat,
                point:this.pointsInWindow[i]
            });
        }else{
            var index = this.getMinDistanceClusterPoint(this.pointsInWindow[i]);
            if(this.isCoverEachOther(this.clusterPoints[index], this.pointsInWindow[i])){
                this.clusterPoints[index].size++;
            }else{
                this.clusterPoints.push({
                    size: 1,
                    lon:this.pointsInWindow[i].lon,
                    lat:this.pointsInWindow[i].lat,
                    point:this.pointsInWindow[i]
                });
            }
        }
    }
}
function drawPoints(){
    for(var i = 0; i < this.clusterPoints.length; i++){
        this.pointsOnMap.push(this.clusterPoints[i].lon + this.clusterPoints[i].lat + this.icon)
        if(this.clusterPoints[i].size == 1){
            this.callback(this.clusterPoints[i].lon, this.clusterPoints[i].lat, this.icon, this.clusterPoints[i].point)
        }else{
            this.callback(this.clusterPoints[i].lon, this.clusterPoints[i].lat, this.icon, "", this.clusterPoints[i].size)
        }
    }
}
function drawRealPoints(){
    for(var i = 0; i < this.pointsInWindow.length; i++){
        this.pointsOnMap.push(this.pointsInWindow[i].lon + this.pointsInWindow[i].lat + this.icon)
        this.callback(this.pointsInWindow[i].lon, this.pointsInWindow[i].lat, this.icon, this.pointsInWindow[i])
    }
}
function removePoints(){
    for(var i = 0; i <　this.pointsOnMap.length; i++){
        appMap.removeOverlayPoint(this.pointsOnMap[i]);
    }
    this.pointsOnMap = [];
}
function startCluster( points ){
    points && (this.points = points)
    var level = this.level || 15;
    this.pointsInWindow = [];
    this.clusterPoints = [];
    this.removePoints();
    var bounds = _mapApp.map.getBoundsLatLng();
    if(_mapApp.map.getZoomLevel() >= level){
        this.getPointsInWindow(bounds._northEast.lng, bounds._southWest.lng, bounds._northEast.lat, bounds._southWest.lat);
        this.drawRealPoints();
        return;
    }
    this.rectRadius = (bounds._northEast.lng - bounds._southWest.lng) / 40;
    this.getPointsInWindow(bounds._northEast.lng, bounds._southWest.lng, bounds._northEast.lat, bounds._southWest.lat);
    this.getClusterPoints();
    this.drawPoints();
}
function Cluster(points, icon, callback, level, ajax){
    this.drawPoints = drawPoints;
    this.icon = icon;
    this.ajax = ajax;
    this.level = level;
    this.callback = callback;
    this.drawRealPoints = drawRealPoints;
    this.pointsOnMap = [];
    this.startCluster = startCluster;
    this.points = points;
    this.rectRadius = 0.005;
    this.removePoints = removePoints;
    this.getMinDistanceClusterPoint = getMinDistanceClusterPoint;
    this.isCoverEachOther = isCoverEachOther;
    this.pointsInWindow = [];
    this.clusterPoints = [];
    this.getClusterPoints = getClusterPoints;
    this.getPointsInWindow = getPointsInWindow;
    this.startCluster(this.points);
}
/////////////////////////////////点的详情////////////////////////////////////////
//通道，卡点
function getHtml(obj, level) {
    var title = level == 1 ? "通道" : level == 2 ? "卡点" : "卡口";
    var html = `
      <div class='tunnel-card'>
        <div class='card-header'>${title}信息</div>
        <div class="card-body">
          <img src="${detail}">
          <ul>
            <li><span>${title}名称：</span>${obj.pointName || ""}</li>
            <li><span>${title}类别：</span>${obj.pointType || ""}</li>
            <li><span>联系人：</span>${obj.linkMan || ""}</li>
            <li><span>联系电话：</span>${obj.linkPhone || ""}</li>
            <li><span>负责单位：</span>${obj.controlOrganization || ""}</li>
          </ul>
        </div>
      </div>`;
    return html;
}
//警力详情
function getPoliceHtml(obj) {
    var html = `
      <div class='tunnel-card'>
        <div class='card-header'>警力信息</div>
        <div class="card-body">
          <img src="${detail}">
          <ul style="min-width:200px">
            <li><span>巡区名称：</span>${obj.xqmc || "无"}</li>
            <li><span>巡区类型：</span>${obj.xqlxdm || "无"}</li>
            <li><span>车牌号：</span>${obj.clxkfs ? obj.clxkfs[0].cph : "无"}</li>
            <li><span>车辆负责人：</span>${obj.clxkfs ? obj.clxkfs[0].clfzrs[0].clfzrxm : "无"}</li>
            <li><span>负责人电话：</span>${obj.clxkfs ? obj.clxkfs[0].clfzrs[0].clfzrdh : "无"}</li>
          </ul>
        </div>
      </div>`;
    return html;
}
//WIFI详情
function getWifiHtml(obj) {
    console.log(obj)
    var type = obj.wifilx == "01" ? "特种WIFI" : "普通WIFI";
    var html = `
      <div class='tunnel-card'>
        <div class='card-header'>WIFI详情</div>
        <div class="card-body">
          <img src="${detail}">
          <ul>
            <li><span>名称：</span>${obj.title || "无"}</li>
            <li><span>类型：</span>${type}</li>
            <li><span>坐标：</span>${obj.lon}</li>
            <li><span></span>${obj.lat}</li>
          </ul>
        </div>
      </div>`;
    return html;
}
//重点人员
function getKeyPersonHtml(obj) {
    var time1, time2;
    if (obj.ksCssj && obj.ksCssj.length == 14) {
      time1 = _transformDate(obj.ksCssj);
    }
    if (obj.jsCssj && obj.jsCssj.length == 14) {
      time2 = _transformDate(obj.jsCssj);
    }
    var numstr = obj.xsly == '02' ? '座位号' : obj.xsly == '03' ? '房号' : '其他';
    var type = obj.xsly == '02' ? '上网' : obj.xsly == '03' ? '住店' : '其他';
    return `
      <div class='tunnel-card'>
        <div class='card-header'>重点人员信息 ( ${type} )</div>
        <div class="card-body">
          <img style="cursor:pointer;background:url(${loading}) center center no-repeat"
          src="/people/${obj.zjhm}/getHeadImg" +
            }" id="smImg">
          <ul>
            <li><span>人员姓名：</span>${obj.xm || ""}</li>
            <li><span>起始时间：</span>${time1 || ""}</li>
            <li><span>结束时间：</span>${time2 || ""}</li>
            <li><span>身份证号：</span>${obj.zjhm || ""}</li>
            <li><span>人员位置：</span>${obj.ksCsmc || ""}</li>
            <li><span>${numstr}：</span>${obj.ksWz || ""}</li>
          </ul>
      </div>`;
}
//重点车辆
function getKeyCarHtml(obj) {
    var time;
    if (obj.xsjssj && obj.xsjssj.length == 14) {
      time = _transformDate(obj.xsjssj);
    }
    //位置
    return `
      <div class='tunnel-card'>
        <div class='card-header'>重点车辆信息</div>
        <div class="card-body">
          <img style="cursor:pointer;background:url(${loading}) center center no-repeat" src="${obj.ksDz || defaultImg}" id="smImg">
          <ul>
            <li><span>车牌号：</span>${obj.zjhm || ""}</li>
            <li><span>创建时间：</span>${time || ""}</li>
            <li><span>位置：</span>${obj.ksCsmc || ""}</li>
          </ul>
      </div>`;
}
// /////////////////////////////辅助函数//////////////////////////////////////////
//日期转换
function _transformDate(str) {
  var arr = str.split("");
  arr.splice(4, 0, "-");
  arr.splice(7, 0, "-");
  arr.splice(10, 0, "  ");
  arr.splice(13, 0, ":");
  arr.splice(16, 0, ":");
  return arr.join("");
}
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}
function _removeAllDrawPoints(){
    allDrawPoints.forEach(item => {
        appMap.removeOverlayPoint(item);
    })
}
//判断一个点是否在多边形内
function isInside(point, poly, type) {
    var lat1 = parseFloat(point.lat || point.ksWd || point.latitude);
    var lng1 = parseFloat(point.lon || point.ksJd || point.longitude);
    if(type == 'rect'){
      return poly.minLon <= lng1 && lng1 <= poly.maxLon && poly.minLat <=lat1 && lat1 <= poly.maxLat;
    } else if(type == 'poly'){
      let flag = true;
      let crosspoints = [];
      for(let i = 0; i < poly.length; i++){
        //计算 y = lat1 与多边形各个边的交点
        if(i + 1 == poly.length) break;
        if(poly[i].lat > poly[i + 1].lat){
          if(poly[i].lat > lat1 && poly[i + 1].lat < lat1){
            let x = (lat1 - poly[i].lat) * (poly[i + 1].lon - poly[i].lon)/(poly[i + 1].lat - poly[i].lat) + poly[i].lon
            crosspoints.push(x);
          }
        }else{
          if(poly[i].lat < lat1 && poly[i + 1].lat > lat1){
            let x = (lat1 - poly[i].lat) * (poly[i + 1].lon - poly[i].lon)/(poly[i + 1].lat - poly[i].lat) + poly[i].lon
            crosspoints.push(x);
          }
        }
      }
      let left = 0,right = 0;
      crosspoints.forEach(item => {
        if(item < lng1) left++;
        else right++;
      })
      if(left % 2 != 0 && right % 2 != 0){
        return true;
      }else{
        return false;
      }
    } else if(type == "circle"){
      const PI = 3.14159;
      const EARTH_RADIUS = 6378137.0;
      var lat2 = parseFloat(poly.lat);
      var lng2 = parseFloat(poly.lon);
      var radLat1 = lat1 * PI / 180.0;
      var radLat2 = lat2 * PI / 180.0;
      var a = radLat1 - radLat2;
      var b = lng1 * PI / 180.0 - lng2 * PI / 180.0;
      var s =
        2 *
        Math.asin(
          Math.sqrt(
            Math.pow(Math.sin(a / 2), 2) +
              Math.cos(radLat1) *
                Math.cos(radLat2) *
                Math.pow(Math.sin(b / 2), 2)
          )
        );
      s = s * EARTH_RADIUS;
      s = Math.round(s * 10000) / 10000.0;
      return s < parseFloat(poly.radius);
      }
}
//点是否在一条线段的指定距离内
function _isPointNearLine(point1, point2, point3){
  //点斜式计算两条互相垂直线的交点
  var k1 = (point2.lat - point1.lat)/(point2.lon - point1.lon);
  var k2 = (point1.lat - point2.lat)/(point2.lon - point1.lon);
  var b1 = point1.lat - k1 * point1.lon;
  var b2 = point3.lat - k2 * point3.lon;
  var crosspoint = {}
  crosspoint.lon = (b2 - b1) / (k1 - k2);
  crosspoint.lat = k1 * crosspoint.lon + b1;
  // console.log(crosspoint)
  var R = 6378137;
  var lat1 = crosspoint.lat * Math.PI / 180.0;
  var lat2 = point3.lat * Math.PI / 180.0;
  var a = lat1 - lat2;
  var b = (crosspoint.lon - point3.lon) * Math.PI / 180.0;
  var d, sa2, sb2;
  sa2 = Math.sin(a / 2.0);
  sb2 = Math.sin(b / 2.0);
  d = 2 * R * Math.asin(Math.sqrt(sa2 * sa2 + Math.cos(lat1) * Math.cos(lat2) * sb2 * sb2));
  if(d < 1000){
    return true;
  }
  else{
    return false;
  }
}
function getPointsBesideLine(lines, allPoint){
    var selectedPoints = {};
    var besidePoints = {};
    var lines = lines.split(',');
    for(let i = 0; i < lines.length; i++){
      lines[i] = parseFloat(lines[i])
    }
    for(let key in allPoint){
        if(!this.isCluster[key]) continue;
        selectedPoints[key]  = allPoint[key];
    }

    for(let key in selectedPoints){
      besidePoints[key] = besidePoints[key] ? besidePoints[key] : [];
      for(let i = 0; i < selectedPoints[key].length; i++){
        for(let j = 0; j < lines.length; j+=2){
          //一公里半径内的点
          var circle = {lon:lines[j], lat: lines[j + 1], radius:1000}
          if(isInside(selectedPoints[key][i], circle, 'circle')){
            if(besidePoints[key].indexOf(selectedPoints[key][i]) < 0){
              besidePoints[key].push(selectedPoints[key][i]);
            }
          }
        }
        for(let j = 0; j < lines.length - 3; j+=2){
          if(lines[j] > lines[j + 2] && (selectedPoints[key][i].lon > (lines[j] + 0.000001) || selectedPoints[key][i].lon < (lines[j + 2] - 0.000001))){
            continue;
          }
          if(lines[j + 2] > lines[j] && (selectedPoints[key][i].lon > (lines[j + 2] + 0.000001) || selectedPoints[key][i].lon < (lines[j] - 0.000001))){
            continue;
          }
          if(lines[j + 1] > lines[j + 3] && (selectedPoints[key][i].lat > (lines[j + 1] + 0.000001) || selectedPoints[key][i].lat < (lines[j + 3] - 0.000001))){
            continue;
          }
          if(lines[j + 3] > lines[j + 1] && (selectedPoints[key][i].lat > (lines[j + 3] + 0.000001) || selectedPoints[key][i].lat < (lines[j + 1] - 0.000001))){
            continue;
          }
          if(_isPointNearLine({lon: lines[j], lat: lines[j + 1]}, {lon: lines[j + 2], lat: lines[j + 3]}, selectedPoints[key][i])){
            if(besidePoints[key].indexOf(selectedPoints[key][i]) < 0){
              besidePoints[key].push(selectedPoints[key][i]);
            }
          }
        }
      }
    }
    for(let key in besidePoints){
      this.clusterType[key].startCluster( besidePoints[key] );
    }
}
//获取当前地图上在画的圆内的所有点
function getAllInsidePoints(poly, type) {
    var points = {};
    for (const key in this.allPoint) {
    if(!this.isCluster[key]) continue;
      for(let i = 0; i < this.allPoint[key].length; i++){
        points[key] = points[key] ? points[key] : [];
        if (isInside(this.allPoint[key][i], poly, type)) {
          points[key].push(this.allPoint[key][i]);
        }
      }
    }
    for(let key in points){
      this.clusterType[key].startCluster( points[key] );
    }
}
function addMapEventListener(cluster, pointType, points){
    _mapApp.map.uMap.on('zoomend dragend',() => {
        if(!this.isCluster[cluster]) return;
        this.clusterType[cluster].startCluster(points);
    })
}
function dataServiceLayer(dataObjects, gxdwdm, icon, layerName, titleDefault) {
    var template = '<table class="zebra"><tbody>';
    for (var key in dataObjects) {
        template += '<tr><td>'+dataObjects[key]+'</td><td>'+key+'</td></tr>';
    }
    template += '</tbody></table>';
    var paramTwo = {
        hotSpotClick: function (pop) {
            var data = pop.contentData.customs;
            var title = data.MC?data.MC:titleDefault;
            var showInfoFormat = dataObjects;
            $(".leaflet-popup-content").css("width", "330px !important");
            $(".leaflet-popup-content").css("height", "200px !important");
            $(".leaflet-popup-content").attr("white-space", "nowrap");
            var html = "<div class='KKItem' style='width: 300px;background: #0d283c;border:0px solid #ddd;position:relative;padding-bottom:10px;'>" +
                "<div class='infoMessDiv' title='" + title + "' style='cursor:default;width:100%;height: 30px;background: #09385a;line-height: 30px;border-bottom: #D0D0D0;padding-left: 10px;font-size: 14px;color: #fff;'>" +
                title +
                "</div>";
            for (key in showInfoFormat) {
                if (data[key])
                    html += "<div class='infoMessDiv' style='padding-top: 3px; padding-bottom:3px;'><span style='margin-left: 10px;font-size:13px;color:#fff'>" + showInfoFormat[key] + "</span>：<span style='font-size:13px;color:#fff' title='" + showInfoFormat[key] + "'>" + data[key] + "</span></div>";
            }

            html += "</div>";
            pop.setContent(html);
        },
        colums: dataObjects,
        template: template,
        where:" AND XIANJXZQHDM:*"+gxdwdm+"*",
        icon: icon,
    };
    window.hotSpotLayer_LD = appMap.addHotSpot(layerName, icon, paramTwo);
}
//添加带有点击事件的点到地图
function addPointWithEvent(lon,lat,img,obj,size) {
    allDrawPoints.add(lon + lat + img);
    var marker = appMap.addOverlayPoint(lon + lat + img,lon,lat,img,"",size,false);
    if(typeof size == 'number'){
      marker.addListener("click", () => {
        appMap.setMapCenter(lon, lat, _mapApp.map.getZoomLevel() + 1);
      })
      return;
    };
    marker.addListener("click", () => {
      //卡口点击事件
      if (img == "kakou") {
        marker.openInfoWindowHtml(`<div class='tunnel-card'>
        <div class='card-header'>${obj.cardMouthName}(${obj.direction})&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></div></div>`);
      } else if (obj.level == 1 || obj.level == 2) {
        //卡点点击事件
        this.ajax.get(pointDetail + "/" + obj.id + "/" + getNowFormatDate())
          .then(data => {
            marker.openInfoWindowHtml(getHtml(data.data, obj.level));
          });
      } else if (img == "tongdao_person") {
        marker.openInfoWindowHtml(getKeyPersonHtml(obj));
        addImgListener()
      } else if (img == "car"){
        marker.openInfoWindowHtml(getKeyCarHtml(obj));
        addImgListener()
      } else if (img == "mj"){
        this.ajax.get(policeDetail, {params:{gpsid: obj.id}}).then(data => {
          marker.openInfoWindowHtml(getPoliceHtml(data.data));
        })
      } else if (img == "wifi_unique" || img == "wifi_normal"){
         marker.openInfoWindowHtml(getWifiHtml(obj));
      }
    });
}
//添加带有点击事件的线到地图
function addLineWithEvent(path, id, i, level) {
    var line = appMap.addOverlayLine(
      "mytunnel" + i,
      path.join(","),
      "#e9ab18",
      5,
      "",
      true
    );
    line.addListener("click", () => {
      this.ajax(pointDetail + "/" + id + "/" + getNowFormatDate())
        .then(data => {
          line.openInfoWindowHtml(getHtml(data.data, level));
        });
    });
}

  //工具插件功能类型
export const TOOL_PLUGIN_TYPE = {
    netbar: "网吧",
    hotel: "旅店",
    camera: "天网",
    safe: "治安",
    trafficPolice: "交警",
    wifi: "普通WIFI",
    specialWifi: "特种WIFI",
    police: "警力",
    person: "重点人员",
    car: "重点车辆",
    circle: "圆形",
    rect: "矩形",
    poly: "多边形",
    line: "画线",
    lineTunnel:"线通道",
    distance:"测距",
    area:"测面积"
};

//////////////////////////////////对外接口/////////////////////////////////////////////
export function MapToolMenuPlugin(ajax){
    this.ajax = ajax ? ajax : window.jQuery.ajax;
    this.isCluster = {};
    this.allPoint = {};
    this.clusterType = {};
    this.lineTunnels = [];
    this._removeAllDrawPoints = _removeAllDrawPoints;
    this.addMapEventListener = addMapEventListener;
    this.addLineWithEvent = addLineWithEvent;
    this.addPointWithEvent = addPointWithEvent;
    this.getAllInsidePoints = getAllInsidePoints;
    this.getAllInsidePoints = getAllInsidePoints;
    this.getPointsBesideLine = getPointsBesideLine;
    this.addPoints =async function(type, mapInstance){
        console.log(type);
        console.log(mapInstance);
        // this.isCluster[type] = true;
        // if(this.clusterType[type] && !this.clusterType['lineTunnel']){
        //     this.clusterType[type].startCluster(this.allPoint[type]);
        //     return;
        // }else if(this.allPoint[type] && !this.clusterType[type]){
        //     let img = type == "wifi" ? "wifi_normal" : "wifi_unique";
        //     this.clusterType[type] = new Cluster(this.allPoint[type], img, this.addPointWithEvent, 17, this.ajax);
        //     this.addMapEventListener(type, type)
        //     return;
        // }
        // if(TUNNEL[type]){
        //   ajax.get(addPoint + "/" + TUNNEL[type])
        //     .then(data => {
        //       data.data.forEach(item => {
        //         item.img = type;
        //         item.lon = item.longitude;
        //         item.lat = item.latitude;
        //       })
        //       this.allPoint[type] = [...data.data];
        //       this.clusterType[type] = new Cluster(this.allPoint[type], type, this.addPointWithEvent, 17, this.ajax);
        //       this.addMapEventListener(type, type)
        //     })
        // }else if(type == "netbar"){
        //     dataServiceLayer({ DZMC:"地址", LX: "卡点类型", SHIJXZQH: "所在市州", XIANJXZQH: "所在区县"}, '51', 'wangba', 'JWZH_ZAGL_WB_PT', '旅店');
        // }else if(type == "hotel"){
        //     dataServiceLayer({ DZMC:"地址", LX: "卡点类型", SHIJXZQH: "所在市州", XIANJXZQH: "所在区县"}, '51', 'lvdian', 'JWZH_ZAGL_LD_PT', '旅店');
        // }else if(type == "camera" && mapInstance){
        //     mapInstance.loadAdimTw("51");
        // }else if(type == "safe" && mapInstance){
        //     mapInstance.loadAdimKd()
        // }else if(type == "trafficPolice" && mapInstance){
        //     mapInstance.loadAdimKakou();
        // }else if(type == "wifi" || type == "specialWifi"){
        //     let img = type == "wifi" ? "wifi_normal" : "wifi_unique";
        //     ajax.get(wifi).then(data => {
        //         this.allPoint['wifi'] = [];
        //         this.allPoint['specialWifi'] = [];
        //         data.forEach(item => {
        //             item.img = item.wifilx == "01" ? "wifi_unique" : "wifi_normal";
        //             item.lon = parseFloat(item.lng)
        //             item.lat = parseFloat(item.lat)
        //             if(item.wifilx == "01"){
        //                 this.allPoint['specialWifi'].push(item);
        //             }else{
        //                 this.allPoint['wifi'].push(item);
        //             }
        //         })
        //         this.clusterType[type] = new Cluster(this.allPoint[type], img, this.addPointWithEvent, 17, this.ajax);
        //         this.addMapEventListener(type, type)
        //     })
        // }else if(type == "police"){
        //     ajax.get(pliceForces).then(data => {
        //         this.allPoint[type] = [...data];
        //         this.allPoint[type].forEach(item => {
        //             item.img = 'mj';
        //             item.lon = item.lng;
        //             item.lat = item.lat;
        //         })
        //         this.clusterType[type] = new Cluster(data, 'mj', this.addPointWithEvent, "", this.ajax);
        //         this.addMapEventListener(type, type)
        //     })
        // }else if(type == "person"){
        //     ajax.get(focusedPeople + "/" + getNowFormatDate()).then(data => {
        //     this.allPoint[type] = [...data.data];
        //     this.allPoint[type].forEach(item => {
        //       item.img = type;
        //       item.lon = parseFloat(item.ksJd)
        //       item.lat = parseFloat(item.ksWd)
        //     })
        //     if(this.clusterType[type]){
        //       this.clusterType[type].startCluster(this.allPoint[type]);
        //     }else{
        //       this.clusterType[type] = new Cluster(this.allPoint[type], 'tongdao_person', this.addPointWithEvent, "", this.ajax);
        //       this.addMapEventListener(type, type)
        //     }
        //   });
        // }else if(type == "car"){
        //     ajax.get(getFocusedCar + "/" + getNowFormatDate()).then(data => {
        //         this.allPoint[type] = [...data.data];
        //         this.allPoint[type].forEach(item => {
        //             item.img = type;
        //             item.lon = parseFloat(item.ksJd)
        //             item.lat = parseFloat(item.ksWd)
        //         })
        //         if(this.clusterType[type]){
        //             this.clusterType[type].startCluster(this.allPoint[type]);
        //         }else{
        //             this.clusterType[type] = new Cluster(this.allPoint[type], 'car', this.addPointWithEvent, "", this.ajax);
        //             this.addMapEventListener(type, type)
        //         }
        //     })
        // }else if(type == "circle"){
        //     appMap.drawCircle(res => {
        //         this._removeAllDrawPoints();
        //         let arr = res.split(",");
        //         let circle = { lon: arr[0], lat: arr[1], radius: arr[2] };
        //         this.getAllInsidePoints(circle, 'circle');
        //     });
        // }else if(type == "rect"){
        //     appMap.drawRectangle((res) => {
        //         this._removeAllDrawPoints();
        //         let arr = res.split(",");
        //         let rect = {maxLon:arr[4],minLon:arr[0],maxLat:arr[3],minLat:arr[1]};
        //         this.getAllInsidePoints(rect, 'rect');
        //     });
        // }else if(type == "poly"){
        //     appMap.drawPolygon((obj) => {
        //         this._removeAllDrawPoints();
        //         let arr = obj.coordString.split(',');
        //         let lonlats = [];
        //         for(let i = 0; i < arr.length; i += 2){
        //           lonlats.push({lon:parseFloat(arr[i]),lat:parseFloat(arr[i + 1])})
        //         }
        //         lonlats.push(lonlats[0])
        //         this.getAllInsidePoints(lonlats, 'poly');
        //     });
        // }else if(type == "line"){
        //     //画线
        //     appMap.drawPolyline( (obj) => {
        //         this.getPointsBesideLine(obj, this.allPoint)
        //     })
        // }else if (type == "distance"){
        //     appMap.measureLength()
        // }else if (type == "area"){
        //     appMap.measureArea()
        // }else if(type == "lineTunnel"){
        //     ajax.get(channelMap).then(data => {
        //         this.lineTunnels = data.data || [];
        //         this.allPoint[type] = [];
        //         let kakou = [];
        //         for (let i = 0; i < data.data.length; i++) {
        //           let path = [];
        //           data.data[i].pointList.push(data.data[i].pointList[1]);
        //           data.data[i].pointList.splice(1, 1);
        //           for (let j = 0; j < data.data[i].pointList.length; j++) {
        //             var img = data.data[i].pointList[j].level == 0 ? "kakou" : "toll";
        //             data.data[i].pointList[j].img = img;
        //             if(data.data[i].pointList[j].level == 0){
        //               kakou.push(data.data[i].pointList[j]);
        //             }else{
        //               this.allPoint[type].push(data.data[i].pointList[j]);
        //               this.addPointWithEvent(
        //                 data.data[i].pointList[j].lon,
        //                 data.data[i].pointList[j].lat,
        //                 img,
        //                 data.data[i].pointList[j]
        //               );
        //             }
        //             path.push(
        //               data.data[i].pointList[j].lon +
        //                 "," +
        //                 data.data[i].pointList[j].lat
        //             );
        //           }
        //           // 1是通道
        //           this.addLineWithEvent(path, data.data[i].pointId, i, 1);
        //         };
        //         this.allPoint.kakou = [...kakou];
        //         if(!this.clusterType[type]){
        //             this.clusterType[type] = new Cluster(kakou, 'kakou', this.addPointWithEvent, "", this.ajax);
        //             this.addMapEventListener(type, type)
        //         }else{
        //             this.clusterType[type].startCluster(this.allPoint[type]);
        //         }
        //     });
        // }
    }
    this.removePoints = function(type, mapInstance){
        this.isCluster[type] = false;
        if(this.clusterType[type]){
            this.clusterType[type].removePoints();
            if(type == "lineTunnel"){
                for (let i = 0; i < this.lineTunnels.length; i++) {
                    appMap.removeOverlayLine("mytunnel" + i);
                    for (let j = 0; j < this.lineTunnels[i].pointList.length; j++) {
                      mapInstance.removePoints(this.lineTunnels[i].pointList[j].lon + this.lineTunnels[i].pointList[j].lat + this.lineTunnels[i].pointList[j].img);
                    }
                }
            }
        }else if(type == "netbar"){
            appMap.clearClusterHotSpot({
                imgId: 'wangba',
                layerName: 'JWZH_ZAGL_WB_PT'
            });
        }else if(type == "hotel"){
            appMap.clearClusterHotSpot({
                imgId: 'lvdian',
                layerName: 'JWZH_ZAGL_LD_PT'
            });
        }else if(type == "camera" && mapInstance){
            mapInstance.removeAdimTw();
        }else if(type == "trafficPolice" && mapInstance){
            mapInstance.removeAdimKakou();
        }else if(type == "safe"){
            mapInstance.removeAdimKd()
        }else{
           // appMap.removeAllOverlay();
        }
    }
    createElement();

}

function addImgListener(){
    //图片放大
    $("#smImg").on("click",function(){
        var arr = createElement();
        console.log(arr)
        arr[1].setAttribute('src', $("#smImg").attr('src'));
        arr[0].style.zIndex = '100000';
        arr[0].style.opacity = 1;
        $(arr[0]).on('click', function(){
            arr[0].style.zIndex = '-1000';
            arr[0].style.opacity = 0;
        })
    });
}
function createElement(){
    if(document.getElementById('IMGBOX')){
        return [document.getElementById('IMGBOX'), document.getElementById('BIGIMG')]
    }
    var div = document.createElement('div');
    var img = document.createElement('img');
    div.id = "IMGBOX";
    img.id = "BIGIMG";
    div.style.width = '100%';
    div.style.position = 'fixed';
    div.style.top = 0;
    div.style.left = 0;
    div.style.height = "100%";
    div.style.opacity = 0;
    div.style.transition = "all .4s";
    div.style.background = "rgba(0,0,0,.7)";
    div.style.zIndex = '-1000';
    img.style.maxHeight = '99%';
    img.style.margin = "auto";
    img.style.position="absolute";
    img.style.top= 0;
    img.style.left= 0;
    img.style.bottom=0;
    img.style.right= 0;
    div.appendChild(img);
    document.body.appendChild(div);
    return [div, img];

}



// WEBPACK FOOTER //
// src/utils/MapToolMenuPlugin.js