<script>
    import common from '../../../components/common.vue';
export default {
    extends:common,
    name:'',
    data(){
        return{
            urls:[
                "/role/permissionList",//list
                "/role/modifyPermission"//role limit set
            ],
            url_idx:{
                init:0,
                setlimit:1,
            },
            params:[
                {userId:window.userId,projectId:projectId,roleId:"",jwt:jwt},
                {userId:window.userId,projectId:window.projectId,roleId:"",permissionIds:"",jwt:jwt}
            ],
            m_list:[],//全部权限
            m_curRole:'',//当前角色
            m_limitTree:[],//only consider two level now
            m_checkedTree:[],//only consider two level now
            checkAll:true
        }
    },
    mounted:function () {
        var roleId=this.getUrlParam('rId');
        // var roleId='1a3e8101a76e4d5589bec5d0ae7305ee';
        var idx = this.url_idx.init;//api index
        this.params[idx].roleId = roleId;
        this.ajax(this,zyfUrl + this.urls[idx],this.params[idx],0,this.init_cb);
    },
    methods:{
        init_cb:function (result) {
            // alert(result.data.message);
            this.m_list = result.data.data.permissions;
            this.m_curRole = result.data.data.hasPermission;
            this.initCheckedTree();
        },
        initCheckedTree:function () {
            //init check tree
            if(this.m_checkedTree.length == 0){
                for(var i=0;i<this.m_list.length;i++){
                    var p = this.m_list[i];
                    var pc = {};//parent checked node
                    pc.menuId = p.menuId;
                    pc.menuName=p.menuName;
                    pc.checked = this.hasCheck(p.menuId);
                    if(pc.checked==false && this.checkAll){
                        this.checkAll=false;
                    }
                    pc.children = [];
                    for(var j=0;j<p.children.length;j++){
                        var c = p.children[j];
                        var cc = {};//child checked node
                        cc.menuId = c.menuId;
                        cc.menuName=c.menuName;
                        cc.checked = this.hasCheck(c.menuId);
                        if(cc.checked==false && this.checkAll){
                            this.checkAll=false;
                        }
                        pc.children.push(cc);
                    }
                    this.m_checkedTree.push(pc);
                }
            }

        },
        hasCheck:function (id) {
            for(var i= 0;i<this.m_curRole.permissionIdList.length;i++){
                if(id==this.m_curRole.permissionIdList[i]){
                    return true;
                }
            }
            return false;
        },
        hasAllChose:function(){
            for(var i=0;i<this.m_checkedTree.length;i++){
                if(this.m_checkedTree[i].checked == false){
                    return false;
                }
                for(var j=0;j<this.m_checkedTree[i].children.length;j++){
                    if(this.m_checkedTree[i].children[j].checked == false){
                        return false;
                    }
                }
            }
            return true;
        },
        childCheck:function (index,cindex) {
            // alert(value);
            var that=this;
            if(that.m_checkedTree[index].children[cindex].checked){
                for(var i=0;i<that.m_checkedTree[index].children.length;i++){
                    if(!that.m_checkedTree[index].children[i].checked){
                        if(that.m_checkedTree[index].checked){
                            that.m_checkedTree[index].checked = false;
                        }
                        return;
                    }
                }
                //勾选父级
                if(that.m_checkedTree[index].checked==false){
                    that.m_checkedTree[index].checked=true;
                }
                //全选
                if(that.hasAllChose()){
                    that.checkAll=true;
                }else{
                    if(that.checkAll){
                        that.checkAll=false;
                    }
                }
            }else{
                //取消父级的全选
                if(that.m_checkedTree[index].checked==true){
                    that.m_checkedTree[index].checked=false;
                }
                if(that.checkAll){
                    that.checkAll=false;
                }
            }

        },
        parentCheck:function (index) {
            var that=this;
            if(that.m_checkedTree[index].checked){
                for(var i=0;i<that.m_checkedTree[index].children.length;i++){
                    if(that.m_checkedTree[index].children[i].checked ==false){
                        that.m_checkedTree[index].children[i].checked= true;
                    }
                }
                //全选
                if(that.hasAllChose()){
                    that.checkAll=true;
                }else{
                    if(that.checkAll){
                        that.checkAll=false;
                    }
                }
            }else{
                //取消父级全选
                for(var i=0;i<that.m_checkedTree[index].children.length;i++){
                    if(that.m_checkedTree[index].children[i].checked){
                        that.m_checkedTree[index].children[i].checked= false;
                    }
                }
                if(that.checkAll){
                    that.checkAll=false;
                }
            }
        },
        save:function () {
            //iterate checked tree and save them
            var submitRoles=[];
            for(var i=0;i<this.m_checkedTree.length;i++){
                var flag=false;
                if(this.m_checkedTree[i].checked){
                    //父级被选中
                    submitRoles.push(this.m_checkedTree[i].menuId);
                    for(var j=0;j<this.m_checkedTree[i].children.length;j++){
                        submitRoles.push(this.m_checkedTree[i].children[j].menuId);
                    }
                }else{
                    //父级未被选中
                    for(var j=0;j<this.m_checkedTree[i].children.length;j++){
                        if(this.m_checkedTree[i].children[j].checked){
                            flag=true;
                            submitRoles.push(this.m_checkedTree[i].children[j].menuId);
                        }
                    }
                    if(flag){
                        submitRoles.push(this.m_checkedTree[i].menuId);
                    }
                }
            }
            var idx = this.url_idx.setlimit;//api index
            this.params[idx].roleId =this.m_curRole.roleId;
            this.params[idx].permissionIds =JSON.stringify(submitRoles);
            this.ajax(this,zyfUrl + this.urls[idx],this.params[idx],0,this.save_cb);
            },
        save_cb:function (result) {
            window.location.href=zyfUrl+"/systemRoleManage?userId="+userId+"&projectId=" +projectId+"&jwt="+jwt;
        },

        getUrlParam:function(name){
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r!=null) return unescape(r[2]); return null;
        },
        allCheck(value){
            //全选
            if(value){
                for(var i=0;i<this.m_checkedTree.length;i++){
                    this.m_checkedTree[i].checked=true;
                    for(var j=0;j<this.m_checkedTree[i].children.length;j++){
                        this.m_checkedTree[i].children[j].checked=true;
                    }
                }
            }else {
                for(var i=0;i<this.m_checkedTree.length;i++){
                    this.m_checkedTree[i].checked=false;
                    for(var j=0;j<this.m_checkedTree[i].children.length;j++){
                        this.m_checkedTree[i].children[j].checked=false;
                    }
                }
            }
        }
    }
}
</script>

