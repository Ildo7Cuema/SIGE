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
                  :options="turmas"
                  label="Turma"
                  option-label="nome"
                  emit-value
                  map-options
                  @update:model-value="carregarAlunos"
                />
              </div>
              <div class="col-12 col-md-3">
                <q-select
                  v-model="disciplinaSelected"
                  :options="disciplinas"
                  label="Disciplina"
                  option-label="nome"
                  emit-value
                  map-options
                  @update:model-value="verificarAutorizacao"
                />
              </div>
              <div class="col-12 col-md-3">
                <q-select
                  v-model="trimestreSelected"
                  :options="trimestres"
                  label="Trimestre"
                  @update:model-value="atualizarCamposNotas"
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

      <!-- Alerta de Autorização -->
      <div class="col-12" v-if="!autorizado">
        <q-banner class="bg-warning text-white">
          Aguardando autorização do professor para inserir notas nesta disciplina.
        </q-banner>
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
                      :disable="!autorizado"
                      :rules="[
                        val => val >= 0 && val <= 20 || 'Nota deve estar entre 0 e 20'
                      ]"
                      @change="salvarNota(props.row, campo.name)"
                    />
                  </q-td>
                  <q-td key="media" :props="props">
                    {{ calcularMedia(props.row) }}
                  </q-td>
                  <q-td key="actions" :props="props">
                    <q-btn
                      flat
                      round
                      color="primary"
                      icon="print"
                      @click="imprimirBoletim(props.row)"
                    >
                      <q-tooltip>Imprimir Boletim</q-tooltip>
                    </q-btn>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
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
    const autorizado = ref(false)
    const turmas = ref([])
    const disciplinas = ref([])
    const alunos = ref([])
    const turmaSelected = ref(null)
    const disciplinaSelected = ref(null)
    const trimestreSelected = ref('I')
    const trimestres = ['I', 'II', 'III']

    // Classes que têm exame
    const classesComExame = ['6ª', '9ª', '12ª', '13ª']
    
    // Disciplinas de línguas
    const disciplinasLinguas = ['Língua Portuguesa', 'Inglês', 'Francês']

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
      
      if (trimestreSelected.value === 'III') {
        const turmaAtual = turmas.value.find(t => t.id === turmaSelected.value)
        const disciplinaAtual = disciplinas.value.find(d => d.id === disciplinaSelected.value)
        
        if (classesComExame.includes(turmaAtual?.classe) && 
            disciplinasLinguas.includes(disciplinaAtual?.nome)) {
          campos = [...campos, ...camposLinguas]
        }
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
        { name: 'media', label: 'Média', field: 'media', align: 'center' },
        { name: 'actions', label: 'Ações', field: 'actions', align: 'center' }
      ]
    })

    const calcularMedia = (aluno) => {
      if (!aluno) return 0

      const trimestre = trimestreSelected.value
      let media = 0

      if (trimestre === 'III') {
        // Média Final da Disciplina (MFD)
        const mt1 = parseFloat(aluno.mt1) || 0
        const mt2 = parseFloat(aluno.mt2) || 0
        const mt3 = parseFloat(aluno.mt3) || 0

        if (disciplinasLinguas.includes(disciplinaSelected.value?.nome)) {
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

    const salvarNota = async (aluno, campo) => {
      try {
        const { error } = await supabase
          .from('notas')
          .upsert({
            aluno_id: aluno.id,
            disciplina_id: disciplinaSelected.value,
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

    const verificarAutorizacao = async () => {
      if (!disciplinaSelected.value) return
      
      try {
        const { data: { user } } = await supabase.auth.getUser()
        const { data, error } = await supabase
          .from('autorizacoes_notas')
          .select('*')
          .eq('disciplina_id', disciplinaSelected.value)
          .eq('professor_id', user.id)
          .single()

        if (error) throw error
        autorizado.value = data?.autorizado || false
      } catch (error) {
        console.error('Erro ao verificar autorização:', error)
        autorizado.value = false
      }
    }

    const imprimirMiniPauta = () => {
      const doc = new jsPDF()
      
      // Cabeçalho
      doc.setFontSize(16)
      doc.text('Mini-Pauta de Avaliações', 105, 15, { align: 'center' })
      
      doc.setFontSize(12)
      doc.text(`Turma: ${turmaSelected.value?.nome}`, 14, 25)
      doc.text(`Disciplina: ${disciplinaSelected.value?.nome}`, 14, 32)
      doc.text(`Trimestre: ${trimestreSelected.value}`, 14, 39)
      doc.text(`Data: ${moment().format('DD/MM/YYYY')}`, 14, 46)

      // Preparar dados para a tabela
      const tableData = alunos.value.map(aluno => {
        const row = [aluno.nome]
        camposAtivos.value.forEach(campo => {
          row.push(aluno[campo.name] || '')
        })
        row.push(calcularMedia(aluno))
        return row
      })

      // Cabeçalho da tabela
      const headers = ['Nome']
      camposAtivos.value.forEach(campo => {
        headers.push(campo.label)
      })
      headers.push('Média')

      // Gerar tabela
      doc.autoTable({
        startY: 55,
        head: [headers],
        body: tableData,
        theme: 'grid',
        styles: { fontSize: 8 }
      })

      doc.save(`mini-pauta-${moment().format('YYYY-MM-DD')}.pdf`)
    }

    onMounted(async () => {
      try {
        const [turmasRes, disciplinasRes] = await Promise.all([
          supabase.from('turmas').select('*'),
          supabase.from('disciplinas').select('*')
        ])

        turmas.value = turmasRes.data || []
        disciplinas.value = disciplinasRes.data || []
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      }
    })

    return {
      loading,
      autorizado,
      turmas,
      disciplinas,
      alunos,
      turmaSelected,
      disciplinaSelected,
      trimestreSelected,
      trimestres,
      camposAtivos,
      colunas,
      calcularMedia,
      salvarNota,
      verificarAutorizacao,
      imprimirMiniPauta
    }
  }
})
</script>