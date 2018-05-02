<!--created by yangy,2018/1/25,7:00-->

<template>
    
</template>

<script>
    import { ajax } from '../common/list-common.js'
    export default {
        name: "common.vue",
        data() {
        },
        mounted:function () {

        },
        created: function () {
            var idx = this.url_idx.init;//api index
            ajax(this, zyfUrl + this.urls[idx], this.params[idx], 0, this.init_cb);
        },
        methods: {
            init_cb: function (result) {
                //alert(result.data.message);
                this.m_list = result.data.data;
            },
            insert_cb: function (result) {
                alert(result.data.message);
                this.dialogVisible = false;
            },
            update_cb: function (result) {
                alert(result.data.message);
            },
            insert: function () {

            },
            insertSubmit: function () {
                var idx = this.url_idx.insert;//api index
                //prepare params
                var param = this.params[idx];
                ajax(this, zyfUrl + this.urls[idx], param, 0, this.insert_cb);
            },
            update: function () {

            },
            filter: function () {

            },
            ajax:function (vue,url,params,mtd,callback) {
                //this.cb = callback;
                ajax(vue,url,params,mtd,callback);
            }
        }
    }
</script>

<style scoped>

</style>