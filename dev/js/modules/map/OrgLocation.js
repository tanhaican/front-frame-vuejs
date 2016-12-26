/**
 * Created by tanhaican on 2016/12/20.
 */
define(function (require, exports, module) {
    var sTpl = require("templates/modules/map/orgLocation.html"),
        Utils = require('js/common/Utils'),
        lng, lat, orgName;

    require.async('http://webapi.amap.com/maps?v=1.3&key=8e412a06612c7ce11582d15a6819292d', function() {
        initMap();
    });

    var OrgLocation = Vue.extend({
        template: sTpl,
        data: function() {
            return {
                groupon: {}
            }
        },
        ready: function () {
            var vm = this;

            ("undefined" !== typeof AMap) && initMap();
        },
        route: {
            data: function(transition) {
                lng = transition.to.params.lng;
                lat = transition.to.params.lat;
                orgName = transition.to.params.orgName;
            }
        },
        methods: {

        }
    });

    function initMap() {
        setTimeout(function() {
            //初始化地图对象，加载地图
            var map = new AMap.Map('mapContainer', {
                resizeEnable: true,
                center: [lng, lat],//地图中心点
                zoom: 13 //地图显示的缩放级别
            });

            //添加点标记，并使用自己的icon
            var marker = new AMap.Marker({
                map: map,
                position: map.getCenter(),
                icon: new AMap.Icon({
                    size: new AMap.Size(70, 60),  //图标大小
                    image: "./images/map_mark.png",
                    imageOffset: new AMap.Pixel(0, 0),
                    imageSize: new AMap.Size(49, 42)
                })
            });

            marker.setMap(map);
            // 设置鼠标划过点标记显示的文字提示
            marker.setTitle(orgName);

            // 设置label标签
            marker.setLabel({//label默认蓝框白底左上角显示，样式className为：amap-marker-label
                offset: new AMap.Pixel(28, 30),//修改label相对于maker的位置
                content: orgName
            });
        }, 0);
    }

    module.exports = OrgLocation;
});