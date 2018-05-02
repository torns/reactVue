import vueResource from 'vue-resource';
<script>
// const list = [
   
// ];
$(document).on('mouseover','.openOver .app-menu .has-submenu',function () {
	$(this).children('.submenu-toggle').children('img:nth-child(1)').hide();
    $(this).children('.submenu-toggle').children('img:nth-child(2)').show();
    $(this).children('.submenu').show();
    $(this).siblings('.has-submenu').children('.submenu').hide();
});
$(document).on('mouseleave','.openOver .app-menu .has-submenu',function () {
    $(this).children('.submenu-toggle').children('img:nth-child(1)').show();
    $(this).children('.submenu-toggle').children('img:nth-child(2)').hide();
    $(this).children('.submenu').hide();
    $(this).siblings('.has-submenu').children('.submenu').hide();
});
$(document).on('click','.app-menu .has-submenu',function () {
    if($(this).children('.submenu').css('display')=='block'){
        $(this).children('.submenu').hide();
        $(this).find('.menu-caret ').removeClass('openMenu-caret')
        $(this).siblings('.has-submenu').children('.submenu').hide();
	}else{
        $(this).children('.submenu').show();
        $(this).find('.menu-caret ').addClass('openMenu-caret');
        $(this).siblings('.has-submenu').children('.submenu').hide();
	}

});
export default {
  	data() {
		return {
			list:'',
			subflage:-1,
			flage:-1,
            url:zyfUrl,
			userName:"",
			roleInfos:[],
			role:"",
			headerSrc:"",
			headerId:"",
			srcId:"",
			navSrc:"",
			before:true,
			after:false,
			showFlag:-1,
		};
	},
    mounted:function() {
        var that = this;
		// /process.png
		that.navSrc=zyfUrl+'/static/images/';
//        console.log('nav'+11);
        that.$http.post(zyfUrl+'/menuList',{
            projectId:projectId,
            userId:userId,
			jwt:jwt,
        },{
            headers:{

            },
            emulateJSON: true
        }).then(function (result) {
            if(result.body.code==10000){
                this.list=result.body.data;
				//
				console.log(this.list);
				this.list.forEach(function(item,index){
					//console.log(item.menuName);
					// if(item.menuName=="进度管理"){
					// 	//that.srcId=1;
					// }else if(item.menuName=="资料管理"){
					// 	//that.srcId=2;
					// }
				})
			}else{
                responsive(result.body.code,that);
			}
        },function (responsive) {
            console.log(responsive);
        })
		//获取登录信息
		that.$http.post(zyfUrl+'/user/userRoleInfo',{
            projectId:projectId,
            userId:userId,
            jwt:jwt,
        },{
            headers:{

            },
            emulateJSON: true
        }).then(function (result) {
            console.log(result.body.data);
			var user=result.body.data;
			this.userName=user.userName;
			this.roleInfos=user.roleInfo;
			if(user.roleInfo.length!=0){
				this.role=user.roleInfo[0].roleName;
			}
			this.headerId=user.headPortrait;
			this.headerSrc=zyfUrl+'/acc/getPicBy/'+user.headPortrait+'?userId='+userId+'&projectId='+projectId+'&jwt='+jwt;
        },function (responsive) {
            console.log(responsive);
        })
		//
		
    },
  	methods: {
    	handleOpen(key, keyPath) {
    	    //this.flage=key;
    	    if(this.flage==key){
    	        this.flage=-1;
			}else{
                this.flage=key;
			}
    	    // console.log(this.flage);
		},
		handleClose() {},
//		mouseover移入
		overShow:function(key){
    	    var that=this;
//            if($('#root').hasClass('openOver')){
//                if(that.showFlag==key){
//                    this.showFlag=-1;
//                    that.flage=-1;
//                }else{
//                    this.showFlag=key;
//                    that.flage=key;
//                }
//			}else{
//                if(that.showFlag==key){
//                    that.showFlag=-1;
////                this.flage=-1;
//                }else{
//                    that.showFlag=key;
////                this.flage=key;
//                }
//			}

		},
        urlThtml:function (index,index1) {
		    var url=this.list[index].children[index1].menuURL;
            if(url.indexOf('instance') > -1){
                window.location.href=zyfUrl+url+'&userId='+userId+'&projectId='+projectId+'&jwt='+jwt;
            }else{
                window.location.href=zyfUrl+url+'?userId='+userId+'&projectId='+projectId+'&jwt='+jwt;
			}
        }
	}
};
</script>

