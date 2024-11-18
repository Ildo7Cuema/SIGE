<template>
  <q-page padding>
    <div class="row q-col-gutter-lg">
      <!-- Informações de Contacto -->
      <div class="col-12 col-md-4">
        <q-card class="contact-card">
          <q-card-section>
            <div class="text-h5 text-primary q-mb-lg">Informações de Contacto</div>
            
            <div class="contact-info q-mb-md">
              <q-icon name="location_on" size="sm" color="primary" />
              <div>
                <div class="text-subtitle1">Endereço</div>
                <p>Rua Comandante Gika, Edifício Garden Towers, Torre B, 10º andar<br>
                Luanda, Angola</p>
              </div>
            </div>

            <div class="contact-info q-mb-md">
              <q-icon name="phone" size="sm" color="primary" />
              <div>
                <div class="text-subtitle1">Telefone</div>
                <p>+244 923 456 789<br>
                +244 923 987 654</p>
              </div>
            </div>

            <div class="contact-info q-mb-md">
              <q-icon name="email" size="sm" color="primary" />
              <div>
                <div class="text-subtitle1">E-mail</div>
                <p>info@gestaoescolar.co.ao<br>
                suporte@gestaoescolar.co.ao</p>
              </div>
            </div>

            <div class="text-h6 q-mt-lg q-mb-md">Redes Sociais</div>
            <div class="row q-gutter-sm">
              <q-btn round color="blue-9" icon="fab fa-facebook-f" type="a" href="https://facebook.com" target="_blank">
                <q-tooltip>Facebook</q-tooltip>
              </q-btn>
              <q-btn round color="pink-6" icon="fab fa-instagram" type="a" href="https://instagram.com" target="_blank">
                <q-tooltip>Instagram</q-tooltip>
              </q-btn>
              <q-btn round color="light-blue-7" icon="fab fa-linkedin-in" type="a" href="https://linkedin.com" target="_blank">
                <q-tooltip>LinkedIn</q-tooltip>
              </q-btn>
              <q-btn round color="light-blue" icon="fab fa-twitter" type="a" href="https://twitter.com" target="_blank">
                <q-tooltip>Twitter</q-tooltip>
              </q-btn>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Formulário de Contacto -->
      <div class="col-12 col-md-8">
        <q-card class="contact-card">
          <q-card-section>
            <div class="text-h5 text-primary q-mb-lg">Envie-nos uma Mensagem</div>
            
            <q-form @submit="onSubmit" class="q-gutter-y-sm">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="form.nome"
                    label="Nome Completo"
                    outlined
                    dense
                    :rules="[val => !!val || 'Nome é obrigatório']"
                  >
                    <template v-slot:prepend>
                      <q-icon name="person" color="primary" />
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="form.email"
                    label="E-mail"
                    type="email"
                    outlined
                    dense
                    :rules="[
                      val => !!val || 'E-mail é obrigatório',
                      val => /^[^@]+@[^@]+\.[^@]+$/.test(val) || 'E-mail inválido'
                    ]"
                  >
                    <template v-slot:prepend>
                      <q-icon name="email" color="primary" />
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="form.telefone"
                    label="Telefone"
                    mask="(+244) ### ### ###"
                    outlined
                    dense
                  >
                    <template v-slot:prepend>
                      <q-icon name="phone" color="primary" />
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-md-6">
                  <q-select
                    v-model="form.assunto"
                    :options="assuntos"
                    label="Assunto"
                    outlined
                    dense
                    :rules="[val => !!val || 'Assunto é obrigatório']"
                  >
                    <template v-slot:prepend>
                      <q-icon name="subject" color="primary" />
                    </template>
                  </q-select>
                </div>
                <div class="col-12">
                  <q-input
                    v-model="form.mensagem"
                    type="textarea"
                    label="Mensagem"
                    outlined
                    dense
                    rows="6"
                    :rules="[val => !!val || 'Mensagem é obrigatória']"
                  >
                    <template v-slot:prepend>
                      <q-icon name="message" color="primary" />
                    </template>
                  </q-input>
                </div>
              </div>

              <div class="row justify-end q-mt-md">
                <q-btn
                  type="submit"
                  color="primary"
                  label="Enviar Mensagem"
                  :loading="loading"
                  icon-right="send"
                  unelevated
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <!-- Mapa -->
      <div class="col-12">
        <q-card class="map-card">
          <q-card-section>
            <div class="text-h5 text-primary q-mb-md">Nossa Localização</div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3942.0385842731036!2d13.234167!3d-8.838333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a51f15106c0e74d%3A0x7c3c8ec95f56fb65!2sLuanda%2C%20Angola!5e0!3m2!1sen!2sus!4v1660000000000!5m2!1sen!2sus"
              width="100%"
              height="450"
              style="border:0;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'
import useSupabase from 'boot/supabase'

export default defineComponent({
  name: 'ContactoPage',

  setup () {
    const $q = useQuasar()
    const { supabase } = useSupabase()
    const loading = ref(false)

    const form = ref({
      nome: '',
      email: '',
      telefone: '',
      assunto: null,
      mensagem: ''
    })

    const assuntos = [
      'Informações Gerais',
      'Suporte Técnico',
      'Vendas',
      'Parcerias',
      'Outros'
    ]

    const onSubmit = async () => {
      loading.value = true
      try {
        const { error } = await supabase
          .from('mensagens')
          .insert([
            {
              nome: form.value.nome,
              email: form.value.email,
              telefone: form.value.telefone,
              assunto: form.value.assunto,
              mensagem: form.value.mensagem
            }
          ])

        if (error) throw error

        $q.notify({
          type: 'positive',
          message: 'Mensagem enviada com sucesso! Entraremos em contacto em breve.'
        })

        // Limpar formulário
        form.value = {
          nome: '',
          email: '',
          telefone: '',
          assunto: null,
          mensagem: ''
        }
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error)
        $q.notify({
          type: 'negative',
          message: 'Erro ao enviar mensagem. Tente novamente.'
        })
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      assuntos,
      loading,
      onSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
.contact-card, .map-card {
  border-radius: 12px;
  height: 100%;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
}

.contact-info {
  display: flex;
  gap: 16px;
  align-items: flex-start;

  .q-icon {
    margin-top: 4px;
  }

  p {
    margin: 4px 0 0;
  }
}

.q-input, .q-select {
  :deep(.q-field__control) {
    border-width: 1px;
    border-radius: 8px;
    height: 44px;
  }

  :deep(.q-field__marginal) {
    height: 44px;
  }
}

.q-btn {
  border-radius: 8px;
  height: 44px;

  &--round {
    height: 40px;
    width: 40px;
  }
}

iframe {
  border-radius: 8px;
}
</style>