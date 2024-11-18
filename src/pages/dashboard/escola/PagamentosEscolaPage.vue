<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <!-- Status da Assinatura -->
      <div class="col-12">
        <q-card class="subscription-card">
          <q-card-section>
            <div class="row items-center justify-between">
              <div>
                <div class="text-h6">Status da Assinatura</div>
                <div class="text-subtitle1">
                  {{ statusAssinatura === 'ativo' ? 'Ativa' : 'Inativa' }}
                </div>
              </div>
              <q-chip
                :color="statusAssinatura === 'ativo' ? 'positive' : 'negative'"
                text-color="white"
              >
                {{ statusAssinatura === 'ativo' ? 'Em dia' : 'Pagamento Pendente' }}
              </q-chip>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Plano Atual -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Plano Atual</div>
            <div class="text-h4 text-primary q-mt-md">
              {{ formatMoney(valorMensalidade) }}
              <span class="text-subtitle1">/mês</span>
            </div>
            <div class="text-subtitle2 q-mt-sm">
              Próximo pagamento: {{ proximoPagamento }}
            </div>
          </q-card-section>

          <q-card-section>
            <div class="text-subtitle1">Recursos Incluídos:</div>
            <q-list>
              <q-item v-for="(recurso, index) in recursos" :key="index">
                <q-item-section avatar>
                  <q-icon name="check" color="positive" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ recurso }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-card-actions align="center">
            <q-btn
              color="primary"
              label="Efetuar Pagamento"
              @click="showPaymentDialog = true"
              :disable="statusAssinatura === 'ativo'"
            />
          </q-card-actions>
        </q-card>
      </div>

      <!-- Histórico de Pagamentos -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Histórico de Pagamentos</div>
            <q-list separator>
              <q-item v-for="pagamento in historicoPagamentos" :key="pagamento.id">
                <q-item-section>
                  <q-item-label>{{ pagamento.descricao }}</q-item-label>
                  <q-item-label caption>{{ pagamento.data }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div class="text-weight-bold">{{ formatMoney(pagamento.valor) }}</div>
                  <q-chip
                    :color="pagamento.status === 'confirmado' ? 'positive' : 'warning'"
                    text-color="white"
                    size="sm"
                  >
                    {{ pagamento.status }}
                  </q-chip>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Diálogo de Pagamento -->
    <PaymentDialog
      v-model="showPaymentDialog"
      :tipo="'Assinatura'"
      :valor="valorMensalidade"
      :descricao="'Mensalidade do Sistema de Gestão Escolar'"
      @payment-success="onPaymentSuccess"
    />
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import PaymentDialog from 'components/PaymentDialog.vue'
import useSupabase from 'boot/supabase'

export default defineComponent({
  name: 'PagamentosEscolaPage',
  components: { PaymentDialog },

  setup () {
    const $q = useQuasar()
    const { supabase } = useSupabase()
    const showPaymentDialog = ref(false)
    const statusAssinatura = ref('inativo')
    const valorMensalidade = ref(150000) // 150.000 AOA

    const recursos = [
      'Gestão ilimitada de alunos',
      'Gestão de professores',
      'Sistema de matrículas',
      'Gestão de turmas e cursos',
      'Relatórios e estatísticas',
      'Suporte técnico 24/7'
    ]

    const historicoPagamentos = ref([])

    const proximoPagamento = computed(() => {
      const hoje = new Date()
      const proximo = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1)
      return proximo.toLocaleDateString('pt-PT')
    })

    const formatMoney = (value) => {
      return new Intl.NumberFormat('pt-AO', {
        style: 'currency',
        currency: 'AOA'
      }).format(value)
    }

    const carregarHistoricoPagamentos = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        const { data: escola } = await supabase
          .from('escolas')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (escola) {
          const { data: pagamentos } = await supabase
            .from('pagamentos_escola')
            .select('*')
            .eq('escola_id', escola.id)
            .order('data', { ascending: false })

          historicoPagamentos.value = pagamentos || []

          // Verificar status da assinatura
          const hoje = new Date()
          const ultimoPagamento = pagamentos?.[0]
          if (ultimoPagamento) {
            const dataPagamento = new Date(ultimoPagamento.data)
            const diffMeses = (hoje.getMonth() - dataPagamento.getMonth()) + 
              (12 * (hoje.getFullYear() - dataPagamento.getFullYear()))
            
            statusAssinatura.value = diffMeses < 1 ? 'ativo' : 'inativo'
          }
        }
      } catch (error) {
        console.error('Erro ao carregar histórico:', error)
      }
    }

    const onPaymentSuccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        const { data: escola } = await supabase
          .from('escolas')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (escola) {
          // Registrar novo pagamento
          const { error } = await supabase
            .from('pagamentos_escola')
            .insert({
              escola_id: escola.id,
              valor: valorMensalidade.value,
              descricao: 'Mensalidade do Sistema',
              data: new Date().toISOString(),
              status: 'confirmado'
            })

          if (error) throw error

          statusAssinatura.value = 'ativo'
          await carregarHistoricoPagamentos()

          $q.notify({
            type: 'positive',
            message: 'Pagamento processado com sucesso!'
          })
        }
      } catch (error) {
        console.error('Erro ao processar pagamento:', error)
        $q.notify({
          type: 'negative',
          message: 'Erro ao processar pagamento'
        })
      }
    }

    onMounted(carregarHistoricoPagamentos)

    return {
      showPaymentDialog,
      statusAssinatura,
      valorMensalidade,
      recursos,
      historicoPagamentos,
      proximoPagamento,
      formatMoney,
      onPaymentSuccess
    }
  }
})
</script>

<style lang="scss" scoped>
.subscription-card {
  background: linear-gradient(45deg, #00b4ff, #2979ff);
  color: white;
}
</style>