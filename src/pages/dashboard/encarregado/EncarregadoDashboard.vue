<!-- Adicionar após o gráfico de desempenho -->
<template>
  <!-- ... código anterior ... -->

  <!-- Seção de Pagamentos -->
  <div class="col-12">
    <q-card>
      <q-card-section>
        <div class="text-h6">Pagamentos</div>
        <div class="row q-col-gutter-md q-mt-md">
          <!-- Propinas -->
          <div class="col-12 col-md-6">
            <q-card class="payment-card">
              <q-card-section>
                <div class="text-h6">Propina {{ mesAtual }}</div>
                <div class="text-subtitle1 q-mt-sm">
                  Status: 
                  <q-chip 
                    :color="propinaPaga ? 'positive' : 'negative'"
                    text-color="white"
                  >
                    {{ propinaPaga ? 'Pago' : 'Pendente' }}
                  </q-chip>
                </div>
                <div class="text-h5 q-mt-md">
                  {{ formatMoney(valorPropina) }}
                </div>
                <q-btn
                  color="primary"
                  label="Pagar Propina"
                  class="q-mt-sm"
                  :disable="propinaPaga"
                  @click="abrirPagamento('propina')"
                />
              </q-card-section>
            </q-card>
          </div>

          <!-- Outras Comparticipações -->
          <div class="col-12 col-md-6">
            <q-card class="payment-card">
              <q-card-section>
                <div class="text-h6">Comparticipações</div>
                <q-list separator>
                  <q-item v-for="comp in comparticipacoes" :key="comp.id">
                    <q-item-section>
                      <q-item-label>{{ comp.descricao }}</q-item-label>
                      <q-item-label caption>Vencimento: {{ comp.vencimento }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <div class="text-subtitle2">{{ formatMoney(comp.valor) }}</div>
                      <q-btn
                        flat
                        color="primary"
                        label="Pagar"
                        :disable="comp.pago"
                        @click="abrirPagamento('comparticipacao', comp)"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>

  <!-- Diálogo de Pagamento -->
  <PaymentDialog
    v-model="showPaymentDialog"
    :tipo="pagamentoAtual.tipo"
    :valor="pagamentoAtual.valor"
    :descricao="pagamentoAtual.descricao"
    @payment-success="onPaymentSuccess"
  />
</template>

<script>
import PaymentDialog from 'components/PaymentDialog.vue'
// ... importações anteriores ...

export default defineComponent({
  name: 'EncarregadoDashboard',
  components: { 
    // ... componentes anteriores ...
    PaymentDialog 
  },

  setup() {
    // ... código anterior ...

    const showPaymentDialog = ref(false)
    const pagamentoAtual = ref({
      tipo: '',
      valor: 0,
      descricao: ''
    })

    const mesAtual = computed(() => {
      return new Date().toLocaleString('pt-PT', { month: 'long' })
    })

    const valorPropina = ref(45000) // 45.000 AOA
    const propinaPaga = ref(false)

    const comparticipacoes = ref([
      {
        id: 1,
        descricao: 'Material Escolar',
        valor: 15000,
        vencimento: '2023-12-20',
        pago: false
      },
      {
        id: 2,
        descricao: 'Visita de Estudo',
        valor: 8000,
        vencimento: '2023-12-25',
        pago: false
      }
    ])

    const formatMoney = (value) => {
      return new Intl.NumberFormat('pt-AO', {
        style: 'currency',
        currency: 'AOA'
      }).format(value)
    }

    const abrirPagamento = (tipo, item = null) => {
      pagamentoAtual.value = {
        tipo: tipo === 'propina' ? 'Propina' : 'Comparticipação',
        valor: tipo === 'propina' ? valorPropina.value : item.valor,
        descricao: tipo === 'propina' ? `Propina ${mesAtual.value}` : item.descricao
      }
      showPaymentDialog.value = true
    }

    const onPaymentSuccess = () => {
      if (pagamentoAtual.value.tipo === 'Propina') {
        propinaPaga.value = true
      } else {
        const comp = comparticipacoes.value.find(
          c => c.descricao === pagamentoAtual.value.descricao
        )
        if (comp) comp.pago = true
      }

      // Registrar pagamento no Supabase
      registrarPagamento()
    }

    const registrarPagamento = async () => {
      try {
        const { error } = await supabase
          .from('pagamentos')
          .insert({
            aluno_id: educandoSelecionado.value?.id,
            tipo: pagamentoAtual.value.tipo,
            valor: pagamentoAtual.value.valor,
            descricao: pagamentoAtual.value.descricao,
            data_pagamento: new Date().toISOString()
          })

        if (error) throw error
      } catch (error) {
        console.error('Erro ao registrar pagamento:', error)
      }
    }

    return {
      // ... retornos anteriores ...
      showPaymentDialog,
      pagamentoAtual,
      mesAtual,
      valorPropina,
      propinaPaga,
      comparticipacoes,
      formatMoney,
      abrirPagamento,
      onPaymentSuccess
    }
  }
})
</script>

<style lang="scss" scoped>
// ... estilos anteriores ...

.payment-card {
  height: 100%;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
}
</style>