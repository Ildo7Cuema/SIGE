<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-md-8">
        <q-card class="payment-card q-mb-md">
          <q-card-section>
            <div class="text-h5">Pagamento de Mensalidade</div>
            <div class="text-subtitle2 text-grey-7">
              Para continuar a utilizar o sistema, por favor efetue o pagamento da mensalidade
            </div>
          </q-card-section>

          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <div class="text-h6 q-mb-md">Detalhes do Pagamento</div>
                <q-list bordered separator>
                  <q-item>
                    <q-item-section>
                      <q-item-label>Mensalidade</q-item-label>
                      <q-item-label caption>{{ mesAtual }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <div class="text-h6">{{ formatMoney(valorMensalidade) }}</div>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label>Status</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-chip color="negative" text-color="white">Em Atraso</q-chip>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="center" class="q-pa-md">
            <q-btn
              color="primary"
              label="Pagar Agora"
              @click="showPaymentDialog = true"
              class="full-width"
            />
          </q-card-actions>
        </q-card>

        <q-card class="info-card">
          <q-card-section>
            <div class="text-h6">Informações Importantes</div>
            <q-list>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="info" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>O acesso ao sistema será liberado após a confirmação do pagamento</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="help" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Em caso de dúvidas, entre em contacto com a secretaria</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <PaymentDialog
      v-model="showPaymentDialog"
      :tipo="'Mensalidade'"
      :valor="valorMensalidade"
      :descricao="'Mensalidade ' + mesAtual"
      @payment-success="onPaymentSuccess"
    />
  </q-page>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import PaymentDialog from 'components/PaymentDialog.vue'
import useSupabase from 'boot/supabase'

export default defineComponent({
  name: 'PagamentosPage',
  components: { PaymentDialog },

  setup() {
    const router = useRouter()
    const $q = useQuasar()
    const { supabase } = useSupabase()
    const showPaymentDialog = ref(false)
    const valorMensalidade = ref(45000) // 45.000 AOA

    const mesAtual = computed(() => {
      return new Date().toLocaleString('pt-PT', { month: 'long', year: 'numeric' })
    })

    const formatMoney = (value) => {
      return new Intl.NumberFormat('pt-AO', {
        style: 'currency',
        currency: 'AOA'
      }).format(value)
    }

    const onPaymentSuccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          if (profile) {
            // Redirecionar para o dashboard apropriado
            const dashboardRoutes = {
              aluno: '/dashboard/aluno',
              encarregado: '/dashboard/encarregado'
            }

            $q.notify({
              type: 'positive',
              message: 'Pagamento confirmado! Redirecionando...'
            })

            router.push(dashboardRoutes[profile.role] || '/')
          }
        }
      } catch (error) {
        console.error('Erro após pagamento:', error)
        $q.notify({
          type: 'negative',
          message: 'Erro ao processar pagamento'
        })
      }
    }

    return {
      showPaymentDialog,
      valorMensalidade,
      mesAtual,
      formatMoney,
      onPaymentSuccess
    }
  }
})
</script>

<style lang="scss" scoped>
.payment-card, .info-card {
  border-radius: 8px;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
}

.info-card {
  background-color: #f5f5f5;
}
</style>