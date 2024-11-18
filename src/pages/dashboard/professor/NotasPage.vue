<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <!-- Filtros -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-3">
                <q-select
                  v-model="turmaSelected"
                  :options="minhasTurmas"
                  label="Turma"
                  option-label="nome"
                  :rules="[val => !!val || 'Selecione uma turma']"
                  @update:model-value="carregarAlunos"
                />
              </div>
              <div class="col-12 col-md-3">
                <q-select
                  v-model="disciplinaSelected"
                  :options="minhasDisciplinas"
                  label="Disciplina"
                  option-label="nome"
                  :rules="[val => !!val || 'Selecione uma disciplina']"
                  @update:model-value="carregarNotas"
                />
              </div>
              <div class="col-12 col-md-3">
                <q-select
                  v-model="trimestreSelected"
                  :options="trimestres"
                  label="Trimestre"
                  @update:model-value="carregarNotas"
                />
              </div>
              <div class="col-12 col-md-3">
                <q-btn
                  color="primary"
                  icon="print"
                  label="Imprimir Mini-Pauta"
                  @click="imprimirMiniPauta"
                  class="full-width"
                  :disable="!alunos.length"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Tabela de Notas -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">Notas dos Alunos</div>
            <q-table
              :rows="alunos"
              :columns="colunas"
              row-key="id"
              :loading="loading"
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="nome" :props="props">
                    {{ props.row.nome }}
                  </q-td>
                  <q-td 
                    v-for="campo in camposAtivos"
                    :key="campo.name"
                    :props="props"
                  >
                    <q-input
                      v-model.number="props.row[campo.name]"
                      type="number"
                      dense
                      :rules="[
                        val => val >= 0 && val <= 20 || 'Nota deve estar entre 0 e 20'
                      ]"
                      @change="salvarNota(props.row, campo.name)"
                    />
                  </q-td>
                  <q-td key="media" :props="props">
                    {{ calcularMedia(props.row) }}
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>

      <!-- Botão de Autorizar Escola -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="row items-center justify-between">
              <div class="text-h6">Autorização para Escola</div>
              <q-btn
                :color="autorizacaoEscola ? 'negative' : 'positive'"
                :label="autorizacaoEscola ? 'Revogar Autorização' : 'Autorizar Escola'"
                @click="toggleAutorizacaoEscola"
              />
            </div>
            <p class="text-grey-8 q-mt-sm">
              {{ autorizacaoEscola 
                ? 'A escola está autorizada a inserir notas nesta disciplina' 
                : 'A escola não está autorizada a inserir notas nesta disciplina' 
              }}
            </p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import useSupabase from 'boot/supabase'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import moment from 'moment'

