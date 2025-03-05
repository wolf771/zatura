<template>
    <div id="suggestion">
        <vs-button @click.stop="active=!active" color="primary" type="filled" class="suggestion-btn" icon-pack="feather" icon="icon-send"></vs-button>
        <vs-sidebar hidden-background position-right v-model="active" click-not-close class="items-no-padding">
            <div class="h-full">
                <div class="suggestion-header mt-6 flex items-center justify-between px-6">
                    <div>
                        <h4>Sugerencias</h4>
                        <small>Envianos tus sugerencias...</small>
                    </div>
                    <feather-icon icon="XIcon" @click.stop="active = false" class="cursor-pointer"></feather-icon>
                </div>

                <vs-divider class="mb-0"></vs-divider>

                <div class="scroll-area--customizer pt-2 pb-6">
                    <div v-loading="loading" element-loading-text="Enviando sugerencias..." style="margin: 50px 0px"></div>
                    <div v-if="!loading">
                    	<!-- <div class="px-6 mt-5">
                    		<vs-input label-placeholder="Asunto" v-model="asunto" style="width: 100%"/>
                    	</div> -->
                        <div class="px-6 mt-2">
                            <label for="">
                                Expresate libremente,
                                 tus comentarios son anónimos y 
                                 bien recibidos
                            </label>
                         <el-input
                            type="textarea"
                            :rows="2"
                            placeholder=""
                            v-model="textarea">
                        </el-input>
                        </div>
                        <div class="px-6 mt-5">
                            <vs-button 
                                color="primary" 
                                type="filled" 
                                icon-pack="feather" 
                                icon="icon-send"
                                @click="sendSuggestion"
                            >Enviar</vs-button>
                        </div>
                    </div>
                </div>
            </div>
        </vs-sidebar>
    </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import emailService from '@/services/emails.service.js'
import { mapState } from 'vuex'

export default {
    components: {
        VuePerfectScrollbar
    },
    data() {
        return {
            active: false,
            loading: false,
            asunto: null,
            textarea: null,
            settings: {}
        }
    },
    computed: {
        ...mapState(['user']),
    	isSubjectValid() {
            return true
    		//return this.asunto != null && this.asunto != "";
    	},
    	isContentValid() {
    		return this.textarea != null && this.textarea != "";
    	}
    },
    methods: {
        sendSuggestion() {
            if(this.isContentValid && this.isSubjectValid)
            {
            	this.loading = true

	            let data = {
	                subject: "Sugerencia Zatura - "+ this.user.name,
	                body: this.textarea
	            }

	            emailService.suggestion(data)
	            .then(res => {
	                if(res)
	                {
	                    this.loading = false
	                    this.active = false
	                    this.textarea = null
	                    this.asunto = null
	                    setTimeout(() => {
	                        this.$notify({
	                            title: `Sugerencia Enviada.`,
	                            type: 'success',
	                            message: `Gracias por contribuir en el mejoramiento de Zatura, apreciamos mucho el tiempo que tomaste enviando esta sugerencia.`
	                        });
	                    }, 1000)
	                }
	            })
	            .catch(error => {
	                this.$notify({
	                    title: `Ocurrio un problema durante el envio.`,
	                    type: 'error',
	                    message: error
	                });
	            })
            }
        }
    }
}
</script>

<style lang="scss">
#suggestion {
    .vs-sidebar{
        position: fixed;
        z-index: 52000;
        width: 400px;
        max-width: 90vw;
    }
}

.suggestion-btn{
    position: fixed;
    top: 70%;
    right: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    z-index: 50000;
}

.scroll-area--suggestion {
    height: calc(100% - 5rem);
}
</style>
