/*<script>
// 请求列表
export default {
    name:"editors",
    data(){
        return{
            
        }
    },
}
</script>

<template>
    <main id="root" class="app-main">
        <div class="wrap">
            <editors></editors>
        </div><!-- .wrap -->
    </main>
</template>
<template>
  <section class="app-content layout-center" id="editors">
        <!--相应内容-->
        <div class="list-content">
            <div class="row">
                <div class="col-md-12" style="padding-right: 0;">
                    <div class="widget">
                        <div class="widget-body" style="padding:10px 20px;">
                            <div class="table-responsive">
                                <table id="default-datatable" data-plugin="DataTable" class="table table-bordered" cellspacing="0" width="100%">
                                    <thead>
                                    <tr>
                                        <th>用户名</th>
                                        <th>IP</th>
                                        <th>城市</th>
                                        <th>浏览器</th>
                                        <th>时间</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>2</td>
                                        <td>3</td>
                                        <td>4</td>
                                        <td>5</td>
                                    </tr>
                                    </tbody>
                                </table>
                                <!--原有的行-->
                                <div class="col-sm-3">
                                    <!--id="default-datatable_info" -->
                                    <div class="dataTables_info" role="status" aria-live="polite">
                                        共<span class="now-num">3</span>条质量问题
                                    </div>
                                </div>
                                <!--页数-->
                                <div class="col-sm-6 text-center">
                                    <!-- id="default-datatable_paginate"-->
                                    <div class="dataTables_paginate paging_simple_numbers">
                                        <ul class="pagination">
                                            <li class="paginate_button previous disabled" id="default-datatable_previous">
                                                <a href="#" aria-controls="default-datatable" data-dt-idx="0" tabindex="0">
                                                    <i class="fa fa-angle-left" aria-hidden="true"></i>
                                                </a>
                                            </li>
                                            <li class="paginate_button active">
                                                <a href="#" aria-controls="default-datatable" data-dt-idx="1" tabindex="0">1</a>
                                            </li>
                                            <li class="paginate_button ">
                                                <a href="#" aria-controls="default-datatable" data-dt-idx="2" tabindex="0">2</a>
                                            </li>
                                            <li class="paginate_button next" id="default-datatable_next">
                                                <a href="#" aria-controls="default-datatable" data-dt-idx="3" tabindex="0">
                                                    <i class="fa fa-angle-right" aria-hidden="true"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div><!-- .widget-body -->
                    </div>
                </div>
            </div>
        </div>
    </section><!-- #dash-content -->
</template>


<style scoped>
    .app-main{
        margin-top: 60px;
        margin-bottom: 15px;
    }
</style>

