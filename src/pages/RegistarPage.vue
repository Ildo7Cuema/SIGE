<template>
  <q-page class="flex flex-center q-mt-md">
    <q-card class="register-card">
      <q-card-section class="text-center">
        <div class="text-h5 q-mb-md">Criar Nova Conta</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-y-sm">
          <q-input
            v-model="name"
            label="Nome Completo"
            outlined
            dense
            class="q-mb-sm"
            :rules="[val => !!val || 'O nome é obrigatório']"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="primary" />
            </template>
          </q-input>

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

          <q-input
            v-model="password"
            :type="isPwd ? 'password' : 'text'"
            label="Palavra-passe"
            outlined
            dense
            class="q-mb-sm"
            :rules="[
              val => !!val || 'A palavra-passe é obrigatória',
              val => val.length >= 6 || 'A palavra-passe deve ter pelo menos 6 caracteres'
            ]"
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

          <q-select
            v-model="role"
            :options="roleOptions"
            label="Tipo de Utilizador"
            outlined
            dense
            class="q-mb-sm"
            :rules="[val => !!val || 'Selecione o tipo de utilizador']"
          >
            <template v-slot:prepend>
              <q-icon name="badge" color="primary" />
            </template>
          </q-select>

          <q-btn
            type="submit"
            color="primary"
            label="Registar"
            class="full-width q-mt-md"
            :loading="loading"
            unelevated
          />
        </q-form>
      </q-card-section>

      <q-card-section class="text-center q-pa-sm">
        <p class="text-grey-7 q-mb-xs">
          Já tem uma conta?
          <q-btn flat color="primary" label="Iniciar Sessão" to="/login" />
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
  name: 'RegistarPage',
  setup () {
    const router = useRouter()
    const $q = useQuasar()
    const { supabase } = useSupabase()

    const name = ref('')
    const email = ref('')
    const password = ref('')
    const role = ref(null)
    const isPwd = ref(true)
    const loading = ref(false)

    const roleOptions = [
      { label: 'Escola', value: 'escola' },
      { label: 'Professor', value: 'professor' },
      { label: 'Aluno', value: 'aluno' },
      { label: 'Encarregado de Educação', value: 'encarregado' }
    ]

    const onSubmit = async () => {
      loading.value = true
      try {
        const { data: { user }, error } = await supabase.auth.signUp({
          email: email.value,
          password: password.value
        })

        if (error) throw error

        // Criar perfil do utilizador
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              name: name.value,
              role: role.value
            }
          ])

        if (profileError) throw profileError

        $q.notify({
          type: 'positive',
          message: 'Conta criada com sucesso! Verifique o seu e-mail para confirmar o registo.'
        })

        router.push('/login')
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Erro ao criar conta. Tente novamente.'
        })
      } finally {
        loading.value = false
      }
    }

    return {
      name,
      email,
      password,
      role,
      roleOptions,
      isPwd,
      loading,
      onSubmit
    }
  }
}
</script>

<style lang="scss" scoped>
.register-card {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  border-radius: 12px;
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
}
</style>