<template>
<!--<el-row class="tac root">-->
  	<!--<el-col :span="24">-->
		<!--<el-menu>-->
			<!--<div v-for="(item, index) in list" :key="index">-->
				<!--<el-menu-item v-if="!item.subList" :index="item.text" >-->
					<!--<i class="el-icon-menu"></i>-->
					<!--<a :href="item.url">{{item.text}}</a>-->
				<!--</el-menu-item>-->
				<!--<el-submenu v-else :index="item.text">-->
					<!--<template slot="title" >-->
						<!--<i class="el-icon-location"></i>-->
						<!--<span>{{item.text}}</span>-->
					<!--</template>-->
					<!--<el-menu-item v-for="(subItem, subIndex) in item.subList" :index="subItem.text" :key="subIndex"><a :href="item.url">{{subItem.text}}</a></el-menu-item>-->
				<!--</el-submenu>-->
			<!--</div>-->
		<!--</el-menu>-->
  	<!--</el-col>-->
<!--</el-row>-->
	<aside id="root" class="menubar light">
			<!-- navbar header navbar-header-->
			<div class="navbar-header">
				<button type="button" id="menubar-toggle-btn" class="navbar-toggle visible-xs-inline-block navbar-toggle-left hamburger hamburger--collapse js-hamburger">
					<span class="sr-only">Toggle navigation</span>
					<span class="hamburger-box"><span class="hamburger-inner"></span></span>
				</button>

				<button type="button" class="navbar-toggle navbar-toggle-right collapsed" data-toggle="collapse" data-target="#app-navbar-collapse" aria-expanded="false">
					<span class="sr-only">Toggle navigation</span>
					<span class="zmdi zmdi-hc-lg zmdi-more"></span>
				</button>

				<button type="button" class="navbar-toggle navbar-toggle-right collapsed" data-toggle="collapse" data-target="#navbar-search" aria-expanded="false">
					<span class="sr-only">Toggle navigation</span>
					<span class="zmdi zmdi-hc-lg zmdi-search"></span>
				</button>

				<a class="navbar-brand">
					<!--<span class="brand-icon"><i class="fa fa-gg"></i></span>-->
					<!--<span class="brand-name">中亿丰BIM</span>-->
					<img src="../image/zyfLogo.jpg" class="logo-img">
				</a>
			</div><!-- .navbar-header -->
		<div class="app-user">
			<div class="media">
				<div class="media-left">
					<div class="avatar avatar-md avatar-circle">
						<a href="javascript:void(0)">
							<img class="img-responsive" v-if="headerId==''" src="../image/default-img.png"/>
							<img class="img-responsive" v-else :src="headerSrc"/>
						</a>
					</div><!-- .avatar -->
				</div>
				<div class="media-body">
					<div class="foldable">
						<h5><a href="javascript:void(0)" class="username">{{userName}}</a></h5>
						<ul>
							<a href="javascript:void(0)" class="dropdown-toggle usertitle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								<!--<small v-for="user in roleInfos">{{user.roleName}}</small>-->
								<span>{{role}}</span>
								<!--<span class="caret"></span>-->
							</a>
							<!--<li class="dropdown">
								<a href="javascript:void(0)" class="dropdown-toggle usertitle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
									<small>Web Developer</small>
									<span class="caret"></span>
								</a>
								<ul class="dropdown-menu animated flipInY">
									<li>
										<a class="text-color" href="/index.html">
											<span class="m-r-xs"><i class="fa fa-home"></i></span>
											<span>Home</span>
										</a>
									</li>
									<li>
										<a class="text-color" href="profile.html">
											<span class="m-r-xs"><i class="fa fa-user"></i></span>
											<span>Profile</span>
										</a>
									</li>
									<li>
										<a class="text-color" href="settings.html">
											<span class="m-r-xs"><i class="fa fa-gear"></i></span>
											<span>Settings</span>
										</a>
									</li>
									<li role="separator" class="divider"></li>
									<li>
										<a class="text-color" href="logout.html">
											<span class="m-r-xs"><i class="fa fa-power-off"></i></span>
											<span>Home</span>
										</a>
									</li>
								</ul>
							</li>-->
						</ul>
					</div>
				</div><!-- .media-body -->
			</div><!-- .media -->
		</div><!-- .app-user -->

		<div class="menubar-scroll">
			<div class="menubar-scroll-inner">
				<!--替换menu-->
				<ul class="app-menu">
					<li class="has-submenu"  v-for="(item, index) in list" :key="index">
						<a href="javascript:void(0)" class="submenu-toggle" @click="handleOpen(index)">
							<!--<i class="menu-icon zmdi zmdi-layers zmdi-hc-lg"></i>-->
							<!--图片跳转-->
							<img :src="navSrc+item.menuIcon"   v-show="showFlag != index">
							<img :src="navSrc+'hover-'+item.menuIcon"  v-show="showFlag == index">
							<span class="menu-text">{{item.menuName}}</span>
							<!--<span class="label label-warning menu-label">2</span>-->
							<i v-if="item.children" class="menu-caret zmdi zmdi-hc-sm zmdi-chevron-right"></i>
						</a>
						<ul v-if="item.children" class="submenu">
							<li v-for="(a,index1) in item.children">
								<!--<a v-bind:href="url+a.menuURL">-->
									<!--<span class="menu-text">{{a.menuName}}</span>-->
								<!--</a>-->
								<a @click="urlThtml(index,index1)">
									<span class="menu-text">{{a.menuName}}</span>
								</a>
							</li>
							<!--<li><a href="../topbar/index.html"><span class="menu-text">Topbar</span></a></li>-->
						</ul>
					</li>

				</ul><!-- .app-menu -->
			</div><!-- .menubar-scroll-inner -->
		</div><!-- .menubar-scroll -->
	</aside>
