<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="min-width: 350px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Pagamento de {{ tipo }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup>
          <q-tooltip>Fechar</q-tooltip>
        </q-btn>
      </q-card-section>

      <q-card-section>
        <div class="text-h5 q-mb-md">Total a pagar: {{ formatMoney(valor) }}</div>

        <q-tabs
          v-model="metodoPagamento"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="multicaixa" icon="payment" label="Multicaixa Express" />
          <q-tab name="stripe" icon="credit_card" label="Cartão de Crédito" />
        </q-tabs>

        <q-tab-panels v-model="metodoPagamento" animated>
          <q-tab-panel name="multicaixa">
            <div class="text-center">
              <q-img
                src="~assets/multicaixa-express.png"
                style="height: 100px; max-width: 200px"
                class="q-mb-md"
              />
              
              <div class="text-body1 q-mb-md">
                Referência de Pagamento:
                <div class="text-h5 text-primary">{{ referencia }}</div>
              </div>

              <q-btn
                color="primary"
                label="Copiar Referência"
                @click="copiarReferencia"
                class="q-mb-md"
                icon="content_copy"
                unelevated
              />

              <div class="text-caption">
                Abra o seu aplicativo Multicaixa Express e use esta referência para efetuar o pagamento
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="stripe">
            <div id="stripe-payment-element" class="q-mb-md"></div>
            
            <q-btn
              color="primary"
              :label="processando ? 'Processando...' : 'Pagar com Cartão'"
              @click="processarPagamentoStripe"
              :loading="processando"
              class="full-width"
              icon="credit_card"
              unelevated
            />
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
// Script remains unchanged
</script>

<style lang="scss" scoped>
.q-dialog__inner {
  :deep(.q-card) {
    border-radius: 12px;
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

#stripe-payment-element {
  min-height: 200px;
  border-radius: 8px;
  overflow: hidden;
}

.q-tab-panels {
  border-radius: 8px;
}
</style>