<template>
<!--<div class="root">-->
    <main id="root" class="app-main">
        <div class="wrap">
            <section class="app-content">
                <div class="list-content">
                    <div class="row">
                        <div class="col-md-12" style="padding-right: 0;">
                            <div class="widget">
                                <header class="widget-header">
                                    <div class="row">
                                        <div class="col-xs-12">
                                            <h5 class="role-header">当前角色：<span>{{m_curRole.roleName}}</span></h5>
                                        </div>
                                    </div>
                                </header>
                                <!--<hr class="widget-separator">-->
                                <div class="widget-body" style="padding: 0;">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="p-lg" v-for="(i,pindex) in m_checkedTree">
                                                <table class="table table-header">
                                                    <tr>
                                                        <td>
                                                            <div>
                                                                <!--<input :id="i.menuId" type="checkbox" :checked="">-->
                                                                <el-checkbox v-model="i.checked" @change="parentCheck(pindex)">{{i.menuName}}</el-checkbox>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <table class="table table-bordered table-first">
                                                    <tr>
                                                        <td v-for=" (c,cindex) in i.children">
                                                            <div>
                                                                <!--<input :id="c.menuId" :name="i.menuId" type="checkbox" @change="checkChildren(c)" :checked="c.checked">-->
                                                                <!--<span>{{c.menuName}}</span>-->
                                                                <el-checkbox v-model="c.checked" @change="childCheck(pindex,cindex,c.menuId)">{{c.menuName}}</el-checkbox>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div><!-- .table -->
                                            <div class="p-lg">
                                                <table class="table table-header table-footer">
                                                    <tr>
                                                        <td class="center">
                                                            <div>
                                                                <!--<input id="checkAll" type="checkbox">-->
                                                                <!--<span>选择全部</span>-->
                                                                <el-checkbox v-model="checkAll" @change="allCheck">选择全部</el-checkbox>

                                                            </div>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </div><!-- END column -->
                                    </div>
                                    <div class="row footer-button">
                                        <button class="btn primary backg-color" @click="save()">保存</button>
                                    </div>
                                </div><!-- .widget-body -->
                            </div>
                        </div>
                        <!--<div class="col-md-12">-->
                        <!--<div class="widget p-lg">-->
                        <!--<table class="table table-bordered">-->
                        <!--<tr><th>#</th><th>First Name</th><th>Last Name</th><th>Username</th></tr>-->
                        <!--<tr><td>1</td><td>Mark</td><td>Otto</td><td>@mdo</td></tr>-->
                        <!--<tr><td>2</td><td>Jacob</td><td>Thornton</td><td>@fat</td></tr>-->
                        <!--<tr><td>3</td><td>Larry</td><td>the Bird</td><td>@twitter</td></tr>-->
                        <!--</table>-->
                        <!--</div>&lt;!&ndash; .widget &ndash;&gt;-->
                        <!--</div>&lt;!&ndash; END column &ndash;&gt;-->
                    </div>
                </div>
            </section><!-- #dash-content -->
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


