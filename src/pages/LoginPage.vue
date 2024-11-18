<template>
  <q-page class="flex flex-center q-mt-md">
    <q-card class="login-card">
      <q-card-section class="text-center">
        <div class="text-h5 text-weight-bold text-primary">Iniciar Sessão</div>
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
            :rules="[val => !!val || 'O e-mail é obrigatório']"
          >
            <template v-slot:prepend>
              <q-icon name="alternate_email" color="primary" />
            </template>
          </q-input>

          <q-input
            v-model="password"
            :type="isPwd ? 'password' : 'text'"
            label="Palavra-passe"
            outlined
            dense
            class="q-mb-sm"
            :rules="[val => !!val || 'A palavra-passe é obrigatória']"
          >
            <template v-slot:prepend>
              <q-icon name="lock" color="primary" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
                color="primary"
              />
            </template>
          </q-input>

          <div class="text-right q-mb-sm">
            <q-btn
              flat
              dense
              color="primary"
              label="Esqueceu a palavra-passe?"
              to="/recuperar-senha"
              icon-right="help_outline"
            />
          </div>

          <q-btn
            type="submit"
            color="primary"
            label="Entrar"
            class="full-width"
            :loading="loading"
            icon-right="login"
            unelevated
          />
        </q-form>
      </q-card-section>

      <q-card-section class="text-center q-pa-sm">
        <p class="text-grey-7 q-mb-xs">
          Não tem uma conta?
          <q-btn
            flat
            color="primary"
            label="Criar Conta"
            to="/registar"
            icon-right="person_add"
          />
        </p>
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
  name: 'LoginPage',
  setup () {
    const router = useRouter()
    const $q = useQuasar()
    const { supabase } = useSupabase()

    const email = ref('')
    const password = ref('')
    const isPwd = ref(true)
    const loading = ref(false)

    const onSubmit = async () => {
      loading.value = true
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.value,
          password: password.value
        })

        if (error) throw error

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', (await supabase.auth.getUser()).data.user.id)
          .single()

        if (profile) {
          router.push(`/dashboard/${profile.role}`)
        }
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'E-mail ou palavra-passe incorretos'
        })
      } finally {
        loading.value = false
      }
    }

    return {
      email,
      password,
      isPwd,
      loading,
      onSubmit
    }
  }
}
</script>

<style lang="scss" scoped>
.login-card {
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