export default defineComponent({
  name: 'NotasPage',

  setup() {
    const $q = useQuasar()
    const { supabase } = useSupabase()
    const loading = ref(false)
    const minhasTurmas = ref([])
    const minhasDisciplinas = ref([])
    const alunos = ref([])
    const turmaSelected = ref(null)
    const disciplinaSelected = ref(null)
    const trimestreSelected = ref('I')
    const trimestres = ['I', 'II', 'III']
    const autorizacaoEscola = ref(false)

    // Campos de notas por trimestre
    const camposPorTrimestre = {
      'I': [
        { name: 'mac1', label: 'MAC1' },
        { name: 'npp', label: 'NPP' },
        { name: 'npt', label: 'NPT' },
        { name: 'mt', label: 'MT' }
      ],
      'II': [
        { name: 'mac2', label: 'MAC2' },
        { name: 'npp', label: 'NPP' },
        { name: 'npt', label: 'NPT' },
        { name: 'mt', label: 'MT' }
      ],
      'III': [
        { name: 'mac3', label: 'MAC3' },
        { name: 'npt', label: 'NPT' },
        { name: 'mt', label: 'MT' },
        { name: 'mfd', label: 'MFD' }
      ]
    }

    // Campos adicionais para línguas no III Trimestre
    const camposLinguas = [
      { name: 'nee', label: 'NEE' },
      { name: 'neo', label: 'NEO' },
      { name: 'mec', label: 'MEC' }
    ]

    const camposAtivos = computed(() => {
      let campos = camposPorTrimestre[trimestreSelected.value]
      
      if (trimestreSelected.value === 'III' && 
          disciplinaSelected.value?.tipo === 'lingua' &&
          ['6ª', '9ª', '12ª', '13ª'].includes(turmaSelected.value?.classe)) {
        campos = [...campos, ...camposLinguas]
      }
      
      return campos
    })

    const colunas = computed(() => {
      const colunasBase = [
        { name: 'nome', label: 'Nome do Aluno', field: 'nome', align: 'left' }
      ]

      const colunasNotas = camposAtivos.value.map(campo => ({
        name: campo.name,
        label: campo.label,
        field: campo.name,
        align: 'center'
      }))

      return [
        ...colunasBase,
        ...colunasNotas,
        { name: 'media', label: 'Média', field: 'media', align: 'center' }
      ]
    })

    const carregarMinhasTurmas = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        const { data, error } = await supabase
          .from('professor_turmas')
          .select(`
            turmas (
              id,
              nome,
              classe,
              periodo,
              curso
            )
          `)
          .eq('professor_id', user.id)

        if (error) throw error
        minhasTurmas.value = data.map(pt => pt.turmas)
      } catch (error) {
        console.error('Erro ao carregar turmas:', error)
        $q.notify({
          type: 'negative',
          message: 'Erro ao carregar turmas'
        })
      }
    }

    const carregarMinhasDisciplinas = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        const { data, error } = await supabase
          .from('professor_disciplinas')
          .select(`
            disciplinas (
              id,
              nome,
              tipo
            )
          `)
          .eq('professor_id', user.id)

        if (error) throw error
        minhasDisciplinas.value = data.map(pd => pd.disciplinas)
      } catch (error) {
        console.error('Erro ao carregar disciplinas:', error)
        $q.notify({
          type: 'negative',
          message: 'Erro ao carregar disciplinas'
        })
      }
    }

    const carregarAlunos = async () => {
      if (!turmaSelected.value) return
      loading.value = true
      try {
        const { data, error } = await supabase
          .from('alunos')
          .select('*')
          .eq('turma_id', turmaSelected.value.id)

        if (error) throw error
        alunos.value = data
      } catch (error) {
        console.error('Erro ao carregar alunos:', error)
        $q.notify({
          type: 'negative',
          message: 'Erro ao carregar alunos'
        })
      } finally {
        loading.value = false
      }
    }

    const carregarNotas = async () => {
      if (!turmaSelected.value || !disciplinaSelected.value) return
      loading.value = true
      try {
        const { data, error } = await supabase
          .from('notas')
          .select('*')
          .eq('turma_id', turmaSelected.value.id)
          .eq('disciplina_id', disciplinaSelected.value.id)
          .eq('trimestre', trimestreSelected.value)

        if (error) throw error

        // Atualizar notas dos alunos
        alunos.value = alunos.value.map(aluno => ({
          ...aluno,
          ...data.find(nota => nota.aluno_id === aluno.id)
        }))
      } catch (error) {
        console.error('Erro ao carregar notas:', error)
        $q.notify({
          type: 'negative',
          message: 'Erro ao carregar notas'
        })
      } finally {
        loading.value = false
      }
    }

    const salvarNota = async (aluno, campo) => {
      try {
        const { error } = await supabase
          .from('notas')
          .upsert({
            aluno_id: aluno.id,
            turma_id: turmaSelected.value.id,
            disciplina_id: disciplinaSelected.value.id,
            trimestre: trimestreSelected.value,
            [campo]: aluno[campo]
          })

        if (error) throw error

        $q.notify({
          type: 'positive',
          message: 'Nota salva com sucesso!'
        })
      } catch (error) {
        console.error('Erro ao salvar nota:', error)
        $q.notify({
          type: 'negative',
          message: 'Erro ao salvar nota'
        })
      }
    }

    const toggleAutorizacaoEscola = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        const { error } = await supabase
          .from('autorizacoes_notas')
          .upsert({
            professor_id: user.id,
            disciplina_id: disciplinaSelected.value.id,
            turma_id: turmaSelected.value.id,
            autorizado: !autorizacaoEscola.value
          })

        if (error) throw error

        autorizacaoEscola.value = !autorizacaoEscola.value
        $q.notify({
          type: 'positive',
          message: `Autorização ${autorizacaoEscola.value ? 'concedida' : 'revogada'} com sucesso!`
        })
      } catch (error) {
        console.error('Erro ao alterar autorização:', error)
        $q.notify({
          type: 'negative',
          message: 'Erro ao alterar autorização'
        })
      }
    }

    const calcularMedia = (aluno) => {
      if (!aluno) return 0

      const trimestre = trimestreSelected.value
      let media = 0

      if (trimestre === 'III') {
        // Média Final da Disciplina (MFD)
        const mt1 = parseFloat(aluno.mt1) || 0
        const mt2 = parseFloat(aluno.mt2) || 0
        const mt3 = parseFloat(aluno.mt3) || 0

        if (disciplinaSelected.value?.tipo === 'lingua') {
          const nee = parseFloat(aluno.nee) || 0
          const neo = parseFloat(aluno.neo) || 0
          const mec = (nee + neo) / 2
          media = ((mt1 + mt2 + mt3) / 3 * 0.6 + mec * 0.4)
        } else {
          media = (mt1 + mt2 + mt3) / 3
        }
      } else {
        // Média Trimestral (MT)
        const mac = parseFloat(aluno[`mac${trimestre}`]) || 0
        const npp = parseFloat(aluno.npp) || 0
        const npt = parseFloat(aluno.npt) || 0
        media = (mac + npp + npt) / 3
      }

      return media.toFixed(1)
    }

    onMounted(() => {
      carregarMinhasTurmas()
      carregarMinhasDisciplinas()
    })

    return {
      loading,
      minhasTurmas,
      minhasDisciplinas,
      alunos,
      turmaSelected,
      disciplinaSelected,
      trimestreSelected,
      trimestres,
      autorizacaoEscola,
      camposAtivos,
      colunas,
      carregarAlunos,
      carregarNotas,
      salvarNota,
      toggleAutorizacaoEscola,
      calcularMedia
    }
  }
})
</script>