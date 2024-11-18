<template>
  <q-page class="flex flex-center q-mt-md">
    <q-card class="recovery-card">
      <q-card-section class="text-center">
        <div class="text-h5 q-mb-md">Recuperar Palavra-passe</div>
        <p class="text-grey-7">
          Introduza o seu e-mail para receber instruções de recuperação
        </p>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-y-sm">
          <q-input
            v-model="email"
            type="email"
            label="E-mail"
            outlined
            dense
            class="q-mb-sm"
            :rules="[
              val => !!val || 'O e-mail é obrigatório',
              val => /^[^@]+@[^@]+\.[^@]+$/.test(val) || 'E-mail inválido'
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="alternate_email" color="primary" />
            </template>
          </q-input>

          <q-btn
            type="submit"
            color="primary"
            label="Enviar Instruções"
            class="full-width q-mt-md"
            :loading="loading"
            unelevated
            icon-right="send"
          />
        </q-form>
      </q-card-section>

      <q-card-section class="text-center q-pa-sm">
        <q-btn
          flat
          color="primary"
          label="Voltar ao Login"
          to="/login"
          icon-left="arrow_back"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import useSupabase from 'boot/supabase'

export default {
  name: 'RecuperarSenhaPage',
  setup () {
    const router = useRouter()
    const $q = useQuasar()
    const { supabase } = useSupabase()

    const email = ref('')
    const loading = ref(false)

    const onSubmit = async () => {
      loading.value = true
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
          redirectTo: `${window.location.origin}/reset-password`
        })

        if (error) throw error

        $q.notify({
          type: 'positive',
          message: 'Instruções enviadas para o seu e-mail!'
        })

        router.push('/login')
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Erro ao enviar instruções. Tente novamente.'
        })
      } finally {
        loading.value = false
      }
    }

    return {
      email,
      loading,
      onSubmit
    }
  }
}
</script>

<style lang="scss" scoped>
.recovery-card {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  border-radius: 12px;
}

.q-input {
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
}
</style>