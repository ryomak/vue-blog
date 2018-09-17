<template>
    <div>
	  	<section>
			<h2><span>お問い合わせ</span></h2>
		    <el-form v-if="show" class="container">
		    	<el-form-item label="メールアドレス">
			        <el-input 
			                      type="email"
			                      v-model="form.email"
			                      required
			                      placeholder="test@example.com">
			        </el-input>
		      	</el-form-item>
		      	<el-form-item label="名前">
			        <el-input 
			                      type="text"
			                      v-model="form.title"
			                      required
			                      placeholder="田中太郎">
			        </el-input>
		    	</el-form-item>
		        <el-form-item label="内容">
			        <el-input id="textarea"
			         			type="textarea"
			                     v-model="form.content"
			                     placeholder="内容"
			                     :rows="4"
			                     :max-rows="6">
			    	</el-input>
		    	</el-form-item>
			    <el-form-item>
			    	<el-button type="success" @click="onSubmit" >Submit</el-button>
			        <el-button type="reset" @click="onReset" >Reset</el-button>
			   </el-form-item>
		    </el-form>
	    </section>
    </div>
</template>

<script>
  import axios from 'axios'
export default {
  data () {
    return {
      form: {
        email: '',
        title: '',
        content:'',
      },
      show: true
    }
  },
  methods: {
    onSubmit () {
      evt.preventDefault();
      alert(JSON.stringify(this.form));
      this.postform(this.form);
    },
    onReset () {
      /* Reset our form values */
      this.form.email = '';
      this.form.title = '';
      this.form.content =  '';
    },
    postform(v){
      var form = document.createElement('form');
      var mail_r = document.createElement('input');
      var title_r = document.createElement('input');
      var content_r = document.createElement('input');
   
      form.method = 'POST';
      form.action = 'https://docs.google.com/forms/d/e/1FAIpQLSdScSitSpdVGNIGq1C7z56AWANOxj6bBHaS-99TacXK2QEH3Q/formResponse';
   
      mail_r.type = 'hidden'; //入力フォームが表示されないように
      mail_r.name = 'entry.2040554687';
      mail_r.value = v.email;
      title_r.type = 'hidden'; //入力フォームが表示されないように
      title_r.name = 'entry.787095462';
      title_r.value = v.title;
      content_r.type = 'hidden'; //入力フォームが表示されないように
      content_r.name = 'entry.1722078225';
      content_r.value = v.content;
   
      form.appendChild(mail_r);
      form.appendChild(title_r);
      form.appendChild(content_r);
      document.body.appendChild(form);
   
      form.submit();
    }
  }
}
</script>