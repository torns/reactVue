<script>
import Header from 'header';
import Nav from 'nav';
import Main from './main';
import Footer from 'footer';
// import './js/plugins.js';
export default {
    components: {
        Header,
        Nav,
        Main,
        Footer
    }
}
</script>

<template>
<div class="row">

    <div class="col-xs-2">
        <Nav></Nav>
    </div>
    <div class="col-xs-offset-2 col-xs-10">
        <Header></Header>
        <Main></Main>
        <Footer></Footer>
    </div>
    <!--<Footer/>-->
</div>
</template>

<style scoped>

</style>


