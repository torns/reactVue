// import Editor from './components/editor';
// import Vueditor from 'vueditor'
let parent =new Vue({
    el: '#editor1',
    components: {
        Editor
    }
});
let editor = parent.$children[0];
editor.setContent(`fill your content here`);
editor.getContent();