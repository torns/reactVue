<script>
$(document).ready(function() {
    var totleHeight=window.screen.height-240 +'px';
    console.log(totleHeight);
    $('iframe').css('height',totleHeight);
});
window.onresize = function() {
    var totleHeight=window.screen.height-240 +'px';
    $('iframe').css('height',totleHeight);
};
export default {
    name:'',
    data(){
        return{

        }
    },
    mounted:function () {

    },
    methods:{

    }
}
</script>

<template>
<!--<div class="root">-->
    <main id="root" class="app-main">
         <div class="wrap">
             <iframe src="http://116.62.203.181/gantt/process-manager.html"></iframe>
        </div>
    </main>

</template>

<style scoped>
    .app-main{
        margin-top: 60px;
        margin-bottom: 30px;
        padding-bottom: 20px;
    }
    iframe{
        width: 100%;
        min-height: 600px;
        border: 0;
    }
</style>


