<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white q-py-xs">
      <q-toolbar>
        <q-toolbar-title class="text-weight-bold">
          <q-icon name="school" size="28px" class="q-mr-sm" />
          Sistema de Gestão Escolar
        </q-toolbar-title>

        <div class="q-gutter-sm">
          <q-btn flat round dense icon="home" to="/">
            <q-tooltip>Início</q-tooltip>
          </q-btn>
          <q-btn flat round dense icon="info" to="/sobre">
            <q-tooltip>Sobre</q-tooltip>
          </q-btn>
          <q-btn flat round dense icon="contact_support" to="/contacto">
            <q-tooltip>Contacto</q-tooltip>
          </q-btn>
          <template v-if="isLoggedIn">
            <q-btn flat round dense icon="logout" @click="logout">
              <q-tooltip>Sair</q-tooltip>
            </q-btn>
          </template>
          <template v-else>
            <q-btn flat round dense icon="person" to="/login">
              <q-tooltip>Entrar</q-tooltip>
            </q-btn>
          </template>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import useSupabase from 'boot/supabase'

export default {
  name: 'MainLayout',

  setup () {
    const router = useRouter()
    const $q = useQuasar()
    const { supabase } = useSupabase()
    const user = ref(null)

    const isLoggedIn = computed(() => {
      return user.value !== null
    })

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      user.value = session?.user || null
    }

    const logout = async () => {
      try {
        await supabase.auth.signOut()
        user.value = null
        $q.notify({
          type: 'positive',
          message: 'Sessão terminada com sucesso'
        })
        router.push('/login')
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Erro ao terminar sessão'
        })
      }
    }

    onMounted(() => {
      checkUser()
      supabase.auth.onAuthStateChange((_event, session) => {
        user.value = session?.user || null
      })
    })

    return {
      isLoggedIn,
      logout
    }
  }
}
</script>

<style lang="scss" scoped>
.q-toolbar {
  min-height: 56px;
}

.q-btn {
  margin: 0 2px;
}
</style>