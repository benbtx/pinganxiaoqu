import { excontrolApi,shipinApi } from "@/https";
import axios from 'axios'

export default{
    install(Vue, options) {
        Vue.prototype.getServerConfig = function() {
          let baseURL = '';
          if (process.env.NODE_ENV == 'development') {
            baseURL = '/static/serverconfig.json';
          }else if(process.env.NODE_ENV == 'production'){
            baseURL = '/serverconfig.json';
          }
          return new Promise((resolve, reject) => {
            axios.get(baseURL).then(res => {
              Vue.prototype.ApiUrl = res.data.ApiUrl;
              Vue.prototype.BASE_IMG_URL = res.data.ImgUrl;
              console.log(res)
              resolve();
            }).catch(error => {
              reject(error)
            })
          })
        },
        Vue.prototype.getFormatDate = function(date,str) {
            if (date == undefined) {
                return ""; 
            }
            let format = str || 'YYYY-MM-DD HH:mm:ss';

            return this.$moment(date).format(format);
        },
        Vue.prototype.getFormatDateYear = function(date,str) {
          if (date == undefined) {
              return ""; 
          }
          let format = str || 'YYYY-MM-DD';

          return this.$moment(date).format(format);
        },
        Vue.prototype.str2DataTime = function(strTime) {
            strTime = strTime.replace(/-/g, "/");
            var date = new Date(strTime);

            return date;
        },
        Vue.prototype.getCLppType = function() {
          return excontrolApi
            .getVehicleBrandTypes()
            .then(res => res.data)
            .then(data => {
              let clpplist = JSON.stringify(data) || [];
              localStorage.setItem('clpplist', clpplist);
            }).catch(() => {
              setTimeout(function() {
                this.getCLppType();
                console.log('获取车辆品牌');
              },2000);
           });
        },
        Vue.prototype.getCLpp = function(ppdm) {
          let clpplist = JSON.parse(localStorage.getItem('clpplist')) || [];
          
          let pp = '';
          for (let i=0; i<clpplist.length; i++) {
            let items = clpplist[i].items;
            for (let j=0; j<items.length; j++) {
              if (items[j].value == ppdm) {
                pp = items[j].label;
                break;
              }  
            }
    
            if (pp) {
              break;
            }
          }
    
          return pp;
        },
        Vue.prototype.getCpysList = function() {
          let cpys = [{
            value: '0',
            label: '白色'
          }, {
            value: '1',
            label: '黄色'
          }, {
            value: '2',
            label: '蓝色'
          },{
            value: '3',
            label: '黑色'
          },{
            value: '4',
            label: '其它颜色'
          },{
            value: '5',
            label: '绿色'
          }];
          
          return cpys;
        },
        Vue.prototype.getClysList = function() {
          let clys = [{
            value: '0',
            label: '其它颜色'
          },{
            value: '1',
            label: '白色'
          }, {
            value: '2',
            label: '银色'
          }, {
            value: '3',
            label: '灰色'
          }, {
            value: '4',
            label: '黑色'
          }, {
            value: '5',
            label: '红色'
          },{
            value: '6',
            label: '深蓝'
          }, {
            value: '7',
            label: '蓝色'
          }, {
            value: '8',
            label: '黄色'
          }, {
            value: '9',
            label: '绿色'
          }, {
            value: '10',
            label: '棕色'
          },{
            value: '11',
            label: '粉色'
          }, {
            value: '12',
            label: '紫色'
          }, {
            value: '13',
            label: '深灰'
          }, {
            value: '14',
            label: '青色'
          }];
          
          return clys;
        },
        // 判断各种浏览器，找到正确的方法
        Vue.prototype.fullScreen = function() {
            var el = document.documentElement,
                rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen,
                wscript;
                
            if(typeof rfs != "undefined" && rfs) {
                rfs.call(el);
                return;
            }
     
            if(typeof window.ActiveXObject != "undefined") {
                wscript = new ActiveXObject("WScript.Shell");
                if(wscript) {
                    wscript.SendKeys("{F11}");
                }
            }
        },   
        Vue.prototype.exitFullScreen = function() {
            var el = document,
                cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen,
                wscript;
         
            if (typeof cfs != "undefined" && cfs) {
              cfs.call(el);
              return;
            }
         
            if (typeof window.ActiveXObject != "undefined") {
                wscript = new ActiveXObject("WScript.Shell");
                if (wscript != null) {
                    wscript.SendKeys("{F11}");
                }
          }
        },
        Vue.prototype.downloadUrlFile = function(url, filename) {
          const xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.responseType = 'blob';
          xhr.onload = () => {
            if (xhr.status === 200) {
              // 获取图片blob数据并保存
              var blob = xhr.response;
              var downloadElement = document.createElement('a');
              var href = window.URL.createObjectURL(blob); //创建下载的链接
              downloadElement.href = href;
              downloadElement.download = filename;
              document.body.appendChild(downloadElement);
              downloadElement.click(); //点击下载
              document.body.removeChild(downloadElement); //下载完成移除元素
              window.URL.revokeObjectURL(href); //释放掉blob对象
            }
          };
          
          xhr.send();
        },
        Vue.prototype.playerVideo = function(data, callback) {          
          let isOnline = data.isOnline || data.payload.isOnline;
          if (isOnline == '离线') {
            this.$message({
              message: '设备离线，无法播放！',
              type: 'warning',  
              duration: 5 * 1000
            });
            return;
          }
          let id = data.id;
          return shipinApi.excontrolGetSecret()
            .then(res => res.data)
            .then(data => {  
              if (callback) {
                callback();
              }
              //弹出exe
              let SvrIp = data[0].host;
              let SvrPort = data[0].port;
              let appSecret =  data[0].appSecret;

              if(id=='00000000000000000000')
              {
                var param = "JZVideoClient://2;"+SvrIp+";"+SvrPort+";"+appSecret + id+";";
              }
              else{
              var param = "JZVideoClient://1;"+SvrIp+";"+SvrPort+";"+appSecret + id+";";
              }
              // console.log(param)
              // document.getElementById("url").src = param;
              window.location.href = param;
            }).catch((err) => {
              this.$message({
                message: '实时视频播放失败！',
                type: 'error',  
                duration: 5 * 1000
              });
            });
        },
        //

        Vue.prototype.getTransducerCode = function() {
          return shipinApi
            .getTransducerCode()
            .then(res => res.data)
            .then(data => {
              let cgqlist = JSON.stringify(data) || [];
              localStorage.setItem('cgqlist', cgqlist);
            }).catch(() => {
              setTimeout(function() {
                this.getTransducerCode();
                console.log('获取传感器');
              },2000);
           });
        }

        
        


    }
}