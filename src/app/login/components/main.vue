<script>
export default {
    name:'login',
    data(){
        return{
            zyfUrl:zyfUrl,
            name:'',
            password:''
        }
    },
    mounted:function () {
		
    },
    methods:{
		login :function(){
			var that = this;
			if(that.name == null || that.name == "" || that.name == "undefined"){
				this.$alert('<strong>请填写用户名！</strong>', '提示信息', {
				  dangerouslyUseHTMLString: true
				});
				return;
			}
			if(that.password == null || that.password == "" || that.password == "undefined"){
				this.$alert('<strong>请填写密码！</strong>', '提示信息', {
				  dangerouslyUseHTMLString: true
				});
				return;
			}
			this.$http.post(zyfUrl + '/user/login', {loginName:that.name,loginPassword:that.password}, {
                headers: {
                },
                emulateJSON: true
            }).then(function(result) {
                // 这里是处理正确的回调
                //console.log(result.data.data);
				var userinfo = result.data.data;
				//console.log(userinfo.jwt);
				//console.log(userinfo.projectId.projectId);
				//console.log(userinfo.userId);
				//返回jwt projectId userId 存入session缓存
				if(result.data.code == "10000"){
					localStorage.setItem('jwt',userinfo.jwt);
					localStorage.setItem('projectId',userinfo.projectId.projectId);
					localStorage.setItem('userId',userinfo.userId);
					window.location.href =zyfUrl + '/qualityOverview'+'?userId='+userinfo.userId+'&projectId='+userinfo.projectId.projectId+'&jwt='+userinfo.jwt;
				}else{
					this.$alert('<strong>'+result.data.message+'</strong>', '提示信息', {
				  dangerouslyUseHTMLString: true
				});
				}

            }, function(response) {
                // 这里是处理错误的回调
                console.log(response);
            });
		}
    }
}
</script>

<template>
<!--<div class="root">-->
    <main id="login" class="app-main">
        <div class="wrap">
            <div id="back-to-home">
                <a href="http://116.62.203.181/ZYF/index.html" class="btn btn-outline btn-default"><i class="fa fa-home animated zoomIn"></i></a>
                <!--<a href="index.html" class="btn btn-outline btn-default"><i class="fa fa-home animated zoomIn"></i></a>-->
            </div>
            <div class="simple-page-wrap">
                <div class="simple-page-logo animated swing">
                    <a href="index.html">
                        <!--<span><i class="fa fa-gg"></i></span>-->
                        <!--<span>中亿丰BIM</span>-->
                        <img src="../images/zyfLogo.png" style="height:60px;">
                        <!--<img :src="zyfUrl+'/login/images/zyfLogo.png'" style="height:60px;">-->
                    </a>
                </div><!-- logo -->
                <div class="simple-page-form animated flipInY" id="login-form">
                <h4 class="form-title m-b-xl text-center">登录</h4>
                
                    <div class="form-group">
                        <input id="sign-in-email" v-model="name" type="email" class="form-control" placeholder="输入用户名">
                    </div>

                    <div class="form-group">
                        <input id="sign-in-password" v-model="password" type="password" class="form-control" placeholder="输入密码">
                    </div>

                    <div class="form-group m-b-xl">
                        <div class="checkbox checkbox-primary">
                            <input type="checkbox" id="keep_me_logged_in"/>
                            <label for="keep_me_logged_in">保存登录信息</label>
                        </div>
                    </div>
                    <input type="button" class="btn btn-primary" value="登录" @click="login()">
                
            </div><!-- #login-form -->

            <div class="simple-page-footer">
                <p style="color:#fff;">Copyright 中亿丰 2018 ©</p>
                <!--<p><a href="password-forget.html">FORGOT YOUR PASSWORD ?</a></p>-->
                <!--<p>-->
                    <!--<small>Don't have an account ?</small>-->
                    <!--<a href="signup.html">CREATE AN ACCOUNT</a>-->
                <!--</p>-->
            </div><!-- .simple-page-footer -->


            </div><!-- .simple-page-wrap -->
        </div><!-- .wrap -->
    </main>
<!--</div>-->
</template>

<style scoped>
    .app-main{
        margin-top: 60px;
        margin-bottom: 15px;
    }
</style>