</template>

<style scoped>
.root a{
	color: #303133;
	text-decoration: none;
}
.menubar,
.app-main{
	opacity: 1;
}
body.menubar-fold .app-main {
	margin-left: 5rem;
}
.menubar{
	width: 17%;
	height: 100%;
}
body.menubar-fold .app-main {
/*margin-left: 5rem;*/
}
.openOver{
/*width: 17%;*/
width: 6%;
height: 100%;
overflow-y: hidden;
}

.openOver .app-menu .menu-text{
	display: none;
}
.openOver .open .menu-text{
	display: block;
}
.openOver .navbar-brand .brand-name{
	display: none;
}
.openOver .menubar.light .app-user .username{
	display: none;
}
.openOver .app-menu a{
	text-align: center;
	display: block;
	padding: 10px 16px;
	font-size: .875rem;
}
.openOver .app-menu .menu-caret{
	display: none;
}
.openOver .open{
	position: absolute;
	left: 100%;
	top: 0;
	background-color: #fff;
	-webkit-box-shadow: 2px 1px 2px rgba(0, 0, 0, 0.08);
	box-shadow: 2px 1px 2px rgba(0, 0, 0, 0.08);
}
.openOver .open li{
	border-bottom-color: #edf0f5;
}
.openOver .open li a{
	display: block;
	padding: 10px 16px;
	font-size: .875rem;
}
.openOver .menubar.light .submenu li:nth-child(1) {
	background-color: rgba(237, 240, 245, 0.5);
}
/*menubar-scroll+*/
.openOver .menubar-scroll{
	position: fixed;
	width: 6%;
}
.openOver .open{
	margin-left: 1px;
}
.menubar{
	z-index: 1;
}
.openOver .username{
	display: none;
}
.openOver .open li:nth-child(1){
	background-color: rgba(237, 240, 245, 0.5);
}
.app-menu .submenu{
	display: none;
}
.app-menu li:hover{
	cursor: pointer;
}
/*.menubar-scroll .app-menu li ul{*/
	/*display: none;*/
/*}*/
.openMenu-caret {
	transform: rotate(90deg);
}
.avatar img, .avatar a > img{
	border: 1px solid #e6e6e6;
}
.logo-img{
	width: 160px;
	padding: 0px;
}
.app-user{
	padding-top: 10px;
}
</style>
